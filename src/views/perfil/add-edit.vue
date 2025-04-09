<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-sede"
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
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nueva' }} sede</h5>

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
          <validation-provider #default="{ errors }" name="name" rules="requeridoE">
            <b-form-group label="Nombre" label-for="name">
              <b-form-input
                v-model="items.description"
                id="name"
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
          <validation-provider #default="{ errors }" name="project_id" rules="requeridoE">
            <b-form-group label="Proyecto" label-for="project_id">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="proyectos"
                label="description"
                input-id="project_id"
                :reduce="(proyectos) => proyectos.id"
                v-model="items.projectId"
                placeholder="Proyecto"
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
import SedeService from '@/services/SedeService'
import { BootstrapVue } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import TravelService from '@/services/TravelService'
import UserService from '@/services/UserService'
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
          code: '',
          description: '',
          projectId: null,
      },
      sede_id: null,
      temp: {},
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  mounted() {
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
      let url =
        `?order=asc&sort=description`
      const respProyectos = await ProjectsService.getProyectos(url, this.$store)
      console.log('respProyectos', respProyectos)
      const respRoles = await RoleUserService.getRoles('', this.$store)
      if (respProyectos.status) {
        this.proyectos = respProyectos.data.rows
      }
      if (respRoles.status) {
        this.roles = respRoles.data.rows
      }
      this.showLoading = false
    },
    setData(item) {
      console.log('items', item)
      
      if (item) {
        console.log('items add-edit', item)
        this.temp = item
        this.sede_id = item.id
        console.log("SEDE ID", this.sede_id)
        this.items.code = item.code
        this.items.description = item.description
        this.items.projectId = item.projectId
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          code: '',
          description: '',
          projectId: this.$parent.$parent.project_id,
        }
        console.log("project id", this.items)
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
        code: '',
        description: '',
        projectId: null,
      }
    },
    async onSubmit(data) {
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        if (success) {
          let resp = ''
          console.log('data TO SAVE', data)

          if (this.isEdit == false) {
            resp = await SedeService.saveSede(data, this.$store)
          } else {
            console.log("SEDE ID ANTES DE UPDATE", this.sede_id)
            resp = await SedeService.updateSede(this.sede_id, data, this.$store)
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
                  ' los datos de la sede.',
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
