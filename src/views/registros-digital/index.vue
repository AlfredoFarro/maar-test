<template>
  <!-- eslint-disable -->
  <div class="w-100">
    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
    <add-edit
        :is-add.sync="isAdd"
        ref="userAdd"
        @saved="handleSaved"
      >
    </add-edit>
    <b-card-body>
    <b-row>
        <b-col md="6" class="mb-1">
          <label>Filtrar por Proyecto</label>
          <v-select
            v-model="selectedProject"
            :options="projectOptions"
            :reduce="project => project.id"
            label="name"
            placeholder="Seleccione un proyecto"
            @input="filterTable"
            :clearable="true"
          ></v-select>
        </b-col>
        <b-col md="6" class="mb-1">
          <label>Filtrar por DNI</label>
          <b-form-input
            v-model="dniFilter"
            placeholder="Ingrese DNI"
            @input="filterTable"
            disabled
          />
        </b-col>
      </b-row>
    </b-card-body>
      <b-card no-body ref="tableCard">
        <div class="table-responsive">
          <b-table
            class="position-relative"
            empty-text="No existen registros con riesgos asociados"
            :fields="fields"
            :hover="true"
            :items="filteredRecords"
            no-border-collapse
            show-empty
            @sort-changed="sortChanged"
          >
            <!-- Columnas de la tabla -->
            <template #cell(number)="data">
              {{ data.index + 1 }}
            </template>
            
            <template #cell(project)="data">
              {{ data.item.project.name }}
            </template>
            
            <template #cell(worker)="data">
              {{ data.item.worker_fullname || 'N/A' }}
            </template>
            
            <template #cell(date)="data">
              {{ formatDate(data.item.completed) }}
            </template>
            
        
            
            <template #cell(actions)="data">
              <b-button
                size="sm"
                @click.prevent="view(data.item)"
                v-b-tooltip.noninteractive.hover.left="'Ver detalles'"
                variant="flat-primary"
                class="mr-1"
              >
                <feather-icon size="20" icon="EyeIcon" />
              </b-button>
              <b-button
                size="sm"
                @click.prevent="edit(data.item)"
                v-b-tooltip.noninteractive.hover.left="'Editar'"
                variant="flat-success"
              >
                <feather-icon size="20" icon="Edit2Icon" />
              </b-button>
              <b-button
                size="sm"
                v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                @click="deleteAction(data.item)"
                variant="flat-danger"
              >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>
          </b-table>
        </div>
        
        <div class="mx-2 mb-2">
          <b-row>
            <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-end"
            >
              <b-pagination
                v-model="currentPage"
                :total-rows="totalElements"
                :per-page="showEntrie"
                class="mb-0 mt-1 mt-sm-0"
                prev-class="prev-item"
                next-class="next-item"
                @change="cambioPagina"
                pills
              >
                <template #prev-text>
                  <feather-icon icon="ChevronLeftIcon" size="15" />
                </template>
                <template #next-text>
                  <feather-icon icon="ChevronRightIcon" size="15" />
                </template>
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import RegisterService from '@/services/RegisterService'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import Vue from 'vue'
import Ripple from 'vue-ripple-directive'
import addEdit from './add-edit.vue'
import vSelect from 'vue-select'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
  components: {
    vSelect,
    addEdit
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      showLoading: false,
      fields: [
        { key: 'number', label: 'N°', sortable: true },
        { key: 'project', label: 'Proyecto', sortable: true, formatter: (value) => value.name },
        { key: 'user', label: 'Usuario', sortable: true, formatter: (value) => value.fullname},
        { key: 'date', label: 'Fecha', sortable: true },
        { key: 'actions', label: 'Acciones' }
      ],
      allRecords: [],
      filteredRecords: [],
      currentPage: 1,
      showEntrie: 10,
      totalElements: 0,
      isAdd: false,
      selectedProject: null,
      dniFilter: '',
      projectOptions: [] // Ahora se llenará con los proyectos de add-edit
    }
  },
  computed: {
    // Filtra los registros que tienen record_risk con al menos un elemento
    recordsWithRisks() {
      return this.allRecords.filter(record => 
        record.record_risk && record.record_risk.length > 0
      )
    }
  },
  mounted() {
    this.getRecords()
    this.loadProjects()
  },
  methods: {
    async loadProjects() {
      try {
        // Opción 1: Cargar proyectos directamente en el padre
        

        // Opción 2: Alternativa si prefieres usar los proyectos de add-edit
        await this.$nextTick();
        if (this.$refs.userAdd && this.$refs.userAdd.getProjects) {
          const projects = await this.$refs.userAdd.getProjects();
          console.log('Proyectos desde add-edit:', projects);
          this.projectOptions = projects || [];
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        this.projectOptions = [];
      }
    },
    handleSaved() {
      this.getRecords() // Recarga los datos después de guardar
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    async deleteData(id) {
      this.showLoading = true;
      try {
        const response = await RegisterService.deleteRecord(id, this.$store);

        if (response.status !== false) {
          

          // Recargar los registros después de eliminar
          await this.getRecords();
        } else {
          throw new Error(response.message || 'Error al eliminar el registro');
        }
      } catch (error) {
        console.error('Error al eliminar registro:', error);
        
      } finally {
        this.showLoading = false;
      }
    },
    async getRecords() {
      this.showLoading = true
      try {
        const response = await RegisterService.getRecord('', this.$store)
        
        if (response.status !== false) {
          this.allRecords = response.data.rows
          this.filteredRecords = this.recordsWithRisks
          this.totalElements = this.filteredRecords.length
        } else {
          console.error('Error al obtener registros:', response)
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
      } finally {
        this.showLoading = false
      }
    },
    
    edit(item) {
      this.isAdd = true; // Abre el sidebar
      this.$nextTick(() => {
        const editData = {
          id: item.id,
          proyecto: item.project ? item.project.id : '',
          nombre: item.worker_fullname || '',
          dni: item.worker_id_number || '',
          fecha: item.completed ? new Date(item.completed) : new Date(),
          area: item.area || '',
          estado: item.flag === 0 ? 'inseguro' : 'seguro',
          categorias: item.category ? item.category.id : '',
          riesgos: item.record_risk ? item.record_risk.map(r => ({
            id: r.risk.id,
            name: r.risk.name
          })) : [],
          descripcion: item.description || '',
          medidas: item.actions || item.corrective_measures || ''
        };
      
        // Verifica que la referencia y el método existan
        if (this.$refs.userAdd && typeof this.$refs.userAdd.setData === 'function') {
          this.$refs.userAdd.setData(editData)
            .then(() => {
              // Acciones después de cargar los datos
              this.projectOptions = this.$refs.userAdd.proyectos || [];
            })
            .catch(error => {
              console.error('Error al cargar datos en el formulario:', error);
            });
        } else {
          console.error('Componente add-edit no está disponible');
        }
      });
    },
    view(item) {
      this.isAdd = true; // Abre el sidebar
      this.$nextTick(() => {
        const viewData = {
          id: item.id,
          proyecto: item.project ? item.project.id : '',
          nombre: item.worker_fullname || '',
          dni: item.worker_id_number || '',
          fecha: item.completed ? new Date(item.completed) : new Date(),
          area: item.area || '',
          estado: item.flag === 0 ? 'inseguro' : 'seguro',
          categorias: item.category ? item.category.id : '',
          riesgos: item.record_risk ? item.record_risk.map(r => ({
            id: r.risk.id,
            name: r.risk.name
          })) : [],
          descripcion: item.description || '',
          medidas: item.actions || item.corrective_measures || '',
          isViewMode: true // Agregamos esta bandera para modo visualización
        };
      
        if (this.$refs.userAdd && typeof this.$refs.userAdd.setData === 'function') {
          this.$refs.userAdd.setData(viewData)
            .catch(error => {
              console.error('Error al cargar datos para visualización:', error);
            });
        } else {
          console.error('Componente add-edit no está disponible');
        }
      });
    },
    filterTable() {
      // Mantenemos la selección pero no filtramos
      console.log('Proyecto seleccionado:', this.selectedProject)
      
      // Opcional: Mostrar el proyecto seleccionado sin filtrar
      this.$swal({
        title: `Proyecto seleccionado: ${this.selectedProject ? this.getProjectName(this.selectedProject) : 'Ninguno'}`,
        text: 'La función de filtrado está desactivada',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    },

    getProjectName(id) {
      const project = this.projectOptions.find(p => p.id === id)
      return project ? project.name : 'Desconocido'
    },
    deleteAction(data) {
      this.$swal({
        title: '¿Desea eliminar este registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.deleteData(data.id)
        }
      })
    },
  
    
    cambioPagina(page) {
      this.currentPage = page
      // Implementa lógica de paginación si es necesario
    },
    
    sortChanged(ctx) {
      // Implementa lógica de ordenamiento si es necesario
      console.log('Ordenar por:', ctx.sortBy, ctx.sortDesc ? 'desc' : 'asc')
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
.pad-export {
  padding: 0.52rem 1rem !important;
}
.content_main {
  .content_timeline {
    max-height: 450px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  .content_form {
    display: flex;
    justify-content: center;
  }
}
.select-obra .vs__dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}
.mt-02{
  margin-top: .2rem;
}

.sticky {
  position: sticky;
  z-index: 3;
}

.table-overflow {
  overflow-x: auto;
  width: 100%;

  thead {
    
    overflow-x: auto;
    position: absolute;
    top: 0;

    &.fixed {
      position: fixed;
      transform: translateX(0px) !important;
      z-index: 2;
    }

    tr {
      display: flex;
      flex: 1 1 auto;

      th {
        flex: 0 0 auto;
        padding: 0.72rem 2rem !important;
      }
    }
  }

  tbody {
    overflow-x: auto;

    tr {
      display: flex;

      &.b-table-empty-row {
        td {
          flex: 0 0 100%;
        }
      }

      td {
        flex: 0 0 auto;
      }
    }
  }
}

</style>