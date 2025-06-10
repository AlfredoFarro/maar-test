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
          ref="proyectoAdd"
        >
      </add-edit>
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="7" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100">
                <b-form-group label="Nombre de la Empresa" label-for="name" class="mr-2">
                  <b-form-input
                    type="text"
                    label="name"
                    id="name"
                    placeholder="Nombre de la Empresa"
                    v-model="name"
                    @input="filter()"
                    class="select-obra"
                    autocomplete="off"
                  >
                  </b-form-input>
                </b-form-group>
              </div>   
            </b-col> 
            <b-col md="7" lg="2" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100">
                <b-form-group label="RUC" label-for="ruc" class="mr-2">
                  <b-form-input
                    type="text"
                    label="ruc"
                    id="ruc"
                    placeholder="RUC"
                    v-model="ruc"
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
                  @click="addProyecto()"
                >
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      <b-row v-if="records.length > 0">
        <b-col v-for="(item, index) in records" :key="index" cols="12" sm="6" md="4" lg="3">
          <div class="card_project d-flex flex-column mb-2">
            <div class="card_img">
              <img :src="item.url_image ? item.url_image : sideImg" :alt="'imagen_project_' + index" />
            </div>

            <div class="card_content px-2 py-2 d-flex flex-column">
              <span class="card_content_sub">{{ item.ruc }}</span>
              <span class="card_content_title mb-2">{{ item.name }}</span>
              <!-- Switch de estado agregado -->
              <div class="d-flex align-items-center mb-2">
                <span class="mr-2 status-text">{{ item.isActive ? 'Activo' : 'Inactivo' }}</span>
                <b-form-checkbox
                  switch
                  v-model="item.isActive"
                  :value="1"
                  :unchecked-value="0"
                  :disabled="!rolesAllowed.includes(user_role)"
                  @change="changeStatus1(item)"
                  class="custom-switch"
                />
              </div>
              <div class="d-flex justify-content-between">
                <b-button
                  size="sm"
                  class="border-0 px-0 btn_edit"
                  @click.prevent="edit(item)"
                  :disabled="!rolesAllowed.includes(user_role)"
                  v-b-tooltip.noninteractive.hover.top="'Editar'"
                  variant="light"
                  style="font-size: 15px;"
                >
                  Editar
                </b-button>
                <b-button
                  size="sm"
                  class=""
                  :disabled="!rolesAllowed.includes(user_role)"
                  v-b-tooltip.noninteractive.hover.top="'Eliminar'"
                  @click="deleteAction(item)"
                  variant="flat-danger"
                >
                  <feather-icon size="20" icon="Trash2Icon" />
                </b-button>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-card no-body>
        <!-- <b-table
          class="position-relative"
          :hover="true"
          :items="records"
          responsive
          :fields="fields"
          show-empty
          empty-text="No existen"
          @sort-changed="sortChanged"
          no-border-collapse
        >
          <template #cell(actions)="data">
            <b-button
              size="sm"
              class=""
              @click.prevent="edit(data.item)"
              v-b-tooltip.noninteractive.hover.top="'Editar'"
              variant="flat-success"
            >
              <feather-icon icon="Edit2Icon" />
            </b-button>
            <b-button
              size="sm"
              class=""
              v-b-tooltip.noninteractive.hover.top="'Eliminar'"
              @click="deleteAction(data.item)"
              variant="flat-danger"
            >
              <feather-icon icon="Trash2Icon" />
            </b-button>
          </template>
          <template #cell(amount)="data">
            <span>{{ data.item ? (parseFloat(data.item.amount)).toLocaleString('en'): parseFloat(0)}}</span>
          </template>
        </b-table> -->
        <div class=" p-2">
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
            <!-- Pagination -->
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
const APIURL = process.env.APIURLFILE
import Vue from 'vue'
import filters from './filters.vue'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import EnterpriseService from '@/services/EnterpriseService'
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
      showLoading: false,
      fields: [
        { key: 'ruc', label: 'Ruc', sortable: false },
        { key: 'name', label: 'Nombre', sortable: false },
        { key: 'contract_type', label: 'Tipo Contrato', sortable: false },
        { key: 'amount', label: 'Monto', sortable: false },
        { key: 'participation', label: 'Participación', sortable: false },
        { key: 'manager', label: 'Gerente', sortable: false },
        { key: 'actions', label: 'Acciones' }
      ],
      form: {
        ruc: null,
        name: '',
      },
      records: [],
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      rolesAllowed: ['administrador'],
      documentSelect: [],
      arrayFilters: [],
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      totalElements: 0,
      id: 0,
      sort: 'id',
      order: 'desc',
      name: '',
      ruc: '',
      apiurl: APIURL,
      isAdd: false,
      sideImg: require('@/assets/images/access/default.png')
    }
  },
  components: {
    vSelect,
    filters,
    addEdit,

  },
  mounted() {
    this.getData()
  },
  methods: {
    async changeStatus1(item) {
      console.log("cambio estado")
      try {
        this.showLoading = true;

        // Guarda el estado anterior para revertir en caso de error
        const previousStatus = item.isActive;

        // Construye el objeto de actualización correctamente
        const updateData = {
          isActive: item.isActive ? 1 : 0, // Asegúrate de que sea 1/0 (o true/false según el backend)
        };

        // Llama al servicio de actualización
        const resp = await EnterpriseService.updateEnterprise(item.id, updateData, this.$store);

        if (resp.status) {
          this.$swal({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El estado ha sido actualizado correctamente',
            customClass: { confirmButton: 'btn btn-success' },
          });
          // No necesitas llamar a getAllData() si solo cambias el estado
          // item.isActive ya está actualizado por el v-model
        } else {
          // Revierte el cambio si falla
          item.isActive = previousStatus;
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: resp.data.message || 'No se pudo actualizar el estado',
            customClass: { confirmButton: 'btn btn-success' },
          });
        }
      } catch (error) {
        console.error('Error al cambiar estado:', error);
        // Revierte el cambio si hay un error
        item.isActive = !item.isActive;
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cambiar el estado',
          customClass: { confirmButton: 'btn btn-success' },
        });
      } finally {
        this.showLoading = false;
      }
    },
    cambioPagina(e) {
      this.currentPage = e
      this.getData()
    },
    changeSizePage() {
      this.getData()
    },
    sortChanged(data) {
      this.sort = data.sortBy
      if (data.sortDesc) {
        this.order = 'desc'
      } else this.order = 'asc'
    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      
      if (this.name != null && this.name != '') {
        this.arrayFilters.push({ keyContains: 'name', key: 'contains', value: this.name })
      }
      if (this.ruc != null && this.ruc != '') {
        this.arrayFilters.push({ keyContains: 'ruc', key: 'contains', value: this.ruc })
      }
      
      this.getData()
    },
    async getData() {
      this.showLoading = true
      const url =
        `?limit=${this.showEntrie}&page=${this.currentPage}&order=${this.order}&sort=${this.sort}&filter=` +
        JSON.stringify(this.arrayFilters)
      const respProyectos = await EnterpriseService.getEnterprise(url, this.$store)
      console.log('respProyectos', respProyectos)
      if (respProyectos.status) {
        this.records = respProyectos.data.rows
        this.totalElements = respProyectos.data.responseFilter.total_rows
      }
      this.showLoading = false
    },
    addProyecto(){
      this.isAdd = true
      this.$refs.proyectoAdd.setData()

    },
    edit(item) {
      console.log('itemAS', item)
      this.form.id = item.id
      this.form.ruc = item.ruc
      this.form.name = item.name
     
      console.log('this.form', this.form)
      this.isAdd = true
      console.log("aqui")
      this.$refs.proyectoAdd.setData(this.form)

    },
    async deleteAction(data) {
     
      this.$swal({
        title: '¿Desea eliminar este proyecto?',
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
          this.deleteData(data.id)
        }
      })
    },
    async deleteData(id) {
      console.log('id', id)
      const resp = await EnterpriseService.deleteEnterprise(id, this.$store)
      if (resp.status) {
        this.currentPage = 1
        this.$swal({
          icon: 'success',
          title: 'Eliminado!',
          text: 'El proyecto ha sido eliminado.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        this.getData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el proyecto seleccionada.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.card_project {
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
  // background: linear-gradient(118deg, #001955, rgba(0, 25, 85, 0.7))
  background: linear-gradient(
    0deg,
    rgba(246, 249, 252, 1) 0%,
    rgba(234, 242, 249, 1) 48%,
    rgba(223, 235, 248, 1) 100%
  );
}
.card_project .card_content .card_content_sub {
  color: #59ccd0;
  font-weight: 600;
}
.card_project .card_content .card_content_title {
  font-size: 18px;
  font-weight: 600;
  color: #001955;
}
.card_img img {
  width: 100%;
  object-fit: cover;
  height: 200px;
  border-radius: 15px 15px 0px 0px;
  background-color: #fff !important;
}
.card_content .btn_edit:hover{
  background-color: transparent !important;
}
.card_content .btn_edit{
  color:  #001955;
  font-weight: 600;
}
</style>
