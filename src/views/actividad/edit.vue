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
                    title="Formularios"
                    icon="feather icon-clipboard"
                    :before-change="validFormularios"
                >
                    <formularios v-if="items.project_id !== null"
                        :edit="true"
                        :projectId="items.project_id"
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
            deletedRows: [],
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
                project_id: null,
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
                plate: null,
                route: null,
                dateInit: null,
                dateEnd: null,
                primaryPilotId: null,
                secondaryPilotId: null,
                formsId: [],
                despacho: [],
                embarque: [],
                conduccion: [],
                finalizacion: [],
                deletedRows: [],
                editedRows: []
            },
            userData: JSON.parse(localStorage.getItem('userData')),

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
        async getData(){
            this.showLoading = true
            const resp = await ActivityService.getActivityById(this.$route.params.id, this.$store)
            console.log('resp', resp)
            if (resp.status) {
                this.items.project_id = resp.data.projectId
                this.dataItems = resp.data
                this.dataItems.dateInit = this.validDate(this.dataItems.dateInit)
                this.dataItems.dateEnd = this.validDate(this.dataItems.dateEnd)
                console.log("DATA ITEMS",this.dataItems)
                this.showLoading = false
                this.$nextTick(() => {
                    // Accediendo a $refs.formularios después de que el componente se haya montado
                    this.$refs.formularios.sedeId = this.dataItems.sedeId
                    this.$refs.formularios.getGroupsCodes()
                    this.$refs.formularios.rowsDespacho = this.dataItems.despacho;
                    this.$refs.formularios.rowsEmbarque = this.dataItems.embarque;
                    this.$refs.formularios.rowsConduccion = this.dataItems.conduccion;
                    this.$refs.formularios.rowsFinalizacion = this.dataItems.finalizacion;
                });

            }
            console.log("data items",this.dataItems)
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
            if(this.rowsDespacho[index].id){
                this.deletedRows.push(this.rowsDespacho[index].id)
            }
            this.rowsDespacho.splice(index,1)
        },

        
        addEmbarque(){
            this.rowsEmbarque.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Embarque",this.rowsEmbarque)
        },
        deleteEmbarque(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsEmbarque[index])
            if(this.rowsEmbarque[index].id){
                this.deletedRows.push(this.rowsEmbarque[index].id)
            }
            console.log("DELETED ROWS",this.deletedRows)
            this.rowsEmbarque.splice(index,1)
        },

        addConduccion(){
            this.rowsConduccion.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Conduccion",this.rowsConduccion)
        },
        deleteConduccion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsConduccion[index])
            if(this.rowsConduccion[index].id){
                this.deletedRows.push(this.rowsConduccion[index].id)
            }
            this.rowsConduccion.splice(index,1)
        },

        addFinalizacion(){
            this.rowsFinalizacion.push({ formId: null, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Finalizacion",this.rowsFinalizacion)
        },
        deleteFinalizacion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsFinalizacion[index])
            if(this.rowsFinalizacion[index].id){
                this.deletedRows.push(this.rowsFinalizacion[index].id)
            }
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
            const respGroups = await GroupService.getGroups('', this.$store)
            if (respGroups.status) {
                this.groups_codes = respGroups.data.rows
                this.groups_codes = this.groups_codes.map((item) => {
                    return item.code
                })
                console.log("GROUPS CODES",this.groups_codes)
            }
        },
        async saveData(){
            console.log("GUARDAR")
            console.log('data', this.dataItems)
            this.showLoading = true
            console.log('data TO SAVE', this.dataItems)
            let resp = ''

            resp = await ActivityService.updateActivity(this.$route.params.id, this.dataItems, this.$store)
            console.log('resp', resp)
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
                this.$router.push('/actividad')
               
            } else {
                this.$swal({
                title: 'Error!',
                text: 'Ocurrió un error al actualizar los datos del formulario.',
                icon: 'error',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
                })
            }
        },
        goBack(){
            this.$router.push('/actividad')
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
                    this.dataItems.plate = this.$refs.general.items.plate
                    this.dataItems.route = this.$refs.general.items.route
                    this.dataItems.stopQty = this.$refs.general.items.stopQty
                    this.dataItems.stopQty = parseInt(this.dataItems.stopQty)
                    this.dataItems.dateInit = this.$refs.general.items.dateInit
                    this.dataItems.dateEnd = this.$refs.general.items.dateEnd
                    this.dataItems.primaryPilotId = this.$refs.general.items.primaryPilotId
                    this.$refs.general.items.secondaryPilotId ? this.dataItems.secondaryPilotId = this.$refs.general.items.secondaryPilotId : this.dataItems.secondaryPilotId = null
                    let data = {
                        type: this.dataItems.type,
                        projectId: this.dataItems.projectId,
                        sedeId: this.dataItems.sedeId
                    }
                    const resp = await ActivityService.getTemplateActivity(data, this.$store)
                    console.log("REASP",resp)
                    if(resp.status){
                        this.$refs.formularios.rowsDespacho = resp.data.despacho
                        this.$refs.formularios.rowsEmbarque = resp.data.embarque
                        this.$refs.formularios.rowsConduccion = resp.data.conduccion
                        this.$refs.formularios.rowsFinalizacion = resp.data.finalizacion
                    }
                    console.log("DATAITEMS",this.dataItems)

                    resolve(true)
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
                    this.$refs.formularios.changedRows()
                    this.dataItems.despacho = this.$refs.formularios.addedRowsDespacho
                    this.dataItems.embarque = this.$refs.formularios.addedRowsEmbarque
                    this.dataItems.conduccion = this.$refs.formularios.addedRowsConduccion
                    this.dataItems.finalizacion = this.$refs.formularios.addedRowsFinalizacion
                    this.dataItems.deletedRows = this.$refs.formularios.deletedRows
                    this.dataItems.editedRows = this.$refs.formularios.editedRows

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