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
        :sedeId="sedeId"
        ref="formAdminAdd"
      >
    </add-edit>
    <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="12" lg="12" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-50 mb-1 mb-lg-0 mt-02 mr-2">
                <b-form-group label="Estado" label-for="estado">
                  <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="states"
                  label="description"
                  input-id="estado"
                  :reduce="(status) => status.id"
                  placeholder="Estado"
                  @input="filter()"
                  v-model="status"
                  class="select-obra"/>
                </b-form-group>
              </div>
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Nombre de Formulario" label-for="name" class="mr-2">
                  <b-form-input
                    type="text"
                    label="name"
                    id="name"
                    placeholder="Nombre"
                    v-model="name"
                    @input="filter()"
                    class="select-obra"
                    autocomplete="off"
                  >
                  </b-form-input>
                </b-form-group>
              </div>   
            </b-col>
            <b-col
              md="12"
              lg="12"
              class="d-flex"
            >
              <div
                  class="d-flex flex-column flex-lg-row align-items-center h-100 w-100 justify-content-center mb-1 mb-lg-0 mt-02"
                >
                <div
                class="d-flex "
              >
             
                  <b-button
                    class="mr-2"
                    variant="primary"
                    @click="addCrono(project_id)"
                    :disabled="availableForms.length == 0 || !rolesAllowed.includes(user_role)" 
                  >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                  </b-button>
                </div>
                <!-- <div
                  class="d-flex "
                >
              
                  <b-button
                    class="mr-2"
                    variant="primary"
                    @click="exportCrono(project_id)"
                  >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Exportar </span>
                  </b-button>
                </div> -->
              </div>
            
            </b-col>
            <!-- <b-col md="12" lg="3" >
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Estado" label-for="status" class="mr-2">
                  <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="estados"
                    label="text"
                    input-id="status"
                    :reduce="(estados) => estados.value"
                    placeholder="Estado"
                    v-model="statusFilter"
                    @input="filter()"
                    class="select-obra"
                  >
                  </v-select>
                </b-form-group>
              </div>
            </b-col> -->
          </b-row>
          <!-- <b-row v-if="selectedRecords.arrayId.length > 0">
            <b-col sm="12" md="4">
              <div class="w-100 mb-1 mb-lg-0">
                <b-form-group label="Estado" label-for="status" class="mr-2">
                  <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="estados"
                    label="text"
                    input-id="status"
                    :reduce="(estados) => estados.value"
                    placeholder="Estado"
                    v-model="status"
                  />
                </b-form-group>
              </div>
            </b-col>
            <b-col sm="12" md="4">
              <div class="w-100 mb-1 mb-lg-0 d-flex align-items-center h-100">
                <b-button class="mr-2 mb-1 mb-md-0" variant="primary" @click="changeStatus()">
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Cambiar </span>
                </b-button>
              </div>
            </b-col>
          </b-row> -->
        </b-card-body>
      </b-card>
      <b-card no-body ref="tableCard">
        <div class="table-overflow">
          <b-table
            class="position-relative"
            empty-text="No existen"
            :fields="visibleFields"
            :hover="true"
            id="__BVID__185"
            :items="records"
            no-border-collapse
            ref="selectableTable"            
            show-empty                     
            @sort-changed="sortChanged"
          >
            <!-- Column: Actions -->
        
            <template #cell(row)="data">
              <div style="width: 0px !important">
                <b-form-checkbox  :checked="selectedRecords.arrayId.includes(data.item)" />
              </div>
            </template>
            <template #cell(actions)="data">
             
              <!-- <input type="file" ref="photo" accept=".jpg, .jpeg, .png" @change="onChangeFile"> -->

              <b-button
                  v-if="(data.item.state == 0 || data.item.state == 3) && data.item.canEdit"
                  size="sm"
                  class=""
                  v-b-tooltip.noninteractive.hover.left="'Subir Foto'"
                  @click="uploadPhoto(data.item)"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="UploadIcon" />
              </b-button>
              <b-button
                  v-if="(data.item.state == 0 || data.item.state == 1) && (data.item.canEdit)"
                  size="sm"
                  class=""
                  v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                  @click="deleteAction(data.item)"
                  variant="flat-danger"
                >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>
            <template #cell(admin.dateGenerated)="data">
              <span>{{ validDate(data.item.admin.dateGenerated) }}</span>
            </template>
            <template #cell(createdAt)="data">
              <span>{{ validDate(data.item.createdAt) }}</span>
            </template>
            <template #cell(state)="data">
              <span v-if="data.item.state == 0">Pendiente</span>
              <span v-if="data.item.state == 1">En proceso</span>
              <span v-if="data.item.state == 2">Aprobado</span>
              <span v-if="data.item.state == 3">Rechazado</span>
            </template>
          </b-table>
        </div>
        <div class="mx-2 mb-2">
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
      <b-modal ref="modalPhoto" size="lg" @hide="resetPhoto">
        <template #modal-title>
          <span>Subir Foto</span>
        </template>
          <b-form-group label="Foto" label-for="photo">
            <b-form-file
              v-model="photo"
              ref="photo"
              id="photo"
              accept=".jpg, .jpeg, .png"
              placeholder="Seleccione una foto o arrástrelo aquí..."
              drop-placeholder="Arrastre aqui..."
              @change="onChangeFile"
            ></b-form-file>
          </b-form-group>

          <div v-if="photo" style="display: flex; justify-content: center;">
            <img :src="photo" alt="Vista Previa" style="max-width: 100%; max-height: 80vh;">
          </div>
        <template #modal-footer="{ cancel, ok }">
          <b-button @click="hideModal" variant="outline-danger">Cancelar</b-button>
          <b-button :disabled="!photo" @click="savePhoto" variant="outline-success">Subir</b-button>
        </template>
      </b-modal>
      
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import TravelService from '@/services/TravelService'
import SedeService from '@/services/SedeService'
import ProjectsService from '@/services/ProjectsService'
import UserService from '@/services/UserService'
import FormService from '@/services/FormService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import { required } from '@validations'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import filters from './filters.vue'
import addEdit from './add-edit.vue'
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import GeneralService from '@/services/GeneralService'
import FormAdminService from '@/services/FormAdminService'
import OperateService from '@/services/OperateService'
const APIURL = process.env.APIURLFILE
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      status: '',
      states: [
        {
          id: '0',
          description: 'Pendiente'
        },
        {
          id: '1',
          description: 'En proceso'
        },
        {
          id: '2',
          description: 'Aprobado'
        },
        {
          id: '3',
          description: 'Rechazado'
        }
      ],
      statusFilter: '',
      required,
      apiurl: APIURL,
      showLoading: false,
      show: false,
      timeLine: [],
      formularios: [],
      forms: [],
      title: '',
      comment: '',
      addComent: false,
      modalOpen: false,
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
        formId: null,
        formName: null,
        sedeId: null,
      }, // Your form data
      photo: null,
      availableForms: [],
      consultas: [], // Your options for consultas select
      optionsWithAll: [], // Your options for users select
      addEnd: false, // Flag to show/hide date_end field
      fields: [
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '80px' } },
        { key: 'formName', label: 'Formulario', sortable: false, visible: true },
        { key: 'state', label: 'Estado', sortable: false, visible: true, thStyle: { width: '130px' } },
        /* { key: 'currentApprovedStep', label: 'Nivel', sortable: false, visible: true }, */
        { key: 'admin.dateGenerated', label: 'Grupo Fecha', sortable: false, visible: true, thStyle: { width: '170px' } },
        { key: 'createdAt', label: 'Creación Formulario', sortable: false, visible: true, thStyle: { width: '170px' } },
        { key: 'sede.description', label: 'Sede', sortable: false, visible: true, thStyle: { width: '80px' } },        
        { key: 'errorMsg', label: 'Motivo Rechazo', sortable: false, visible: true, thStyle: { width: '300px' } },

        /* { key: 'userRegister.fullname', label: 'Registro por', sortable: true, visible: true, thStyle: { width: '160px' } }, */
      ],
      form: {
        formId: null,
        formName: null,
        sedeId: null,
      },
      formAdminId: null,
      formId: null,
      estados: [
        {
          text: 'Oficializado',
          value: 'Oficializado'
        },
        {
          text: 'Liberado por Planner',
          value: 'LiberadoPorPlanner'
        },
        {
          text: 'Rechazado',
          value: 'Rechazado'
        },
      ],
      project_id: JSON.parse(localStorage.getItem('project_id')),
      route: '',
      code: '',
      sede: null,
      startDate: null,
      endDate: null,
      type: null,
      pilot_id: null,
      restriction_id: null,
      records: [],
      tipos: [
        'Externo', 'Interno', 'PDP Externo', 'PDP Interno'
      ],
      sedes: [],
      sedeId: 1,
      projectSelect: '',
      proyectos: [],
      pilotos: [],
      arrayFilters: [],
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      totalElements: 0,
      currentPage1: 1,
      entries1: [10, 20, 50, 100],
      showEntrie1: 10,
      totalElements1: 0,
      description: '',
      name: '',
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      rolesAllowed: ['administrador', 'gestor', 'planner', 'supervisor'],
      isAdd: false,
      selectedRecords: {
        arrayId: []
      },
      allData: [],
      allDataSorted: [],
      navbar: null,
      filterContent: null,
      tableCard: null,
      tableContainer: null,
      selectableTable: null,
      tableHead: null,
      ths: null,
      trs: null,
    }
  },
  components: {
    vSelect,
    flatPickr,
    addEdit,
    filters,
    AppTimeline,
    ValidationProvider,
    ValidationObserver,
    AppTimelineItem,
    FormWizard,
    TabContent,
},
  computed: {
    visibleFields() {
      return this.fields.filter((field) => field.visible)
    }
  },
  created() {
    // Escucha un evento personalizado llamado 'executeGetData'
    this.$bus.on('executeGetDataRestrictionxLiberar', () => {
      // Llama a la función getData pasando las variables
      console.log('ejecutando rest x liberar')
      this.filter();
    });
  },
  mounted() {
    this.getGeneral()
    this.filter()
    this.getSelect()
    this.getEmpresas()

    this.navbar = document.querySelector(".navbar");
    this.filterContent = this.$refs.filterContent;
    this.tableContainer = this.$el.querySelector(".table-overflow");
    this.tableCard = this.$refs.tableCard;
    this.selectableTable = this.$refs.selectableTable.$el;
    this.tableHead = this.selectableTable.querySelector("thead");
    this.ths = this.selectableTable.querySelector('thead').querySelectorAll('th');

    this.setupScrollSync();
    new ResizeObserver(this.fixedElements).observe(this.tableCard);
  },
  watch: {
    records(newVal, oldVal) {
      this.$nextTick(() => {
        this.trs = this.selectableTable.querySelector('tbody').querySelectorAll('tr');
        
        this.fixedElements()
      })
    },
    visibleFields(newVal, oldVal) {
      this.$nextTick(() => {
        this.ths = this.selectableTable.querySelector('thead').querySelectorAll('th');
        this.fixedElements()
      })
    },
    /* startDate() {
      this.checkIfBothDatesSelected();
    },
    endDate() {
      this.checkIfBothDatesSelected();
    }, */
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleWindowScroll);
    window.removeEventListener("resize", this.fixedElements);
  },
  methods: {
    /* checkIfBothDatesSelected() {
      if (this.startDate && this.endDate) {
        this.filter(); // Ejecutar el filtrado solo cuando ambas fechas tienen valor
      }
    }, */
    async exportCrono(id){
      if (id != null) {
          this.showLoading = true
          // const resp = await RestrictionsService.exportExcel(id,this.$store)
          // console.log('resp',resp)
          var fileLink = document.createElement('a')
          fileLink.href = this.apiurl + '/travel/download/' + id
          console.log('fileLink.href', fileLink.href)
          fileLink.setAttribute('target', '_blank')
          document.body.appendChild(fileLink)
          fileLink.click()

          this.showLoading = false
        } else {
          this.$swal({
            icon: 'warning',
            title: 'Proyecto',
            text: 'Seleccione un proyecto para exportar los datos.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        }
    },
    async uploadPhoto(item){
      console.log("ITEM", item)
      this.formAdminId = item.formAdminId
      console.log("formAdminId", this.formAdminId)
      this.$refs['modalPhoto'].show()
    },
    async onChangeFile(event) {
      const file = event.target.files ? event.target.files[0] : null;
      console.log("selected PHOTO", this.photo);
      if (file) {
        const acceptedTypes = [".jpg", ".jpeg", ".png"];
        const fileType = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (acceptedTypes.includes(fileType)) {
          const reader = new FileReader();
          reader.onload = async () => {
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
      this.photo = null
    },
    async getEmpresas(){
        const arrayFilters = []
        this.items.sedeId = null
        if (this.project_id != null && this.project_id != '') {
            arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
        }
        const url =
        `?limit=10000&order=asc&sort=description&filter=` +
        JSON.stringify(arrayFilters)
        const respSedes = await SedeService.getEmpresas(url, this.$store)
        console.log("URL sedes", url)
        if (respSedes.status) {
            this.sedes = respSedes.data.rows
            console.log("SEDES AAA",this.sedes)
        }
    },
    async getGeneral(){
      const resp = await GeneralService.getGeneral('',this.$store)
      console.log("RESP GENERAL", resp)
      if (resp.status) {
        this.availableForms = resp.data.canCreateForms
        /* this.sedes = resp.data.sedes */
      }
    },
    async saveData() {
      console.log("SAVING", this.items)
      if (this.items.formsId.length == 0) {
        console.log("FALLA 2")
        return
      }
      console.log("LOGRADO")
      this.showLoading = true
      this.items.type == true ? this.items.type = 'Externo' : this.items.type = 'Interno'
      this.items.projectId = this.project_id
      let resp = await TravelService.saveTravel(this.items, this.$store)
      console.log('resp', resp)
      if(resp.status){
        this.$swal({
            title: 'Registrado',
            text: 'Los datos han sido registrados.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
          })
        this.getAllData()
        this.showLoading = false
        this.$refs['modal-agregar-cronograma'].hide()
        this.resetForm()
      }
      // Your form submission logic goes here
    },
    async saveForms(){
      this.items.type == true ? this.items.type = 'Externo' : this.items.type = 'Interno'
      console.log("SAVING FORMS", this.items)
      this.items.dateInit = this.validDate(this.items.dateInit)
      this.items.dateEnd = this.validDate(this.items.dateEnd)
      let resp = await TravelService.updateTravel(this.formId, this.items, this.$store)
      console.log("UPDATEADO", resp)
      if (resp.status) {
            this.$swal({
              title: 'Actualizado',
              text: 'Los datos han sido actualizados.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
            this.getAllData()
            this.$refs['modal-agregar-formularios'].hide()
            this.resetForm()
          } else {
            this.$swal({
              title: 'Error!',
              text: resp.data.message
                ? resp.data.message
                : 'Ocurrió un error al actualizar los datos del formulario.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          }
    },
    // Function to validate the form before changing tabs
    beforeTabChange(newTab, oldTab) {
      
      return this.$refs.refFormObserver.validate().then(success => {
        if (!success) {
          // Si la validación falla, no permitir cambiar de tab
          console.log("FALLA")
          return false;
        }
        this.changeCheckboxsSelected()
        return true;
      });
      
    },
    changeCheckboxsSelected(){
      // Permitir cambiar de tab si la validación tiene éxito
      console.log("INPUTS COMPLETOS")
      this.items.type == true ? this.items.type = 'Externo' : this.items.type = 'Interno'
      console.log("items", this.items)
      console.log('BEFORE this.items.formsId', this.items.formsId)
      this.forms = this.formularios.filter(form => form.type == this.items.type)
      this.items.formsId = []
      /* this.items.formsId = this.formularios.filter(form => form.type === this.items.type).map(form => form.form.id);       */
      this.items.type == 'Externo' ? this.items.type = true : this.items.type = false
      console.log('AFTER this.items.formsIds', this.items.formsId)
    },
    hide(){
      this.$refs['modal-agregar-formularios'].hide()
    },
    // Function to check if the email option is selected
    validEstablecer() {
      // Your validation logic goes here
      // Return false to prevent tab change if validation fails
      return true;
    },
    // Function to handle changes in date_end field
    checkOptionAll(value) {
      // Your logic goes here
    },
    // Function to handle removing selected user
    removeSelectedUser(option) {
      // Your logic goes here
    },
    // Function to handle navigating to the next tab
    goToNextTab() {
      // Your logic goes here
      this.$refs.wizard.nextTab();
    },
    // Function to handle differences in date
    diferentDate(date, type) {
      // Your logic goes here
    },

    getFilteredPilots(selectedPilotKey) {
      // Obtenemos el ID del piloto seleccionado en el otro v-select
      const selectedPilotId = this.items[selectedPilotKey];

      // Filtramos la lista de pilotos para excluir el piloto seleccionado en el otro v-select
      return this.pilotos.filter(pilot => pilot.id !== selectedPilotId);
    },
    fixedElements() {
      if (!this.trs[0].classList.contains('b-table-empty-row')) {
        const thsTotalWidth = [...this.ths].reduce((acc, th) => acc + th.offsetWidth, 0);

        if (thsTotalWidth > this.tableCard.offsetWidth) {
          this.ths.forEach((th, index) => {
            th.style.flex = "0 0 " + th.offsetWidth + "px";
          });
        } else {
          this.ths.forEach((th, index) => {
            th.style.flex = "1 1 " + th.offsetWidth + "px";
          });
        }

        this.trs.forEach((tr, index) => {
          const tds = tr.querySelectorAll('td');

          this.ths.forEach((th, index) => {
            tds[index].style.width = th.offsetWidth + "px";

            if (thsTotalWidth > this.tableCard.offsetWidth) {
              tds[index].style.flex = "0 0 " + th.offsetWidth + "px";
            } else {
              tds[index].style.flex = "1 1 " + th.offsetWidth + "px";
            }
          });
        });
        
      } else {
        this.selectableTable.style.width = this.tableHead.querySelector('tr').offsetWidth + 1 + "px";
      }

      this.tableHead.style.width = this.tableCard.offsetWidth - 1 + "px";
      this.selectableTable.style.paddingTop = this.tableHead.offsetHeight + "px";
    },
    setupScrollSync() {
      this.tableHead.addEventListener("scroll", () => {
        this.tableContainer.scrollLeft = this.tableHead.scrollLeft;
        this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`;
      });

      this.tableContainer.addEventListener("scroll", () => {
        this.tableHead.scrollLeft = this.tableContainer.scrollLeft;
        this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`;
      });

      window.addEventListener("scroll", this.handleWindowScroll);
      window.addEventListener("resize", this.fixedElements);
    },
    handleWindowScroll() {
      this.filterContent.style.top = this.navbar.offsetHeight + "px";

      if (this.tableCard.offsetTop - this.navbar.offsetHeight - 7 - window.scrollY <= 0) {
        this.tableHead.classList.add("fixed");
        this.tableHead.style.top = this.navbar.offsetHeight + this.filterContent.offsetHeight + "px";
      } else {
        this.tableHead.classList.remove("fixed");
        this.tableHead.style.top = null;
      }
    },
    openModal() {
     
      this.modalOpen = true;

    },
    closeModal() {
      this.modalOpen = false;
    },
    resetPhoto() {
      this.photo = null;
    },
    hideModal() {
      this.$refs['modalPhoto'].hide()
      this.resetPhoto()
    },
    async savePhoto() {
      let dataSend = [{
        formAdminId: this.formAdminId,
        approvalStatus: null,
        isPhoto: 1,
        content: [
          {
            photo: this.photo,
          }
        ],
        adminId: parseInt(this.$route.params.id)
      } ]
      console.log("dataSend", dataSend)
      let resp = await FormAdminService.saveForm(dataSend, this.$store)
      console.log("RESP", resp)
      if (resp.status) {
        this.currentPage = 1
        this.$swal({
          icon: 'success',
          title: 'Subido',
          text: 'La foto ha sido subida con éxito.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        await this.getAllData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al subir la foto seleccionada.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
      this.$refs['modalPhoto'].hide()
      this.resetPhoto()
    },
    async deleteAction(data){
      //DELETE USER
      console.log('data', data)
      this.$swal({
        title: '¿Desea eliminar este formulario?',
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
          this.currentPage = 1
          this.$swal({
            icon: 'success',
            title: 'Eliminado!',
            text: 'El formulario ha sido eliminado.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.deleteData(data.formAdminId)
        }
      })
    },
    async deleteData(id) {
      console.log('id del formulario', id)
      const resp = await FormAdminService.deleteForm(id, this.$store)
      console.log('resp delete',resp)
      if (resp) {
        this.getAllData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el formulario.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
      console.log('respDelete', resp)
    },

    onRowSelectedOrder(items) {
     
      this.selectedRecords.arrayId = items
     
    },
    addCrono(id){

     
      
      this.isAdd = true
      this.$refs.formAdminAdd.setData({})
      this.$refs.formAdminAdd.getData(this.project_id, this.sedeId)


    },
    async editForms(item) {
      console.log('item', item)
      this.$router.push('/cronograma/editar/' + item.id)
    },
    resetForm() {
      this.$refs['modal-agregar-formularios'].hide()
      this.$refs['modal-agregar-cronograma'].hide()
      this.$refs.refFormObserver.reset()
      
      this.items = {
        formId: null,
        formName: null,
        sedeId: null,
      }
    },
    
    edit(item) {
      console.log('item', item)
      this.form.formId = item.formId
      this.form.formName = item.formName
      this.form.sedeId = item.sede.id
      this.form.formAdminId = item.formAdminId
      console.log('this.form', this.form)
      this.isAdd = true
      this.$refs.formAdminAdd.getData()
      this.$refs.formAdminAdd.setData(this.form)
    },
    changeForms(item){

      this.$router.push('/cronograma/editar/' + item.id)


      /* this.$refs['modal-agregar-formularios'].show()
      console.log('item', item)
      this.formId = item.id
      this.items.code = item.code
      this.items.dateInit = item.dateInit
      this.items.dateEnd = item.dateEnd
      this.items.route = item.route
      this.items.primaryPilotId = item.primaryPilot.id
      item.secondaryPilotId ? this.items.secondaryPilotId = item.secondaryPilotId.id : this.items.secondaryPilotId = null
      item.externoForms.length > 0 ? this.items.formsId = item.externoForms : this.items.formsId = item.internoForms
      this.items.formsId = this.items.formsId.map(form => form.form.id);      

      item.type == 'Externo' ? this.items.type = true : this.items.type = false
      this.forms = this.formularios.filter(form => form.type == item.type)
      console.log('this.form', this.form)
      console.log('formS', this.items) */
    },
    selectAll(val) {
     
      if (val) {
     
        this.$refs.selectableTable.selectAllRows()
      } else {
        this.$refs.selectableTable.clearSelected()
      }
      //
    },
    validDate(fecha) {
      fecha = new Date(fecha);
      if (!isNaN(fecha.getTime())) {
        // Sumar 5 horas a la fecha
        fecha.setHours(fecha.getHours() + 5);
        return moment(fecha).format('DD-MM-yyyy HH:mm');
      }
      return '';

    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      if(this.project_id != null && this.project_id != ''){
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
      }
      if(this.route != null && this.route != ''){
        this.arrayFilters.push({ keyContains: 'route', key: 'contains', value: this.route })
      }
      if(this.code != null && this.code != ''){
        this.arrayFilters.push({ keyContains: 'code', key: 'contains', value: this.code })
      }
      
      if(this.sede != null && this.sede != ''){
        this.arrayFilters.push({ keyContains: 'sede.id', key: 'equals', value: this.sede })
      }
      if(this.type != null && this.type != ''){
        this.arrayFilters.push({ keyContains: 'type', key: 'equals', value: this.type })
      }
      
      if(this.startDate != null && this.startDate != ''){
        const startOfDay = new Date(this.startDate);
        const endOfDay = new Date(this.startDate);
        
        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'admin.dateGenerated', key: 'gte', value: startOfDay });
      }
      if(this.endDate != null && this.endDate != ''){
        const startOfDay = new Date(this.endDate);
        const endOfDay = new Date(this.endDate);
        
        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'admin.dateGenerated', key: 'lte', value: endOfDay });
      }
      this.getAllData()
    },
    cambioPagina(e) {
      this.currentPage = e
      this.records = this.allDataSorted[e - 1];

      /* this.getData() */
    },
    changeSizePage() {
      this.getAllData()
    },
    sortChanged(data) {
      this.sort = data.sortBy
      this.currentPage = 1
      this.getSortedData(data.sortBy, data.sortDesc ? 'desc' : 'asc')
      this.records = this.allDataSorted[0]
      /* this.sort = data.sortBy
      if (data.sortDesc) {
        this.order = 'desc'
      } else this.order = 'asc' */
    },
    closeComment() {
      this.comment = ''
      this.addComent = false
    },
    showTimeLine(item) {
    
      this.restriction_id = item.id
      this.$refs['modal-comment'].show()
      this.getTimeLine(item.id)
    },
    async getTimeLine(id) {
      const resp = ''
    
      if (resp.status) {
        this.timeLine = resp.data
      
      }
    },
    
    async getSelect() {
      const user = JSON.parse(localStorage.getItem('userData'))
      const url2 = `?limit=100000&page=${this.currentPage}&order=asc&sort=code`
      const respProyectos = await ProjectsService.getEmpresas(url2, this.$store)
      console.log("PROYECTOS", respProyectos)
      let arrayFilters = []
      arrayFilters.push({ keyContains: 'role.description', key: 'equals', value: 'piloto' })
      if(this.project_id != null || this.project_id == ''){
        arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
      }
      const url =
        `?limit=10000&order=asc&sort=fullname&filter=` +
        JSON.stringify(arrayFilters)
      const respPilotos = await UserService.getUsers(url, this.$store)
      console.log("PILOTOS", respPilotos)
/*       const respForms = await FormService.getProjectForms(url, this.$store)
 */      
      if (respProyectos.status || respPilotos.status || respForms.status) {
        this.proyectos = respProyectos.data.rows
        this.pilotos = respPilotos.data.rows
        /* this.formularios = respForms.data.rows */
        console.log("FORMS", this.formularios)
        console.log("PILOTOS", this.pilotos)
        // if (respProyectos.data.rows.length > 0) {
        //   this.project_id = respProyectos.data.rows[0].id
        // } else {
        //   if (user.role == 'planner') {
        //     this.project_id = 0
        //   }
        // }
        this.filter()
      }
    },
    async getData() {
      this.showLoading = true
      const url =
        `?limit=${this.showEntrie}&page=${this.currentPage}&order=${this.order}&sort=${this.sort}&filter=` +
        JSON.stringify(this.arrayFilters)
     
      const resp = ''
     
      if (resp.status) {
       
        this.records = resp.data.rows
        this.totalElements = resp.data.responseFilter.total_rows
      }

      this.showLoading = false
    },
    async getAllData() {
      this.showLoading = true;
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      console.log('URL', url)
      let adminId = this.$route.params.id
      let resp
      if(this.user_role == 'monitor'){
        resp = await OperateService.getFormsForProject(this.project_id, adminId, this.$store)
      }else{
        resp = await FormAdminService.getMyForms(adminId, '', this.$store)
      }
    
      console.log('resp MY FORMSss', resp)
      this.sedeId = resp.data[0].sede.id
      console.log('sedeId WAAAA', this.sedeId)
      if (resp.status) {
        this.allData = resp.data;
        if(this.user_role == 'administrador' && this.project_id != null && this.project_id != ''){
          console.log("ES ADMIN")
          this.allData = this.allData.filter(item => item.project.id == this.project_id)
        }
        if (this.sede != null && this.sede != '') {
          this.allData = this.allData.filter(item => item.sede.id == this.sede)
        }
        if (this.name != null && this.name != '') {
          this.allData = this.allData.filter(item => item.formName.toLowerCase().includes(this.name.toLowerCase()))
        }
        if (this.status) {
          this.allData = this.allData.filter(item => item.state == this.status)
        }
        // Filtrar por rango de fechas
        if(this.startDate != null && this.startDate != ''){
          const startOfDay = new Date(this.startDate);
          const endOfDay = new Date(this.startDate);
          
          this.allData = this.allData.filter((item) => {
            const dateGenerated = moment.utc(item.admin.dateGenerated);
            return dateGenerated.isSameOrAfter(startOfDay);
          });
        }
        if(this.endDate != null && this.endDate != ''){
          const startOfDay = new Date(this.endDate);
          const endOfDay = new Date(this.endDate);
          
          // Sumar un día al endOfDay para abarcar todo el día actual
          endOfDay.setDate(endOfDay.getDate() + 1);

          this.allData = this.allData.filter((item) => {
            const dateGenerated = moment.utc(item.admin.dateGenerated);
            return dateGenerated.isSameOrBefore(endOfDay);
          });
        }

        //ordenar por id de mayor a menor
        
        console.log("records", this.records)
        this.totalElements = this.allData.length
      }
      if(this.allData.length > 0){
        this.getSortedData("admin.dateGenerated", 'desc')
        this.records = this.allDataSorted[0]
      }else{
        this.records = this.allData
      }
  
      console.log("records2", this.records)
      this.showLoading = false;
    },
    getAttributeValue(obj, attribute) {
    // Si el atributo contiene un punto, es un atributo anidado
      if (attribute.includes('.')) {
        const parts = attribute.split('.');
        let value = obj;

        for (const part of parts) {
          if (value && value.hasOwnProperty(part)) {
            value = value[part];
          } else {
            return null; // Manejo de error si no se encuentra el atributo anidado
          }
        }

        return value;
      } else {
        return obj[attribute];
      }
    },

    getSortedData(sortBy, sortOrder) {
      let sortedData = [...this.allData];
      if (this.description != null && this.description != '') {
        const searchTerm = this.description.toLowerCase();
        sortedData = sortedData.filter(item => item.description.toLowerCase().includes(searchTerm));      
      }
      sortedData.sort((a, b) => {
        const aValue = this.getAttributeValue(a, sortBy);
        const bValue = this.getAttributeValue(b, sortBy);

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      this.allDataSorted = [];
      for (let i = 0; i < sortedData.length; i += this.showEntrie) {
        this.allDataSorted.push(sortedData.slice(i, i + this.showEntrie));
      }

    },
    async getDatosExport() {
      const url =
        `?limit=100&page=${this.currentPage}&order=${this.order}&sort=${this.sort}&filter=` +
        JSON.stringify(this.arrayFilters)
      const resp = ''
      if (resp.status) {
        this.totalData = resp.data.rows
        this.totalElementExport = resp.data.rows.length
      }
    },
    actionLiberar(item,type) {
    
      let status;
      if(type === 1){
        status = 'LiberadoPorPlanner';
      
       this.$swal({
        title: '¿Seguro que desea liberar esta restricción?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, liberalo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then(async (result) => {
         if (result.value) {
          const resp = ''
          if (resp.status) {
            this.currentPage = 1
            this.$swal({
              icon: 'success',
              title: 'Liberado!',
              text: 'La restricción fue liberada con éxito.',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            this.getAllData()
          } else {
            this.$swal({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al liberar la restricción seleccionada.',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          }
        }
      })
      }else{
          status = 'Oficializado';
          /* this.openModal() */
          this.$swal.fire({
            title: '¿Seguro que desea rechazar esta restricción?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazalo',
            html: `
              <input type="text" style="margin: 15px 0" id="inputValuexRechazar" class="swal2-input" placeholder="Ingrese la razón">
            `,
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
          }).then(async (result) => {
            if (result.value) {
              const inputValue = document.getElementById('inputValuexRechazar').value; 

             

              const resp = ''
            

              if (resp.status) {
                this.currentPage = 1
                this.$swal({
                  icon: 'success',
                  title: 'Rechazado!',
                  text: 'La restricción fue rechazada con éxito.',
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                })
                this.getAllData()
              } else {
                this.$swal({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ocurrió un error al rechazar la restricción seleccionada.',
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                })
              }
            }
          });
      }
    },
    async changeStatus() {
   
      let filterArrays = []
      for (let index = 0; index < this.selectedRecords.arrayId.length; index++) {
        const element = this.selectedRecords.arrayId[index]
        filterArrays.push(element.id)
      }
     
      this.$swal({
        title: '¿Seguro que desea cambiar a esta(s) restriccion(es)?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cambialo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.value) {
          if (filterArrays.length > 0) {
            const resp = ''
            if (resp.status) {
              this.currentPage = 1
              this.$swal({
                icon: 'success',
                title: 'Cambiado!',
                text: 'Los estados fueron cambiados.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              })
              this.getAllData()
            } else {
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al cambiar el estado de la restricción seleccionada.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              })
            }
          }
        }
      })
    },
    showFilters() {
      this.isAdd = true
    },
    clean() {
      this.statusFilter = ''
      this.project_id = null
      var arrayFilter = []
      if (this.user_role != 'administrador') {
        const proyects = []
        const estados = []
        for (let index = 0; index < this.estados.length; index++) {
          const element = this.estados[index]
          estados.push(element.value)
        }
        if (this.proyectos.length > 0) {
          for (let index = 0; index < this.proyectos.length; index++) {
            const element = this.proyectos[index]
            proyects.push(element.id)
          }
        }
        if (proyects.length > 0) {
          arrayFilter.push({
            keyContains: 'project_id',
            key: 'in',
            value: JSON.stringify(proyects)
          })
        }
        if (estados.length > 0) {
          arrayFilter.push({
            keyContains: 'status',
            key: 'in',
            value: JSON.stringify(estados)
          })
        }
      }

      this.arrayFilters = arrayFilter
      this.getAllData()
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
.pad-export {
  padding: 0.52rem 1rem !important;
}
.content_main {
  .content_timeline {
    max-height: 450px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  .content_form {
    display: flex;
    justify-content: center;
  }
}
.select-obra .vs__dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}
.mt-02{
  margin-top: .2rem;
}

.sticky {
  position: sticky;
  z-index: 3;
}

.table-overflow {
  overflow-x: auto;
  width: 100%;

  thead {
    display: flex;
    overflow-x: auto;
    position: absolute;
    top: 0;

    &.fixed {
      position: fixed;
      transform: translateX(0px) !important;
      z-index: 2;
    }

    tr {
      display: flex;
      flex: 1 1 auto;

      th {
        flex: 0 0 auto;
        padding: 0.72rem 2rem !important;
      }
    }
  }

  tbody {
    overflow-x: auto;

    tr {
      display: flex;

      &.b-table-empty-row {
        td {
          flex: 0 0 100%;
        }
      }

      td {
        flex: 0 0 auto;
      }
    }
  }
}
.hidden-input {
    position: absolute;
    left: -9999px;
}
.invisible-input {
    position: fixed;
    top: -100px;
    left: -100px;
    opacity: 0;
}

</style>
