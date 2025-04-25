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
          

          <validation-provider #default="{ errors }" name="fullname" rules="requeridoE">
            <b-form-group label="Nombre Completo" label-for="fullname">
              <b-form-input
                v-model="items.fullname"
                id="fullname"
                placeholder="Nombre"
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
            <b-form-group label="Nro Documento" label-for="document">
              <b-form-input
                v-model="items.document"
                id="document"
                placeholder="Nro Documento"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="{ errors }"
            name="email"
            rules="requeridoE|correo"
          >
            <b-form-group label="Correo" label-for="email">
              <b-form-input
                id="email"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Correo"
                v-model="items.email"
                autocomplete="off"
              />
              <small
                class="text-danger alert"
                :style="{
                  height: (errors.length > 0 ? 20 : 0) + 'px',
                }"
                >{{ errors[0] }}</small
              >
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

          <validation-provider #default="{ errors }" name="mail_enabled" rules="required">
            <b-form-group>
              <b-form-checkbox
                id="mail_enabled"
                v-model="items.flagMsg"
                name="mail_enabled"
                class="custom-control-primary"
              >
                Habilitado para enviar correo
              </b-form-checkbox>
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
              >{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="active" rules="required">
            <b-form-group>
              <b-form-checkbox
                id="active"
                v-model="items.isActive"
                name="active"
                class="custom-control-primary"
              >
                Activo
              </b-form-checkbox>
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
              >{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="web_access" rules="required">
            <b-form-group>
              <b-form-checkbox
                id="web_access"
                v-model="items.isAccessWeb"
                name="web_access"
                class="custom-control-primary"
              >
                Accede a la web
              </b-form-checkbox>
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
              >{{ errors[0] }}</small>
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
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import TravelService from '@/services/TravelService'
import GroupService from '@/services/GroupService'
import UserService from '@/services/UserService'
import PositionService from '@/services/PositionService'
import ProjectsService from '@/services/ProjectsService'
import RoleUserService from '@/services/RoleUserService'
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
      proyectos: [],
      positions: [],
      grupos: [],
      roles: [],
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
          document: '',
          email: '',
          password: '',
          fullname: '',
          flagMsg: null,
          isActive: null,
          isAccessWeb: null,
      },
      user_id: null,
      temp: {},
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  mounted() {
    this.getData()
  },
  
  methods: {
    async getSelect(){
      this.items.groupId = []
      this.getGroups()
    },
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
    async getData(id=null) {
      this.showLoading = true
      const urlOrder =
        `?limit=1000000&order=asc&sort=description`	
      const respProyectos = await ProjectsService.getProyectos(urlOrder, this.$store)
      console.log('respProyectos', respProyectos)
      //const respRoles = await RoleUserService.getRoles(urlOrder, this.$store)
      //const respPosition = await PositionService.getPositions(urlOrder, this.$store)
      //console.log('respPosition', respPosition)
      if (respProyectos.status) {
        this.proyectos = respProyectos.data.rows
      }
      /* if (respRoles.status) {
        this.roles = respRoles.data.rows
        //eliminar el rol administrador de this.roles
        this.roles = this.roles.filter(rol => rol.id != 1)
      } */
      /* if (respPosition.status) {
        this.positions = respPosition.data.rows
      } */
      this.getGroups()
      this.showLoading = false
    },
    async getGroups(){
      const url = `?limit=1000000&order=asc&sort=description&filter=` + JSON.stringify([{ keyContains: 'project.id', key: 'equals', value: this.items.projectId }])
      console.log('url', url)
      const respGrupos = await GroupService.getGroups(url, this.$store)
      if (respGrupos.status) {
        this.grupos = respGrupos.data.rows
        console.log('grupos', this.grupos)
      }
    },
    setData(items) {
      if (items) {
        console.log('items add-edit', items)
        this.temp = items
        this.user_id = items.id
        this.items.document = items.document
        this.items.email = items.email
        this.items.password = items.password
        this.items.fullname = items.fullname
        this.items.flagMsg = items.flagMsg
        this.items.isActive = items.isActive
        this.items.isAccessWeb = items.isAccessWeb
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          document: '',
          email: '',
          password: '',
          fullname: '',
          flagMsg: null,
          isActive: null,
          isAccessWeb: null,
      }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      console.log("RESET")
      this.isEdit = false
      this.items = {
          document: '',
          email: '',
          password: '',
          fullname: '',
          flagMsg: null,
          isActive: null,
          isAccessWeb: null,
      }
    },
    async onSubmit(data) {
      console.log('data1', data)
      const formData = { ...this.items };
      formData.isAccessWeb = this.items.isAccessWeb ? 1 : 0;
      formData.isActive = this.items.isActive ? 1 : 0;
      formData.flagMsg = this.items.flagMsg ? 1 : 0;
      console.log('data1', formData)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        data.email = data.email.trim();
        if (success) {
          let resp = ''
          console.log('data TO SAVE', data)
          if(data.roleId == 2 || data.roleId == 6){
            data.groupId = []
            console.log("ES PILOTO NO TIENE GRUPO", data)
          }
          if (this.isEdit == false) {
            resp = await UserService.registerU(formData, this.$store)
          } else {
            let id = this.user_id
            console.log('id', id)
            resp = await UserService.updateUser(id, formData, this.$store)
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
