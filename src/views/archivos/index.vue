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
          ref="groupAdd"
        >
      </add-edit>
      <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
        <b-card ref="filterContent" no-body class="sticky">
          <b-card-body>
            <b-row>
              <b-col md="4" lg="2" class="d-flex flex-column flex-lg-row justify-content-start">
                <div class="w-100">
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
                </div>   
              </b-col> 
              <!-- Nuevo filtro de DNI -->
              <b-col md="4" lg="2" class="d-flex flex-column flex-lg-row justify-content-start">
                <div class="w-100">
                  <b-form-group label="DNI" label-for="dni" class="mr-2">
                    <b-form-input
                      type="text"
                      id="dni"
                      placeholder="DNI"
                      v-model="dniFilter"
                      @input="filter()"
                      autocomplete="off"
                    />
                  </b-form-group>
                </div>   
              </b-col>
            
              <!-- Nuevo filtro de Descripción -->
              <b-col md="4" lg="2" class="d-flex flex-column flex-lg-row justify-content-start">
                <div class="w-100">
                  <b-form-group label="Descripción" label-for="description" class="mr-2">
                    <b-form-input
                      type="text"
                      id="description"
                      placeholder="Descripción"
                      v-model="descriptionFilter"
                      @input="filter()"
                      autocomplete="off"
                    />
                  </b-form-group>
                </div>   
              </b-col>
            
              <!-- Nuevo filtro de Tipo de Archivo (dropdown) -->
              <b-col md="4" lg="2" class="d-flex flex-column flex-lg-row justify-content-start">
                <div class="w-100">
                  <b-form-group label="Tipo de Archivo" label-for="fileType" class="mr-2">
                    <v-select
                      v-model="fileTypeFilter"
                      :options="fileTypeOptions"
                      label="text"
                      :reduce="option => option.value"
                      placeholder="Seleccione tipo"
                      @input="filter()"
                    />
                  </b-form-group>
                </div>   
              </b-col>
              
              <b-col md="6" lg="2" class="d-flex">              
                <div
                  class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                >
               
                <b-button
                    class="mr-2"
                    variant="primary"
                    :disabled="!rolesAllowed.includes(user_role)"
                    @click="addSede()"
                  >
                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                  </b-button>
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
                    size="sm"
                    class=""
                    @click.prevent="edit(data.item)"
                    :disabled="!rolesAllowed.includes(user_role)"
                    v-b-tooltip.noninteractive.hover.left="'Editar'"
                    variant="flat-success"
                  >
                  <feather-icon size="20" icon="Edit2Icon" />
                </b-button>
                <b-button
                    size="sm"
                    class=""
                    :disabled="!rolesAllowed.includes(user_role)"
                    v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                    @click="deleteAction(data.item)"
                    variant="flat-danger"
                  >
                  <feather-icon size="20" icon="XIcon" />
                </b-button>
              </template>
              <template #cell(dateInit)="data">
                <span>{{ validDate(data.item.dateInit) }}</span>
              </template>
              <template #cell(dateEnd)="data">
                <span>{{ validDate(data.item.dateEnd) }}</span>
              </template>
              <template #cell(user.isActive)="data">
                <span>{{ data.item.user.isActive === 1 ? 'Activo' : 'Inactivo' }}</span>
              </template>
              <template #cell(color)="data">
                <div 
                  v-if="data.item.color" 
                  :style="{
                    'background-color': data.item.color,
                    width: '24px',
                    height: '24px',
                    border: '1px solid #ddd',
                    'border-radius': '3px',
                  }"
                  :title="data.item.color"
                ></div>
                <span v-else>-</span>
              </template>
              <template #cell(url_file)="data">
                <div v-if="data.item.url_file">
                  <b-button
                    variant="link"
                    @click="downloadFile(data.item)"
                    v-b-tooltip.hover.top="'Descargar archivo'"
                    class="p-0"
                  >
                    <feather-icon icon="DownloadIcon" size="18" class="text-primary" />
                  </b-button>
                </div>
                <span v-else>-</span>
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
        <b-modal size="xl" v-model="modalOpen" @close="closeModal" centered  hide-footer>
          <div class="w-100">
            <b-overlay
            variant="white"
            :show="showLoading2"
            spinner-variant="primary"
            blur="0"
            opacity=".75"
            rounded="sm"
            >
              <b-card>
                  <b-table v-if="recordsModal.length > 0" :items="recordsModal" :fields="fieldsModal"/>
                  <p style="text-align: center" v-else>No hay integrantes en este grupo</p>
              </b-card>
            </b-overlay>
          </div>
        </b-modal>
      </b-overlay>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import SedeService from '@/services/SedeService'
  import GroupService from '@/services/GroupService'
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
  import addEdit from './add-edit.vue'
  import DisciplineService from '@/services/DisciplineService'
  import FileTypeService from '@/services/FileTypeService'
  import FileService from '@/services/FilesService'
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
       
  
        fields: [
          { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '50px' } },
          { key: 'user.fullname', label: 'Usuario', sortable: false, visible: true, thStyle: { width: '160px' } },
          { key: 'user.email', label: 'Correo', sortable: false, visible: true, thStyle: { width: '160px' } },
          { key: 'user.isActive', label: 'Estado', sortable: false, visible: true, thStyle: { width: '80px' } },
          { key: 'user.document', label: 'DNI', sortable: false, visible: true, thStyle: { width: '80px' } },
          { key: 'user.email', label: 'Correo', sortable: false, visible: true, thStyle: { width: '160px' } },
          { key: 'filetype.name', label: 'Tipo de Archivo', sortable: false, visible: true, thStyle: { width: '160px' } },
          { key: 'description', label: 'Descripcion', sortable: false, visible: true, thStyle: { width: '160px' } },  
          { 
            key: 'url_file', 
            label: 'Archivo', 
            sortable: false, 
            visible: true, 
            thStyle: { width: '100px' },
            formatter: (value) => {
              return value ? value : '-';
            }
          },  

        ],
        fieldsModal: [
  
          { key: 'name', label: 'Nombre', sortable: true },
  
        ],
        form: {
            projectId: null,
            name: '',
          },
        
        project_id: JSON.parse(localStorage.getItem('project_id')),
        name: '',
        //code: '',
        records: [],
        recordsModal: [],
        modalOpen: false,
        showLoading2: false,
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
        id: 0,
        sedes: [],
        sede: null,
        sort: 'id',
        order: 'desc',
        userData: JSON.parse(localStorage.getItem('userData')),
        user_role: JSON.parse(localStorage.getItem('userData')).role.description,
        rolesAllowed: ['administrador', 'gestor'],
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
        fileTypeFilter: null,
        dniFilter: '',
        descriptionFilter: '',
        fileTypeOptions: [], // Para las opciones del dropdown de tipo de archivo
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
      this.filter()
      this.getSelect()
      this.loadFileTypeOptions()
      //this.getEnterprise()
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
        async loadFileTypeOptions() {
      try {
        const resp = await FileTypeService.getFileType('?limit=10000', this.$store);
        if (resp.status) {
          this.fileTypeOptions = resp.data.rows.map(item => ({
            value: item.id,
            text: item.name
          }));
        }
      } catch (error) {
        console.error('Error loading file types:', error);
      }
    },
      async downloadFile(item) {
        const fileId = item.id;
        window.open(`${APIURL}/file/download/${fileId}`, '_blank');
      },
      async changeStatus1(item) {
        console.log("cambio estado")
        try {
          this.showLoading = true;

          // Guarda el estado anterior para revertir en caso de error
          const previousStatus = item.isActive;

          // Construye el objeto de actualización correctamente
          const updateData = {
            isActive: item.isActive ? 1 : 0, // Asegúrate de que sea 1/0 (o true/false según el backend)
          };

          // Llama al servicio de actualización
          const resp = await FileService.updateFile(item.id, updateData, this.$store);

          if (resp.status) {
            this.$swal({
              icon: 'success',
              title: '¡Éxito!',
              text: 'El estado ha sido actualizado correctamente',
              customClass: { confirmButton: 'btn btn-success' },
            });
            // No necesitas llamar a getAllData() si solo cambias el estado
            // item.isActive ya está actualizado por el v-model
          } else {
            // Revierte el cambio si falla
            item.isActive = previousStatus;
            this.$swal({
              icon: 'error',
              title: 'Error',
              text: resp.data.message || 'No se pudo actualizar el estado',
              customClass: { confirmButton: 'btn btn-success' },
            });
          }
        } catch (error) {
          console.error('Error al cambiar estado:', error);
          // Revierte el cambio si hay un error
          item.isActive = !item.isActive;
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al cambiar el estado',
            customClass: { confirmButton: 'btn btn-success' },
          });
        } finally {
          this.showLoading = false;
        }
      },
      fixedElements() {
        if (!this.trs || this.trs.length === 0) {
          
          return;
        }
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
      async searchMembers(item){
        console.log('Buscando grupo', item)
        const respGroup = await GroupService.getUsersById(item.id, this.$store)
        console.log('RESP GROUP', respGroup)
        if(respGroup.status){
          this.recordsModal = respGroup.data.group.users
        }
        else{
          this.recordsModal = []
        }
      },    
      openModal(item) {
        
        this.searchMembers(item)
        this.modalOpen = true;
  
      },
      closeModal() {
        this.modalOpen = false;
        this.recordsModal = []
      },
  
      onRowSelectedOrder(items) {
       
        this.selectedRecords.arrayId = items
       
      },
      addSede(){
        this.isAdd = true
        this.form.projectId = this.project_id
        this.$refs.groupAdd.setData()
      },
      edit(item) {
          console.log('item', item)
          this.form.id = item.id
          this.form.name = item.name
          this.form.description = item.description
          this.form.filetypeId = item.filetype.id
          this.form.userId = item.user.id
          console.log('this.form', this.form)
          this.isAdd = true
          this.$refs.groupAdd.setData(this.form)
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
      async deleteAction(data){
        //DELETE USER
        this.$swal({
          title: '¿Desea eliminar esta sede?',
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
              text: 'La sede ha sido eliminada.',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            this.deleteData(data.id)
          }
        })
      },
      async deleteData(id) {
        console.log('id del usuario', id)
        const resp = await FileService.deleteFile(id, this.$store)
        console.log('resp delete',resp)
        if (resp) {
          this.getAllData()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar el usuario.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
        }
        console.log('respDelete', resp)
      },
      filter() {
        this.arrayFilters = []
        console.log("FILTROS")
        
        
        if (this.name != null && this.name != '') {
          this.arrayFilters.push({ keyContains: 'user.fullname', key: 'contains', value: this.name })
        }
        if (this.dniFilter != null && this.dniFilter != '') {
          this.arrayFilters.push({ keyContains: 'user.document', key: 'contains', value: this.dniFilter });
        }

        if (this.descriptionFilter != null && this.descriptionFilter != '') {
          this.arrayFilters.push({ keyContains: 'description', key: 'contains', value: this.descriptionFilter });
        }

        if (this.fileTypeFilter != null && this.fileTypeFilter != '') {
          this.arrayFilters.push({ keyContains: 'filetype.id', key: 'equals', value: this.fileTypeFilter });
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
        /* const url2 = `?limit=100000&page=${this.currentPage}&order=asc&sort=code`
        const respProyectos = await EnterpriseService.getEnterprise(url2, this.$store)
        console.log("HLA")
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
        } */
      },
      async getEnterprise(){
          const arrayFilters = []
          this.sede = null
          if (this.project_id != null && this.project_id != '') {
              arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.project_id })
          }
          const url =
          `?limit=10000&order=asc&sort=description&filter=` +
          JSON.stringify(arrayFilters)
         /*  const respSedes = await SedeService.getEnterprise(url, this.$store)
          console.log("URL sedes", url)
          if (respSedes.status) {
              this.sedes = respSedes.data.rows
              console.log("SEDES AAA",this.sedes)
          } */
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
        const resp = await FileService.getFiles(url, this.$store);
      
        console.log('resp riesgos', resp)
        if (resp.status) {
          this.allData = resp.data.rows;
          this.records = this.allData;
          this.totalElements = resp.data.responseFilter.total_rows
         if(this.allData.length > 0){
  
           this.getSortedData("id", 'asc')
           
           this.records = this.allDataSorted[0]
          }
        }
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
  </style>
  