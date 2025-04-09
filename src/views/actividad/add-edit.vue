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
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nueva' }} actividad</h5>

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
          <validation-provider #default="{ errors }" name="project_id" rules="requeridoE">
            <b-form-group label="Proyecto" label-for="project_id">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="proyectos"
                label="description"
                input-id="project_id"
                :reduce="(proyectos) => proyectos.id"
                v-model="items.projectId"
                @input="getData"
                placeholder="Proyecto"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" rules="requeridoE">
            <b-form-group label="Sede" label-for="sede">
              <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="sedes"
              label="description"
              input-id="sede"
              :reduce="(sedes) => sedes.id"
              placeholder="Sede"
              v-model="items.sedeId"
              class="select-obra"/>
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="code" rules="">
            <b-form-group label="Código" label-for="code">
              <b-form-input
                v-model="items.code"
                id="code"
                placeholder="Código"
                autocomplete="off"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" rules="requeridoE">
            <b-form-group label="Tipo de Actividad" label-for="service">
              <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="servicios"
              input-id="service"
              placeholder="Tipo de Actividad"
              v-model="items.type"
              class="select-obra"/>
              <small class="text-danger">{{ errors[0] }}</small>
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
         
          <validation-provider #default="{ errors }" name="route" rules="requeridoE">
            <b-form-group label="Descripción" label-for="route">
              <b-form-input
                v-model="items.route"
                type="text"
                id="route"
                placeholder="Descripción"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="plate" rules="requeridoE">
            <b-form-group label="Código de Unidad" label-for="plate">
              <b-form-input
                v-model="items.plate"
                type="text"
                id="plate"
                placeholder="Código de Unidad"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="stopQty" rules="requeridoE">
            <b-form-group label="Cantidad de Paradas" label-for="stopQty">
              <b-form-input
                v-model="items.stopQty"
                type="number"
                id="stopQty"
                placeholder="Cantidad de Paradas"
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
                :options="getFilteredPilots('secondaryPilotId')"
                label="fullname"
                input-id="primaryPilotId"
                :reduce="(pilot) => pilot.id"
                v-model="items.primaryPilotId"
                placeholder="Piloto 1"
              />
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          
          <validation-provider #default="{ errors }" name="secondaryPilotId">
            <b-form-group label="Piloto 2" label-for="secondaryPilotId">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="getFilteredPilots('primaryPilotId')"
                label="fullname"
                input-id="secondaryPilotId"
                :reduce="(pilot) => pilot.id"
                v-model="items.secondaryPilotId"
                placeholder="Piloto 2"
              />
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
import SedeService from '@/services/SedeService'
import ActivityService from '@/services/ActivityService'
import ProjectsService from '@/services/ProjectsService'
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
      sedes: [],
      servicios: ['Abastecimiento de combustible', 'Viaje en vacío', 'Prueba en ruta', 'Mantenimiento de la unidad'],
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
        enableTime: true,
        dateFormat: "Y-m-d H:i",
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
        projectId: this.$parent.$parent.project_id,
        sedeId: null,
        type: null,
        stopQty: null,
        route: null,
        plate: null,
        code: null,
        dateInit: null,
        dateEnd: null,
        primaryPilotId: null,
        secondaryPilotId: null,
      },
      proyectos: [],
      internoForms: [],
      externoForms: [],
      externoFormsId: [],
      internoFormsId: [],
      crono_id: null,
      temp: {},
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  mounted() {
    
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
        return moment(fecha, 'yyyy-MM-DD HH:mm').utc(fecha).format('yyyy-MM-DD HH:mm')
      }
      return ''
    },
    async getData(id){
      console.log("GET DATA", id)
      this.getPilots()
      this.getProjects()
      this.getSedes()
      if(id){
        this.items.projectId = id
      }
      /* this.getForms(this.items.projectId) */
    },
    async getPilots() {
      const arrayFilters = []
      this.items.primaryPilotId = null
      this.items.secondaryPilotId = null
      console.log("PROJECT ID", this.items.projectId)
      if (this.items.projectId != null && this.items.projectId != '') {
          arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.projectId })
      }
      arrayFilters.push({ keyContains: 'role.description', key: 'equals', value: 'piloto' })
      const url =
      `?limit=10000&filter=` +
      JSON.stringify(arrayFilters)
      console.log("URL PILOTOS",url)
      let resp = await UserService.getUsers(url,this.$store)
      this.pilots = resp.data.rows
      console.log('PILOTOOOOOS', this.pilots)
    },
    async getProjects() {
      const respProyectos = await ProjectsService.getProyectos('', this.$store)
      this.proyectos = respProyectos.data.rows
      console.log('PROYECTOS', this.proyectos)
    },
    async getSedes(){
        const arrayFilters = []
        this.items.sedeId = null
        if (this.items.projectId != null && this.items.projectId != '') {
            arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.projectId })
        }
        const url =
        `?limit=10000&filter=` +
        JSON.stringify(arrayFilters)
        const respSedes = await SedeService.getSedes(url, this.$store)
        if (respSedes.status) {
            this.sedes = respSedes.data.rows
            console.log("SEDES",this.sedes)
        }
    },
    
   
    getFilteredPilots(selectedPilotKey) {
      // Obtenemos el ID del piloto seleccionado en el otro v-select
      const selectedPilotId = this.items[selectedPilotKey];

      // Filtramos la lista de pilotos para excluir el piloto seleccionado en el otro v-select
      return this.pilots.filter(pilot => pilot.id !== selectedPilotId);
    },
    setData(items) {
      if (Object.entries(items).length !== 0) {
        console.log('items add-edit', items)
        this.temp = items
        this.crono_id = items.id
        this.items.projectId = this.$parent.$parent.project_id,
        this.items.code = items.code
        this.items.sedeId = items.sedeId
        this.items.type = items.type
        this.items.stopQty = items.stopQty
        this.items.route = items.route
        this.items.plate = items.plate
        this.items.dateInit = this.validDate(items.dateInit)
        this.items.dateEnd = this.validDate(items.dateEnd)
        this.items.primaryPilotId = items.primaryPilotId.id
        items.secondaryPilotId ? this.items.secondaryPilotId = items.secondaryPilotId.id : this.items.secondaryPilotId = null
        this

        this.isEdit = true
        console.log("ITEMS", this.items, this.isEdit)
      } else {
        this.temp = {}
        this.items = {
          code: null,
          primaryPilotId: null,
          secondaryPilotId: null,
          dateInit: new Date(),
          dateEnd: new Date(),
          projectId: this.$parent.$parent.project_id,
          sedeId: null,
          type: null,
          stopQty: null,
        }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
      console.log("EDIT", this.isEdit)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
          code: null,
          dateInit: '',
          dateEnd: '',
          primaryPilotId: null,
          secondaryPilotId: null,
          projectId: this.$parent.$parent.project_id,
          sedeId: null,
          type: null,
          stopQty: null,
      }
      this.internoFormsId = []
      this.externoFormsId = []
    },
    async onSubmit(data) {
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        data.stopQty = parseInt(data.stopQty)
        if (success) {
          let resp = ''
          console.log('data TO SAVE', data)

          if (this.isEdit == false) {
            resp = await ActivityService.saveActivity(data, this.$store)
          } else {
            let id = this.crono_id
            resp = await ActivityService.updateActivity(id, data, this.$store)
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
