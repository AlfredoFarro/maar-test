<template>
  <!-- eslint-disable -->
  <b-sidebar id="add-proyecto" :visible="isAdd" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header
    right no-close-on-backdrop @change="(val) => $emit('update:is-add', val)">
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nueva' }} empresa</h5>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click=";[hide(), resetForm()]" />
      </div>

      <!-- BODY -->
      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <!-- Form -->

        <b-form class="p-2" @submit.prevent="onSubmit(items)">

          <validation-provider #default="{ errors }" name="ruc" rules="requeridoE">
            <b-form-group label="RUC" label-for="ruc">
              <b-form-input v-model="items.ruc" id="ruc" placeholder="RUC" autocomplete="off" />
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="name" rules="requeridoE">
            <b-form-group label="Nombre de la Empresa" label-for="name">
              <b-form-input v-model="items.name" id="name" placeholder="Nombre de la Empresa" autocomplete="off" />
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
            </b-form-group>
          </validation-provider>

          <validation-provider #default="{ errors }" name="image" rules="">
            <b-form-group label="Imagen de la Empresa" label-for="image">
              <b-form-file v-model="items.image" id="image" placeholder="Seleccionar archivo..."
                accept="image/*"></b-form-file>
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2 justify-content-end">
            <b-button :disabled="invalid" v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2"
              type="submit">
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled" class="px-1">guardando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Agregar' }}</span>
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary"
              @click=";[hide(), resetForm()]">
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
import EnterpriseService from '@/services/EnterpriseService'
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
        ruc: '',
        name: '',
      },
      proyecto_id: null,
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
    async getData(id = null) {
      this.showLoading = true
      let url =
        `?filter=` + JSON.stringify([{ keyContains: 'project_id', key: 'equals', value: id }])
      const respProyectos = await EnterpriseService.getEnterprise('', this.$store)
      if (respProyectos.status) {
        this.proyectos = respProyectos.data.rows
      }

      this.showLoading = false
    },
    setData(item) {
      console.log('items', item)

      if (item) {
        console.log('items add-edit', item)
        this.temp = item
        this.proyecto_id = item.id
        console.log("PROYECTO ID", this.proyecto_id)
        this.items.ruc = item.ruc
        this.items.name = item.name
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          ruc: '',
          name: '',
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
        ruc: '',
        name: '',
      }
    },
async onSubmit() {
  this.$refs.refFormObserver.validate().then(async (success) => {
    this.showLoading = true;
    if (success) {
      const formData = new FormData();
      formData.append('name', this.items.name);
      formData.append('ruc', this.items.ruc);

      // Agregar la imagen si se ha seleccionado un archivo
      if (this.items.image) {
        formData.append('image', this.items.image);
      }

      let resp = '';

      if (!this.isEdit) {
        resp = await EnterpriseService.saveEnteprise(formData, this.$store); // Enviar FormData
      } else {
        formData.append('_method', 'PATCH'); // Para simular el método PATCH en algunos backends
        resp = await EnterpriseService.updateEnterprise(this.proyecto_id, formData, this.$store); // Enviar FormData
      }

      console.log('resp', resp);
      if (resp.status) {
        this.$swal({
          title: this.isEdit ? 'Actualizado' : 'Registrado',
          text: 'Los datos han sido ' + (this.isEdit ? 'actualizado.' : 'registrado.'),
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        });
        this.$parent.$parent.getData();
        this.$emit('update:is-add', false);
        this.resetForm();
      } else {
        this.$swal({
          title: 'Error!',
          text:
            'Ocurrió un error al ' +
            (this.isEdit ? 'actualizar' : 'registrar') +
            ' los datos del proyecto.',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        });
      }
    }
    this.showLoading = false;
  });
}
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
