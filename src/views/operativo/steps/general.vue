<template>
    <!-- eslint-disable -->
    <div>
      <b-overlay
        variant="white"
        :show="showLoading"
        spinner-variant="primary"
        blur="0"
        opacity=".75"
        rounded="sm"
      >
        <b-card no-body>
          <validation-observer #default="{ invalid }" ref="refFormObserver">
            <b-form class="p-1">
                <b-row class="mb-1">
                    <b-col md="12">
                    <h5>Cabecera</h5>
                    </b-col>
                </b-row>
                <b-row class="mb-1">
                    <b-col md="4" class="d-flex flex-column">
                        <validation-provider #default="{ errors }" name="project_id" rules="requeridoE">
                            <b-form-group label="Proyecto" label-for="project_id">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="proyectos"
                                label="description"
                                input-id="project_id"
                                :reduce="(proyectos) => proyectos.id"
                                v-model="items.projectId"
                                @input="getSelects"
                                placeholder="Proyecto"
                            />
                            <small
                                class="text-danger alert"
                                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                                >{{ errors[0] }}</small
                            >
                            </b-form-group>
                        </validation-provider>
                    </b-col>
                    <b-col md="4" class="">
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
                    </b-col>
                    <b-col md="4" class="">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-form-group label="Tipo de Servicio" label-for="service">
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
                    </b-col>
                </b-row>
                <b-row class="mb-1">
                    <b-col cols="12">
                    <h5>Detalle</h5>
                    </b-col>
                </b-row>
                <b-row class="mb-1">
                    <b-col md="6" class="d-flex flex-column">
                        <validation-provider #default="{ errors }" name="plate" rules="requeridoE">
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
                    </b-col>
                    <b-col md="6" class="d-flex flex-column">
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
                    </b-col>  
                </b-row>
            </b-form>
          </validation-observer>
        </b-card>
      </b-overlay>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import Vue from 'vue'
  import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
  import Ripple from 'vue-ripple-directive'
  import { required } from '@validations'
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import vSelect from 'vue-select'
  import flatPickr from 'vue-flatpickr-component'
  import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
  import SedeService from '@/services/SedeService'
  import TravelService from '@/services/TravelService'
  import EnterpriseService from '@/services/EnterpriseService'
  import UserService from '@/services/UserService'
  
  import moment from 'moment'
  Vue.use(BootstrapVue)
  Vue.use(BootstrapVueIcons)
  export default {
    props: ['edit', 'view'],
    directives: {
      'b-tooltip': VBTooltip,
      Ripple
    },
    components: {
      ValidationProvider,
      ValidationObserver,
      vSelect,
      flatPickr,

    },
    data() {
      return {
        showLoading: false,
        tabIndex: 0,
        records: [],
        project: null,
        project_id: JSON.parse(localStorage.getItem('project_id')),
        servicios: ['Externo', 'Interno', 'PDP Externo', 'PDP Interno'],
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
        items: {
            projectId: JSON.parse(localStorage.getItem('project_id')),
            sedeId: null,
            type: null,
            stopQty: null,
            plate: null,
            dateInit: this.validDate(new Date()),
            dateEnd: this.validDate(new Date()),
            route: '',
            primaryPilotId: null,
            secondaryPilotId: null,
            formsId: [],
        },
        sedes: [],
        proyectos: [],
        pilots: [],
        crono_id: null,
        temp: {},
        userData: JSON.parse(localStorage.getItem('userData'))
      }
    },
    async mounted() {
     this.getData()
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
        async getData(){
            console.log("GET DATA")
            this.getSelects()
            
        },
        async getSelects(){
            console.log("GET SELECT")
            this.getEnterprise()
            this.getPilots()
            this.getProjects()
            this.$emit('cambiar-valor', this.items.projectId)
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
            const respProyectos = await EnterpriseService.getEnterprise('', this.$store)
            this.proyectos = respProyectos.data.rows
            console.log('PROYECTOS', this.proyectos)
        },
        async getEnterprise(){
            const arrayFilters = []
            this.items.sedeId = null
            if (this.items.projectId != null && this.items.projectId != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.projectId })
            }
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            console.log("URL SEDES",url)
            const respSedes = await SedeService.getEnterprise(url, this.$store)
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
    }
  }
  </script>
  
  <style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  </style>
  