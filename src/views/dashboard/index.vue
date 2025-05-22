<template>
  <div class="dashboard-container p-4">
    <!-- Gráfico de Proyectos -->
    <b-card ref="filterContent" no-body class="sticky">
      <b-card-body>
        <b-row>
          <b-col md="7" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
            <div class="w-100 mb-1 mb-lg-0 mt-02">
              <b-form-group label="Proyecto" label-for="project" class="mr-2">
                <v-select v-model="selectedProject" :options="projectOptions" :reduce="project => project.id"
                  label="name" placeholder="Seleccione un proyecto" @input="filter()" :clearable="true"
                  class="select-obra">
                  <template v-slot:selected-option="option">
                    {{ option.name }}
                  </template>
                  <template slot="option" slot-scope="option">
                    {{ option.name }}
                  </template>
                </v-select>
              </b-form-group>
            </div>
          </b-col>
          <b-col lg="3" class="col-xxl">
            <b-form-group label="Fecha Rango Inicio" label-for="dateInit" class="mr-2">
              <flat-pickr id="dateInit" v-model="dateInit" class="form-control" :config="configDateInit"
                @on-change="filter()" @on-close="close()" />
            </b-form-group>
          </b-col>
          <b-col lg="3" class="col-xxl">
            <b-form-group label="Fecha Rango Fin" label-for="dateEnd" class="mr-2">
              <flat-pickr id="dateEnd" v-model="dateEnd" class="form-control" :config="configDateInit"
                @on-change="filter()" @on-close="close()" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <div class="card p-4">
      <h4 class="font-semibold text-gray-900">Proyectos</h4>
      <h4 class="text-gray-700">Registros x Proyecto</h4>
      <canvas id="projectsChart"></canvas>
    </div>
    <!-- Mapa Leaflet -->
    <div class="card p-4 mt-4">
      <h4 class="font-semibold text-gray-900">Ubicaciones</h4>
      <div id="map" style="height: 300px;"></div>
    </div>

    <!-- Tarjetas -->
    <div class="card-row">
      <!-- Tipo de Hallazgos -->
      <div class="card p-4 h-full">
        <h4 class="mb-2 font-semibold text-gray-900 text-base">Tipo de Hallazgos</h4>
        <ul>
          <li v-for="(item, index) in hallazgos" :key="index"
            class="mb-1 flex items-center justify-between text-sm text-gray-700">
            <div class="flex items-center">
              <span class="inline-block mr-2" :style="{
                color: starColors[index % starColors.length],
                fontSize: '1.5rem' // o '2rem', etc.
              }">★</span>
              <span>{{ item.tipo }}</span>
            </div>
            <span>{{ item.cantidad }}</span>
          </li>
        </ul>
      </div>

      <!-- Nivel de Riesgo -->
      <div class="card p-4 text-center h-full">
        <h4 class="mb-2 font-semibold text-gray-900 text-base">Nivel de Riesgo</h4>
        <canvas id="riskChart" style="max-height: 200px;"></canvas>
        <div class="mt-2 font-bold text-lg text-gray-800">30% AVG. Exceptions</div>
      </div>

      <!-- Categorías -->
      <div class="card p-4 categorias h-full">
        <h4 class="mb-4 font-semibold text-gray-900 text-base">Categorías</h4>
        <ul class="space-y-4">
          <li v-for="(cat, index) in categorias" :key="index" class="categoria-item">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36">
                <path class="circle-bg" d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle" :stroke="cat.color" :stroke-dasharray="`${cat.porcentaje}, 100`" d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span class="percentage">{{ cat.porcentaje }}%</span>
            </div>

            <div class="info">
              <div class="nombre">{{ cat.nombre }}</div>
              <div class="registros">{{ cat.registros }} registros</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SedeService from '@/services/SedeService'
import filters from './filters.vue'
import Chart from 'chart.js/auto'
import L from 'leaflet'
import ChartDataLabels from 'chartjs-plugin-datalabels'
// Importa los íconos explícitamente
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import DashboardService from '@/services/DashboardService'
import vSelect from 'vue-select'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import flatPickr from 'vue-flatpickr-component'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
Chart.register(ChartDataLabels)

