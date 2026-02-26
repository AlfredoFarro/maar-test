<template>
  <div class="dashboard-container p-4">
    <!-- Gráfico de Proyectos -->
    <b-card ref="filterContent" no-body class="sticky">
      <b-card-body>
        <b-row>
          <b-col
            md="7"
            lg="4"
            class="d-flex flex-column flex-lg-row justify-content-start"
          >
            <div class="w-100 mb-1 mb-lg-0 mt-02">
              <b-form-group label="Proyecto" label-for="project" class="mr-2">
                <v-select
                  v-model="selectedProject"
                  :options="projectOptions"
                  :reduce="(project) => project.id"
                  label="name"
                  placeholder="Seleccione un proyecto"
                  @input="filter()"
                  :clearable="true"
                  class="select-obra"
                >
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
            <b-form-group
              label="Fecha Rango Inicio"
              label-for="dateInit"
              class="mr-2"
            >
              <flat-pickr
                id="dateInit"
                v-model="dateInit"
                class="form-control"
                :config="configDateInit"
                @on-change="filter()"
                @on-close="close()"
              />
            </b-form-group>
          </b-col>
          <b-col lg="3" class="col-xxl">
            <b-form-group
              label="Fecha Rango Fin"
              label-for="dateEnd"
              class="mr-2"
            >
              <flat-pickr
                id="dateEnd"
                v-model="dateEnd"
                class="form-control"
                :config="configDateInit"
                @on-change="filter()"
                @on-close="close()"
              />
            </b-form-group>
          </b-col>

          <b-col lg="3" class="col-xxl">
            <b-form-group
              label="Categoría"
              label-for="catFilter"
              class="mb-2 mr-3"
            >
              <v-select
                id="catFilter"
                v-model="selectedCategories"
                :options="categoryOptions"
                label="label"
                :reduce="(o) => o.value"
                multiple
                :clearable="true"
                placeholder="Todas"
                class="min-w-360"
                @input="loadTopHallazgosChart"
              />
            </b-form-group>
          </b-col>

          <b-col lg="3" class="col-xxl">
            <b-form-group
              label="Nivel de riesgo"
              label-for="riskFilter"
              class="mb-2 mr-3"
            >
              <v-select
                id="riskFilter"
                v-model="riskFilter"
                :options="riskOptions"
                label="label"
                :reduce="(o) => o.value"
                :clearable="true"
                placeholder="Todos"
                class="min-w-250"
                @input="loadTopHallazgosChart"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-row class="g-3 align-items-stretch mb-2">
      <b-col cols="12" lg="4" class="d-flex">
        <div class="card h-100 w-100 reports-card">
          <div
            class="card-header pb-0 d-flex align-items-center justify-content-between"
          >
            <h1 class="mb-0">Reportes</h1>
            <span class="subtitle mb-0">Últimos 7 días</span>
          </div>

          <div class="card-body d-flex flex-column">
            <!-- Total arriba -->
            <div class="d-flex align-items-baseline gap-2">
              <span class="kpi-label mr-1">Total </span>
              <span class="weekly-total">{{ weeklyTotal }}</span>
            </div>

            <!-- Gráfico al fondo del card -->
            <div class="chart-bottom mt-auto">
              <apexchart
                type="bar"
                height="180"
                :options="weeklyChartOptions"
                :series="weeklySeries"
              />
            </div>
          </div>
        </div>
      </b-col>

      <!-- Registros totales (histórico) -->
      <b-col cols="12" lg="4">
        <div class="card h-100">
          <div class="card-header pb-0 stacked-header">
            <h5 class="mb-1 card-title">Registros históricos</h5>
            <h3 class="mb-1 subtitle">Total acumulado</h3>
            <h2 class="mb-0 fw-bold lh-1 total-strong">
              {{ formattedHistoricTotal }}
            </h2>
          </div>

          <div class="card-body px-0">
            <!-- Imagen estática en lugar del gráfico -->
            <img
              :src="historicImageUrl"
              class="chart-img"
              alt="Histórico de registros"
            />
            <!-- Si luego quieres volver al gráfico, cambia a v-if="!useStaticImage" -->
            <!--
          <apexchart v-if="!useStaticImage"
            type="area" height="105"
            :options="historicAreaOptions"
            :series="historicAreaSeries"
          />
          --></div>
        </div>
      </b-col>

      <!-- Nivel de Riesgo (nuevo card) -->
      <b-col cols="12" lg="4">
        <div class="card h-100">
          <div class="card-header">
            <h1 class="mb-0 text-body">Nivel de Riesgo</h1>
          </div>

          <div class="card-body risk-card-body">
            <!-- Esquina izquierda -->
            <div class="risk-corner risk-left">
              <div class="risk-head">Seguro</div>
              <div class="risk-pct">{{ riskSeguroPct.toFixed(1) }}%</div>
              <div class="risk-sub">{{ riskSeguroCountFmt }} registros</div>
            </div>

            <!-- Esquina derecha -->
            <div class="risk-corner risk-right text-end">
              <div class="risk-head">Inseguro</div>
              <div class="risk-pct">{{ riskInseguroPct.toFixed(1) }}%</div>
              <div class="risk-sub">{{ riskInseguroCountFmt }} registros</div>
            </div>

            <!-- Sólo el divisor VS al centro -->
            <div class="d-flex justify-content-center my-4">
              <div class="risk-divider">
                <span class="risk-divider-badge bg-label-secondary">VS</span>
              </div>
            </div>

            <!-- Barra -->
            <div class="d-flex align-items-center">
              <div class="progress w-100 risk-progress">
                <div
                  class="progress-bar bg-success"
                  :style="{ width: riskSeguroPct + '%' }"
                  role="progressbar"
                  :aria-valuenow="riskSeguroPct"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
                <div
                  class="progress-bar bg-danger"
                  :style="{ width: riskInseguroPct + '%' }"
                  role="progressbar"
                  :aria-valuenow="riskInseguroPct"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <div
      class="card p-4"
      v-if="user.role.code == 'admin' || user.role.code == 'Admin'"
    >
      <h4 class="font-semibold text-gray-900">Proyectos</h4>
      <h4 class="text-gray-700">Registros x Proyecto</h4>
      <canvas id="projectsChart"></canvas>
    </div>

    <hr class="my-3" />

    <div class="card p-4">
      <div
        class="d-flex align-items-center justify-content-between flex-wrap gap-1 mb-2"
      >
        <div>
          <h4 class="font-semibold text-gray-900 mb-0">Registros mensuales</h4>
          <h4 class="text-gray-700 mb-0">Total por mes</h4>
        </div>

        <div class="d-flex align-items-center">
          <span class="mr-1">Año</span>
          <b-form-select
            v-model="monthlyYear"
            :options="monthlyYearOptions"
            class="w-auto"
            @change="onMonthlyYearChange"
          />
        </div>
      </div>

      <div class="monthly-chart-wrap">
        <canvas id="monthlyRecordsChart"></canvas>
      </div>
    </div>

    <!-- Mapa Leaflet -->
    <div class="card p-4 mt-4">
      <h4 class="font-semibold text-gray-900">Ubicaciones</h4>
      <div id="map" style="height: 300px"></div>
    </div>

    <!-- === Top 5 Hallazgos (debajo del mapa) === -->
    <div class="card p-4 mt-4">
      <h1>Gráfico Top 5 Tipo de Hallazgos</h1>
      <div class="mt-3">
        <apexchart
          type="bar"
          height="300"
          :options="topHallazgosOptions"
          :series="topHallazgosSeries"
        />
      </div>
    </div>

    <!-- Tarjetas -->
    <div class="card-row">
      <!-- Tipo de Hallazgos -->
      <div class="card p-4 h-full">
        <h4 class="mb-2 font-semibold text-gray-900 text-base">
          Tipo de Hallazgos
        </h4>
        <ul>
          <li
            v-for="(item, index) in hallazgos"
            :key="index"
            class="mb-1 flex items-center justify-between text-sm text-gray-700"
          >
            <div class="flex items-center">
              <span
                class="inline-block mr-2"
                :style="{
                  color: starColors[index % starColors.length],
                  fontSize: '1.5rem', // o '2rem', etc.
                }"
                >★</span
              >
              <span>{{ item.tipo }}</span>
            </div>
            <span>{{ item.cantidad }}</span>
          </li>
        </ul>
      </div>

      <!-- Nivel de Riesgo -->
      <!--<div class="card p-4 text-center h-full">
        <h4 class="mb-2 font-semibold text-gray-900 text-base">Nivel de Riesgo</h4>
        <canvas id="riskChart" style="max-height: 200px;"></canvas>
        <div class="mt-2 font-bold text-lg text-gray-800">30% AVG. Exceptions</div>
      </div>
      -->

      <!-- Categorías -->
      <div class="card p-4 categorias h-full">
        <h4 class="mb-4 font-semibold text-gray-900 text-base">Categorías</h4>
        <ul class="space-y-4">
          <li
            v-for="(cat, index) in categorias"
            :key="index"
            class="categoria-item"
          >
            <div class="progress-circle">
              <svg viewBox="0 0 36 36">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circle"
                  :stroke="cat.color"
                  :stroke-dasharray="`${cat.porcentaje}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
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
import SedeService from "@/services/SedeService";
import filters from "./filters.vue";
import Chart from "chart.js/auto";
import L from "leaflet";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Vue from "vue";
import historicPlaceholder from "@/assets/images/historic-placeholder.png";
// Importa los íconos explícitamente
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import DashboardService from "@/services/DashboardService";
import UserService from "@/services/UserService";
import RegisterService from "@/services/RegisterService";
import vSelect from "vue-select";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import flatPickr from "vue-flatpickr-component";
import ShortcutButtonsPlugin from "shortcut-buttons-flatpickr";
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import Ripple from "vue-ripple-directive";
Chart.register(ChartDataLabels);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: shadow,
});
import "leaflet/dist/leaflet.css";
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
export default {
  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },
  data() {
    return {
      projectChartInstance: null,
      projectChartConfigData: {
        labels: [],
        datasets: [
          {
            label: "Registros",
            data: [],
            backgroundColor: "#c0bfff",
            borderRadius: 5,
          },
        ],
      },

      riskChartInstance: null,
      riskChartConfigData: {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      },
      hallazgos: [],
      categorias: [],
      assignedProjectIds: [],

      hallazgoPalette: [
        "#5B8FF9",
        "#5AD8A6",
        "#5D7092",
        "#F6BD16",
        "#E8684A",
        "#6DC8EC",
        "#9270CA",
        "#FF9D4D",
        "#269A99",
        "#FF99C3",
      ],
      hallazgoColorsMap: {},

      colores: [
        { bg: "#f3e8ff", color: "#8b5cf6" }, // morado
        { bg: "#e0f7fa", color: "#00acc1" }, // cyan
        { bg: "#e0f2f1", color: "#26a69a" }, // teal
        { bg: "#fff3e0", color: "#fb8c00" }, // naranja
        { bg: "#ffebee", color: "#e53935" }, // rojo
      ],
      starColors: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"],
      filters: {
        fechaInicio: null,
        fechaFin: null,
        estado: null,
      },
      estadosOptions: [
        { label: "Activo", value: "activo" },
        { label: "Inactivo", value: "inactivo" },
        { label: "En progreso", value: "en_progreso" },
      ],
      weeklySeries: [{ name: "Reportes", data: [] }],
      projectOptions: [],
      name: "",
      selectedProject: null,
      arrayFilters: [],
      configDateInit: {
        dateFormat: "Y-m-d",
        altFormat: "Y-m-d",
        placeholder: "YYYY-MM-DD",
        disableMobile: true,
        plugins: [
          ShortcutButtonsPlugin({
            theme: "dark",
            button: [{ label: "Hoy" }],
            onClick(index, fp) {
              let date = index
                ? new Date(Date.now() + 24 * index * 60 * 60 * 1000)
                : new Date();
              fp.setDate(date);
              fp.close();
              fp.clear();
            },
          }),
          ShortcutButtonsPlugin({
            theme: "dark",
            button: [{ label: "Limpiar" }],
            onClick(index, fp) {
              fp.setDate(null);
              fp.close();
              fp.clear();
            },
          }),
        ],
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            longhand: [
              "Domingo",
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
            ],
          },
          months: {
            shorthand: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Оct",
              "Nov",
              "Dic",
            ],
            longhand: [
              "Enero",
              "Febrero",
              "Мarzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
          },
        },
      },
      dateInit: null,
      dateEnd: null,
      //Primer grafico
      weeklyChartOptions: {
        chart: {
          toolbar: { show: false },
          sparkline: { enabled: true },
          custom: { fullLabels: [] },
        },
        plotOptions: {
          bar: {
            columnWidth: "36%",
            borderRadius: 12,
            borderRadiusApplication: "end",
            distributed: true,
            endingShape: "rounded",
          },
        },
        grid: {
          show: false,
          padding: { left: -6, right: -6, top: -8, bottom: -8 },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: [],
          axisTicks: { show: false },
          axisBorder: { show: false },
          labels: { style: { colors: [] } },
        },
        yaxis: { show: false },
        states: {
          hover: { filter: { type: "none" } },
          active: { filter: { type: "darken", value: 0.9 } },
        },
        tooltip: {
          theme: "light",
          x: {
            formatter: (val, { dataPointIndex, w }) =>
              w?.config?.chart?.custom?.fullLabels?.[dataPointIndex] || val,
          },
          y: { formatter: (val) => `${val} reporte${val === 1 ? "" : "s"}` },
        },
        colors: [],
      },
      weeklyTotal: 0,
      weeklyDeltaText: "",

      //Segundo grafico
      historicTotal: 0,
      useStaticImage: true,
      historicImageUrl: historicPlaceholder,
      historicAreaOptions: {
        chart: {
          toolbar: { show: false },
          sparkline: { enabled: true },
          animations: { enabled: true },
          parentHeightOffset: 0,
        },
        stroke: { curve: "smooth", width: 2 },
        markers: { size: 0, strokeWidth: 0, hover: { size: 4 } },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 100],
            colorStops: [],
          },
        },
        grid: {
          show: false,
          padding: { left: 0, right: 0, top: 0, bottom: 0 },
        },
        dataLabels: { enabled: false },
        xaxis: {
          type: "category",
          tickPlacement: "on",
          labels: { show: false },
          axisTicks: { show: false },
          axisBorder: { show: false },
          crosshairs: {
            show: true,
            position: "back",
            stroke: {
              width: 1,
              dashArray: 3,
              color: "var(--bs-border-color,#b6b6b6)",
            },
          },
        },
        yaxis: { show: false },
        colors: [],
        tooltip: {
          theme: "light",
          followCursor: true,
          intersect: false,
          shared: false,
          x: {
            formatter: ({}, { dataPointIndex, w }) =>
              w.config.series[0].data[dataPointIndex]?.x ?? "",
          },
          y: { formatter: (v) => `${v} registro${v === 1 ? "" : "s"}` },
        },
        useStaticImage: true,
        historicImageUrl: historicPlaceholder,
      },
      //Tercer grafico
      riskSummary: { seguro: 0, inseguro: 0 },

      //Gráfico Top 5
      selectedCategories: [],
      categoryOptions: [],
      riskFilter: null,
      riskOptions: [
        { label: "Seguro", value: "Seguro" },
        { label: "Inseguro", value: "Inseguro" },
      ],

      topHallazgosSeries: [{ name: "Registros", data: [] }],
      topHallazgosOptions: {
        chart: { toolbar: { show: false }, parentHeightOffset: 0 },
        plotOptions: {
          bar: { horizontal: true, borderRadius: 6, barHeight: "65%" },
        },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 3, xaxis: { lines: { show: true } } },
        xaxis: { categories: [], labels: { style: { colors: [] } } },
        yaxis: { labels: { maxWidth: 220 } },
        tooltip: {
          y: { formatter: (v) => `${v} registro${v === 1 ? "" : "s"}` },
        },
        colors: [],
      },

      riskFilterKey: "type",

      //Grafico mensual
      monthlyChartInstance: null,
      monthlyYear: new Date().getFullYear(),
      monthlyYearOptions: [],
      monthlyChartConfigData: {
        labels: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        datasets: [
          {
            label: "Registros",
            data: new Array(12).fill(0),
            backgroundColor: "#c0bfff",
            borderRadius: 5,
          },
        ],
      },
    };
  },

  components: {
    vSelect,
    filters,
    flatPickr,
  },

  mounted() {
    this.filter();
    this.getSelect();
    this.loadProjectLocations();
    this.loadHistoricAreaChart();
    this.bootstrapCategoryOptions();
    this.loadTopHallazgosChart();
    this.loadWeeklyChart();
    this.loadProjectChartData();
    this.loadHallazgosData();
    this.loadRiskChartData();
    this.loadCategoriasData();
    this.renderProjectsChart();
    this.renderRiskChart();
    this.initMonthlyYearOptions();
    this.initMap();
  },
  computed: {
    user() {
      const user = JSON.parse(localStorage.getItem("userData"));
      console.log("USER:", user);
      return user;
    },

    isAdmin() {
      const code = (this.user?.role?.code || "").toLowerCase();
      return ["admin", "superadmin", "administrador"].includes(code);
    },

    formattedHistoricTotal() {
      return new Intl.NumberFormat("es-PE").format(this.historicTotal || 0);
    },

    riskTotal() {
      return (this.riskSummary.seguro || 0) + (this.riskSummary.inseguro || 0);
    },
    riskSeguroPct() {
      return this.riskTotal
        ? (this.riskSummary.seguro * 100) / this.riskTotal
        : 0;
    },
    riskInseguroPct() {
      return this.riskTotal
        ? (this.riskSummary.inseguro * 100) / this.riskTotal
        : 0;
    },

    riskSeguroCount() {
      return this.riskSummary.seguro | 0;
    },
    riskInseguroCount() {
      return this.riskSummary.inseguro | 0;
    },

    riskSeguroCountFmt() {
      return new Intl.NumberFormat("es-PE").format(this.riskSeguroCount);
    },
    riskInseguroCountFmt() {
      return new Intl.NumberFormat("es-PE").format(this.riskInseguroCount);
    },
  },

  methods: {
    async getSelect() {
      try {
        if (this.isAdmin) {
          const url2 = `?limit=10000&filter=[{%22keyContains%22:%22isActive%22,%22key%22:%22equals%22,%22value%22:1}]`;
          const respEmpresas = await SedeService.getProyectos(
            url2,
            this.$store,
          );
          if (respEmpresas.status) {
            this.projectOptions = respEmpresas.data.rows;
            this.filter();
          }
        } else {
          const resp = await UserService.getAssignedProjects(
            this.user.id,
            this.$store,
          );
          console.log("Assigned Projects Response:", resp);
          if (resp?.status) {
            const rows = Array.isArray(resp.data.projects)
              ? resp.data.projects
              : resp.data?.projects || [];
            this.projectOptions = rows
              .map((p) => ({
                id: p.id ?? p.project?.id,
                name: p.name ?? p.project?.name,
              }))
              .filter((x) => x.id && x.name);

            this.assignedProjectIds = this.projectOptions.map((p) => p.id);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        this.filter();
      }
    },

    getColorForType(tipo) {
      const key = String(tipo || "").toLowerCase();
      if (!this.hallazgoColorsMap[key]) {
        const used = Object.keys(this.hallazgoColorsMap).length;
        this.hallazgoColorsMap[key] =
          this.hallazgoPalette[used % this.hallazgoPalette.length];
      }
      return this.hallazgoColorsMap[key];
    },

    async bootstrapCategoryOptions() {
      try {
        const url = `?limit=10000&filter=${encodeURIComponent(
          JSON.stringify(this.buildFilters()),
        )}`;
        const res = await DashboardService.getCategoriasChartData(
          url,
          this.$store,
        );
        const cats = res?.status ? res.data || [] : [];
        this.categoryOptions = cats
          .map((c) => ({ label: c.nombre, value: c.nombre }))
          .filter((c) => c.value);
      } catch (e) {
        console.error("bootstrapCategoryOptions error", e);
        this.categoryOptions = [];
      }
    },

    initMonthlyYearOptions() {
      const current = new Date().getFullYear();
      const years = [];
      for (let y = current; y >= current - 10; y--) {
        years.push({ value: y, text: String(y) });
      }
      this.monthlyYearOptions = years;

      if (!this.monthlyYear) this.monthlyYear = current;
    },

    onMonthlyYearChange() {
      this.loadMonthlyRecordsChartData();
    },

    buildFiltersForMonthly() {
      const filters = [];

      const year = Number(this.monthlyYear) || new Date().getFullYear();

      const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
      const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      filters.push({
        keyContains: "created_at",
        key: "gte",
        value: yearStart,
      });

      filters.push({
        keyContains: "created_at",
        key: "lte",
        value: yearEnd,
      });

      if (this.selectedProject) {
        filters.push({
          keyContains: "project.id",
          key: "equals",
          value: this.selectedProject,
        });
      } else if (!this.isAdmin) {
        if (this.assignedProjectIds.length === 0) {
          filters.push({ keyContains: "project.id", key: "in", value: [-1] });
        } else {
          filters.push({
            keyContains: "project.id",
            key: "in",
            value: this.assignedProjectIds,
          });
        }
      }

      if (this.selectedCategories && this.selectedCategories.length) {
        filters.push({
          keyContains: "category.name",
          key: "in",
          value: this.selectedCategories,
        });
      }

      if (this.riskFilter) {
        filters.push({
          keyContains: this.riskFilterKey,
          key: "equals",
          value: this.riskFilter,
        });
      }

      return filters;
    },

    async loadMonthlyRecordsChartData() {
      const filters = this.buildFiltersForMonthly();
      const url = `?limit=10000&filter=${encodeURIComponent(JSON.stringify(filters))}`;
    
      const res = await DashboardService.getRegistrosMensualesPorAnioChartData(url, this.$store);
    
      this.monthlyChartConfigData =
        res?.status && res.data?.chartData
          ? res.data.chartData
          : {
              labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
              datasets: [{ label: "Registros", data: new Array(12).fill(0), backgroundColor: "#c0bfff", borderRadius: 5 }],
            };
    
      this.$nextTick(() => this.renderMonthlyRecordsChart());
    },

    renderMonthlyRecordsChart() {
      const ctx = document.getElementById("monthlyRecordsChart");
      if (!ctx) return;

      if (this.monthlyChartInstance) {
        this.monthlyChartInstance.destroy();
      }

      this.monthlyChartInstance = new Chart(ctx, {
        type: "bar",
        data: this.monthlyChartConfigData,
        options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => `Registros: ${tooltipItem.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false }, 
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,      
        maxTicksLimit: 6,   
      },
      grid: {
        drawBorder: false,
      },
    },
  },
},
      });
    },

    buildFilters() {
      const filters = [];
      if (this.selectedProject) {
        filters.push({
          keyContains: "project.id",
          key: "equals",
          value: this.selectedProject,
        });
      } else if (!this.isAdmin) {
        if (this.assignedProjectIds.length === 0) {
          filters.push({ keyContains: "project.id", key: "in", value: [-1] });
        } else {
          filters.push({
            keyContains: "project.id",
            key: "in",
            value: this.assignedProjectIds,
          });
        }
      }
      if (this.dateInit) {
        const startOfDay = new Date(this.dateInit);
        const endOfDay = new Date(this.dateInit);
        endOfDay.setDate(endOfDay.getDate() + 1);
        filters.push({
          keyContains: "created_at",
          key: "gte",
          value: startOfDay,
        });
      }
      if (this.dateEnd) {
        const startOfDay = new Date(this.dateEnd);
        const endOfDay = new Date(this.dateEnd);
        endOfDay.setDate(endOfDay.getDate() + 1);
        filters.push({
          keyContains: "created_at",
          key: "lte",
          value: endOfDay,
        });
      }
      if (this.selectedCategories && this.selectedCategories.length) {
        filters.push({
          keyContains: "category.name",
          key: "in",
          value: this.selectedCategories,
        });
      }

      if (this.riskFilter) {
        filters.push({
          keyContains: this.riskFilterKey,
          key: "equals",
          value: this.riskFilter,
        });
      }
      return filters;
    },

    async loadTopHallazgosChart() {
      const filters = this.buildFilters();
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;

      let items = [];
      try {
        const res = await DashboardService.getTipoHallazgosData(
          url,
          this.$store,
        );
        items = res?.status ? res.data?.hallazgos || [] : [];
      } catch (e) {
        console.error("Top hallazgos error:", e);
        items = [];
      }

      const top = [...items]
        .sort((a, b) => (b.cantidad || 0) - (a.cantidad || 0))
        .slice(0, 5);

      const labels = top.map((i) => i.tipo || "—");
      const data = top.map((i) => i.cantidad || 0);

      const labelColor = (
        getComputedStyle(document.documentElement).getPropertyValue(
          "--bs-secondary-color",
        ) || "#6e6b7b"
      ).trim();

      const barColors = labels.map((l) => this.getColorForType(l));

      this.topHallazgosOptions = {
        ...this.topHallazgosOptions,
        plotOptions: {
          ...this.topHallazgosOptions.plotOptions,
          bar: {
            ...this.topHallazgosOptions.plotOptions?.bar,
            horizontal: true,
            borderRadius: 6,
            barHeight: "65%",
            distributed: true,
          },
        },
        xaxis: {
          ...this.topHallazgosOptions.xaxis,
          categories: labels,
          labels: { style: { colors: labelColor } },
        },
        colors: barColors,
      };

      this.topHallazgosSeries = [{ name: "Registros", data }];
    },

    esDayLetter(d) {
      const map = ["D", "L", "M", "X", "J", "V", "S"];
      return map[d.getDay()];
    },

    monthKey(d) {
      const y = d.getFullYear();
      const m = `${d.getMonth() + 1}`.padStart(2, "0");
      return `${y}-${m}`;
    },
    spanishMonth(y, mIdx) {
      const nombres = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return `${nombres[mIdx]} ${String(y).slice(-2)}`;
    },
    buildMonthSpan(startDate, endDate) {
      const keys = [];
      const labels = [];
      let y = startDate.getFullYear(),
        m = startDate.getMonth();
      const endKey = this.monthKey(
        new Date(endDate.getFullYear(), endDate.getMonth(), 1),
      );
      while (true) {
        const k = `${y}-${String(m + 1).padStart(2, "0")}`;
        keys.push(k);
        labels.push(this.spanishMonth(y, m));
        if (k === endKey) break;
        m++;
        if (m > 11) {
          m = 0;
          y++;
        }
      }
      return { keys, labels };
    },

    async loadHistoricAreaChart() {
      const filters = this.buildFilters ? this.buildFilters() : [];
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;

      let rows = [];
      try {
        const resp = await RegisterService.getRecord(url, this.$store);
        rows = resp?.status ? resp.data?.rows || [] : [];
      } catch (e) {
        console.error("loadHistoricAreaChart error", e);
        rows = [];
      }

      if (!rows.length) {
        this.historicTotal = 0;
        this.historicAreaSeries = [{ name: "Registros", data: [] }];
        this.historicAreaOptions = {
          ...this.historicAreaOptions,
          labels: [],
          colors: [],
        };
        return;
      }

      let minDate = new Date(
        rows[0].created_at ||
          rows[0].completed ||
          rows[0].createdAt ||
          rows[0].date,
      );
      let maxDate = new Date(minDate);
      for (const r of rows) {
        const d = new Date(
          r.created_at || r.completed || r.createdAt || r.date,
        );
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
      }
      minDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

      const { keys, labels } = this.buildMonthSpan(minDate, maxDate);
      const counts = Object.fromEntries(keys.map((k) => [k, 0]));

      // 4) Contar por mes
      for (const r of rows) {
        const d = new Date(
          r.created_at || r.completed || r.createdAt || r.date,
        );
        const k = this.monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
        if (counts[k] != null) counts[k]++;
      }
      const data = keys.map((k) => counts[k]);
      const seriesData = keys.map((k, i) => ({
        x: labels[i],
        y: counts[k],
      }));

      this.historicTotal = seriesData.reduce((a, b) => a + b.y, 0);

      const css = getComputedStyle(document.documentElement);
      const main = (css.getPropertyValue("--bs-success") || "#28c76f").trim();
      const paper = (css.getPropertyValue("--bs-paper-bg") || "#ffffff").trim();

      this.historicAreaOptions = {
        ...this.historicAreaOptions,
        colors: [main],
        fill: {
          ...this.historicAreaOptions.fill,
          gradient: {
            ...this.historicAreaOptions.fill.gradient,
            colorStops: [
              [{ offset: 0, color: main, opacity: 0.4 }],
              [{ offset: 100, color: paper, opacity: 0.1 }],
            ],
          },
        },
      };

      this.historicAreaSeries = [{ name: "Registros", data: seriesData }];
    },

    esDayFull(d) {
      const dias = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ];
      return `${dias[d.getDay()]} ${d.getDate()}`;
    },
    getWeekRange() {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
    rotateWeekLabelsEndingToday() {
      const labels = [];
      const full = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(this.esDayLetter(d));
        full.push(this.esDayFull(d));
      }
      return { labels, full };
    },

    async loadWeeklyChart() {
      const { start, end } = this.getWeekRange();

      const filters = this.buildFilters ? this.buildFilters() : [];
      filters.push({ keyContains: "created_at", key: "gte", value: start });
      filters.push({ keyContains: "created_at", key: "lte", value: end });

      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;

      let rows = [];
      try {
        const resp = await RegisterService.getRecord(url, this.$store);
        rows = resp?.status ? resp.data?.rows || [] : [];
      } catch (e) {
        rows = [];
      }

      const buckets = new Array(7).fill(0);
      const startMs = new Date(start).setHours(0, 0, 0, 0);
      rows.forEach((r) => {
        const t = new Date(r.created_at || r.completed).setHours(0, 0, 0, 0);
        const idx = Math.floor((t - startMs) / 86400000);
        if (idx >= 0 && idx < 7) buckets[idx] += 1;
      });

      const css = getComputedStyle(document.documentElement);
      const subtle = (
        css.getPropertyValue("--bs-success-bg-subtle") || "#dbeafe"
      ).trim();
      const strong = (css.getPropertyValue("--bs-success") || "#28c76f").trim();
      const colors = buckets.map((_, i) => (i === 6 ? strong : subtle));

      const { labels, full } = this.rotateWeekLabelsEndingToday();

      const labelSecondary = (
        css.getPropertyValue("--bs-secondary-color") || "#6e6b7b"
      ).trim();
      const labelStrong = (
        css.getPropertyValue("--bs-body-color") || "#4b465c"
      ).trim();
      const labelColors = labels.map((_, i) =>
        i === 6 ? labelStrong : labelSecondary,
      );

      this.weeklyChartOptions = {
        ...this.weeklyChartOptions,
        xaxis: {
          ...this.weeklyChartOptions.xaxis,
          categories: labels,
          labels: { style: { colors: labelColors, fontSize: "12px" } },
        },
        colors,
        chart: {
          ...this.weeklyChartOptions.chart,
          custom: { fullLabels: full },
        },
      };
      this.weeklySeries = [{ name: "Reportes", data: buckets }];

      this.weeklyTotal = buckets.reduce((a, b) => a + b, 0);
      this.weeklyDeltaText = "";
    },

    filter() {
      this.loadWeeklyChart();
      this.loadProjectChartData();
      this.loadMonthlyRecordsChartData();
      this.loadHallazgosData();
      this.loadRiskChartData();
      this.loadCategoriasData();
      this.loadProjectLocations();
      this.loadHistoricAreaChart();
      this.bootstrapCategoryOptions();
      this.loadTopHallazgosChart();
    },
    async loadProjectChartData() {
      const filters = this.buildFilters();

      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;
      try {
        const res = await DashboardService.getRegistrosPorProyectoChartData(
          url,
          this.$store,
        );
        this.projectChartConfigData =
          res?.status && res.data
            ? res.data
            : {
                labels: [],
                datasets: [
                  {
                    label: "Registros",
                    data: [],
                    backgroundColor: "#c0bfff",
                    borderRadius: 5,
                  },
                ],
              };
      } catch {
        this.projectChartConfigData = {
          labels: [],
          datasets: [
            {
              label: "Registros",
              data: [],
              backgroundColor: "#c0bfff",
              borderRadius: 5,
            },
          ],
        };
      }
      this.renderProjectsChart();
    },
    async loadHallazgosData() {
      const filters = this.buildFilters();
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;
      try {
        const res = await DashboardService.getTipoHallazgosData(
          url,
          this.$store,
        );
        this.hallazgos = res?.status && res.data ? res.data.hallazgos : [];
      } catch (e) {
        console.error("Error hallazgos:", e);
        this.hallazgos = [];
      }
    },
    _countsFromPerc(percents = [], total = 0) {
      if (!total) return percents.map(() => 0);
      const raw = percents.map((p) => ((Number(p) || 0) * total) / 100);
      const floors = raw.map(Math.floor);
      let diff = total - floors.reduce((a, b) => a + b, 0);
      const residuals = raw
        .map((v, i) => ({ i, r: v - floors[i] }))
        .sort((a, b) => b.r - a.r);
      for (let k = 0; k < diff; k++) floors[residuals[k]?.i ?? 0]++;
      return floors;
    },

    async loadRiskChartData() {
      const filters = this.buildFilters();
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;

      try {
        const res = await DashboardService.getNivelDeRiesgoChartData(
          url,
          this.$store,
        );
        if (res?.status && res.data) {
          this.riskChartConfigData = res.data;

          const labels = (res.data.labels || []).map((l) =>
            String(l).toLowerCase(),
          );
          const values = (res.data.datasets?.[0]?.data || []).map(
            (v) => Number(v) || 0,
          );

          const seguroAliases = ["seguro", "bajo", "low", "safe"];
          const inseguroAliases = [
            "inseguro",
            "medio",
            "alto",
            "medium",
            "high",
            "unsafe",
          ];

          let seguro = 0,
            inseguro = 0;
          labels.forEach((lbl, i) => {
            if (seguroAliases.includes(lbl)) seguro += values[i];
            if (inseguroAliases.includes(lbl)) inseguro += values[i];
          });

          if (!seguro && !inseguro && values.length === 2) {
            seguro = values[0];
            inseguro = values[1];
          }

          const sum = seguro + inseguro;
          const looksLikePercent = sum > 0 && Math.abs(sum - 100) < 0.001;

          if (looksLikePercent) {
            let totalFiltrado = this.historicTotal || 0;

            if (!totalFiltrado) {
              const r = await RegisterService.getRecord(url, this.$store);
              totalFiltrado = r?.status ? r.data?.rows?.length || 0 : 0;
            }

            const [segCount, insCount] = this._countsFromPerc(
              [seguro, inseguro],
              totalFiltrado,
            );
            seguro = segCount;
            inseguro = insCount;
          } else {
            seguro = Math.round(seguro);
            inseguro = Math.round(inseguro);
          }

          this.riskSummary = { seguro, inseguro };

          this.renderRiskChart();
        }
      } catch (e) {
        console.error("Error risk chart:", e);
        this.riskSummary = { seguro: 0, inseguro: 0 };
      }
    },
    async loadCategoriasData() {
      const filters = this.buildFilters();
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;
      try {
        const res = await DashboardService.getCategoriasChartData(
          url,
          this.$store,
        );
        this.categorias = res?.status && res.data ? res.data : [];
      } catch (e) {
        console.error("Error categorías:", e);
        this.categorias = [];
      }
    },
    async loadProjectLocations() {
      const filters = this.buildFilters();
      const url = `?limit=10000&filter=${encodeURIComponent(
        JSON.stringify(filters),
      )}`;
      try {
        const res = await DashboardService.getProjectLocations(
          url,
          this.$store,
        );
        if (res?.status && res.data) {
          this.addMarkersToMap(res.data);
        } else {
          console.error("Error ubicaciones:", res?.message);
        }
      } catch (e) {
        console.error("Error ubicaciones:", e);
      }
    },
    initMap() {
      this.map = L.map("map").setView([-12.0464, -77.0428], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);
    },
    addMarkersToMap(locations) {
      if (!this.map) return;
      this.map.eachLayer((layer) => {
        if (layer instanceof L.MarkerClusterGroup) {
          this.map.removeLayer(layer);
        }
      });
      const markers = L.markerClusterGroup();

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          const marker = L.marker([location.latitude, location.longitude]);
          marker.bindPopup(
            `<strong>${location.latitude},${location.longitude}</strong>`,
          );
          markers.addLayer(marker);
        }
      });

      this.map.addLayer(markers);
    },
    renderProjectsChart() {
      const ctx = document.getElementById("projectsChart");
      if (!ctx) {
        return;
      }

      if (this.projectChartInstance) {
        this.projectChartInstance.destroy();
      }

      if (
        !this.projectChartConfigData ||
        !this.projectChartConfigData.labels ||
        !this.projectChartConfigData.datasets
      ) {
        return;
      }

      this.projectChartInstance = new Chart(ctx, {
        type: "bar",
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
                callback: (value) =>
                  value >= 1000 ? `${value / 1000}k` : value,
              },
            },
          },
        },
      });
    },
    renderRiskChart() {
      const ctx = document.getElementById("riskChart");
      if (!ctx) {
        return;
      }

      if (this.riskChartInstance) {
        this.riskChartInstance.destroy();
      }

      this.riskChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: this.riskChartConfigData,
        options: {
          cutout: "70%",
          plugins: {
            legend: { display: true },
          },
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";

.card-row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  > .card {
    flex: 1 1 0;
    min-width: 0;
  }

  > .categorias {
    flex: 0 0 auto;
    width: auto;
  }
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card .p-4 {
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

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

span {
  font-weight: 500;
}

.card.bg-white {
  background-color: #f9fafb;
}

.categorias {
  ul {
    .categoria-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .progress-circle {
      width: 48px;
      height: 48px;
      position: relative;
      margin-right: 20px;
      flex-shrink: 0;

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
  margin: 0;
}

.card h4:first-of-type {
  font-weight: 600;
}

.card h4:last-of-type {
  font-weight: normal;
  margin-top: 4px;
}

#map {
  width: 100%;
  height: 700px !important;
  border-radius: 12px;
  margin-top: 1rem;
}

.chart-statistics .card-title {
  font-weight: 600;
  color: var(--bs-body-color);
}

.chart-statistics .badge.bg-label-success {
  background-color: var(--bs-success-bg-subtle) !important;
  color: var(--bs-success) !important;
  border: 0;
}

:deep(.apexcharts-xaxis text) {
  fill: var(--bs-secondary-color);
}
:deep(.apexcharts-bar-area) {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
:deep(.apexcharts-series:hover .apexcharts-bar-area) {
  opacity: 0.9;
}

.total-strong {
  font-size: 2rem;
  line-height: 1;
  color: var(--bs-body-color);
  letter-spacing: 0.2px;
}
.card-title {
  font-weight: 600;
}

:deep(.apexcharts-xcrosshairs) {
  stroke: var(--bs-border-color, #b6b6b6);
  stroke-dasharray: 3;
}

:deep(.apexcharts-area) {
  transition: opacity 0.2s ease;
}
:deep(.apexcharts-area:hover) {
  opacity: 0.95;
}

.stacked-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--bs-body-color);
  margin: 0;
}
.subtitle {
  font-size: 0.875rem;
  color: var(--bs-secondary-color);
  margin: 0;
}

.total-strong {
  font-size: 2rem;
  line-height: 1;
  color: var(--bs-body-color);
  letter-spacing: 0.2px;
}

.chart-img {
  display: block;
  width: 100%;
  height: auto;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  user-select: none;
  pointer-events: none;
}

.card-title {
  font-weight: 600;
  font-size: 2rem;
}

.risk-card-body {
  position: relative;
  padding-top: 1rem;
}

.risk-corner {
  position: absolute;
  top: 0.25rem;
  max-width: 45%;
}
.risk-left {
  left: 0.75rem;
}
.risk-right {
  right: 0.75rem;
}

.risk-head {
  font-weight: 700;
  font-size: 1.12rem;
  color: var(--bs-body-color);
  margin-bottom: 0.4rem;
}

.risk-pct {
  font-weight: 800;
  font-size: 1.9rem;
  line-height: 1.1;
  color: var(--bs-body-color);
  margin-bottom: 0.15rem;
}

.risk-sub {
  font-size: 1.2rem;
  color: var(--bs-secondary-color);
}

.risk-divider {
  position: relative;
  width: 1px;
  height: 56px;
  background: var(--bs-border-color, #e9ecef);
}
.risk-divider-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
}

.risk-progress {
  height: 12px;
  border-radius: 9999px;
  overflow: hidden;
  background: var(--bs-border-color, #ececec);
}
.risk-progress .progress-bar {
  height: 12px;
}

.reports-card .card-header h1 {
  font-size: 1.75rem;
}

.reports-card .subtitle {
  color: var(--bs-secondary-color);
  font-size: 0.95rem;
}

.kpi-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--bs-secondary-color);
}

.weekly-total {
  display: inline-block;
  font-size: 2rem;
  line-height: 1;
  color: var(--bs-body-color);
  letter-spacing: 0.2px;
}

:deep(.reports-card .apexcharts-canvas) {
  margin-top: -4px;
}

.chart-bottom {
  border-top: 1px solid var(--bs-border-color, #e9ecef);
  padding-top: 0.5rem;
  min-height: 190px;
}

.reports-card .card-header h1 {
  font-size: 1.75rem;
}
.reports-card .subtitle {
  color: var(--bs-secondary-color);
  font-size: 0.95rem;
}
.kpi-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--bs-secondary-color);
}
.weekly-total {
  display: inline-block;
  font-size: 2rem;
  line-height: 1;
  color: var(--bs-body-color);
  letter-spacing: 0.2px;
}

.min-w-250 {
  min-width: 250px;
}
.min-w-360 {
  min-width: 360px;
}

.monthly-chart-wrap {
  height: 50vh;
  width: 100%;
  position: relative;
}

.monthly-chart-wrap canvas {
  height: 100% !important;
  width: 100% !important;
}
</style>
