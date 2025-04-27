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
          <validation-provider #default="{ errors }" rules="requeridoE">
            <b-form-group label="Sede" label-for="sede">
              <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="sedes"
              label="description"
              input-id="sede"
              placeholder="Sede"
              v-model="items.sedeCode"
              :reduce="(sedes) => sedes.description"
              class="select-obra"
              >
                  <!--   <template slot="option" slot-scope="option">
                      {{ option.code }}|{{ option.description }}
                    </template> -->
                  </v-select>
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
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="plate" rules="">
            <b-form-group label="Codigo de Unidad" label-for="plate">
              <b-form-input
                v-model="items.plate"
                id="plate"
                placeholder="Codigo de Unidad"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" rules="requeridoE">
            <b-form-group label="Tipo de Servicio" label-for="sede">
              <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="servicios"
              input-id="service"
              placeholder="Tipo de Servicio"
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
                :reduce="(pilot) => pilot.fullname"
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
                :reduce="(pilot) => pilot.fullname"
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
import SedeService from '@/services/SedeService'
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
      servicios: ['Externo', 'Interno', 'PDP Externo', 'PDP Interno'],
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
      sedes: [],
      leadTime: '',
      project_id: this.$parent.$parent.project_id,
      items: {
        code: null,
        plate: null,
        route: '',
        dateInit: null,
        dateEnd: null,
        type: null,
        stopQty: null,
        sedeCode: null,
        primaryPilotId: null,
        secondaryPilotId: null,
      },
      formattedSedeCode: '',
      projectId: this.$parent.$parent.project_id,
      crono_id: null,
      temp: {},
      tempIndex: null,
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  mounted() {
    this.getPilots()
  },
  
  methods: {
    validDate(fecha) {
      if (fecha != null) {
        const year = new Date(fecha).getFullYear();
        if (year <= 1970) {
            return '';
        }
        const fechaAjustada = new Date(fecha);
        fechaAjustada.setHours(fechaAjustada.getHours()); // Sumar 5 horas
        return moment(fechaAjustada).utc().format('yyyy-MM-DD HH:mm');
      }
      return '';
    },
    formatAndSaveSedeCode(selectedSede) {
      console.log("VALUE", selectedSede)
      // Realiza el formateo según tu necesidad
      // Por ejemplo, aquí simplemente asignamos el valor a items.sedeCode
      const formattedSedeCode = `${selectedSede.code}|${selectedSede.description}`;
      this.items.sedeCode = formattedSedeCode;
      console.log("SEDE CODE", this.items.sedeCode)
    },
    async getPilots() {
      const arrayFilters = []
      this.items.primaryPilotId = null
      this.items.secondaryPilotId = null
      console.log("PROJECT ID", this.projectId)
      if (this.projectId != null && this.projectId != '') {
          arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.projectId })
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
    getFilteredPilots(selectedPilotKey) {
      // Obtenemos el ID del piloto seleccionado en el otro v-select
      const selectedPilotId = this.items[selectedPilotKey];

      // Filtramos la lista de pilotos para excluir el piloto seleccionado en el otro v-select
      return this.pilots.filter(pilot => pilot.fullname !== selectedPilotId);
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
    async getData(){
      this.getPilots()
      this.getEmpresas()
      
      /* this.getForms(this.items.projectId) */
    },
    consultItems(){
      console.log("CONSULTANDO ITEMS", this.items.sedeCode)
    },
    async getEmpresas(){
        const arrayFilters = []
        this.items.sedeCode = null
        console.log("PROJECT IDddd", this.projectId)
        if (this.projectId != null && this.projectId != '') {
            arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.projectId})
        }
        const url =
        `?limit=10000&filter=` +
        JSON.stringify(arrayFilters)
        console.log("URL SEDES",url)
        const respSedes = await SedeService.getEmpresas(url, this.$store)
        if (respSedes.status) {
            this.sedes = respSedes.data.rows
            console.log("SEDES",this.sedes)
        }
    },
    setData(items) {
      if (Object.entries(items).length !== 0) {
        console.log('items add-edit', items)
        this.temp = items
        this.crono_id = items.id
        this.items.code = items.code
        this.items.plate = items.plate
        this.items.route = items.route
        this.items.dateInit = items.dateInit
        this.items.dateEnd = items.dateEnd
        this.items.type = items.type
        this.items.stopQty = items.stopQty
        this.items.sedeCode = items.sedeCode
        this.items.primaryPilotId = items.primaryPilotId
        items.secondaryPilotId ? this.items.secondaryPilotId = items.secondaryPilotId : this.items.secondaryPilotId = null
        /* this.items.dateInit = this.validDate(items.dateInit)
        this.items.dateEnd = this.validDate(items.dateEnd) */
        this.tempIndex = items.index
        console.log("TEMP", this.tempIndex)
        this.isEdit = true
        console.log("ITEMS", this.items, this.isEdit)
      } else {
        this.temp = {}
        this.items = {
          code: null,
          plate: null,
          route: '',
          dateInit: new Date(),
          dateEnd: new Date(),
          type: null,
          stopQty: null,
          sedeCode: null,
          primaryPilotId: null,
          secondaryPilotId: null,
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
          plate: null,
          route: '',
          dateInit: '',
          dateEnd: '',
          type: null,
          stopQty: null,
          sedeCode: null,
          primaryPilotId: null,
          secondaryPilotId: null,
      }
    },
    convertirFecha(fecha) {
      // Crear un objeto de fecha a partir del string proporcionado
      const fechaOriginal = new Date(fecha);
      // Obtener la cadena en el formato deseado
      return fechaOriginal;
    },
    async onSubmit(data) {
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        if (success) {
          
          console.log("TIPO",typeof(data.dateInit));

          /* data.dateInit = this.convertirFecha(data.dateInit)
          data.dateEnd = this.convertirFecha(data.dateEnd) */
          /* data.dateInit = data.dateInit
          data.dateEnd = data.dateEnd
          console.log('data TO SAVE CONVERTED DATE', data)
 */
          
          let id = this.crono_id
          console.log("ID", id)
          this.$parent.$parent.recordsNew.data = data
          this.$parent.$parent.recordsNew.data.indexAllData = this.tempIndex
          this.$parent.$parent.recordsNew.index = this.tempIndex
          /* this.$emit('updateRecord', id, data) */
          
          console.log("UPDATEADO", data)

          
          this.$parent.$parent.getAllData(false)
          this.$swal({
            title: this.isEdit == true ? 'Actualizado' : 'Registrado',
            text: 'Los datos han sido ' + (this.isEdit == true ? 'actualizado.' : 'registrado.'),
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
          })
          this.$emit('update:is-add', false)
          this.resetForm()
          
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
