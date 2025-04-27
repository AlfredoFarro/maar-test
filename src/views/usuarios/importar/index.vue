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
        @updateRecord="getDataImport"
        ref="cronoImportAdd"
      >
    </add-edit>
    <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="12" lg="7" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Proyecto" label-for="project" class="mr-2">
                  <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="proyectos"
                    label="code"
                    input-id="project"
                    :reduce="(proyectos) => proyectos.id"
                    placeholder="Proyecto"
                    v-model="project_id"
                    @input="filter()"
                    class="select-obra"
                    :disabled="user_role != 'administrador'"
                    
                  >
                    <template v-slot:selected-option="option">
                      {{ option.code }} - {{ option.description }}
                    </template>
                    <template slot="option" slot-scope="option">
                      {{ option.code }} - {{ option.description }}
                    </template>
                  </v-select>
                </b-form-group>
              </div>
              <div class="w-100">
                <b-form-group label="Archivo" label-for="file">
                    <b-form-file
                      v-model="file"
                      placeholder="Seleccione un archivo o arrastre aqui..."
                      drop-placeholder="Arrastre aqui..."
                      id="file"
                      @change="onChangeFile"
                      ref="file"
                      accept=".xls,.xlsx,.csv"
                    />
                  </b-form-group>
              </div>    
            </b-col>
            <b-col md="2" sm="1" class="">
                <div
                  class="d-flex h-100 align-items-center justify-content-center justify-content-md-start"
                >
                  <!-- <h5 class="mr-2 mb-0">Ayuda</h5> -->
                  <b-button
                    class="mb-0"
                    variant="success"
                    @click="exportExcel(project_id)"
                  >
                    <div class="d-flex">
                      <feather-icon icon="DownloadCloudIcon" size="17" />
                      <span class="ml-25">Descargar formato</span>
                    </div>
                  </b-button>
                </div>
              </b-col>
            
            <b-col md="1" lg="1" class="d-flex">              
              <div
                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
              >
             
              <b-button
                  class="mr-2"
                  variant="warning"
                  :disabled="fileExists == false || fileExists == null"
                  @click="saveData(false)"
                >
                  <span class="text-nowrap"> <feather-icon icon="DownloadIcon"/> Validar </span>
                </b-button>
              </div>
            </b-col>
            <b-col md="1" lg="2" class="d-flex">              
              <div
                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
              >
             
              <b-button
                  class="mr-2"
                  variant="warning"
                  :disabled="fileExists == false || fileExists == null || !canImport"
                  @click="saveData(true)"
                >
                  <span class="text-nowrap"> <feather-icon icon="CheckIcon"/> Importar </span>
                </b-button>
              </div>
            </b-col>
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
              <!-- <b-button
                  size="sm"
                  class=""
                  @click.prevent="changeForms(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Seleccionar Formularios'"
                  variant="flat-success"
                >
                <feather-icon icon="EditIcon" /> 
              </b-button> -->
              <b-button
                  size="sm"
                  class=""
                  @click.prevent="edit(data.item, data.index)"
                  v-b-tooltip.noninteractive.hover.left="'Editar'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="Edit2Icon" />
              </b-button>
              <b-button
                  size="sm"
                  class=""
                  v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                  @click="deleteAction(data.item, data.index)"
                  variant="flat-danger"
                >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>

            <template #cell(dateInit)="data">
              <span>{{ convertirFecha(data.item.dateInit) }}</span>
            </template>
            <template #cell(dateEnd)="data">
              <span>{{ convertirFecha(data.item.dateEnd) }}</span>
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
      <b-modal size="lg" v-model="modalOpen" @close="closeModal" centered  hide-footer>
        <div class="w-100">
          <b-card no-body class="sticky">
            <b-row>
                <b-col md="8" lg="8" class="w-50 ml-2">
                  <b-form-group label="Archivo">
                    <b-form-file
                    :placeholder="fileName"
                    disabled
                    />
                  </b-form-group>
                </b-col>   
                <b-col md="2" lg="2" class="w-20 ml-2 mt-2">
                  <b-button
                  class="mr-2"
                  variant="primary"
                  @click="closeModal()"
                  >
                  <span class="text-nowrap"> <feather-icon icon="XIcon" /> Salir </span>
                </b-button>
              </b-col>   
            </b-row>
          </b-card>
          <b-card>
            <b-table :items="recordsModal" :fields="fieldsModal">
              <template #cell(column)="data">
                <div style="font-weight: bold;">
                  {{ data.item.column }}
                </div>
              </template>
              <template #cell(error)="data">
                <div style="color: red;">
                  {{ data.item.error }}
                </div>
              </template>
            </b-table>
          </b-card>
        </div>
      </b-modal>
      <!-- <b-modal
        id="modal-agregar-formularios"
        ref="modal-agregar-formularios"
        centered
        title='Seleccionar Formularios'
        ok-only
        hide-footer
        size="lg"
        no-close-on-backdrop
        @hide="resetForm"
      >
        <b-form class="p-1">
          <validation-observer #default="{ invalid }" ref="refFormObserver3">
            <validation-provider #default="{ errors }" name="type" rules="">
              <b-form-group label="Tipo" label-for="type">
                <div class="d-flex w-50 align-items-center mt-1 ml-1">
                  <span class="mr-2">Interno</span>
                  <b-form-checkbox v-model="form.type" name="type" switch @change="changeCheckboxsSelected">                       
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
            <validation-provider #default="{ errors }" name="formularios" rules="requeridoE">
              <b-form-group label="Formularios" label-for="formularios">
                <b-form-checkbox-group
                  id="formularios"
                  v-model="form.formsId"
                  :options="forms"
                  value-field="form.id"
                  text-field="form.name"
                ></b-form-checkbox-group>
              </b-form-group>
            </validation-provider>
          </validation-observer>
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="form.formsId.length == 0"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              @click="saveForms()"
            >
              <span>Actualizar</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click=";[hide(), resetForm()]"
            >
              Cancelar
            </b-button>
          </div>
        </b-form>
      </b-modal> -->
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import UserService from '@/services/UserService'
import ProjectsService from '@/services/ProjectsService'
import FormService from '@/services/FormService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import readXlsxFile from "read-excel-file";
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
import XlsxPopulate from 'xlsx-populate';

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
      statusFilter: '',
      required,
      apiurl: APIURL,
      showLoading: false,
      show: false,
      timeLine: [],
      title: '',
      comment: '',
      addComent: false,
      modalOpen: false,

      fields: [
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '170px' } },
        { key: 'docType', label: 'Tipo de Documento', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'document', label: 'Documento', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'fullname', label: 'Nombre', sortable: false, visible: true, thStyle: { width: '160px' } },
        { key: 'email', label: 'Email', sortable: false, visible: true, thStyle: { width: '160px' } },
        { key: 'password', label: 'Password', sortable: false, visible: true, thStyle: { width: '160px' } },
        { key: 'position', label: 'Posicion', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'role', label: 'Rol', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'delete', label: 'Dar de Baja', sortable: true, visible: true, thStyle: { width: '140px' } },
      ],
      canImport: false,
      form: {
        docType: '',
        document: '',
        fullname: '',
        email: '',
        password: '',
        position: null,
        role: null,
        delete: '',
      },
      forms: [],
      formId: null,
      formularios: [],
      project_id: JSON.parse(localStorage.getItem('project_id')),
      fileExists: false,
      file: null,
      recordNew: [],
      recordId: null,
      fileName: '',
      headers: [],
      firstRow: [],
      records: [],
      projectSelect: '',
      proyectos: [],
      schema: [],
      modalOpen: false,
      fieldsModal: [
        { key: 'column', label: 'Nombre de columna', sortable: false },
        { key: 'error', label: 'Error', sortable: false},
      ],
      recordsModal: [],
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
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      isAdd: false,
      selectedRecords: {
        arrayId: []
      },
      configurationFile: {
        name: "",
        extension: "",
        size: 0,
        firstRowHeader: true,
      },
      headerExcel: null,
      allData: [],
      allDataSorted: [],
      recordsNew: {},
      dataExcel: [],
      navbar: null,
      filterContent: null,
      tableCard: null,
      tableContainer: null,
      selectableTable: null,
      tableHead: null,
      ths: null,
      trs: null,
      formData: null,
      schemaSend: null
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
  async mounted() {
    const resp = await this.$store.dispatch('back/GET_GENERAL')
    console.log('resp', resp)
    this.schema = resp.userSchema

    this.filter()
    this.getSelect()

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
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleWindowScroll);
    window.removeEventListener("resize", this.fixedElements);
  },
  methods: {
    async exportExcel(id) {
      if (id != null) {
        this.showLoading = true;
        console.log("url", this.apiurl);
        var fileLink = document.createElement("a");
        fileLink.href =
          this.apiurl + "/user/downloadFormat/" + id;
        console.log("fileLink", fileLink.href);
        fileLink.setAttribute("target", "_blank");
        document.body.appendChild(fileLink);
        fileLink.click();
        this.showLoading = false;
      }
    },
    async downloadUsersImportedExcel(id) {
      if (id != null) {
        this.showLoading = true;
        console.log("url", this.apiurl);
        var fileLink = document.createElement("a");
        fileLink.href =
          this.apiurl + "/user/downloadImported/" + id;
        console.log("fileLink", fileLink.href);
        fileLink.setAttribute("target", "_blank");
        document.body.appendChild(fileLink);
        fileLink.click();
        this.showLoading = false;
      }
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
    closeModal() {
        this.modalOpen = false;
        this.cleanModal()
        console.log("CLOSE")
    },
    cleanModal(){
      this.fileName = ''
      this.recordsModal = []
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
    resetForm() {
      this.form = {
        code: null,
        plate: null,
        dateInit: null,
        dateEnd: null,
        type: false,
        route: '',
        primaryPilotId: null,
        secondaryPilotId: null,
      }
    },
    hide(){
      this.$refs['modal-agregar-formularios'].hide()
    },
    changeCheckboxsSelected(){
      // Permitir cambiar de tab si la validación tiene éxito
      console.log("INPUTS COMPLETOS")
      this.form.type == true ? this.form.type = 'Externo' : this.form.type = 'Interno'
      console.log("FORM", this.form)
      console.log('BEFORE this.form.formsId', this.form.formsId)
      this.forms = this.formularios.filter(form => form.type == this.form.type)
      this.form.formsId = []
      /* this.items.formsId = this.formularios.filter(form => form.type === this.items.type).map(form => form.form.id);       */
      this.form.type == 'Externo' ? this.form.type = true : this.form.type = false
      console.log('AFTER this.form.formsId', this.form.formsId)
    },
    async saveForms(){
      this.form.type == true ? this.form.type = 'Externo' : this.form.type = 'Interno'
      console.log("SAVING FORMS", this.form)
      this.showLoading = true
      this.recordsNew = this.form

      this.$swal({
        title: 'Actualizado',
        text: 'Los datos han sido actualizados.',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
      this.getAllData(false)
      this.$refs['modal-agregar-formularios'].hide()
      this.resetForm()
    },
    onChangeFile(event) {
      this.cancelarImportacion();
      this.file = event.target.files ? event.target.files[0] : null;
      console.log("thisFILE", this.file)
      this.fileName =this.file.name
      if (this.file) {
        this.processFile(this.file);
      }
    },
    processFile(xlsxfile) {
      this.configurationFile.name = xlsxfile.name;
      this.configurationFile.size = xlsxfile.size;
      readXlsxFile(xlsxfile, { sheet: 1 }).then((rows) => {
        this.dataExcel = rows

        // Convertir todas las filas
        this.headerExcel = this.dataExcel[0];
        console.log("HEADER",this.headerExcel)
        const objetosExcel = this.dataExcel.slice(1).map(this.convertirFilaEnObjeto);

        objetosExcel.forEach((objeto, index) => {
          objeto.indexAllData = index;
        });

        console.log("EXCEL",objetosExcel);
        this.fileExists = true;
        this.canImport = false;
        this.allData = objetosExcel;
        this.totalElements = this.allData.length
        this.getSortedData("id", 'desc')
        this.records = this.allDataSorted[0]
        console.log("RECORDS",this.records)
      });
    },
    convertirFilaEnObjeto(fila) {
      const objeto = {};
      this.dataExcel[0].forEach((cabecera, indice) => {
          const columna = this.fields.find(field => field.label === cabecera);
          if (columna) {
              const clave = columna.key;
              objeto[clave] = fila[indice];
          }
      });
      return objeto;
    },
    async importData(){
      console.log("IMPORTAR")
    },
    async deleteAction(data, index){
      //DELETE USER
      this.$swal({
        title: '¿Desea eliminar este usuario?',
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
          this.$swal({
            icon: 'success',
            title: 'Eliminado!',
            text: 'El usuario ha sido eliminado.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.deleteData(data.id, index)
        }
      })
    },
    async deleteData(id, index) {
      this.canImport = false
      console.log('id del usuario', index)
      console.log('ALL DATA ANTES DE ELIMINR', this.allData)
      console.log("VALOR", ((this.currentPage - 1) * this.showEntrie))
      this.allData.splice(( ((this.currentPage - 1) * this.showEntrie) + index), 1)
      console.log('ALL DATA DESPUES DE ELIMINR', this.allData)

      this.getAllData(true)
      
    },

    onRowSelectedOrder(items) {
     
      this.selectedRecords.arrayId = items
     
    },
    addCrono(){
      this.isAdd = true
      this.$refs.cronoImportAdd.setData({})
      this.$refs.cronoImportAdd.getData(this.project_id)
    },
    edit(item, index) {
      console.log('item', item)
      this.form.docType = item.docType
      this.form.document = item.document
      this.form.fullname = item.fullname
      this.form.email = item.email
      this.form.password = item.password
      /* this.form.password = item.password */
      this.form.position = item.position
      this.form.role = item.role
      this.form.delete = item.delete
      this.form.index = item.indexAllData
      console.log('this.form', this.form)
      this.isAdd = true
      this.$refs.cronoImportAdd.getData()
      this.$refs.cronoImportAdd.setData(this.form)
    },
    changeForms(item, index){
      this.$refs['modal-agregar-formularios'].show()
      console.log('item', item)
      this.formId = index
      this.form.code = item.code
      this.form.plate = item.plate
      this.form.dateInit = item.dateInit
      this.form.dateEnd = item.dateEnd
      this.form.route = item.route
      this.form.primaryPilotId = item.primaryPilotId
      item.secondaryPilotId ? this.form.secondaryPilotId = item.secondaryPilotId : this.form.secondaryPilotId = null

      item.type == 'Externo' ? this.form.type = true : this.form.type = false
      this.forms = this.formularios.filter(form => form.type == item.type)
      console.log('this.form', this.form)
      console.log('formS', this.forms)
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
      if (fecha != null) {
        const year = new Date(fecha).getFullYear();
        if (year <= 1970) {
            return '';
        }
        const fechaAjustada = new Date(fecha);
        return moment(fechaAjustada).utc().format('yyyy-MM-DD HH:mm');
      }
      return '';
    },
    convertirFecha(fecha) {
      // Crear un objeto de fecha a partir del string proporcionado
      const fechaOriginal = new Date(fecha);
      
      // Formatear la fecha en el formato deseado utilizando Moment.js
      const fechaFormateada = moment(fechaOriginal).format('YYYY-MM-DD HH:mm');
      
      // Devolver la cadena formateada
      return fechaFormateada;
    },
    validDateForExcel(fecha) {
      fecha = new Date(fecha);
      if (fecha != null) {
        const year = new Date(fecha).getFullYear();
        if (year <= 1970) {
          return '';
        }
        return moment(fecha).format('DD/MM/YYYY');
      }
      return '';
    },
   
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      /* if(this.project_id != null && this.project_id != ''){
        this.arrayFilters.push({ keyContains: 'project_id', key: 'equals', value: this.project_id })
      } */
      /* this.arrayFilters.push({
          keyContains: 'status',
          key: 'equals',
          value: 'LiberadoPorDueño'
        })
      if (this.project_id != null && this.project_id != '') {
        this.arrayFilters.push({ keyContains: 'project_id', key: 'equals', value: this.project_id })
      } */


      // if (this.statusFilter != null && this.statusFilter != '') {
      //   this.arrayFilters.push({ keyContains: 'status', key: 'equals', value: this.statusFilter })
      // }
     
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
    
    async cancelarImportacion() {
      this.records = []
      this.totalElements = 0
      this.fileExists = false
      this.headers = []
      this.file = null
      this.firstRow = null
      this.headerExcel = null
      this.configurationFile = {
        name: '',
        extension: '',
        size: 0,
        firstRowHeader: true
      }
    },
    // Función para convertir el arreglo de objetos en un archivo Excel
    async convertirAExcel(arregloDeObjetos) {
      // Crear un nuevo libro de Excel
      const workbook = await XlsxPopulate.fromBlankAsync();

      /* arregloDeObjetos.unshift(this.headerExcel); */
      console.log('arregloDeObjetos', arregloDeObjetos)
      
      

      // Agregar una nueva hoja al libro
      const sheet = workbook.sheet('Sheet1') || workbook.addSheet('Sheet1');


      // Escribir los encabezados en la primera fila
      this.headerExcel.forEach((encabezado, columnIndex) => {
        sheet.cell(1, columnIndex + 1).value(encabezado);
      });
      console.log("header", this.headerExcel)

      // Obtener los índices de las columnas "Fecha Inicio" y "Fecha Fin"
      const fechaInicioIndex = this.headerExcel.findIndex(header => header === 'Fecha Inicio');
      const fechaFinIndex = this.headerExcel.findIndex(header => header === 'Fecha Fin');

      // Establecer el estilo de fecha para las celdas de "Fecha Inicio" y "Fecha Fin"
      if (fechaInicioIndex !== -1) {
        sheet.range(2, fechaInicioIndex + 1, arregloDeObjetos.length + 1, fechaInicioIndex + 1)
            .style({ numberFormat: 'dd/mm/yyyy', horizontalAlignment: 'left' });
      }
      if (fechaFinIndex !== -1) {
        sheet.range(2, fechaFinIndex + 1, arregloDeObjetos.length + 1, fechaFinIndex + 1)
            .style({ numberFormat: 'dd/mm/yyyy', horizontalAlignment: 'left' });
      }

      // Escribir los datos en las filas
      arregloDeObjetos.forEach((objeto, rowIndex) => {
        Object.values(objeto).forEach((valor, columnIndex) => {
          sheet.cell(rowIndex + 2, columnIndex + 1).value(valor);
        });
      });

      // Convertir el libro de Excel a un blob
      const excelBlob = await workbook.outputAsync();

      return excelBlob;
    },

    async saveData(save_data) {
      this.showLoading = true
      /* this.records.forEach(objeto => {
          if (objeto.dateInit) {
            objeto.dateInit = this.validDateForExcel(objeto.dateInit);
          }
          if (objeto.dateEnd) {
            objeto.dateEnd = this.validDateForExcel(objeto.dateEnd);
          }
        }); */

      this.formData = null
      this.formData = new FormData()
      console.log("DATOS DE TABLA",this.allData)
      console.log('this.file', this.file)
      /* this.allData.forEach(usuario => {
        // Verifica si el campo 'password' no es una cadena
        if (typeof usuario.password !== 'string') {
            // Convierte el valor a cadena
            usuario.password = usuario.password.toString();
        }

        // Verifica si el campo 'document' no es una cadena
        if (typeof usuario.document !== 'string') {
            // Convierte el valor a cadena
            usuario.document = usuario.document.toString();
        }
      }); */
      /* console.log('this.file', this.file) */
      
      // Llamar a la función para convertir el arreglo de objetos en un archivo Excel
      await this.convertirAExcel(this.allData).then(blob => {

        this.file = new File([blob], 'archivo.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        console.log('this.file AAA', this.file);

        // Aquí puedes realizar cualquier otra acción que necesite hacerse después de que this.file se haya actualizado
      });

      console.log('NUEVO this.file', this.file)
      this.formData.append('file', this.file)
      this.schemaSend = null
      const resp = await this.$store.dispatch('back/GET_GENERAL')
      console.log('resp SCHEMAAAAA', resp)
      this.schema = resp.userSchema
      this.schemaSend = {
        save: save_data,
        schema: this.schema,
        projectId : this.project_id,
        user_id : this.userData.id
      }
      console.log('schemaSend',this.schemaSend)
      this.formData.append('schema', JSON.stringify(this.schemaSend))
      const respImport = await UserService.uploadFile(this.formData, this.$store)
      console.log('respImport as',respImport)
      if (respImport.status) {
        var findErr = false
        for (let i = 0; i < respImport.data.schema.length; i++) {
          this.schema[i].errors = respImport.data.schema[i].errors
          if (respImport.data.schema[i].errors.length > 0) {
            findErr = true
          }
        }
        console.log('findErr',findErr)
        if (save_data && !findErr) {
          this.cancelarImportacion()
          this.$swal({
            icon: 'success',
            title: 'Importado!',
            text: 'Los usuarios han sido importados con exito.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.downloadUsersImportedExcel(this.project_id)
          this.cancelarImportacion()
        } else if (findErr) {
          console.log('respImport', respImport)
          this.$swal({
            icon: 'warning',
            title: 'Errores',
            text: 'Se presentaron los siguientes errores.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.modalOpen = true
          /* this.fieldsModal = this.schema.map(item => {
            return item.title
          }) */
          this.recordsModal = this.schema
            .filter(item => item.errors.length > 0)
            .map(item => ({
                column: item.title,
                cell: item.id,
                error: item.errors
            }));

          console.log("FIELÑDS", this.fieldsModal)
          console.log("records modal", this.recordsModal)
          console.log("SCXHEMA", this.schema)

        } else {
          this.canImport = true
          this.$swal({
            icon: 'success',
            title: 'Éxito',
            text: 'La prueba se realizó con éxito.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
        }
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al importar los usuarios.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
      this.showLoading = false
    },
    async getSelect() {
      const user = JSON.parse(localStorage.getItem('userData'))
      const url2 = `?limit=100000&page=${this.currentPage}&order=asc&sort=code`
      const respProyectos = await ProjectsService.getEmpresas(url2, this.$store)
      let arrayFilters = []
      arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(arrayFilters)
      /* const respForms = await FormService.getProjectForms(url, this.$store)
      if (respForms.status) {
        this.formularios = respForms.data.rows
        console.log("FORMS", this.formularios)

      } */
      console.log("PROYECTOS", respProyectos)
      if (respProyectos.status) {
        this.proyectos = respProyectos.data.rows
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
    async getAllData(deleted) {
      if (this.fileExists) {
        this.showLoading = true;
        if(!deleted){
          this.canImport = false
          console.log("BEFORE", this.allData)
          const index = this.allData.findIndex(item => item.indexAllData == this.recordsNew.index)
          console.log("INDEX", index)
          console.log("BEFORE INDEX", this.allData[index])
          this.allData[index] = this.recordsNew.data;
          console.log("AFTER INDEX", this.allData[index])
        }
        console.log("AFTER", this.allData)

        this.totalElements = this.allData.length
        this.getSortedData("id", 'desc')
        this.currentPage = 1
        
        this.records = this.allDataSorted[0]
        console.log('this.records', this.records)
        this.showLoading = false;
      }
    },
    getDataImport(id, data){
      this.showLoading = true;
   

      this.recordId = id
      this.recordNew = data

      console.log("RECORDDDD", this.recordId, this.recordNew)
      console.log("ANTESRECORDDDD", this.records)
      this.records[this.recordId] = this.recordNew
      console.log("DESPUESRECORDDDD", this.records)
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
</style>
