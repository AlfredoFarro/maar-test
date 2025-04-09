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
            <b-col md="12" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
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
              <!-- <div class="w-100">
                <b-form-group label="Nombre" label-for="name" class="mr-2">
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
                  class="mr-2"
                  variant="primary"
                  @click="addCrono()"
                >
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                </b-button>
              </div>
            </b-col> -->
            <!-- <b-form-group label="Cambiar Tipo" label-for="status" class="mr-2">
              <div style="display: flex; flex-direction: row;">
                <div
                  class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                >
                  <b-button
                      class="mr-2"
                      variant="primary"
                      :disabled="selected.length == 0"
                      @click="convertToExtern()"
                    >
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Externo </span>
                </b-button>
                </div>
                <div
                  class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                >
                  <b-button
                      class="mr-2"
                      :disabled="selected.length == 0"
                      variant="primary"
                      @click="convertToIntern()"
                    >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Interno </span>
                  </b-button>
                </div>
                <div
                  class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                >
                <b-button
                    class="mr-2"
                    variant="primary"
                    :disabled="selected.length == 0"
                    @click="convertToNull()"
                  >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Sin Tipo </span>
                  </b-button>
                </div>
              </div>

            </b-form-group> -->
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
      <!-- <b-card no-body ref="tableCard">
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
            selectable
            @row-selected="handleRowSelection"               
            @sort-changed="sortChanged"
          >
        
            <template #cell(row)="data">
              <div style="width: 0px !important">
                <b-form-checkbox  :checked="selectedRecords.arrayId.includes(data.item)" />
              </div>
            </template>
            
            
            <template #cell(type)="data">
              <span v-if="data.item.type=='Externo'">Externo</span>
              <span v-if="data.item.type=='Interno'">Interno</span>
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
      </b-card> -->

      <!--DRAGGABLE COLUMNS -->
      <b-card class="">
        <div class="d-flex">
          <b-col md="4">
            <h5 class="mb-1">FORMULARIOS</h5>
            <drop-list
              :items="records"
              class="list1 d-flex flex-column"
              mode="cut"
              @insert="onInsertNullFilters"
              @reorder="$event.apply(records)"
            >
              <template v-slot:item="{ item }">
                <drag
                  class="item rounded-lg bg-light border border-light-emphasis"
                  :key="item.id"
                  :data="item"
                  @cut="remove(records, item)"
                >
                  {{ item.name }}
                </drag>
              </template>
              <template v-slot:feedback="{ data }">
                <div
                  class="item feedback rounded-lg"
                  :key="data.id"
                >
                  {{ data.name }}
                </div>
              </template>
            </drop-list>
          </b-col>
          <b-col md="4">
            <h5 class="mb-1">Externo</h5>
            <drop-list
              :items="externColumns"
              class="list1 d-flex flex-column"
              mode="cut"
              @insert="onInsertExternFilters"
              @reorder="$event.apply(externColumns)"
            >
              <template v-slot:item="{ item }">
                <drag
                  class="item"
                  :key="item.id"
                  :data="item"
                  @cut="remove(externColumns, item)"
                >
                  {{ item.name }}
                </drag>
              </template>
              <template v-slot:feedback="{ data }">
                <div
                  class="item feedback rounded-lg"
                  :key="data.id"
                >
                  {{ data.name }}
                </div>
              </template>
            </drop-list>
          </b-col>
          <b-col md="4">
            <h5 class="mb-1">Interno</h5>
            <drop-list
              :items="internColumns"
              class="list1 d-flex flex-column"
              mode="cut"
              @insert="onInsertInternFilters"
              @reorder="$event.apply(internColumns)"
            >
              <template v-slot:item="{ item }">
                <drag
                  class="item"
                  :key="item.id"
                  :data="item"
                  @cut="remove(internColumns, item)"
                >
                  {{ item.name }}
                </drag>
              </template>
              <template v-slot:feedback="{ data }">
                <div
                  class="item feedback rounded-lg"
                  :key="data.id"
                >
                  {{ data.name }}
                </div>
              </template>
            </drop-list>
          </b-col>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import FormService from '@/services/FormService'
