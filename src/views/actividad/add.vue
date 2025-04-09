<template>
    <div>
        <b-overlay
        variant="white"
        :show="showLoading"
        spinner-variant="primary"
        blur="0"
        opacity=".75"
        rounded="sm"
        >
            <b-card>
                <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                @click="goBack">
                    <feather-icon style="width: 15px; height: 15px;" icon="ArrowLeftIcon"/> Volver
                </b-button>
                <form-wizard
                color="#005193"
                :title="null"
                :subtitle="null"
                next-button-text="Siguiente"
                back-button-text="Atrás"
                finish-button-text="Finalizar"
                class="steps-transparent mb-3"
                @on-complete="saveData"
                >
                <tab-content
                    title="Información General"
                    icon="feather icon-folder"
                    :before-change="validGeneral"
                >
                    <general
                    :edit="false"
                    @cambiar-valor="cambiarValorGeneral"
                    ref="general"
                    />
                </tab-content>

                <tab-content
                    title="Formularios"
                    icon="feather icon-clipboard"
                    :before-change="validFormularios"
                >
                    <formularios v-if="items.project_id !== null"
                        :edit="false"
                        :projectId="items.project_id"
                        @actualizar-project-id="actualizarProjectId"
                        ref="formularios"
                    />
                </tab-content>

                
                </form-wizard>
            </b-card>
        </b-overlay>

    </div>
</template>

