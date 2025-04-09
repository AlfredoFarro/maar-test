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
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nuevo' }} formulario</h5>

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
          <!-- <validation-provider #default="{ errors }" rules="requeridoE">
            <b-form-group label="Sede" label-for="sede">
              <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="sedes"
              label="description"
              input-id="sede"
              :reduce="(sedes) => sedes.id"
              placeholder="Sede"
              v-model="items.sedeId"
              @input="getGeneral()"
              class="select-obra"/>
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider> -->

          <validation-provider #default="{ errors }" name="formId" rules="requeridoE">
            <b-form-group label="Formulario" label-for="formId">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="availableForms"
                label="formName"
                input-id="formId"
                :reduce="(availableForms) => availableForms.formId"
                v-model="items.formId"
                placeholder="Formulario"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="formPhoto" rules="">
            <b-form-group label="Foto" label-for="formPhoto">
              <b-form-file
                v-model="photo"
                placeholder="Seleccione una foto o arrastre aqui..."
                drop-placeholder="Arrastre aqui..."
                id="formPhoto"
                @change="onChangeFile"
                ref="photo"
                accept=".png,.jpg,.jpeg"
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
import TravelService from '@/services/TravelService'
import ProjectsService from '@/services/ProjectsService'
import UserService from '@/services/UserService'
import GeneralService from '@/services/GeneralService'
import moment from 'moment'
import FormAdminService from '@/services/FormAdminService'
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
    },
    sedeId: {
      type: Number,
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
      photo: null,
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
      availableForms: [],
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
        formId: null,
        sedeId: null,
      },
      proyectos: [],
      internoForms: [],
      externoForms: [],
      externoFormsId: [],
      internoFormsId: [],
      form_id: null,
      temp: {},
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  async mounted() {
    await this.getGeneral()
    console.log("SEDE ID", this.sedeId)
    this.items.sedeId = this.sedeId
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
    async getData(id, sedeId){
      console.log("GET DATA", id)
      this.items.sedeId = sedeId
     
    },
    async getGeneral(){
      const resp = await GeneralService.getGeneral('',this.$store)
      console.log("RESP GENERAL ADD-EDIT", resp)
      if (resp.status) {
        this.availableForms = resp.data.canCreateForms.forms;
        this.availableForms = resp.data.canCreateForms
        .filter(item => item.sedeId === this.items.sedeId) // Filtras los elementos que coinciden con la condición
        .flatMap(item => item.forms); // Utilizas flatMap para aplanar el arreglo anidado y obtener un arreglo de objetos plano

        console.log("FORMS", this.availableForms)
        console.log("SEDE ID", this.items.sedeId)
        this.sedes = resp.data.sedes
      }
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
    
    onChangeFile(event) {
      const file = event.target.files ? event.target.files[0] : null;
      console.log("selected PHOTO", this.photo);
      if (file) {
        const acceptedTypes = [".jpg", ".jpeg", ".png"];
        const fileType = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (acceptedTypes.includes(fileType)) {
          const reader = new FileReader();
          reader.onload = () => {
            this.photo = reader.result;
            console.log("selectedFile", this.photo);
            // Aquí puedes realizar cualquier acción que necesites con la imagen en base64
          };
          reader.readAsDataURL(file);
          console.log("selectedFile red", this.photo);
          // Aquí puedes realizar cualquier acción que necesites con el archivo seleccionado
        } else {
          this.photo = null;
          console.error("Por favor, selecciona un archivo JPG, JPEG o PNG válido.");
          // Puedes mostrar un mensaje de error o realizar otra acción en caso de que no se seleccione un archivo válido
        }
      }
    },
    getFilteredPilots(selectedPilotKey) {
      // Obtenemos el ID del piloto seleccionado en el otro v-select
      const selectedPilotId = this.items[selectedPilotKey];

      // Filtramos la lista de pilotos para excluir el piloto seleccionado en el otro v-select
      return this.pilots.filter(pilot => pilot.id !== selectedPilotId);
    },
    setData(items) {
      this.getGeneral()
      if (Object.entries(items).length !== 0) {
        console.log('items add-edit', items)
        this.temp = items
        this.items.formId = items.formId
        this.items.sedeId = items.sedeId
        this.form_id = items.formAdminId
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          formId: null,
          sedeId: this.$parent.$parent.sede,
        }
        this.photo = null
        console.log("SET DATA ITEMS", this.items, this.isEdit)
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
      console.log("EDIT", this.isEdit)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
        formId: null,
        sedeId: null,
      }
      this.photo = null
      this.internoFormsId = []
      this.externoFormsId = []
    },
    async onSubmit(data) {
      data = { ...data, adminId: parseInt(this.$route.params.id) }
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true
        console.log('data TO SAVE', data)
        if (success) {
          let resp = ''
          console.log('data TO SAVE', data)

          if (this.isEdit == false) {
            let dataSend
            if(this.photo){
              dataSend = [{
                formAdminId: null,
                formId: data.formId,
                sedeId: data.sedeId,
                isPhoto: 1,
                content: [
                  {
                    photo: this.photo
                  }
                ],
                adminId: parseInt(this.$route.params.id)
              }]
            }
            else{
             dataSend = [{
                formAdminId: null,
                formId: data.formId,
                approvalStatus: null,
                sedeId: data.sedeId,
                isPhoto: 1,
                comment: null,
                isDeleted: null,
                content: null,
                adminId: parseInt(this.$route.params.id)
              } ]
            }
            console.log('dataSend', dataSend)
            resp = await FormAdminService.saveForm(dataSend, this.$store)
            console.log("REPONSE", resp)
          } else {
            let id = this.form_id
            resp = await FormAdminService.updateForm(id, data, this.$store)
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
