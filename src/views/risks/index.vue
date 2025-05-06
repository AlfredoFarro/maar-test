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
        ref="riskAdd"
        @refreshTable="getAllData"
      >
    </add-edit>
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="7" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Buscar" label-for="search" class="mr-2">
                  <b-form-input
                    type="text"
                    id="search"
                    placeholder="Buscar riesgo..."
                    v-model="searchTerm"
                    @input="filter()"
                    class="select-obra"
                    autocomplete="off"
                  >
                  </b-form-input>
                </b-form-group>
              </div>
            </b-col>

            <b-col md="6" lg="2" class="d-flex">              
              <div
                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
              >
              <b-button
                  class="mr-2"
                  variant="primary"
                  :disabled="!rolesAllowed.includes(user_role)"
                  @click="addRisk()"
                >
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      <b-card no-body ref="tableCard">
        <div class="table-overflow">
          <b-table
            :key="tableKey"
            class="position-relative"
            empty-text="No existen riesgos registrados"
            :fields="visibleFields"
            :hover="true"
            :items="records"
            :pagination="false"
            no-border-collapse
            ref="selectableTable"
            show-empty
            @sort-changed="sortChanged"
          >
            <!-- Column: ID -->
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>

            <!-- Column: Name -->
            <template #cell(name)="data">
              {{ data.item.name }}
            </template>

            <!-- Column: Actions -->
            <template #cell(actions)="data">
              <b-button
                  size="sm"
                  class="mr-1"
                  @click.prevent="edit(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Editar'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="Edit2Icon" />
              </b-button>
              <b-button
                  size="sm"
                  @click="deleteAction(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                  variant="flat-danger"
                >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>
          </b-table>
        </div>
        <div class="mx-2 mb-2">
          <b-row>
            <b-col sm="3">
              <b-form-group
                label-cols="4"
                label-cols-md="4"
                label-size="md"
                label="Entradas"
                label-for="input-md"
              >
                <b-form-select
                  v-model="showEntrie"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="entries"
                  @change="changeSizePage"
                />
              </b-form-group>
            </b-col>
            <b-col sm="3" class="mt-75" style="font-size: 12px">
              <span> {{ totalElements }} Registros en total</span>
            </b-col>
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
/* eslint-disable */
import RiskService from '@/services/RiskService'
import { required } from '@validations'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import Ripple from 'vue-ripple-directive'
import addEdit from './add-edit.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      required,
      showLoading: false,
      searchTerm: '',
      tableKey: 0,
      fields: [
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '100px' } },
        { key: 'name', label: 'Nombre', sortable: true, visible: true, thStyle: { width: 'auto' } }

      ],
      
      records: [],
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      totalElements: 0,
      sort: 'id',
      order: 'asc',
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      rolesAllowed: ['administrador', 'gestor'],
      isAdd: false,

    }
  },
  components: {
    addEdit,
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    visibleFields() {
      return this.fields.filter((field) => field.visible)
    },
    
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    addRisk(){
      this.isAdd = true
      this.$refs.riskAdd.setData()
    },
    edit(item) {
      this.isAdd = true
      this.$refs.riskAdd.setData(item)
    },
    async deleteAction(data){
      this.$swal({
        title: '¿Desea eliminar este riesgo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminalo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.currentPage = 1
          this.$swal({
            icon: 'success',
            title: 'Eliminado!',
            text: 'El riesgo ha sido eliminado.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.deleteData(data.id)
        }
      })
    },
    async deleteData(id) {
      const resp = await RiskService.deleteRecord(id, this.$store)
      if (resp) {
        this.getAllData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el riesgo.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    },
    filter() {
      this.currentPage = 1
      this.getAllData()
    },
    cambioPagina(page) {
      this.currentPage = page;
      this.getAllData();
    },
    changeSizePage() {
      this.currentPage = 1;
      this.getAllData();
    },
    sortChanged(data) {
      this.sort = data.sortBy;
      this.order = data.sortDesc ? 'desc' : 'asc';
      this.currentPage = 1;
      this.getAllData();
    },
    async getAllData() {
  this.showLoading = true;

  try {
    // Construir parámetros de consulta
    const params = {
      limit: this.showEntrie,
      page: this.currentPage,
      sort: this.sort,
      order: this.order
    };

    // Agregar filtro si hay término de búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      params.filter = JSON.stringify([{
        keyContains: 'name',
        key: 'contains',
        value: this.searchTerm.trim()
      }]);
    }

    // Construir URL
    const url = `?${new URLSearchParams(params)}`;
    
    // Llamar al servicio
    const response = await RiskService.getRisk(url, this.$store);

    // Manejo seguro de la respuesta
    if (response && response.data) {
      this.records = Array.isArray(response.data.rows) ? response.data.rows : [];
      this.totalElements = response.data.responseFilter?.total_rows || 0;
      this.tableKey += 1; // Forzar actualización de la tabla
    } else {
      throw new Error('Estructura de respuesta inválida');
    }
  } catch (error) {
    console.error("Error fetching risks:", error);
    this.$bvToast.toast("Error al cargar riesgos", {
      title: "Error",
      variant: "danger",
      solid: true
    });
    
    // Resetear datos en caso de error
    this.records = [];
    this.totalElements = 0;
  } finally {
    this.showLoading = false;
  }
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

  table {
    width: 100%;
    min-width: 600px;

    thead th,
    tbody td {
      white-space: nowrap;
      padding: 0.75rem 1rem;
      vertical-align: middle;
    }

    thead {
      background-color: #f8f8f8;
      border-bottom: 1px solid #dee2e6;
    }

    tbody tr {
      transition: background-color 0.2s;

      &:hover {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>
