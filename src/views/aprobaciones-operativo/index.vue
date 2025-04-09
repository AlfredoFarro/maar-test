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
        ref="cronoAdd"
      >
    </add-edit>
    <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="12" lg="12" class="d-flex flex-column flex-lg-row justify-content-start">
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
                    disabled
                    @input="filter()"
                    class="select-obra"
                    
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
              <div class="w-100 mb-1 mb-lg-0 mt-02 mr-2">
                <b-form-group label="Sede" label-for="sede">
                  <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="sedes"
                  label="description"
                  input-id="sede"
                  :reduce="(sedes) => sedes.id"
                  placeholder="Sede"
                  @input="filter()"
                  v-model="sede"
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
              <!-- Campo Fecha Inicio -->
              <div class="w-100 mb-1 mb-lg-0 mt-02 mr-2">
                <b-form-group
                  label="Fecha de Inicio"
                  label-for="fecha-inicio"
                >
                  <b-form-datepicker
                    v-model="startDate"
                    id="fecha-inicio"
                    placeholder="Seleccione fecha"
                    class="select-obra"
                    :state="startDate ? true : null" 
                    ></b-form-datepicker>
                </b-form-group>
              </div>

              <!-- Campo Fecha Final -->
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group
                  label="Fecha Final"
                  label-for="fecha-final"
                >
                  <b-form-datepicker
                    v-model="endDate"
                    id="fecha-final"
                    placeholder="Seleccione fecha"
                    class="select-obra"
                    :state="endDate ? true : null"
                  ></b-form-datepicker>
                </b-form-group>
              </div>  
              
            </b-col>
            
          </b-row>
          
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
              <b-button
                  v-if="(data.item.content && data.item.content[0].photo)"
                  size="sm"
                  class=""
                  @click.prevent="openModal(data.item, true)"
                  v-b-tooltip.noninteractive.hover.left="'Ver Foto'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="EyeIcon" />
              </b-button>
              <b-button
                  v-else-if="data.item.content && !data.item.content[0].photo"
                  size="sm"
                  class=""
                  @click.prevent="openModal(data.item, false)"
                  v-b-tooltip.noninteractive.hover.left="'Ver Declaración Jurada'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="ClipboardIcon" />
              </b-button>
              <b-button
                  v-if="data.item.canApprove && data.item.canEdit"
                  size="sm"
                  class=""
                  @click.prevent="approveAction(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Aprobar'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="CheckCircleIcon" />
              </b-button>
              <b-button
                  v-if="data.item.canApprove && data.item.canEdit"
                  size="sm"
                  class=""
                  v-b-tooltip.noninteractive.hover.left="'Rechazar'"
                  @click="rejectAction(data.item)"
                  variant="flat-danger"
                >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>
            <template #cell(photoUploadDate)="data">
              <span>{{ validDate(data.item.photoUploadDate) }}</span>
            </template>
            <template #cell(createdAt)="data">
              <span>{{ validDate(data.item.createdAt) }}</span>
            </template>
            
            <template #cell(currentApprovedStep)="data">
              <span v-if="data.item.currentApprovedStep == 0 && data.item.state != 3">Primera Aprobación</span>
              <span v-if="data.item.currentApprovedStep == 0 && data.item.state == 3" style="font-weight: bold; color: red;">Primera Aprobación</span>
              <span v-if="data.item.currentApprovedStep == 1 && data.item.state != 3">Segunda Aprobación</span>
              <span v-if="data.item.currentApprovedStep == 1 && data.item.state == 3" style="font-weight: bold; color: red;">Segunda Aprobación</span>
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
      <b-modal
        id="modal-photo"
        ref="modal-photo"
        centered
        :title= "isPhoto == true ? 'Foto Formulario' : 'Declaración Jurada'"
        ok-only
        hide-footer
        size="lg"
        no-close-on-backdrop
        @hide="resetForm">
        <div v-if="isPhoto">
          <img :src="photoModal" style="width: 100%;" alt="Foto">
        </div>
        <div v-else>
          <div v-if="formContent && formContent[0] && formContent[0].content">
            <p>1. ¿USTED INGIRIÓ ALGÚN TIPO DE MEDICAMENTO?</p>
            <div>
              <b-button :variant="formContent[0].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formContent[0].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
            <div v-if="formContent[0].content[0].value == '1'">
              <b-form-group label="INDIQUE EL NOMBRE DEL MEDICAMENTO" label-for="1.1" class="mt-2">
                <b-form-input type="text" v-model="formContent[0].content[1].value" id="1.1" disabled/>
              </b-form-group>
              <b-form-group label="¿POR QUÉ FUE ADMINISTRADO?" label-for="1.2">
                <b-form-input type="text" v-model="formContent[0].content[2].value" id="1.2" disabled/>
              </b-form-group>
              <b-form-group label="MOTIVO" label-for="1.3" >
                <b-form-input type="text" v-model="formContent[0].content[3].value" id="1.3" disabled/>
              </b-form-group>
              <b-form-group label="FECHA Y HORA" label-for="1.4" >
                <b-form-input type="text" v-model="formContent[0].content[4].value" id="1.4" disabled/>
              </b-form-group>
            </div>
            
          </div>
          <div class="mt-2">
            <p>2. INDICAR LOS MEDICAMENTO A LOS CUALES USTED ES ALÉRGICO</p>
            <b-form-textarea 
            rows="1"
            max-rows="6"
            v-model="formContent[1].content[0].value"  
            disabled/>
          </div>
          <div class="mt-2">
            <p>3. ACTUALMENTE ¿TIENE ALGUNA DOLENCIA O SIENTE ALGUNA MOLESTIA CON RESPECTO A SU SALUD?</p>
            <div>
              <b-button :variant="formContent[2].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formContent[2].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
            <b-form-group label="INDICAR" label-for="3.1" class="mt-2">
              <b-form-input type="text" v-model="formContent[2].content[1].value" id="3.1" disabled/>
            </b-form-group>
          </div>
          <div>
            <p>4. ¿CUÁNTAS HORAS DESCANSÓ USTED ANTES DEL VIAJE?</p>
            <b-form-group >
              <b-form-input type="text" v-model="formContent[3].content[0].value" disabled/>
            </b-form-group>
            <div v-if="formContent[3].content[0].value != ''">
              <b-form-group label="HORA DE INICIO" v-if="formContent[3].content[1]" label-for="1.1" class="mt-2">
                <b-form-input type="text" v-model="formContent[3].content[1].value" id="1.1" disabled/>
              </b-form-group>
              <b-form-group label="HORA DE FINALIZACIÓN" v-if="formContent[3].content[2]" label-for="1.2">
                <b-form-input type="text" v-model="formContent[3].content[2].value" id="1.2" disabled/>
              </b-form-group>
            </div>
          </div>
          <div>
            <p>5. ¿TUVO ALGÚN MALESTAR DURANTE EL DESCANSO? (INSOMNIO, DOLOR DE CABEZA, OTROS)</p>
            <div>
              <b-button :variant="formContent[4].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formContent[4].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
          </div>
          <div class="mt-2">
            <p>6. ¿PASO USTED POR LA PRUEBA DE ALCOHOLEMIA?</p>
            <div>
              <b-button :variant="formContent[5].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formContent[5].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
          </div>
          <!-- <div class="mt-2" v-if="formContent[5].content[0].value == '1'">
            <p>RESULTADO</p>
            <div>
              <b-button :variant="formContent[5].content[1].value == '1' ? 'primary' : ''" class="mr-2">Positivo</b-button>
              <b-button :variant="formContent[5].content[1].value != '1' ? 'primary' : ''">Negativo</b-button>
            </div>
          </div> -->
          <div class="mt-2" v-if="formContent[5].content[0].value == '1' && formContent[5].content[1]">
            <b-form-group label="RESULTADO" v-if="formContent[5].content[1]" label-for="5.1">
              <b-form-input type="text" v-model="formContent[5].content[1].value" id="5.1" disabled/>
            </b-form-group>
          </div>
        </div>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import FormService from '@/services/FormService'