// Arregla el problema del path de los íconos
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: shadow,
})
import 'leaflet/dist/leaflet.css'
export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      projectChartInstance: null,
      projectChartConfigData: { labels: [], datasets: [{ label: 'Registros', data: [], backgroundColor: '#c0bfff', borderRadius: 5 }] },

      riskChartInstance: null,
      riskChartConfigData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
      hallazgos: [],
      categorias: [],

      colores: [
        { bg: '#f3e8ff', color: '#8b5cf6' }, // morado
        { bg: '#e0f7fa', color: '#00acc1' }, // cyan
        { bg: '#e0f2f1', color: '#26a69a' }, // teal
        { bg: '#fff3e0', color: '#fb8c00' }, // naranja
        { bg: '#ffebee', color: '#e53935' }, // rojo
      ],
      starColors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
      filters: {
        fechaInicio: null,
        fechaFin: null,
        estado: null,
      },
      estadosOptions: [
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' },
        { label: 'En progreso', value: 'en_progreso' },
      ],
      projectOptions: [],
      name: '',
      selectedProject: null,
      arrayFilters: [],
      configDateInit: {
        dateFormat: "Y-m-d",
        /* altInput: true, */
        altFormat: "Y-m-d",
        placeholder: "YYYY-MM-DD",
        disableMobile: true,
        plugins: [
          ShortcutButtonsPlugin({
            theme: 'dark',
            button: [{ label: 'Hoy' }],
            onClick(index, fp) {
              let date = index ? new Date(Date.now() + 24 * index * 60 * 60 * 1000) : new Date()
              fp.setDate(date)
              fp.close()
              fp.clear()
            }
          }),
          ShortcutButtonsPlugin({
            theme: 'dark',
            button: [{ label: 'Limpiar' }],
            onClick(index, fp) {
              console.log("FPP", fp)
              console.log("index", index)
              fp.setDate(null)
              fp.close()
              fp.clear()
            }
          })
        ],
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          },
          months: {
            shorthand: [
              'Ene',
              'Feb',
              'Mar',
              'Abr',
              'May',
              'Jun',
              'Jul',
              'Ago',
              'Sep',
              'Оct',
              'Nov',
              'Dic'
            ],
            longhand: [
              'Enero',
              'Febrero',
              'Мarzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'
            ]
          }
        }
      },
      dateInit: null,
      dateEnd: null,
    }
  },
  components: {
    vSelect,
    filters,
    flatPickr,
  },

  mounted() {
    this.filter()
    this.getSelect();
    this.loadProjectLocations(); // Llama al método para cargar ubicaciones

    this.loadProjectChartData();
    this.loadHallazgosData();
    this.loadRiskChartData();
    this.loadCategoriasData();
    this.renderProjectsChart();
    this.renderRiskChart();
    this.initMap();
  },

  methods: {
    close() {
      console.log("close")
    },
    async getSelect() {
      const user = JSON.parse(localStorage.getItem('userData'))
      const url2 = `?limit=100000&order=asc`
      const respEmpresas = await SedeService.getProyectos(url2, this.$store)
      console.log("aaaaaaa", respEmpresas.data.rows)
      console.log("HLA")
      if (respEmpresas.status) {
        this.projectOptions = respEmpresas.data.rows
        this.filter()
      }
    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")

      if (this.selectedProject != null && this.selectedProject != '') {
        this.arrayFilters.push({ keyContains: 'id', key: 'equals', value: this.selectedProject })
      }
      if (this.dateInit != null && this.dateInit != '') {
        const startOfDay = new Date(this.dateInit);
        const endOfDay = new Date(this.dateInit);

        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'created_at', key: 'gte', value: startOfDay });
      }
      if (this.dateEnd != null && this.dateEnd != '') {
        const startOfDay = new Date(this.dateEnd);
        const endOfDay = new Date(this.dateEnd);

        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'created_at', key: 'lte', value: endOfDay });
      }
      console.log("FILTROS", this.arrayFilters)
      this.loadProjectChartData()
      this.loadHallazgosData()
      this.loadRiskChartData()
      this.loadCategoriasData()
      this.loadProjectLocations()
    },
    async loadProjectChartData() {
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      try {
        const serviceCallResponse = await DashboardService.getRegistrosPorProyectoChartData(url, this.$store);
        if (serviceCallResponse && serviceCallResponse.status === true && serviceCallResponse.data) {
          this.projectChartConfigData = serviceCallResponse.data;
        } else {
          this.projectChartConfigData = { labels: [], datasets: [{ label: 'Registros', data: [], backgroundColor: '#c0bfff', borderRadius: 5 }] };
        }
      } catch (error) {
        this.projectChartConfigData = { labels: [], datasets: [{ label: 'Registros', data: [], backgroundColor: '#c0bfff', borderRadius: 5 }] };
      }
      this.renderProjectsChart();
    },
    async loadHallazgosData() {
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      try {
        const serviceCallResponse = await DashboardService.getTipoHallazgosData(url, this.$store);
        if (serviceCallResponse && serviceCallResponse.status === true && serviceCallResponse.data) {
          this.hallazgos = serviceCallResponse.data.hallazgos;
        } else {
          this.hallazgos = [];
        }
      } catch (error) {
        console.error('Error al cargar los datos de hallazgos:', error);
        this.hallazgos = [];
      }
    },
    async loadRiskChartData() {
      this.arrayFilters = []
      console.log("FILTROS")

      if (this.selectedProject != null && this.selectedProject != '') {
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.selectedProject })
      }
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      try {
        const serviceCallResponse = await DashboardService.getNivelDeRiesgoChartData(url, this.$store);
        if (serviceCallResponse && serviceCallResponse.status === true && serviceCallResponse.data) {
          this.riskChartConfigData = serviceCallResponse.data;
          this.renderRiskChart();
        }
      } catch (error) {
        console.error('Error al cargar los datos del gráfico de nivel de riesgo:', error);
      }
    },
    async loadCategoriasData() {
      this.arrayFilters = []
      console.log("FILTROS")

      if (this.selectedProject != null && this.selectedProject != '') {
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.selectedProject })
      }
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      try {
        const serviceCallResponse = await DashboardService.getCategoriasChartData(url, this.$store);
        if (serviceCallResponse && serviceCallResponse.status === true && serviceCallResponse.data) {
          this.categorias = serviceCallResponse.data; // Asignar los datos dinámicos
        } else {
          this.categorias = []; // Vaciar en caso de error o respuesta inesperada
        }
      } catch (error) {
        console.error('Error al cargar los datos de categorías:', error);
        this.categorias = [];
      }
    },
    async loadProjectLocations() {
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      try {
        const response = await DashboardService.getProjectLocations(url, this.$store);
        if (response && response.status === true && response.data) {
          this.addMarkersToMap(response.data);
        } else {
          console.error('Error al obtener las ubicaciones de los proyectos:', response.message);
        }
      } catch (error) {
        console.error('Error al cargar las ubicaciones de los proyectos:', error);
      }
    },
    initMap() {
      this.map = L.map('map').setView([-12.0464, -77.0428], 6); // Centro inicial: Lima, Perú

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    },
    addMarkersToMap(locations) {
      if (!this.map) return;

      // Crea el grupo de clusters
      const markers = L.markerClusterGroup();

      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          const marker = L.marker([location.latitude, location.longitude]);
          // Si deseas mostrar más información al hacer clic:
          marker.bindPopup(`<strong>${location.latitude},${location.longitude}</strong>`);
          markers.addLayer(marker);
        }
      });

      this.map.addLayer(markers);
    },
    renderProjectsChart() {
      const ctx = document.getElementById('projectsChart');
      if (!ctx) {
        return;
      }

      if (this.projectChartInstance) {
        this.projectChartInstance.destroy();
      }

      if (!this.projectChartConfigData || !this.projectChartConfigData.labels || !this.projectChartConfigData.datasets) {
        return;
      }

      this.projectChartInstance = new Chart(ctx, {
        type: 'bar',
        data: this.projectChartConfigData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => value >= 1000 ? `${value / 1000}k` : value,
              }
            }
          }
        }
      });
    },
    renderRiskChart() {
      const ctx = document.getElementById('riskChart');
      if (!ctx) {
        return;
      }

      if (this.riskChartInstance) {
        this.riskChartInstance.destroy();
      }

      this.riskChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: this.riskChartConfigData,
        options: {
          cutout: '70%',
          plugins: {
            legend: { display: true },
          },
        },
      });
    },
  }
}
</script>

