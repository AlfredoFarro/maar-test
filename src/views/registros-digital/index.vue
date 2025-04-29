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

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
  components: {
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
        { key: 'date', label: 'Fecha', sortable: true, formatter: this.formatDate },
        { key: 'actions', label: 'Acciones' }
      ],
      allRecords: [],
      filteredRecords: [],
      currentPage: 1,
      showEntrie: 10,
      totalElements: 0,
      isAdd: false
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
  },
  methods: {
    handleSaved() {
      this.getRecords() // Recarga los datos después de guardar
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    
    async getRecords() {
      this.showLoading = true
      try {
        const response = await RegisterService.getRecord('', this.$store)

        if (response.status !== false) {
          const originalRecords = response.data.rows || []
        
          // Aquí expandimos los records: uno por cada record_risk
          const expandedRecords = []
          originalRecords.forEach(record => {
            if (record.record_risk && record.record_risk.length > 0) {
              record.record_risk.forEach(risk => {
                expandedRecords.push({
                  ...record,
                  single_risk: risk   // Guardamos el riesgo individual por si luego quieres mostrar algo más
                })
              })
            }
          })
        
          this.allRecords = expandedRecords
          this.filteredRecords = expandedRecords
          this.totalElements = expandedRecords.length
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
      this.isAdd = true // Abre el sidebar
      this.$nextTick(() => {
        // Mapea los datos del item al formato que espera el componente add-edit
        const editData = {
          id: item.id,
          proyecto: item.project ? item.project.id : '',
          nombre: item.user ? item.user.fullname : '', // Usa user.fullname
          dni: item.user ? item.user.document : '',    // Usa user.document
          fecha: item.completed ? new Date(item.completed) : new Date(),
          area: item.area || '',
          estado: item.status || 'seguro',
          // Para categorías - busca la categoría correspondiente al categoryId
          categoryId: item.categoryId || null, // Envía solo el ID de la categoría
          riesgos: item.single_risk ? [{
            id: item.single_risk.risk.id,
            name: item.single_risk.risk.name
          }] : [],
          descripcion: item.description || '',
          medidas: item.actions || item.corrective_measures || '' // Asegúrate de usar el campo correcto
        }
      
        // Llama al método setData del componente add-edit
        this.$refs.userAdd.setData(editData)
      })
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
    
    async deleteData(id) {
      // Implementa tu lógica de eliminación aquí
      console.log('Eliminar registro con ID:', id)
      // Después de eliminar, actualiza los datos:
      // this.getRecords()
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