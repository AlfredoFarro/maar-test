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
    <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters>
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="12" lg="12" class="d-flex flex-column flex-lg-row justify-content-start">
              <!-- <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Proyecto" label-for="project" class="mr-2">
                  <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="proyectos"
                    label="code"
                    input-id="project"
                    :reduce="(proyectos) => proyectos.id"
                    placeholder="Proyecto"
                    disabled
                    v-model="project_id"
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
              </div> -->
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
              <!-- Campo Fecha Inicio -->
              <!-- <div class="w-100 mb-1 mb-lg-0 mt-02 mr-2">
                <b-form-group
                  label="Fecha Rango Inicio"
                  label-for="fecha-inicio"
                >
                  <b-form-datepicker
                    v-model="startDate"
                    id="fecha-inicio"
                    placeholder="Seleccione fecha"
                    class="select-obra"
                    :state="startDate ? true : null" 
                    @input="filter()"
                    ></b-form-datepicker>
                </b-form-group>
              </div>

              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group
                  label="Fecha Rango Final"
                  label-for="fecha-final"
                >
                  <b-form-datepicker
                    v-model="endDate"
                    id="fecha-final"
                    placeholder="Seleccione fecha"
                    class="select-obra"
                    :state="endDate ? true : null"
                    @input="filter()"
                  ></b-form-datepicker>
                </b-form-group>
              </div>    -->
              <!-- <div class="w-100">
                <b-form-group label="Descripción" label-for="description" class="mr-2">
                  <b-form-input
                    type="text"
                    label="name"
                    id="description"
                    placeholder="Descripción"
                    v-model="description"
                    @input="filter()"
                    class="select-obra"
                    autocomplete="off"
                  >
                  </b-form-input>
                </b-form-group>
              </div>     -->
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
            <!-- <b-col md="6" lg="5" class="d-flex">              
              <div
                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
              >
             
                <b-button
                  @click="showFilters"
                  variant="primary"
                  class="text-left px-1 w-auto"
                  block
                  v-b-toggle="'accordion1'"
                >
                <feather-icon icon="PlusCircleIcon" size="15" />
                  Columnas
                  
                </b-button>
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
            <template #cell(state)="data">
              <span v-if="data.item.state == 0">No iniciado</span>
              <span v-if="data.item.state == 1">En proceso</span>
              <span v-if="data.item.state == 2">Aprobado</span>
              <span v-if="data.item.state == 3">Rechazado</span>
            </template>
            <template #cell(errorMsg)="data">
              <div style="color: red">
                <span style="font-weight: bold">{{ data.item.errorMsg }}</span>
              </div>
            </template>
            <template v-slot:cell(actions)="row">
              <b-button
                  size="sm"
                  class=""               
                  @click.prevent="showFlow(row.index)"
                  v-b-tooltip.noninteractive.hover.left="'Ver Flujo'"
                  variant="flat-success"               
                  >
                  <feather-icon size="20" icon="EyeIcon" />
              </b-button>
            </template>
            
            <template #cell(admin.dateGenerated)="data">
              <span>{{ validDate(data.item.admin.dateGenerated) }}</span>
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
        id="modal-comment"
        ref="modal-comment"
        centered
        size="xl"
        :title= "showingContent == true ? 'Contenido' : 'Flujo'"
        ok-only
        hide-footer
        :size="addComent && timeLine.length > 0 ? 'lg' : ''"
        no-close-on-backdrop
        @hide="closeComment"
      >
      <div v-if="showingContent && isPhoto">
          <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          @click="goBack"
          class="mb-2">
              <feather-icon style="width: 15px; height: 15px;" icon="ArrowLeftIcon"/> Volver
          </b-button>
          <img :src="photoModal" style="width: 100%;" alt="Foto">
        </div>
        <div v-else-if="showingContent && !isPhoto">
          <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          @click="goBack"
          class="mb-2">
              <feather-icon style="width: 15px; height: 15px;" icon="ArrowLeftIcon"/> Volver
          </b-button>
          <p>1. ¿USTED INGIRIÓ ALGÚN TIPO DE MEDICAMENTO?</p>
          <div>
            <b-button :variant="formModal[0].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
            <b-button :variant="formModal[0].content[0].value != '1' ? 'primary' : ''">No</b-button>
          </div>
          <div v-if="formModal[0].content[0].value == '1'">
            <b-form-group label="INDIQUE EL NOMBRE DEL MEDICAMENTO" label-for="1.1" class="mt-2">
              <b-form-input type="text" v-model="formModal[0].content[1].value" id="1.1" disabled/>
            </b-form-group>
            <b-form-group label="¿POR QUÉ FUE ADMINISTRADO?" label-for="1.2">
              <b-form-input type="text" v-model="formModal[0].content[2].value" id="1.2" disabled/>
            </b-form-group>
            <b-form-group label="MOTIVO" label-for="1.3" >
              <b-form-input type="text" v-model="formModal[0].content[3].value" id="1.3" disabled/>
            </b-form-group>
            <b-form-group label="FECHA Y HORA" label-for="1.4" >
              <b-form-input type="text" v-model="formModal[0].content[4].value" id="1.4" disabled/>
            </b-form-group>
          </div>
            
          <div class="mt-2">
            <p>2. INDICAR LOS MEDICAMENTO A LOS CUALES USTED ES ALÉRGICO</p>
            <b-form-textarea 
            rows="1"
            max-rows="6"
            v-model="formModal[1].content[0].value"  
            disabled/>
          </div>
          <div class="mt-2">
            <p>3. ACTUALMENTE ¿TIENE ALGUNA DOLENCIA O SIENTE ALGUNA MOLESTIA CON RESPECTO A SU SALUD?</p>
            <div>
              <b-button :variant="formModal[2].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formModal[2].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
            <b-form-group label="INDICAR" label-for="3.1" class="mt-2">
              <b-form-input type="text" v-model="formModal[2].content[1].value" id="3.1" disabled/>
            </b-form-group>
          </div>
          <div>
            <p>4. ¿CUÁNTAS HORAS DESCANSÓ USTED ANTES DEL VIAJE?</p>
            <b-form-group >
              <b-form-input type="text" v-model="formModal[3].content[0].value" disabled/>
            </b-form-group>
            <div v-if="formModal[3].content[0].value != ''">
              <b-form-group label="HORA DE INICIO" v-if="formModal[3].content[1]" label-for="1.1" class="mt-2">
                <b-form-input type="text" v-model="formModal[3].content[1].value" id="1.1" disabled/>
              </b-form-group>
              <b-form-group label="HORA DE FINALIZACIÓN" v-if="formModal[3].content[2]" label-for="1.2">
                <b-form-input type="text" v-model="formModal[3].content[2].value" id="1.2" disabled/>
              </b-form-group>
            </div>
          </div>
          <div>
            <p>5. ¿TUVO ALGÚN MALESTAR DURANTE EL DESCANSO? (INSOMNIO, DOLOR DE CABEZA, OTROS)</p>
            <div>
              <b-button :variant="formModal[4].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formModal[4].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
          </div>
          <div class="mt-2">
            <p>6. ¿PASO USTED POR LA PRUEBA DE ALCOHOLEMIA?</p>
            <div>
              <b-button :variant="formModal[5].content[0].value == '1' ? 'primary' : ''" class="mr-2">Si</b-button>
              <b-button :variant="formModal[5].content[0].value != '1' ? 'primary' : ''">No</b-button>
            </div>
          </div>
          <!-- <div class="mt-2" v-if="formModal[5].content[0].value == '1'">
            <p>RESULTADO</p>
            <div>
              <b-button :variant="formModal[5].content[1].value == '1' ? 'primary' : ''" class="mr-2">Positivo</b-button>
              <b-button :variant="formModal[5].content[1].value != '1' ? 'primary' : ''">Negativo</b-button>
            </div>
          </div> -->
          <div class="mt-2" v-if="formModal[5].content[0].value == '1' && formModal[5].content[1]">
            <b-form-group label="RESULTADO" v-if="formModal[5].content[1]" label-for="5.1">
              <b-form-input type="text" v-model="formModal[5].content[1].value" id="5.1" disabled/>
            </b-form-group>
          </div>
        </div>
        <div class="wrapper" v-else>
          <div
              class="timeline-group"
              v-for="(group, groupIndex) in props"
          >
              <div class="timeline-title">
                  {{ group.label }}
                  <b-button
                      size="sm"
                      class=""               
                      @click="showContent(groupIndex)"
                      v-if="hasContent"
                      v-b-tooltip.noninteractive.hover.right="'Ver Contenido'"
                      variant="flat-success"               
                      >
                      <feather-icon size="20" icon="EyeIcon" />
                  </b-button>
              </div>
              <div
                  :class="['timeline-item', (item.approvalStatus == 0 ? 'pending' : item.approvalStatus == 1 ? 'pending_approval' : item.approvalStatus == 2 ? 'approved' : item.approvalStatus == 3 ? 'rejected' : '')]"
                  v-for="(item, index) in group.content"
                  :key="index"
              >
                  <div class="left-wrapper">
                      <span class="title">{{ item.label }}</span>
                      <span class="subtitle"
                          >Usuario: {{ item.user.fullname }}</span
                      >
                      <span class="comment" v-if="item.comment">
                        <feather-icon icon="MessageCircleIcon" />
                          {{ item.comment }}
                      </span>
                  </div>
                  <div class="right-wrapper" v-if="item.created_at">
                      <span class="date">{{
                          validDate(item.created_at)
                      }}</span>
                  </div>
              </div>
          </div>
        </div>
      </b-modal>

    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import EnterpriseService from '@/services/EnterpriseService'
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
import TravelService from '@/services/TravelService'
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
      formModal: null,
      photoModal: null,
      allContent: null,
      hasContent: false,
      showingContent: false,
      isPhoto: false,
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
      rows: [],
      fields: [
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '160px' } },
        { key: 'formName', label: 'Formulario', sortable: false, visible: true },
        { key: 'state', label: 'Estado', sortable: false, visible: true, thStyle: { width: '130px' } },
        /* { key: 'currentApprovedStep', label: 'Nivel', sortable: false, visible: true }, */
        { key: 'admin.dateGenerated', label: 'Grupo Fecha', sortable: false, visible: true, thStyle: { width: '170px' } },
        { key: 'createdAt', label: 'Creación Formulario', sortable: false, visible: true, thStyle: { width: '170px' } },
        { key: 'sede.description', label: 'Sede', sortable: false, visible: true, thStyle: { width: '80px' } },        
        { key: 'userRegister.fullname', label: 'Registrado Por', sortable: false, visible: true, thStyle: { width: '300px' } },
        { key: 'errorMsg', label: 'Motivo Rechazo', sortable: false, visible: true, thStyle: { width: '300px' } },

        /* { key: 'userRegister.fullname', label: 'Registro por', sortable: true, visible: true, thStyle: { width: '160px' } }, */
      ],
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
      sede: null,
      sedes: [],
      project_id: JSON.parse(localStorage.getItem('project_id')),
      name: '',
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
      description: '',
      startDate: null,
      endDate: null,
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      isAdd: false,
      selectedRecords: {
        arrayId: []
      },
      props: [],
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
    this.getSelect()
    this.getEnterprise()

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

    onRowSelectedOrder(items) {
     
      this.selectedRecords.arrayId = items
     
    },
    selectAll(val) {
     
      if (val) {
     
        this.$refs.selectableTable.selectAllRows()
      } else {
        this.$refs.selectableTable.clearSelected()
      }
      //
    },
    /* validDate(fecha) {
      fecha = new Date(fecha)
      if (fecha != null) {
        const year = new Date(fecha).getFullYear()
        if (year <= 1970) {
          return ''
        }
        return moment(fecha, 'yyyy-MM-DD HH:mm').utc(fecha).format('yyyy-MM-DD HH:mm')
      }
      return ''
    }, */
    validDate(fecha) {
      fecha = new Date(fecha);
      if (!isNaN(fecha.getTime())) {
        // Sumar 5 horas a la fecha
        fecha.setHours(fecha.getHours() + 5);
        return moment(fecha).format('DD-MM-YYYY HH:mm');
      }
      return '';

    },
    filter() {
      this.arrayFilters = []
      
      console.log("project_id", this.project_id)
      
      
      
     
      this.getAllData()
    },
    showFlow(index){
      console.log("MOSTRAR FLUJO")
      this.props = this.records[index].approvalFlow
      this.hasContent = this.records[index].content ? true : false
      this.allContent = this.records[index].allPhotos

      this.$refs['modal-comment'].show()
      console.log("props", this.props)
    },
    validDateForm(fecha) {
      fecha = new Date(fecha);
      if (!isNaN(fecha.getTime())) {
        // Sumar 5 horas a la fecha
        return moment(fecha).format('DD-MM-YYYY HH:mm');
      }
      return '';
    },
    showContent(groupIndex){
      this.showingContent = true
      if(this.allContent[groupIndex].photo){
        this.photoModal = this.allContent[groupIndex].photo
        this.isPhoto = true
        console.log("MODAL FOTO",this.photoModal)
      }else{
        this.formModal = this.allContent[groupIndex]
        this.isPhoto = false
        this.allContent[0][0].content[4].value = this.validDateForm(this.allContent[0][0].content[4].value)
        console.log("ALL CONTENT", this.allContent)
        console.log("MODAL DECLARACIÓN",this.formModal)
      }
      console.log("CONTENIDO", this.allContent, groupIndex)
    },
    goBack(){
      this.showingContent = false
    },
    async getEnterprise(){
        const arrayFilters = []
        if (this.project_id != null && this.project_id != '') {
            arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
        }
        const url =
        `?limit=10000&order=asc&sort=description&filter=` +
        JSON.stringify(arrayFilters)
        const respSedes = await SedeService.getEnterprise(url, this.$store)
        console.log("URL sedes", url)
        if (respSedes.status) {
            this.sedes = respSedes.data.rows
            console.log("SEDES AAA",this.sedes)
        }
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
      this.showingContent = false
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
      const url2 = `?limit=10000&page=${this.currentPage}&order=asc&sort=code`
      const respProyectos = await EnterpriseService.getEnterprise(url2, this.$store)
     
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
    async getAllData() {
      this.showLoading = true;
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      console.log("url,", url)
      let adminId = this.$route.params.id

      const resp = await OperateService.getFormsForProject(this.project_id, adminId, this.$store)
      console.log("resp RECORD FORMS ID", resp)

      if (resp.status) {
        this.allData = resp.data;
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
@import './ModalTimeline.styles.scss';
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