<style scoped lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.card-row {
  display: flex;
  gap: 1rem; // espacio entre las tarjetas
  justify-content: space-between;

  >.card {
    flex: 1 1 0;
    min-width: 0; // evita que se rompa el layout
  }

  >.categorias {
    flex: 0 0 auto; // Solo ocupa lo necesario
    width: auto; // Deja que crezca según su contenido
  }
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}

/* Estilo de las tarjetas de Tipo de Hallazgos igual al de Categorías */
.card .p-4 {
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Estilo para las listas de hallazgos y categorías */
ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #4b5563;
}

/* Para los nombres de hallazgos y categorías */
span {
  font-weight: 500;
}

/* Fondo de tarjeta en color gris claro */
.card.bg-white {
  background-color: #f9fafb;
}

.categorias {
  ul {
    .categoria-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      /* Ajustar a flex-start para que estén pegados al gráfico */
    }

    .progress-circle {
      width: 48px;
      height: 48px;
      position: relative;
      margin-right: 20px; // espacio justo al texto
      flex-shrink: 0; // evita que se reduzca

      svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);

        .circle-bg {
          fill: none;
          stroke: #e5e7eb;
          stroke-width: 4;
        }

        .circle {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
        }
      }

      .percentage {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        font-weight: 600;
        color: #4b5563;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 0;

      /* Evitar que haya más espacio encima del texto */
      .nombre {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
        margin-bottom: 2px;
      }

      .registros {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
}

.card h4 {
  font-size: 1.125rem;
  color: #111827;
  /* Color para ambos h4 */
  margin: 0;
  /* Elimina márgenes innecesarios */
}

.card h4:first-of-type {
  font-weight: 600;
  /* Negrita solo para el primer título (Proyectos) */
}

.card h4:last-of-type {
  font-weight: normal;
  /* Normal para el segundo título (Registros x Proyecto) */
  margin-top: 4px;
  /* Un poco de separación entre los títulos */
}

#map {
  width: 100%;
  height: 700px !important;
  border-radius: 12px;
  margin-top: 1rem;
}
</style>