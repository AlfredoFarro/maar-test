<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-crono"
    :visible="isAdd"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    no-close-on-backdrop
    @change="(val) => $emit('update:is-add', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
      >
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nuevo' }} cronograma</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click=";[hide(), resetForm()]"
        />
      </div>

      <!-- BODY -->
      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <!-- Form -->

        <b-form class="p-2" @submit.prevent="onSubmit(items)">
          
          <validation-provider #default="{ errors }" name="code" rules="requeridoE">
            <b-form-group label="Código" label-for="code">
              <b-form-input
                v-model="items.code"
                id="code"
                placeholder="Código"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="dateInit" rules="requeridoE">
            <b-form-group label="Fecha Inicio" label-for="dateInit">
              <flat-pickr
                id="dateInit"
                v-model="items.dateInit"
                class="form-control"
                :config="config"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="dateEnd" rules="requeridoE">
            <b-form-group label="Fecha Fin" label-for="dateEnd">
              <flat-pickr
                id="dateEnd"
                v-model="items.dateEnd"
                class="form-control"
                :config="config"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="state" rules="">
            <b-form-group label="Estado" label-for="state">
              <!-- <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="types"
                label="text"
                input-id="type"
                :reduce="(types) => types.value"
                v-model="items.type"
                placeholder="Tipo"
              /> -->

              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">Interno</span>
                <b-form-checkbox v-model="items.state" name="state" switch >                       
                </b-form-checkbox>                       
                  <span class="ml-2">Externo</span>
              </div>
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="formAssignedQty" rules="requeridoE">
            <b-form-group label="N° Formularios Asignados" label-for="formAssignedQty">
              <b-form-input
                v-model="items.formAssignedQty"
                type="number"
                id="formAssignedQty"
                placeholder="N° Formularios Asignados"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="formApprovQty" rules="requeridoE">
            <b-form-group label="N° Formularios Aprobados" label-for="formApprovQty">
              <b-form-input
                v-model="items.formApprovQty"
                type="number"
                id="formApprovQty"
                placeholder="N° Formularios Aprobados"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="route" rules="requeridoE">
            <b-form-group label="Ruta" label-for="route">
              <b-form-input
                v-model="items.route"
                id="route"
                placeholder="Ruta"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="primaryPilotId" rules="requeridoE">
            <b-form-group label="Piloto 1" label-for="primaryPilotId">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="pilots"
                label="fullname"
                input-id="primaryPilotId"
                :reduce="(pilots) => pilots.id"
                v-model="items.primaryPilotId"
                placeholder="Piloto 1"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="secondaryPilotId" rules="requeridoE">
            <b-form-group label="Piloto 2" label-for="secondaryPilotId">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="pilots"
                label="fullname"
                input-id="secondaryPilotId"
                :reduce="(pilots) => pilots.id"
                v-model="items.secondaryPilotId"
                placeholder="Piloto 2"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          
          

          
          <!-- Form Actions -->
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="invalid"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled" class="px-1">guardando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Agregar' }}</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click=";[hide(), resetForm()]"
            >
              Cancel
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
/* eslint-disable*/
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import TravelService from '@/services/TravelService'
import UserService from '@/services/UserService'

