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
    
    <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col lg="3" class="col-xxl d-flex flex-column flex-lg-row justify-content-start">
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
                    @input="getSelect()"
                    class="select-obra"
                    :disabled="user_role != 'superadmin'"
                    
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
            </b-col>
            <b-col lg="3" class="col-xxl">
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
            </b-col>
            <b-col lg="3" class="col-xxl">
              <b-form-group label="Actividad" label-for="type" class="mr-2">
                <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="tipos"
                  input-id="type"
                  placeholder="Tipo"
                  v-model="type"
                  @input="filter()"
                  class="select-obra"
                >
                </v-select>
              </b-form-group>
            </b-col>
            <b-col lg="3" class="col-xxl">        
              <b-form-group label="Código" label-for="code" class="mr-2">
                <b-form-input
                  type="text"
                  label="code"
                  id="code"
                  placeholder="Código"
                  v-model="code"
                  @input="filter()"
                  class="select-obra"
                  autocomplete="off"
                >
                </b-form-input>
              </b-form-group>
            </b-col>    
            <b-col lg="3" class="col-xxl">        
              <b-form-group label="Piloto" label-for="pilot_id" class="mr-2">
                <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="pilotos"
                  label="fullname"
                  input-id="pilot_id"
                  :reduce="(pilotos) => pilotos.id"
                  placeholder="Piloto"
                  v-model="pilot_id"
                  @input="filter()"
                  class="select-obra"
                >
                </v-select>
              </b-form-group>
            </b-col>
            <b-col lg="3" class="col-xxl">
              <b-form-group label="Fecha Rango Inicio" label-for="dateInit" class="mr-2">
                <flat-pickr
                  id="dateInit"
                  v-model="dateInit"
                  class="form-control"
                  :config="configDateInit"
                  @on-change="filter()"
                  @on-close="close()"
                />
              </b-form-group>
            </b-col>
            <b-col lg="3" class="col-xxl">
              <b-form-group label="Fecha Rango Fin" label-for="dateEnd" class="mr-2">
                <flat-pickr
                  id="dateEnd"
                  v-model="dateEnd"
                  class="form-control"
                  :config="configDateInit"
                  @on-change="filter()"
                  @on-close="close()"
                />
              </b-form-group>
            </b-col>
              
            <b-col md="12" lg="12" class="d-flex" >
              <div
                  class="d-flex flex-column flex-lg-row align-items-center h-100 w-100 justify-content-center mb-1 mb-lg-0 mt-02"
                >
                <div class="d-flex ">
                  <b-button
                    class="mr-2"
                    variant="primary"
                    @click="exportDetailCrono(project_id)"
                  >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Exportar Reporte</span>
                  </b-button>
                </div>

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
              <b-button
                  size="sm"
                  class=""
                  @click.prevent="changeForms(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Ver Formularios'"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="EditIcon" />
              </b-button>
              <b-button
                  size="sm"
                  class=""
                  @click.prevent="reactivateActivity(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Reactivar'"
                  v-if="data.item.state == 2 && data.item.formApprovQty < data.item.formAssignedQty"
                  variant="flat-success"
                >
                <feather-icon size="20" icon="EyeIcon" />
              </b-button>
              
            </template>
            <template #cell(dateInit)="data">
              <span>{{ validDate(data.item.dateInit) }}</span>
            </template>
            <template #cell(dateEnd)="data">
              <span>{{ validDate(data.item.dateEnd) }}</span>
            </template>
            <template #cell(state)="data">
              <span v-if="data.item.state == 0">No iniciado</span>
              <span v-if="data.item.state == 1">En proceso</span>
              <span v-if="data.item.state == 2">Finalizado</span>
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
        id="modal-agregar-cronograma"
        ref="modal-agregar-cronograma"
        centered
        title='Agregar Tareas Programadas'
        ok-only
        hide-footer
        size="lg"
        no-close-on-backdrop
        @hide="resetForm"
      >
      <validation-observer #default="{ invalid }" ref="refFormObserver">
      <b-form class="p-1">
        <form-wizard
        ref="wizard"
        color="#7367F0"
        :title="null"
        :subtitle="null"
        next-button-text="Siguiente"
        back-button-text="Atrás"
        finish-button-text="Finalizar"
        class="steps-transparent mb-3"
        @on-complete="saveData"
        >
        <!-- Step 1 -->
        <tab-content title="Definicion." icon="feather icon-folder" :before-change="beforeTabChange">
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
              </tab-content>
              
              <!-- Step 2 -->
              <tab-content title="Formularios" icon="feather icon-file-text">
                <validation-provider #default="{ errors }" name="type" rules="">
                  <b-form-group label="Tipo" label-for="type">
                    <div class="d-flex w-50 align-items-center mt-1 ml-1">
                      <span class="mr-2">Interno</span>
                      <b-form-checkbox v-model="items.type" name="type" switch @change="changeCheckboxsSelected">                       
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
              <validation-provider #default="{ errors }" name="formularios" rules="">
                <b-form-group label="Formularios" label-for="formularios">
                  <b-form-checkbox-group
                  id="formularios"
                  v-model="items.formsId"
                  :options="forms"
                  value-field="form.id"
                  text-field="form.name"
                  ></b-form-checkbox-group>
                </b-form-group>
              </validation-provider>
                
            </tab-content>
            
          </form-wizard>
        </b-form>
      </validation-observer>
      </b-modal>
      <b-modal
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
                  <b-form-checkbox v-model="items.type" name="type" switch @change="changeCheckboxsSelected">                       
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
                  v-model="items.formsId"
                  :options="forms"
                  value-field="form.id"
                  text-field="form.name"
                ></b-form-checkbox-group>
              </b-form-group>
            </validation-provider>
          </validation-observer>
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="items.formsId.length == 0"
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
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import TravelService from '@/services/TravelService'
import ActivityService from '@/services/ActivityService'
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
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'

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
      configDateInit: {
        dateFormat: "Y-m-d",
        plugins: [
          ShortcutButtonsPlugin({
            theme: 'dark',
            button: [{ label: 'Hoy' }],
            onClick(index, fp) {
              let date = index ? new Date(Date.now() + 24 * index * 60 * 60 * 1000) : new Date()
              fp.setDate(date)
              fp.close()
              fp.clear()
            }
          }),
          ShortcutButtonsPlugin({
            theme: 'dark',
            button: [{ label: 'Limpiar' }],
            onClick(index, fp) {
              console.log("FPP",fp)
              console.log("index",index)
              fp.setDate(null)
              fp.close()
              fp.clear()
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
      dateInit: null,
      dateEnd: null,
      items: {
        code: null,
        plate: null,
        dateInit: null,
        dateEnd: null,
        type: false,
        primaryPilotId: null,
        secondaryPilotId: null,
        formsId: []
      }, // Your form data
      consultas: [], // Your options for consultas select
      optionsWithAll: [], // Your options for users select
      addEnd: false, // Flag to show/hide date_end field
      fields: [
        { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '140px' } },
        { key: 'code', label: 'Código', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'sede.description', label: 'Sede', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'type', label: 'Tipo', sortable: false, visible: true, thStyle: { width: '170px' } },        
        { key: 'plate', label: 'Codigo de Unidad', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'userRegister.fullname', label: 'Registrado Por', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'dateInit', label: 'Fecha Inicio', sortable: false, visible: true, thStyle: { width: '190px' } },
        { key: 'dateEnd', label: 'Fecha Fin', sortable: false, visible: true, thStyle: { width: '190px' } },        
        { key: 'formAssignedQty', label: 'N° Form. Asignados', sortable: true, visible: true, thStyle: { width: '140px' } },
        { key: 'formProgressQty', label: 'N° Form. Progreso', sortable: true, visible: true, thStyle: { width: '140px' } },
        { key: 'formApprovQty', label: 'N° Form. Aprobados', sortable: true, visible: true, thStyle: { width: '145px' } },
        { key: 'route', label: 'Descripción', sortable: true, visible: true, thStyle: { width: '220px' } },
        { key: 'stopQty', label: 'N° Paradas', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'primaryPilot.fullname', label: 'Piloto 1', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'secondaryPilot.fullname', label: 'Piloto 2', sortable: true, visible: true, thStyle: { width: '160px' } },
        { key: 'state', label: 'Estado', sortable: false, visible: true, thStyle: { width: '155px' } },
      ],
      form: {
        code: null,
        plate: null,
        dateInit: null,
        dateEnd: null,
        type: null,
        sedeId: null,
        stopQty: null,
        primaryPilotId: null,
        secondaryPilotId: null,
        formsId: []
      },
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
      code: '',
      sede: null,
      type: null,
      pilot_id: null,
      restriction_id: null,
      records: [],
      tipos: [
      'Abastecimiento de combustible', 'Mantenimiento de la unidad','Prueba en ruta','Viaje en vacío',  
      ],
      sedes: [],
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
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
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
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleWindowScroll);
    window.removeEventListener("resize", this.fixedElements);
  },
  methods: {
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
    async getSedes(){
        const arrayFilters = []
        this.items.sedeId = null
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
            console.log("SEDES",this.sedes)
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

    async exportDetailCrono(id){
      if (id != null) {
          this.showLoading = true
          const url =
          `?filter=` +
          JSON.stringify(this.arrayFilters)
          console.log("URL EXPORTAR",url)
          // const resp = await RestrictionsService.exportExcel(id,this.$store)
          // console.log('resp',resp)
          var fileLink = document.createElement('a')
          fileLink.href = this.apiurl + '/activity/detail/download/' + id + url
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
      console.log('AFTER this.items.formsId', this.items.formsId)
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
    addCrono(id){

      this.$router.push('/cronograma/registro/' + id)
      
      /* this.isAdd = true
      this.$refs.cronoAdd.setData({})
      this.$refs.cronoAdd.getData(this.project_id) */


      /* this.$refs['modal-agregar-cronograma'].show() */

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
        code: null,
        dateInit: null,
        dateEnd: null,
        type: false,
        primaryPilotId: null,
        secondaryPilotId: null,
        formsId: []
      }
    },

    async reactivateActivity(item) {
      console.log('item', item)
      this.$swal({
        title: '¿Desea reactivar este cronograma?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, reactivar',
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
            title: 'Reactivado!',
            text: 'El cronograma ha sido reactivado.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          this.reactivateData(item.id)
        }
      })
    },

    async reactivateData(id) {
      console.log('id del cronograma', id)
      const resp = await ActivityService.reactivateAllActivity(id, this.$store)
      console.log('resp reactivar',resp)
      if (resp) {
        this.getAllData()
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al reactivar el cronograma.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
      console.log('respDelete', resp)
    },
    
    edit(item) {
      console.log('item', item)
      this.form.id = item.id
      this.form.code = item.code
      this.form.plate = item.plate
      this.form.dateInit = item.dateInit
      this.form.dateEnd = item.dateEnd
      this.form.primaryPilotId = item.primaryPilot
      this.form.secondaryPilotId = item.secondaryPilot
      this.form.type = item.type
      this.form.sedeId = item.sede.id
      this.form.stopQty = item.stopQty
      console.log('this.form', this.form)
      this.$refs.cronoAdd.getData()
      this.$refs.cronoAdd.setData(this.form)
    },
    changeForms(item){

      this.$router.push('/registros-actividad/aprobar/' + item.id)


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
        return moment(fecha).format('DD-MM-YYYY HH:mm');
      }
      return '';

    },
    close(){
      console.log("close")
    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      if(this.project_id != null && this.project_id != ''){
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
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
      if(this.dateInit != null && this.dateInit != ''){
        const startOfDay = new Date(this.dateInit);
        const endOfDay = new Date(this.dateInit);
        
        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'dateInit', key: 'gte', value: startOfDay });
      }
      if(this.dateEnd != null && this.dateEnd != ''){
        const startOfDay = new Date(this.dateEnd);
        const endOfDay = new Date(this.dateEnd);
        
        // Sumar un día al endOfDay para abarcar todo el día actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        this.arrayFilters.push({ keyContains: 'dateInit', key: 'lte', value: endOfDay });
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
      const respProyectos = await ProjectsService.getProyectos(url2, this.$store)
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
        console.log("HOLA")
      console.log('URL', url)
      const resp = await ActivityService.getRecords(url, this.$store)
    
      console.log('resp RECORDS', resp)
      if (resp.status) {
        this.allData = resp.data.activities;
        let filteredData

        if (this.pilot_id != null && this.pilot_id != '') {
          console.log("FILTRANDO PILOTO", this.pilot_id)
          filteredData = this.allData.filter(item => {
            if (item.primaryPilot && item.primaryPilot.id) {
                return item.primaryPilot.id === this.pilot_id;
            }
            if (item.secondaryPilot && item.secondaryPilot.id) {
                return item.secondaryPilot.id === this.pilot_id;
            }
            // Si ninguno de los pilotos existe o tiene un id, retorna false para filtrar el elemento
            return false;
          });
          console.log("FILTRADO", filteredData)
          this.records = filteredData;
        }else{
          this.records = this.allData
          this.getSortedData("id", 'desc')
          console.log("1", this.records)
          if(this.allDataSorted.length > 0)
          {
            this.records = this.allDataSorted[0]
          }else{
            this.records = []
          }
          console.log("2", this.records)

        }
        this.totalElements = this.allData.length
      }
      /* this.getSortedData("id", 'desc')
  
      this.records = this.allDataSorted[0] */
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
