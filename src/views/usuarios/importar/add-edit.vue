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
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nuevo' }} usuario</h5>

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
          
          <validation-provider #default="{ errors }" name="docType" rules="requeridoE">
            <b-form-group label="Tipo de Docuemnto" label-for="docType">
              <v-select
                id="docType"
                label="text"
                :reduce="(types) => types.value"
                :options = "types"
                v-model="items.docType"
                placeholder="Tipo de Documento"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="document" rules="requeridoE">
            <b-form-group label="Documento" label-for="document">
              <b-form-input
                v-model="items.document"
                id="document"
                placeholder="Documento"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="fullname">
            <b-form-group label="Nombre" label-for="fullname">
              <b-form-input
                v-model="items.fullname"
                id="fullname"
                placeholder="Nombre"
                autocomplete="off"
              />
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="{ errors }"
            name="email"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Email"
                v-model="items.email"
                autocomplete="off"
              />
            </b-form-group>
          </validation-provider>
          <b-form-group v-if="isEdit">
            <div class="d-flex justify-content-between">
              <label for="password">Contraseña</label>
            </div>

            <b-input-group class="input-group-merge">
              <b-form-input
                id="password"
                trim
                v-model="items.password"
                :type="passwordFieldType"
                name="login-password"
                autocomplete="off"
                placeholder="Contraseña"
              />
              <b-input-group-append is-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="passwordToggleIcon"
                  @click="togglePasswordVisibility"
                />
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-form-group v-if="!isEdit">
            <div class="d-flex justify-content-between">
              <label for="password">Contraseña</label>
            </div>
            <validation-provider
              #default="{ errors }"
              name="password"
              rules="requeridoE"
            >
              <b-input-group
                class="input-group-merge"
                :class="errors.length > 0 ? 'is-invalid' : null"
              >
                <b-form-input
                  id="password"
                  trim
                  v-model="items.password"
                  :type="passwordFieldType"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                  name="login-password"
                  autocomplete="off"
                  placeholder="Contraseña"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="passwordToggleIcon"
                    @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
              <small
                class="text-danger alert"
                :style="{
                  height: (errors.length > 0 ? 20 : 0) + 'px',
                }"
                >{{ errors[0] }}</small
              >
            </validation-provider>
          </b-form-group>

          <validation-provider #default="{ errors }" name="position">
            <b-form-group label="Posición" label-for="position">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="positions"
                label="description"
                input-id="position"
                :reduce="(positions) => positions.description"
                v-model="items.position"
                placeholder="Posición"
              />
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="role" >
            <b-form-group label="Rol" label-for="role">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="roles"
                label="description"
                input-id="role"
                :reduce="(roles) => roles.description"
                v-model="items.role"
                placeholder="Rol"
              />
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="delete" rules="requeridoE">
            <b-form-group label="Dar de Baja" label-for="delete">
              <v-select
                :options="deletes"
                label="text"
                input-id="delete"
                :reduce="(deletes) => deletes.value"
                v-model="items.delete"
                placeholder="Dar de Baja"
                autocomplete="off"
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
import SedeService from '@/services/SedeService'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import TravelService from '@/services/TravelService'
import UserService from '@/services/UserService'
import RoleUserService from '@/services/RoleUserService'
import PositionService from '@/services/PositionService'
import GroupService from '@/services/GroupService'
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
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  mixins: [togglePasswordVisibility],
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
      positions: [],
      roles: [],
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
          text: 'DNI',
          value: 'DNI'
        },
        {
          text: 'Carnet de Extranjería',
          value: 'Carnet de Extranjería'
        },
      ],
      deletes:[
        {
          text: 'Si',
          value: 'Si'
        },
        {
          text: 'No',
          value: 'No'
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
        docType: '',
        document: '',
        fullname: '',
        email: '',
        password: '',
        position: null,
        role: null,
        delete: null
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
    this.getData()
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
    async getPositions() {
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
      this.showLoading = true
      const urlOrder =
        `?limit=1000000&order=asc&sort=description`	
      
      const respRoles = await RoleUserService.getRoles(urlOrder, this.$store)
      const respPosition = await PositionService.getPositions(urlOrder, this.$store)
      console.log('respPosition', respPosition)
      
      if (respRoles.status) {
        this.roles = respRoles.data.rows
      }
      if (respPosition.status) {
        this.positions = respPosition.data.rows
      }
      this.showLoading = false
    },
    consultItems(){
      console.log("CONSULTANDO ITEMS", this.items.sedeCode)
    },
    async getSedes(){
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
        const respSedes = await SedeService.getSedes(url, this.$store)
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
        this.items.docType = items.docType
        this.items.document = items.document
        this.items.fullname = items.fullname
        this.items.email = items.email
        this.items.password = items.password
        this.items.position = items.position
        this.items.role = items.role
        this.items.delete = items.delete
        this.tempIndex = items.index
        this.isEdit = true
        console.log("ITEMS", this.items, this.isEdit)
      } else {
        this.temp = {}
        this.items = {
          docType: '',
          document: '',
          fullname: '',
          email: '',
          password: '',
          position: null,
          role: null,
        }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
          docType: '',
          document: '',
          fullname: '',
          email: '',
          password: '',
          position: null,
          role: null,
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