import ProjectsService from '@/services/ProjectsService'
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
import { Drag, Drop, DropList } from 'vue-easy-dnd'
import { forEach } from 'postcss-rtl/lib/affected-props'
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
        { key: 'name', label: 'Nombre', sortable: false, visible: true, thStyle: { width: '155px' } },
        { key: 'lvl', label: 'Nivel', sortable: false, visible: true, thStyle: { width: '20px' } },
        { key: 'tableNameContent', label: 'Nombre Contenido Tabla', sortable: false, visible: true, thStyle: { width: '150px' } },        
        /* { key: 'form.isPhoto', label: 'Es Foto?', sortable: false, visible: true, thStyle: { width: '150px' } },         */
        /* { key: 'project.description', label: 'Proyecto', sortable: true, visible: true, thStyle: { width: '160px' } }, */
        /* { key: 'type', label: 'Tipo', sortable: true, visible: true, thStyle: { width: '80px' } }, */
        /* { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '300px' } } */
      ],
      form: {
          name: '',
          lvl: null,
          tableNameContent: null,
          project: null
        },
      project_id: JSON.parse(localStorage.getItem('project_id')),
      restriction_id: null,
      records: [],
      externColumns: [],
      internColumns: [],
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
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      isAdd: false,
      selectedRecords: {
        arrayId: []
      },
      allData: [],
      selected: [],
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
    Drag,
    DropList,
    Drop,
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
    this.getAllData()
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
    async onInsertNullFilters(event) {
        const { data, index } = event
        let newItem = { ...data, visible: true }
        this.records.splice(index, 0, newItem)
        console.log("NEW ITEM", newItem)
        console.log("DATA", data)
        console.log("VISIBLE",this.records)
        let newObject = {
          type: null,
          forms: [newItem.id],
          projectId: this.project_id
        }
        console.log('newObject', newObject)
        let resp = await FormService.createProjectForms(newObject, this.$store)
        console.log('resp', resp)
    },
    async onInsertExternFilters(event) {
        const { data, index } = event
        let newItem = { ...data, visible: true }
        this.externColumns.splice(index, 0, newItem)
        console.log("VISIBLE",this.externColumns)
        let newObject = {
          type: 'Externo',
          forms: [newItem.id],
          projectId: this.project_id
        }
        console.log('newObject', newObject)
        let resp = await FormService.createProjectForms(newObject, this.$store)
        console.log('resp', resp)
    },
    async onInsertInternFilters(event) {
        const { data, index } = event
        let newItem = { ...data, visible: true }
        this.internColumns.splice(index, 0, newItem)
        console.log("VISIBLE",this.internColumns)
        let newObject = {
          type: 'Interno',
          forms: [newItem.id],
          projectId: this.project_id
        }
        console.log('newObject', newObject)
        let resp = await FormService.createProjectForms(newObject, this.$store)
        console.log('resp', resp)
    },
    remove(array, value) {
        let index = array.indexOf(value)
        array.splice(index, 1)
    },
    handleRowSelection(items){
      console.log("handleRowSelection")
      this.selected = items
      console.log("this.selected", this.selected)
    },
    convertToExtern(){
      this.$swal.fire({
        title: '¿Seguro que desea cambiar los formularios seleccionados a Externo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambialo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.value) {
          let newObject = {
            type: 'Externo',
            forms: this.selected.map(item => item.id),
            projectId: this.project_id
          }
          console.log('newObject', newObject)
          let resp = await FormService.createProjectForms(newObject, this.$store)
          console.log('resp', resp)
          if(resp.status){
            this.$swal({
                title: 'Actualizado',
                text: 'El tipo ha sido cambiado a Externo.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
            this.getAllData()
          }
        }
      });
    },
    convertToIntern(){
      this.$swal.fire({
        title: '¿Seguro que desea cambiar los formularios seleccionados a Interno?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambialo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.value) {
          let newObject = {
            type: 'Interno',
            forms: this.selected.map(item => item.id),
            projectId: this.project_id
          }
          console.log('newObject', newObject)
          let resp = await FormService.createProjectForms(newObject, this.$store)
          console.log('resp', resp)
          if(resp.status){
            this.$swal({
                title: 'Actualizado',
                text: 'El tipo ha sido cambiado a Interno.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
            this.getAllData()
          }
        }
      });
    },
    convertToNull(){
      this.$swal.fire({
        title: '¿Seguro que desea cambiar los formularios seleccionados a Sin Tipo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambialo',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.value) {
          let newObject = {
            type: null,
            forms: this.selected.map(item => item.id),
            projectId: this.project_id
          }
          console.log('newObject', newObject)
          let resp = await FormService.createProjectForms(newObject, this.$store)
          console.log('resp', resp)
          if(resp.status){
            this.$swal({
                title: 'Actualizado',
                text: 'El tipo ha sido cambiado a Sin Tipo.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
            this.getAllData()
          }
        }
      });
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
      async changeType(item){
        let type = {
          type: (item.type != 'Externo' || item.type == null) ? 'Externo' : 'Interno'
        }
        let resp = await FormService.updateProjectForm(item.id, type, this.$store)
        if(resp.status){
          this.$swal({
              title: 'Actualizado',
              text: 'El type ha sido cambiado a ' + ((item.type != 'Externo' || item.type == null) ? 'Externo.' : 'Interno.'),
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          this.getAllData()
        }

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
      fecha = new Date(fecha)
      if (fecha != null) {
        const year = new Date(fecha).getFullYear()
        if (year <= 1970) {
          return ''
        }
        return moment(fecha, 'yyyy-MM-DD HH:mm').utc(fecha).format('yyyy-MM-DD')
      }
      return ''
    },
    filter() {
      this.arrayFilters = []
      console.log("FILTROS")
      /* if(this.project_id != null && this.project_id != ''){
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
      } */
     
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
     
      /* this.getAllData() */
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
      const url2 = `?limit=100000&page=${this.currentPage}&order=${this.order}&sort=${this.sort}`
      const respProyectos = await ProjectsService.getProyectos(url2, this.$store)
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
    async getAllData() {
      console.log("LLAMADAAAAAAA")
      this.showLoading = true;
      if(this.project_id != null && this.project_id != ''){
        this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
      }
      const url =
        `?limit=10000&filter=` +
        JSON.stringify(this.arrayFilters)
      const respFormProjects = await FormService.getProjectForms(url, this.$store)
      console.log('resp FORMS PROJECTS', respFormProjects)
      const respForms = await FormService.getForms('', this.$store)
      console.log('resp FORMS', respForms)
      if(respFormProjects.data.rows.length > 0){
        respFormProjects.data.rows.forEach((item) => {
          if(item.type == 'Externo'){
            this.externColumns.push(item.form)
          }else if(item.type == 'Interno'){
            this.internColumns.push(item.form)
          }else{
            this.records.push(item)
          }
        })
        console.log('this.externColumns', this.externColumns)
        console.log('this.internColumns', this.internColumns)
        this.records = respForms.data.rows.filter(record => {
            return !this.externColumns.some(item => item.id == record.id) && !this.internColumns.some(item => item.id == record.id);
        });
        console.log('this.records', this.records)
        /* this.records = respFormProjects.data.rows */
      }else {
        this.allData = respForms.data.rows;
        this.records = this.allData;
        this.totalElements = respForms.data.responseFilter.total_rows
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
      if (this.name != null && this.name != '') {
        const searchTerm = this.name.toLowerCase();
        sortedData = sortedData.filter(item => item.form.name.toLowerCase().includes(searchTerm));      
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

.list1,
  .list2 {
    height: 100%;
    gap: 0.5rem;

    .item {
      border-radius: 0.5rem;
      border-style: solid;
      border-width: 1px;
      padding: 0.5rem;

      &.disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }

  .list1 {
    .item {
      background-color: #ecf7ff;
      border-color: #b4ddff;

      &.feedback {
        background-color: #f5fffa;
        border-style: dashed;
        border-color: #50bd87;
      }
    }
  }

  .list2 {
    .item {
      background-color: #ececec;
      border-color: #9e9e9e;

      &.feedback {
        background-color: #fff5f5;
        border-style: dashed;
        border-color: #f87171;
      }
    }
  }

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