import TravelService from '@/services/TravelService'
import ProjectsService from '@/services/ProjectsService'
import UserService from '@/services/UserService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
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
import ActivityService from '@/services/ActivityService'
import OperateService from '@/services/OperateService'
import SedeService from '@/services/SedeService'
import GeneralService from '@/services/GeneralService'
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
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '160px' } },
        { key: 'formName', label: 'Formulario', sortable: false, visible: true },
        { key: 'currentApprovedStep', label: 'Nivel', sortable: false, visible: true },
        { key: 'createdAt', label: 'Fecha Registro', sortable: false, visible: true, thStyle: { width: '170px' } },
        { key: 'sede.description', label: 'Sede', sortable: false, visible: true, thStyle: { width: '80px' } },        
        { key: 'userLastUpload.fullname', label: 'Subido por', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'photoUploadDate', label: 'Fecha subida de foto', sortable: false, visible: true },
      ],
      form: {
          name: '',
          lvl: null,
          tableNameContent: null,
          project: null
        },
        formContent: [
          {
              "content": [
                  {
                      "value": "0"
                  },
                  {
                      "value": ""
                  },
                  {
                      "value": ""
                  },
                  {
                      "value": ""
                  },
                  {
                      "value": "2024-04-08T20:38:59"
                  }
              ],
              "questionNumber": 1
          },
          {
              "content": [
                  {
                      "value": "prueba app"
                  }
              ],
              "questionNumber": 2
          },
          {
              "content": [
                  {
                      "value": "0"
                  },
                  {
                      "value": ""
                  }
              ],
              "questionNumber": 3
          },
          {
              "content": [
                  {
                      "value": "11:05"
                  },
                  {
                      "value": ""
                  },
                  {
                      "value": ""
                  }
              ],
              "questionNumber": 4
          },
          {
              "content": [
                  {
                      "value": "1"
                  }
              ],
              "questionNumber": 5
          },
          {
              "content": [
                  {
                      "value": "1"
                  },
                  {
                      "value": "0"
                  }
              ],
              "questionNumber": 6
          }
      ],
      project_id: JSON.parse(localStorage.getItem('project_id')),
      route: '',
      code: '',
      isPhoto: false,
      pilot_id: null,
      pilotos: [],
      restriction_id: null,
      records: [],
      projectSelect: '',
      proyectos: [],
      arrayFilters: [],
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      totalElements: 0,
      currentPage1: 1,
      entries1: [10, 20, 50, 100],
      showEntrie1: 10,
      totalElements1: 0,
      name: '',
      photoModal: '',
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      userGroups: [],
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      isAdd: false,
      selectedRecords: {
        arrayId: []
      },
      allData: [],
      allDataSorted: [],
      sede: null,
      startDate: null,
      endDate: null,
      sedes: [],
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
    if(this.userData.group){
      this.userGroups = this.userData.group.map(user => user.approver_group.id)
    }
    console.log('userGroups', this.userGroups)
    this.filter()
    this.getSelect()
    this.getSedes()

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
    startDate() {
      this.checkIfBothDatesSelected();
    },
    endDate() {
      this.checkIfBothDatesSelected();
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleWindowScroll);
    window.removeEventListener("resize", this.fixedElements);
  },
  methods: {
    checkIfBothDatesSelected() {
      if (this.startDate && this.endDate) {
        this.filter(); // Ejecutar el filtrado solo cuando ambas fechas tienen valor
      }
    },
    async approveAction(item){
      console.log('item', item)
      this.$swal
        .fire({
          title: 'Seguro que desea aprobar este formulario?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, aprobar',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        })
        .then(async result => {
          if (result.value) {
            const resp = await OperateService.approvalForms(
              
                [
                  {
                    formAdminId: item.formAdminId,
                    approvalStatus: 1,
                    currentApprovedStep: item.currentApprovedStep,
                    adminId: item.adminId
                  }
                ]
              ,
              this.$store
            )
            console.log("RESP APPROVE", resp)
            if (resp.status) {
              this.currentPage = 1
              this.$swal({
                icon: 'success',
                title: 'Aprobado!',
                text: 'El formulario fue aprobado con éxito.',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
              this.getAllData()
            } else {
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al aprobar el formulario seleccionado.',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            }
          }
        })
    },
    async rejectAction(item) {
      console.log('item', item)
      this.$swal
        .fire({
          title: 'Seguro que desea rechazar este formulario?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, rechazar',
          html: `
            <input type="text" style="margin: 15px 0" id="inputValueProvisionales" class="swal2-input" placeholder="Ingrese la razón">
          `,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        })
        .then(async result => {
          if (result.value) {
            const inputValue = document.getElementById('inputValueProvisionales').value

            const resp = await OperateService.approvalForms(
              [
                {
                  formAdminId: item.formAdminId,
                  approvalStatus: 0,
                  comment: inputValue,
                  currentApprovedStep: item.currentApprovedStep,
                  adminId: item.adminId
                }
              ]
              ,
              this.$store
            )
            if (resp.status) {
              this.currentPage = 1
              this.$swal({
                icon: 'success',
                title: 'Rechazado!',
                text: 'El formulario fue rechazado con éxito.',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
              this.getAllData()
            } else {
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al rechazar el formulario seleccionado.',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            }
          }
        })
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
    openModal(item, isPhoto) {
      console.log("ITEM", item)
      this.photoModal = item.content[0].photo
      console.log("PHOTO", this.photoModal)
      if(!isPhoto){
        this.formContent = item.content
        this.formContent[0].content[4].value = this.validDateForm(this.formContent[0].content[4].value)
      }
      this.isPhoto = isPhoto
      this.$refs['modal-photo'].show()
      console.log('modalOpen', this.modalOpen)

    },
    closeModal() {
      this.modalOpen = false;
    },
    async deleteAction(data){
      //DELETE USER
      this.$swal({
        title: '¿Desea eliminar este cronograma?',
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
            text: 'El cronograma ha sido eliminado.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.deleteData(data.id)
        }
      })
    },
    async deleteData(id) {
      console.log('id del cronograma', id)
      const resp = await TravelService.deleteTravel(id, this.$store)
      console.log('resp delete',resp)
      if (resp) {
        this.getAllData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el cronograma.',
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
    addCrono(){
      this.isAdd = true
      this.$refs.cronoAdd.setData({})
      this.$refs.cronoAdd.getData(this.project_id)
    },
    edit(item) {
        console.log('item', item)
        this.form.id = item.id
        this.form.code = item.code
        this.form.dateInit = item.dateInit
        this.form.dateEnd = item.dateEnd
        this.form.state = item.state
        this.form.formAssignedQty = item.formAssignedQty
        this.form.formApprovQty = item.formApprovQty
        this.form.route = item.route
        this.form.primaryPilot = item.primaryPilot
        this.form.secondaryPilot = item.secondaryPilot
        console.log('this.form', this.form)
        this.isAdd = true
        this.$refs.cronoAdd.setData(this.form)
        this.$refs.cronoAdd.getData(this.project_id)
      },
    selectAll(val) {
     
      if (val) {
     
        this.$refs.selectableTable.selectAllRows()
      } else {
        this.$refs.selectableTable.clearSelected()
      }
      //
    },
    resetForm(){
      this.photoModal = ''
    },
    validDate(fecha) {
      fecha = new Date(fecha);
      if (!isNaN(fecha.getTime())) {
        // Sumar 5 horas a la fecha
        fecha.setHours(fecha.getHours() + 5);
        return moment(fecha).format('DD-MM-YYYY HH:mm');
      }
      return '';
    },
    validDateForm(fecha) {
      fecha = new Date(fecha);
      if (!isNaN(fecha.getTime())) {
        // Sumar 5 horas a la fecha
        return moment(fecha).format('DD-MM-YYYY HH:mm');
      }
      return '';
    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      console.log("project_id", this.project_id)
      
      /* if(this.user_role == "supervisor_1" ){
        this.arrayFilters.push({ keyContains: 'form_travel.groupLvl1.id', key: 'in', value: JSON.stringify(this.userGroups)})
      }
      if(this.user_role == "supervisor_2"){
        this.arrayFilters.push({ keyContains: 'form_travel.groupLvl2', key: 'in', value: JSON.stringify(this.userGroups)})
      } */



      /* this.arrayFilters.push({ keyContains: 'user.role_code', key: 'equals', value: 3}) */


      

      
      if(this.code != null && this.code != ''){
        this.arrayFilters.push({ keyContains: 'activity.code', key: 'contains', value: this.code })
      }
      if(this.name != null && this.name != ''){
        this.arrayFilters.push({ keyContains: 'form.name', key: 'contains', value: this.name })
      }

     /*  this.arrayFilters.push({ keyContains: 'currentLvl', key: 'equals', value: 1 })
      this.arrayFilters.push({ keyContains: 'state', key: 'equals', value: 1 })
      this.arrayFilters.push({ keyContains: 'groupLvl1.id', key: 'in', value: this.userGroups}) */
     
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
    async addComment() {
      this.$refs.addComentarios.validate().then(async (success) => {
        if (success) {
          this.isDisabled = true
          let datos = {}
          const userData = JSON.parse(localStorage.getItem('userData'))
          datos.restriction_id = this.restriction_id
          datos.description = this.comment
          datos.user_id = userData.id
       
          const respComment = ''
          if (respComment.status) {
            this.$swal({
              title: 'Registrado',
              text: 'El comentario ha sido registrado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
            this.addComent = false
            this.getAllData()
            this.$refs['modal-comment'].hide()
          } else {
            this.$swal({
              title: 'Error!',
              text: ' Hubo un error al registrar el comentario',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          }
          this.isDisabled = false
        }
      })
    },
    async getSelect() {
      const user = JSON.parse(localStorage.getItem('userData'))
      const url2 = `?limit=100000&page=${this.currentPage}&order=asc&sort=code`
      const respProyectos = await ProjectsService.getProyectos(url2, this.$store)
      const respPilotos = await UserService.getPilots('', this.$store)

      console.log("PROYECTOS", respProyectos)
      if (respProyectos.status) {
        this.proyectos = respProyectos.data.rows
        this.pilotos = respPilotos.data

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
        this.totalElements = this.allData.length
      }

      this.showLoading = false
    },
    async getSedes(){
        const arrayFilters = []
        if (this.project_id != null && this.project_id != '') {
            arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
        }
        const url =
        `?limit=10000&order=asc&sort=description&filter=` +
        JSON.stringify(arrayFilters)
        const respSedes = await SedeService.getSedes(url, this.$store)
        console.log("URL sedes", url)
        if (respSedes.status) {
            this.sedes = respSedes.data.rows
            console.log("SEDES AAA",this.sedes)
        }
        /* const resp = await GeneralService.getGeneral('',this.$store)
        if (resp.status) {
            this.sedes = resp.data.sedes
            console.log("SEDES AAA",this.sedes)
        } */
    },
    async getAllData() {
      this.showLoading = true;
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      console.log("ARRAY FILTERS", this.arrayFilters)
      const resp = await OperateService.getFormsToApprove('', this.$store)
    
      console.log('resp FORMS OPERATIVO', resp)
     
      if (resp.status) {
        this.allData = resp.data;
        console.log("ROLE",this.user_role)
        if(this.user_role != 'superadmin' && this.user_role != 'monitor'){
          console.log("FILTRADO POR APPROVE")
          this.allData = this.allData.filter(obj => {
            if(obj.canApprove == true){
              return obj
            }
          })
        }
        if((this.user_role == 'superadmin' || this.user_role == 'monitor') && this.project_id != null && this.project_id != ''){
          this.allData = this.allData.filter(item => item.project.id == this.project_id)
        }
        if (this.sede != null && this.sede != '') {
          this.allData = this.allData.filter(item => item.sede.id == this.sede)
        }
        if (this.name != null && this.name != '') {
          this.allData = this.allData.filter(item => item.formName.toLowerCase().includes(this.name.toLowerCase()))
        }
        this.allData = this.allData.filter(item => (item.isRequiredApproved))
        console.log("FILTRADO POR GRUPO LELVEL",this.allData);

        // Filtrar por rango de fechas
        if (this.startDate != null && this.endDate != null) {
          const start = moment(this.startDate, 'YYYY-MM-DD').subtract(1, 'days').startOf('day');; // Parseo explícito de formato
          const end = moment(this.endDate, 'YYYY-MM-DD').subtract(1, 'days').endOf('day'); // Considera el final del día para incluir todo el día

          this.allData = this.allData.filter((item) => {
            const createdAt = moment.utc(item.createdAt);
            return createdAt.isSameOrAfter(start) && createdAt.isSameOrBefore(end);
          });
        }

        this.totalElements = this.allData.length
      }
      if(this.allData.length > 0){
        this.getSortedData("createdAt", 'desc')
        this.records = this.allDataSorted[0]
      }else{
        this.records = this.allData
      }
      
      console.log('records', this.records)
      this.showLoading = false;
      console.log("ALL DATA", this.allData)
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
      console.log("SORTEANDO")
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
      console.log("SORTED", this.allDataSorted)
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
      if (this.user_role != 'superadmin') {
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