import moment from 'moment'
Vue.use(BootstrapVue)
export default {
  directives: {
    Ripple
  },
  components: {
    // Form Validation
    flatPickr,
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      required,
      // speciality: {
      //   title: ''
      // },
      isEdit: false,
      isDisabled: false,
      showLoading: false,
      tabIndex: 0,
      records: [],
      pilots: [],
      prioridades: [
        {
          id: 1,
          name: 'Alta'
        },
        {
          id: 2,
          name: 'Media'
        },
        {
          id: 3,
          name: 'Baja'
        }
      ],
      types:[
        {
          text: 'Campo',
          value: 'campo'
        },
        {
          text: 'Critica',
          value: 'critica'
        },
      ],
      config: {
        plugins: [
          ShortcutButtonsPlugin({
            theme: 'dark',
            button: [{ label: 'Hoy' }],
            onClick(index, fp) {
              let date = index ? new Date(Date.now() + 24 * index * 60 * 60 * 1000) : new Date()
              fp.setDate(date)
              fp.close()
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
      categorias: [],
      subcategorias: [],
      subcategory: [],
      especialidades: [],
      leadTime: '',
      project_id: this.$parent.$parent.project_id,
      items: {
        /* project_id: this.$parent.$parent.project_id, */
        code: null,
        dateInit: '',
        dateEnd: '',
        state: null,
        formAssignedQty: null,
        formApprovQty: null,
        route: '',
        primaryPilotId: null,
        secondaryPilotId: null,
      },
      crono_id: null,
      temp: {},
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  mounted() {
    this.getPilots()
  },
  
  methods: {
    validDate(fecha) {
     
      if (fecha != null) {
        const year = new Date(fecha).getFullYear()
        if (year <= 1970) {
          return ''
        }
        // console.log('data fecha', fecha)
        // console.log('fecha local', moment(fecha, 'yyyy-MM-DD HH:mm').utc(fecha).format('yyyy-MM-DD'))
        return moment(fecha, 'yyyy-MM-DD HH:mm').utc(fecha).format('yyyy-MM-DD')
      }
      return ''
    },
    async getPilots() {
      let resp = await UserService.getPilots('',this.$store)
      this.pilots = resp.data
      console.log('PILOTOOOOOS', this.pilots)
    },
    
    diferenDate(fecha, val) {
      if (fecha != null) {
        if (val == 1) {
          let date1T = moment(fecha).format('yyyy-MM-DD')
          let date2T = moment(this.items.date_required).format('yyyy-MM-DD')
          let date1 = moment(date1T)
          let date2 = moment(date2T)
          if (date1.diff(date2, 'days') > 0) {
            this.$swal({
              icon: 'warning',
              title: 'Fecha inválida',
              text: 'La fecha identificada no puede ser mayor a la fecha requerida',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            this.items.date_identified = new Date()
          }
        } else {
          let date1T = moment(this.items.date_identified).format('yyyy-MM-DD')
          let date2T = moment(fecha).format('yyyy-MM-DD')
          let date1 = moment(date1T)
          let date2 = moment(date2T)
          if (date2.diff(date1, 'days') < 0) {
            this.$swal({
              icon: 'warning',
              title: 'Fecha inválida',
              text: 'La fecha requerida no puede ser menor a la fecha identificada',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            this.items.date_required = new Date()
          }
        }
      }
    },
    async getData(id) {
      this.showLoading = true
      let url =
        `?filter=` + JSON.stringify([{ keyContains: 'project_id', key: 'equals', value: id }])
      const respCategory = ""
      console.log('respCategory', respCategory)
      if (respCategory.status) {
        this.categorias = respCategory.data.rows
      }
      this.showLoading = false
    },
    setData(items) {
      if (Object.entries(items).length !== 0) {
        console.log('items add-edit', items)
        this.temp = items
        this.crono_id = items.id
        this.items.code = items.code
        this.items.formAssignedQty = items.formAssignedQty
        this.items.formApprovQty = items.formApprovQty
        this.items.dateInit = this.validDate(items.dateInit)
        this.items.dateEnd = this.validDate(items.dateEnd)
        this.items.route = items.route
        this.items.primaryPilotId = items.primaryPilot.id
        this.items.secondaryPilotId = items.secondaryPilot.id
        if (items.state == 0) {
          this.items.state = false;
        } else {
          this.items.state = true;
        }
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          code: null,
          state: null,
          formAssignedQty: null,
          formApprovQty: null,
          route: '',
          primaryPilotId: null,
          secondaryPilotId: null,
          dateInit: new Date(),
          dateEnd: new Date(),
          
        }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
          code: null,
          dateInit: '',
          dateEnd: '',
          state: null,
          formAssignedQty: null,
          formApprovQty: null,
          route: '',
          primaryPilotId: null,
          secondaryPilotId: null,
      }
    },
    async onSubmit(data) {
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        if (success) {
          let resp = ''
          if (data.state) {
            data.state = 1
          } else {
            data.state = 0
          }
          data.formApprovQty = parseInt(data.formApprovQty)
          data.formAssignedQty = parseInt(data.formAssignedQty)
          console.log('data TO SAVE', data)

          if (this.isEdit == false) {
            resp = await TravelService.saveTravel(data, this.$store)
          } else {
            let id = this.crono_id
            resp = await TravelService.updateTravel(id, data, this.$store)
            console.log("UPDATEADO")
          }
          console.log('resp', resp)
          if (resp.status) {
            this.$swal({
              title: this.isEdit == true ? 'Actualizado' : 'Registrado',
              text: 'Los datos han sido ' + (this.isEdit == true ? 'actualizado.' : 'registrado.'),
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
            this.$parent.$parent.getAllData()
            this.$emit('update:is-add', false)
            this.resetForm()
          } else {
            this.$swal({
              title: 'Error!',
              text: resp.data.message
                ? resp.data.message
                : 'Ocurrió un error al ' +
                  (this.isEdit == true ? 'actualizar' : 'registrar') +
                  ' los datos del formulario.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          }
        }
        this.showLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