<script>
import TemplateService from '@/services/TemplateService'
import GroupService from '@/services/GroupService'
import SedeService from '@/services/SedeService'
import FormService from '@/services/FormService'
import ProjectsService from '@/services/ProjectsService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import { required } from '@validations'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import groupSelect from './group-select.vue'
import general from './steps/general.vue'
import formularios from './steps/formularios.vue'
import ActivityService from '@/services/ActivityService'
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
            allowFinish: false,
            showLoading: false,
            proyectos: [],
            sedes: [],
            servicios: ['Abastecimiento de combustible', 'Viaje en vacío', 'Prueba en ruta', 'Mantenimiento de la unidad'],
            formularios: [],
            groups_codes: [],
            project_id: null,
            service: '',
            modalOpen: false,
            tempUsers: [],
            rowsDespacho: [],
            rowsEmbarque: [],
            rowsConduccion: [],
            rowsFinalizacion: [],
            fields: [
                { key: 'actions', label: 'Acciones', sortable: false },
                { key: 'formId', label: 'Formulario', sortable: false },
                { key: 'mandatory', label: 'Obligatorio', sortable: false },
                { key: 'repeatable', label: 'Repetible', sortable: false },
                { key: 'groupLvl1Id', label: 'Aprobador NVL 1', sortable: false },
                { key: 'groupLvl2Id', label: 'Aprobador NVL 2', sortable: false },
            ],
            items: {
                project_id: JSON.parse(localStorage.getItem('project_id')),
                service: null,
                sede: null
            },

            fieldsModal: [
                { key: 'document', label: 'DNI', sortable: true },
                { key: 'fullname', label: 'Nombre', sortable: true },
                { key: 'email', label: 'Email', sortable: true},
                { key: 'role.description', label: 'Perfil', sortable: true}
            ],
            records: [],
            keyField: 'dni',
            itemsModal: {
                temp_index: null,
                temp_type: null,
                temp_field: null,
                code_group: '',
                group: '',
                id_group: null
            },
            showLoading2: false,
            dataItems: {
                projectId: JSON.parse(localStorage.getItem('project_id')),
                sedeId: null,
                type: null,
                stopQty: null,
                route: null,
                plate: null,
                dateInit: null,
                dateEnd: null,
                primaryPilotId: null,
                secondaryPilotId: null,
                formsId: [],
                despacho: [],
                embarque: [],
                conduccion: [],
                finalizacion: []
            },
            dataTemplate: {},
            userData: JSON.parse(localStorage.getItem('userData')),
            arrayFilters: []
        }
    },
    components: {
        vSelect,
        flatPickr,
        AppTimeline,
        ValidationProvider,
        ValidationObserver,
        AppTimelineItem,
        groupSelect,
        FormWizard,
        TabContent,
        general,
        formularios
    },
    mounted(){
        this.getData()

    },
    methods: {
        async getData(){
            this.getProyectos()
            this.getFormularios()
            this.getSedes()
            this.getGroupsCodes()
        },
        async searchGroup(item){
            console.log('Buscando grupo', item)
            const respGroup = await GroupService.getUsersByCode(item, this.$store)
            console.log('RESP GROUP', respGroup)
            if(respGroup.status){
                this.itemsModal.group = respGroup.data.group.description
                console.log("RESP USERS", respGroup.data.data)
                this.tempUsers = respGroup.data.group.users
                console.log("TEMP USERS", this.tempUsers)
                this.itemsModal.id_group = respGroup.data.group.id
            }
            else{
                this.itemsModal.group = ''
            }
            //LLAMAR SERVICIO QUE BUSQUE GRUPO POR EL CODIGO
        },    
        async searchUsers(){
            console.log('Buscando usuarios')
            console.log("TEMP USERS", this.tempUsers)

            //LLAMAR SERVICIO QUE BUSQUE USUARIOS POR EL GRUPO
            this.records = this.tempUsers
        },
        actualizarProjectId(nuevoProjectId) {
            this.items.project_id = nuevoProjectId;
            console.log("ACTUALIZAR PROJECT ID", nuevoProjectId)
        },
        cambiarValorGeneral(nuevoValor) {
            this.items.project_id = nuevoValor;
            console.log("CAMBIAR VALOR", nuevoValor)
            this.$refs.formularios.projectId = nuevoValor;
            this.$refs.formularios.getGroupsCodes();
        },
        async saveModalSubmit(){
            console.log('Guardando registros de modal')
            switch (this.itemsModal.temp_field) {
                case 'despacho':
                    this.rowsDespacho[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'embarque':
                    this.rowsEmbarque[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'conduccion':
                    this.rowsConduccion[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'finalizacion':
                    this.rowsFinalizacion[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                default:
                    break;
            }
            this.closeModal()
            //LLAMAR SERVICIO QUE GUARDE LOS REGISTROS DEL MODAL

        },
        goBack(){
            this.$router.push('/actividad')
        },
        cleanModal(){
            this.itemsModal = {
                temp_index: null,
                temp_type: null,
                temp_field: null,
                code_group: '',
                group: '',
                id_group: null
            }
            this.records = []
        
        },
        closeModal() {
            this.modalOpen = false;
            this.cleanModal()
            console.log("CLOSE")
        },
        async selectSups(row, type, field){
            this.cleanModal()
            console.log("ABRIR MODAL")
            console.log("ROW",row)
            console.log("TYPE",type)
            console.log("FIELD",field)
            this.itemsModal.temp_index = row.index;
            this.itemsModal.temp_type = type;
            this.itemsModal.temp_field = field;
            this.getModalData()
            if(row.item[type] != null){
                console.log("LLAMAR FUNCIÓN PARA SETEAR DATOS EN MODAL")
                const resp = await GroupService.getUsersById(row.item[type], this.$store)
                console.log("RESP USER EDIT",resp)
                this.itemsModal.code_group = resp.data.group.code
                this.searchGroup(this.itemsModal.code_group)
                this.searchUsers()
            }
            this.modalOpen = true
            /* this.selectedRow = row;
            this.selectedField = field; */
        },
        async getModalData(){
            console.log("GET MODAL DATA")
        },
        addDespacho(){
            this.rowsDespacho.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS DESPACHO",this.rowsDespacho)
        },
        deleteDespacho(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsDespacho[index])
            this.rowsDespacho.splice(index,1)
        },

        
        addEmbarque(){
            this.rowsEmbarque.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Embarque",this.rowsEmbarque)
        },
        deleteEmbarque(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsEmbarque[index])
            this.rowsEmbarque.splice(index,1)
        },

        addConduccion(){
            this.rowsConduccion.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Conduccion",this.rowsConduccion)
        },
        deleteConduccion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsConduccion[index])
            this.rowsConduccion.splice(index,1)
        },

        addFinalizacion(){
            this.rowsFinalizacion.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Finalizacion",this.rowsFinalizacion)
        },
        deleteFinalizacion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsFinalizacion[index])
            this.rowsFinalizacion.splice(index,1)
        },


        updateRow(data) {
            // Actualiza la fila seleccionada con los datos del modal
            this.selectedRow[this.selectedField] = data;
            this.modalOpen = false;
        },
        async getProyectos(){
            const user = JSON.parse(localStorage.getItem('userData'))
            const respProyectos = await ProjectsService.getProyectos('', this.$store)
            if (respProyectos.status) {
                this.proyectos = respProyectos.data.rows
                console.log("PROYECTOS",this.proyectos)
            }
        },
        async getFormularios(){
            const respFormularios = await FormService.getForms('', this.$store)
            if (respFormularios.status) {
                this.formularios = respFormularios.data.rows
                console.log("FORMULARIOS",this.formularios)
            }
        },
        async getSedes(){
            const arrayFilters = []
            this.items.sede = null
            if (this.items.project_id != null && this.items.project_id != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.project_id })
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
        async getGroupsCodes(){
            const arrayFilters = []
            console.log("PROJECT ID ADD",this.$refs.general.items.projectId)
            if (this.$refs.general.items.projectId != null && this.$refs.general.items.projectId != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.$refs.general.items.projectId })
            }
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            const respGroups = await GroupService.getGroups(url, this.$store)
            if (respGroups.status) {
                this.groups_codes = respGroups.data.rows
                this.groups_codes = this.groups_codes.map((item) => {
                    return item.code
                })
                console.log("GROUPS CODES ADD",this.groups_codes)
            }
        },
        async saveData(templateExists = true){
            console.log("GUARDAR")
            this.dataItems.userRegisterId = this.userData.id
            console.log('data', this.dataItems)
            this.showLoading = true
            console.log('data TO SAVE', this.dataItems)
            let resp = ''

            resp = await ActivityService.saveActivity(this.dataItems, this.$store)
            console.log('resp', resp)
            if (resp.status) {
                if(templateExists){
                    this.$swal({
                    title: 'Registrado',
                    text: 'Los datos han sido registrados.',
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    },
                    buttonsStyling: false
                    })
                    this.$router.push('/actividad')
                }else{
                    this.$swal({
                    title: 'Registrado',
                    text: 'Los datos han sido registrados.',
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    },
                    buttonsStyling: false
                    })
                    this.$router.push('/actividad')
                }
            } else {
                this.$swal({
                title: 'Error!',
                text: 'Ocurrió un error al registrar los datos del formulario.',
                icon: 'error',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
                })
            }
        },
        async validGeneral() {
            console.log("VALIDA")
            return new Promise((resolve, reject) => {
                // var validate = null
                this.$refs.general.$refs.refFormObserver.validate().then(async success => {
                if (success) {
                    this.dataItems.projectId = this.$refs.general.items.projectId
                    this.dataItems.sedeId = this.$refs.general.items.sedeId
                    this.dataItems.type = this.$refs.general.items.type
                    this.dataItems.route = this.$refs.general.items.route
                    this.dataItems.plate = this.$refs.general.items.plate
                    this.dataItems.stopQty = this.$refs.general.items.stopQty
                    this.dataItems.stopQty = parseInt(this.dataItems.stopQty)
                    this.dataItems.dateInit = this.$refs.general.items.dateInit
                    this.dataItems.dateEnd = this.$refs.general.items.dateEnd
                    this.dataItems.primaryPilotId = this.$refs.general.items.primaryPilotId
                    this.$refs.general.items.secondaryPilotId ? this.dataItems.secondaryPilotId = this.$refs.general.items.secondaryPilotId : this.dataItems.secondaryPilotId = null
                    this.dataTemplate = {
                        type: this.$refs.general.items.type,
                        projectId: this.$refs.general.items.projectId,
                        sedeId: this.$refs.general.items.sedeId
                    }
                    console.log("DATA TEMPLATE",this.dataTemplate)
                    this.arrayFilters = []
                    console.log("FILTROS")
                    
                    this.arrayFilters.push({ keyContains: 'projectId', key: 'equals', value: this.dataTemplate.projectId })
                    this.arrayFilters.push({ keyContains: 'type', key: 'equals', value: this.dataTemplate.type })
                    this.arrayFilters.push({ keyContains: 'sedeId', key: 'equals', value: this.dataTemplate.sedeId })
                    const url =
                    `?limit=1000000&page=1&order=ASC&sort=id&filter=` +
                    JSON.stringify(this.arrayFilters)
                    const resp = await ActivityService.getTemplateActivity(url, this.$store)
                    console.log("REASP TEMPLATE",resp)
                    if(resp.status){
                        this.$refs.formularios.sedeId = this.dataItems.sedeId
                        this.$refs.formularios.getGroupsCodes()
                        this.$refs.formularios.rowsDespacho = resp.data.despacho
                        this.$refs.formularios.rowsEmbarque = resp.data.embarque
                        this.$refs.formularios.rowsConduccion = resp.data.conduccion
                        this.$refs.formularios.rowsFinalizacion = resp.data.finalizacion
                        resolve(true)

                    }else{
                        this.$swal({
                            title: 'Advertencia',
                            title: "No se encontró una plantilla para esta sede y/o tipo. ¿Desea guardarlo sin formularios?",
                            icon: 'warning',
                            showDenyButton: true,
                            confirmButtonText: "Guardar",
                            denyButtonText: `Cancelar`,
                            customClass: {
                                confirmButton: 'btn btn-primary mr-2',
                                denyButton: 'btn btn-secondary'
                            },
                            buttonsStyling: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    console.log("NO HAY PLANTILLAaaa")
                                    this.dataItems.despacho = []
                                    this.dataItems.embarque = []
                                    this.dataItems.conduccion = []
                                    this.dataItems.finalizacion = []
                                    reject()
                                    this.saveData(false)
                                } 
                        });
                        reject()
                    }
                    console.log("DATAITEMS",this.dataItems)

                } else {
                    reject()
                }
                })
            })
        },
        validFormularios() {
            console.log("VALID FORMS")
            return new Promise((resolve, reject) => {
                // var validate = null
                this.$refs.formularios.$refs.refFormObserver.validate().then(success => {
                if (success) {
                    this.dataItems.despacho = this.$refs.formularios.rowsDespacho
                    this.dataItems.embarque = this.$refs.formularios.rowsEmbarque
                    this.dataItems.conduccion = this.$refs.formularios.rowsConduccion
                    this.dataItems.finalizacion = this.$refs.formularios.rowsFinalizacion
                    console.log("DATAITEMS 2",this.dataItems)
                    resolve(true)

                } else {
                    console.log("REJECT")
                    reject()
                }
                })
            })
        },
    }
}
</script>

<style>
.addButton{
    cursor: pointer;
    transition: all .1s ease-in-out;
}
.addButton:hover{
    width: 27px !important;
    height: 27px !important;
    transition: all .2s ease-in-out;
}
</style>