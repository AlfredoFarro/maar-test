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
        ref="sedeAdd"
      >
    </add-edit>
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="7" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100 mb-1 mb-lg-0 mt-02">
                <b-form-group label="Proyecto" label-for="project" class="mr-2">
                  <v-select
                    v-model="selectedProject"
                    :options="projectOptions"
                    :reduce="project => project.id"
                    label="name"
                    placeholder="Seleccione un proyecto"
                    @input="filter()"
                    :clearable="true"
                    class="select-obra"
                  >
                    <template v-slot:selected-option="option">
                      {{ option.name }} 
                    </template>
                    <template slot="option" slot-scope="option">
                      {{ option.name }} 
                    </template>
                  </v-select>
                </b-form-group>
              </div>
            </b-col>
            <b-col md="7" lg="4" class="d-flex flex-column flex-lg-row justify-content-start">
              <div class="w-100">
                <b-form-group label="DNI" label-for="dni" class="mr-2">
                  <b-form-input
                    v-model="dniFilter"
                    placeholder="Ingrese DNI"
                    @input="filter()"
                    class="select-obra"
                    autocomplete="off"
                  />
                
              </b-form-group>
              </div>   
            </b-col> 
            
            <b-col md="6" lg="2" class="d-flex">              
              <div
                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
              >
                <!-- <b-button
                  class="mr-2"
                  variant="primary"
                  @click="isAdd = true"
                >
                  <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                </b-button> -->
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
        <b-card no-body ref="tableCard">
          <div class="table-overflow">
            <b-table
              class="position-relative"
              empty-text="No existen registros con riesgos asociados"
              :fields="visibleFields"
              :hover="true"
              :items="records"
              no-border-collapse
              ref="selectableTable"            
              show-empty                     
              @sort-changed="sortChanged"
            >
              <!-- Columnas de la tabla -->
              <template #cell(number)="data">
                {{ (currentPage - 1) * showEntrie + data.index + 1 }}
              </template>
              
              <template #cell(project)="data">
                {{ data.item.project ? data.item.project.name : 'N/A' }}
              </template>
              
              <template #cell(user)="data">
                {{ data.item.worker_fullname || 'N/A' }}
              </template>
              
              <template #cell(date)="data">
                {{ formatDate(data.item.completed) }}
              </template>
              
              <template #cell(actions)="data">
                <b-button
                  size="sm"
                  @click.prevent="view(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Ver detalles'"
                  variant="flat-primary"
                  class="mr-1"
                >
                  <feather-icon size="20" icon="EyeIcon" />
                </b-button>
                <b-button
                  size="sm"
                  @click.prevent="edit(data.item)"
                  v-b-tooltip.noninteractive.hover.left="'Editar'"
                  variant="flat-success"
                >
                  <feather-icon size="20" icon="Edit2Icon" />
                </b-button>
                <b-button
                  size="sm"
                  v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                  @click="deleteAction(data.item)"
                  variant="flat-danger"
                >
                  <feather-icon size="20" icon="XIcon" />
                </b-button>
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
      </b-overlay>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import SedeService from '@/services/SedeService'
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
  import RegisterService from '@/services/RegisterService'
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
          { key: 'number', label: 'N°', sortable: false, visible: true, thStyle: { width: '50px' } },
          { key: 'project', label: 'Proyecto', sortable: false, visible: true, thStyle: { width: '200px' } },
          { key: 'user', label: 'Usuario', sortable: false, visible: true, thStyle: { width: '200px' } },
          { key: 'date', label: 'Fecha', sortable: false, visible: true, thStyle: { width: '150px' } },
          { key: 'actions', label: 'Acciones', visible: true, thStyle: { width: '120px' } }
        ],
        form: {
          id: null,
          proyecto: '',
          nombre: '',
          dni: '',
          fecha: new Date(),
          area: '',
          estado: '',
          categorias: '',
          riesgos: [], // array de objetos con id y name
          descripcion: '',
          medidas: '',
          isViewMode: false
        },
        dniFilter: '',
        selectedProject: null,
          enterprise_id: JSON.parse(localStorage.getItem('enterprise_id')),
        proyecto: '',
        dni: '',
        records: [],
        enterpriseSelect: '',
        projectOptions: [],
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
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm')
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
  
      onRowSelectedOrder(items) {
       
        this.selectedRecords.arrayId = items
       
      },
      addSede(){
        this.isAdd = true
        this.form.enterpriseId = this.enterprise_id
        this.$refs.sedeAdd.setData()
      },
      edit(item) {
        console.log('item', item)
        this.form.id = item.id;
        this.form.proyecto = item.project ? item.project.id : '';
        this.form.nombre = item.worker_fullname || '';
        this.form.dni = item.worker_id_number || '';
        this.form.fecha = item.completed ? new Date(item.completed) : new Date();
        this.form.area = item.area || '';
        this.form.estado = item.flag === 0 ? 'inseguro' : 'seguro';
        this.form.categorias = item.category ? item.category.id : '';
        this.form.riesgos = item.record_risk
          ? item.record_risk.map(r => ({
              id: r.risk.id,
              name: r.risk.name
            }))
          : [];
        this.form.descripcion = item.description || '';
        this.form.medidas = item.actions || item.corrective_measures || '';
        this.form.isViewMode = false;
        console.log('this.form', this.form)
        this.isAdd = true
        this.$refs.sedeAdd.setData(this.form)
      },
      view(item) {
        console.log('item', item)
        this.form.id = item.id;
        this.form.proyecto = item.project ? item.project.id : '';
        this.form.nombre = item.worker_fullname || '';
        this.form.dni = item.worker_id_number || '';
        this.form.fecha = item.completed ? new Date(item.completed) : new Date();
        this.form.area = item.area || '';
        this.form.estado = item.flag === 0 ? 'inseguro' : 'seguro';
        this.form.categorias = item.category ? item.category.id : '';
        this.form.riesgos = item.record_risk
          ? item.record_risk.map(r => ({
              id: r.risk.id,
              name: r.risk.name
            }))
          : [];
        this.form.descripcion = item.description || '';
        this.form.medidas = item.actions || item.corrective_measures || '';
        this.form.isViewMode = true;
        console.log('this.form', this.form)
        this.isAdd = true
        this.$refs.sedeAdd.setData(this.form)
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
        const resp = await RegisterService.deleteRecord(id, this.$store);
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
        
        if (this.selectedProject != null && this.selectedProject != '') {
          this.arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.selectedProject })
        }
        
        if (this.dniFilter != null && this.dniFilter != '') {
          this.arrayFilters.push({ keyContains: 'worker_id_number', key: 'contains', value: this.dniFilter })
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
        const url2 = `?limit=100000&page=${this.currentPage}&order=asc`
        const respEmpresas = await SedeService.getProyectos(url2, this.$store)
        console.log("aaaaaaa",respEmpresas.data.rows)
        console.log("HLA")
        if (respEmpresas.status) {
          this.projectOptions = respEmpresas.data.rows
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
        const resp = await RegisterService.getRecord(url, this.$store)
      
        console.log('resp record', resp)
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
        this.enterprise_id = null
        var arrayFilter = []
        if (this.user_role != 'administrador') {
          const proyects = []
          const estados = []
          for (let index = 0; index < this.estados.length; index++) {
            const element = this.estados[index]
            estados.push(element.value)
          }
          if (this.projectOptions.length > 0) {
            for (let index = 0; index < this.projectOptions.length; index++) {
              const element = this.projectOptions[index]
              proyects.push(element.id)
            }
          }
          if (proyects.length > 0) {
            arrayFilter.push({
              keyContains: 'enterprise_id',
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
  