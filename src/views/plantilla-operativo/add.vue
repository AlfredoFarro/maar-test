<template>
    <div class="w-100">
        <b-overlay
        variant="white"
        :show="showLoading"
        spinner-variant="primary"
        blur="0"
        opacity=".75"
        rounded="sm"
        >
        <validation-observer #default="{ invalid }" ref="refFormObserver">

            <b-card  no-body class="sticky">
                <b-card-body>
                   
                    <b-row>
                        <b-col md="12" lg="7" class="d-flex flex-column flex-lg-row justify-content-start">
                            <div class="w-100 mb-1 mb-lg-0 mt-02">
                                <b-form-group label="Proyecto" label-for="project" class="mr-2">
                                    <validation-provider #default="{ errors }" rules="requeridoE">
                                        <v-select
                                            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                            :options="proyectos"
                                            label="code"
                                            input-id="project"
                                            :reduce="(proyectos) => proyectos.id"
                                            placeholder="Proyecto"
                                            v-model="items.project_id"
                                            @input="getSedes(), getGroupsCodes()"
                                            class="select-obra"
                                        >
                                            <template v-slot:selected-option="option">
                                            {{ option.code }} - {{ option.description }}
                                            </template>
                                            <template slot="option" slot-scope="option">
                                            {{ option.code }} - {{ option.description }}
                                            </template>
                                        </v-select>
                                        <small class="text-danger">{{ errors[0] }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </div>
                            <div class="w-100">
                                <b-form-group label="Sede" label-for="sede" class="mr-2">
                                    <validation-provider #default="{ errors }" rules="requeridoE">
                                        <v-select
                                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                        :options="sedes"
                                        label="description"
                                        input-id="sede"
                                        :reduce="(sedes) => sedes.id"
                                        placeholder="Sede"
                                        @input="getGroupsCodes()"
                                        v-model="items.sede"
                                        class="select-obra"/>
                                        <small class="text-danger">{{ errors[0] }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </div>    
                        </b-col>
                        <b-col md="6" lg="5" class="d-flex">              
                            <div
                                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                            >
                            
                                <b-button
                                    class="mr-2"
                                    variant="primary"
                                    @click="saveSubmit()"
                                    >
                                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Guardar </span>
                                </b-button>
                                <b-button
                                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                                variant="primary"
                                
                                @click="goBack">
                                    <feather-icon style="width: 15px; height: 15px;" icon="ArrowLeftIcon"/> Volver
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                </b-card-body>
            </b-card>
            <b-card>
                <b-row class="mb-2">
                    <h2 class="mr-1 ml-2">Formulario</h2>
                    <span class="text-nowrap " > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addRow()" />
                    </span>
                </b-row>
                <b-table :class="{'table-responsive': rows.length > 0}" :items="rows" :fields="fields">
                    <template v-slot:cell(formId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="formularios"
                                label="name"
                                input-id="formDespacho"
                                :reduce="(formularios) => formularios.id"
                                placeholder="Formulario"
                                style="width: 700px;"
                                v-model="row.item.formId"
                                class="select-obra">
                            </v-select>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    
                    <template #head(isRequiredApproved)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isRequiredApproved)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isRequiredApproved"
                                name="isRequiredApproved"
                                class="select-obra"
                                @change="changedIsRequired(row.item);"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    
                   
                    <template v-slot:cell(groupLvl1Id)="row">
                        <validation-provider #default="{ errors }" :rules="!row.item.isRequiredApproved ? 'requeridoE' : ''">
                            <b-button
                            v-if="row.item.groupLvl1Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl1Id"
                            :disabled="row.item.isRequiredApproved == true"
                            @click="selectSups(row, 'groupLvl1Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl1Id"
                            :disabled="row.item.isRequiredApproved == true"
                            @click="selectSups(row, 'groupLvl1Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl2Id)="row">
                        <validation-provider #default="{ errors }" rules="">
                            <b-button
                            v-if="row.item.groupLvl2Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.isRequiredApproved == true"
                            @click="selectSups(row, 'groupLvl2Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.isRequiredApproved == true"
                            @click="selectSups(row, 'groupLvl2Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupUsersId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-button
                            v-if="row.item.groupUsersId == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupUsersId"
                            @click="selectSups(row, 'groupUsersId', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupUsersId"
                            @click="selectSups(row, 'groupUsersId', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            class=""               
                            @click.prevent="deleteRow(row.index)"
                            v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                            variant="flat-danger"               
                            >
                            <feather-icon icon="XCircleIcon" />
                        </b-button>
                        </template>
                </b-table>
               
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
                        <b-card no-body class="sticky">
                            <b-card-body>
                                <b-row>
                                    <b-col md="12" lg="7" class="d-flex flex-column flex-lg-row justify-content-start">
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Sede" label-for="sede" class="mr-2">
                                            <v-select
                                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                                :options="sedes"
                                                label="description"
                                                :reduce="(sedes) => sedes.id"
                                                input-id="sede"
                                                placeholder="Sede"
                                                disabled
                                                @input="getGroupsCodes()"
                                                v-model="items.sede"
                                                class="select-obra"
                                            />
                                            </b-form-group>
                                        </div>
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Grupo" label-for="code_group" class="mr-2">
                                            <v-select
                                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                                :options="groups_codes"
                                                label="description"
                                                input-id="code_group"
                                                placeholder="Grupo"
                                                v-model="itemsModal.code_group"
                                                @input="searchGroup(itemsModal.code_group)"
                                                class="select-obra"
                                            />
                                            </b-form-group>
                                        </div>
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Código de Grupo" label-for="group" class="mr-2">
                                            <b-form-input 
                                                id="group"
                                                v-model="itemsModal.group"
                                                :disabled="true"
                                                class="form-control"
                                                placeholder="Código de Grupo"
                                            />
                                            </b-form-group>
                                        </div>
                                    </b-col>
                                    <b-col md="1" lg="1" class="d-flex">              
                                        <div
                                            class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                                        >
                                        
                                            <b-button
                                                class="mr-2"
                                                variant="primary"
                                                @click="searchUsers()"
                                                :disabled="itemsModal.group == ''"
                                                >
                                                <span class="text-nowrap"> <feather-icon icon="UsersIcon" /> Visualizar </span>
                                            </b-button>
                                        </div>
                                    </b-col>
                                    <b-col md="1" lg="2" class="d-flex">              
                                        <div
                                            class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                                        >
                                        
                                            <b-button
                                                class="mr-2"
                                                variant="primary"
                                                @click="saveModalSubmit()"
                                                :disabled="records.length == 0"
                                                >
                                                <span class="text-nowrap"> <feather-icon icon="CheckCircleIcon" /> Guardar </span>
                                            </b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                        <b-card>
                            <b-table :items="records" :fields="fieldsModal"/>
                        </b-card>
                    </b-overlay>
                </div>
            </b-modal>
        </validation-observer>
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
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import groupSelect from './group-select.vue'
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
            showLoading: false,
            proyectos: [],
            sedes: [],
            formularios: [],
            groups_codes: [],
            project_id: null,
            modalOpen: false,
            tempUsers: [],
            rows: [],
            
            fields: [
                { key: 'formId', label: 'Formulario', sortable: false },
                { key: 'isRequiredApproved', label: 'Auto Aprobable', sortable: false },
                { key: 'groupUsersId', label: 'Registrador/Responsable', sortable: false },
                { key: 'groupLvl1Id', label: 'Aprobador NVL 1', sortable: false },
                { key: 'groupLvl2Id', label: 'Aprobador NVL 2', sortable: false },
                { key: 'actions', label: 'Acciones', sortable: false },
            ],
            items: {
                project_id: JSON.parse(localStorage.getItem('project_id')),
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
        }
    },
    components: {
        vSelect,
        flatPickr,
        AppTimeline,
        ValidationProvider,
        ValidationObserver,
        AppTimelineItem,
        groupSelect
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
            const respGroup = await GroupService.getUsersById(item.id, this.$store)
            console.log('RESP GROUP', respGroup)
            if(respGroup.status){
                this.itemsModal.group = respGroup.data.group.code
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
            this.rows[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group

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
        async changedIsRequired(item){
            console.log("ITEM changedIsRequired", item)
            if (item.isRequiredApproved) {
                // Si isRequiredApproved es true, establecer groupLvl1Id y groupLvl2Id a null
                this.$set(item, 'groupLvl1Id', null);
                this.$set(item, 'groupLvl2Id', null);
            }
            console.log("ITEM changedIsRequired 2", item)
            console.log("ROWS", this.rows)


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
                this.itemsModal.code_group = resp.data.group.description
                await this.searchGroup(resp.data.group)
                await this.searchUsers()
            }
            this.modalOpen = true
            /* this.selectedRow = row;
            this.selectedField = field; */
        },
        goBack(){
            this.$router.push('/plantilla-operativo')
        },
        async getModalData(){
            console.log("GET MODAL DATA")
        },
        addRow(){
            this.rows.push({ formId: null, isRequiredApproved: false, groupLvl1Id: null, groupLvl2Id: null, groupUsersId: null })
            console.log("ROWS ",this.rows)
        },
        deleteRow(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rows[index])
            this.rows.splice(index,1)
        },

        
        


        updateRow(data) {
            // Actualiza la fila seleccionada con los datos del modal
            this.selectedRow[this.selectedField] = data;
            this.modalOpen = false;
        },
        async getProyectos(){
            const user = JSON.parse(localStorage.getItem('userData'))
            const url2 = `?limit=100000&order=asc&sort=code`
            const respProyectos = await ProjectsService.getProyectos(url2, this.$store)
            if (respProyectos.status) {
                this.proyectos = respProyectos.data.rows
                console.log("PROYECTOS",this.proyectos)
            }
        },
        async getFormularios(){
            const url =
            `?limit=10000`
            const respFormularios = await FormService.getForms(url, this.$store)
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
            `?limit=10000&order=asc&sort=description&filter=` +
            JSON.stringify(arrayFilters)
            const respSedes = await SedeService.getSedes(url, this.$store)
            if (respSedes.status) {
                this.sedes = respSedes.data.rows
                console.log("SEDES",this.sedes)
            }
        },
        async getGroupsCodes(){
            const arrayFilters = []
            this.itemsModal.code_group = null
            this.itemsModal.group = ''
            if (this.items.project_id != null && this.items.project_id != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.project_id })
            }
            arrayFilters.push({ keyContains: 'sede.id', key: 'equals', value: this.items.sede })
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            console.log("URL",url)
            const respGroups = await GroupService.getGroups(url, this.$store)
            if (respGroups.status) {
                this.groups_codes = respGroups.data.rows
                console.log("GROUPS CODES",this.groups_codes)
            }
        },
        async saveSubmit(){
            console.log("GUARDAR")
            console.log("ROWS",this.rows)
            this.$refs.refFormObserver.validate().then(async (success) => {
                if (success && this.rows.length > 0) {     
                    this.rows.forEach((element, index) => {
                        this.rows[index].isRequiredApproved = !this.rows[index].isRequiredApproved
                    });
                    const data = {
                        projectId: this.items.project_id,
                        sedeId: this.items.sede,
                        /* userRegisterId: JSON.parse(localStorage.getItem('userData')).id, */
                        forms: this.rows,
                        
                    }
                    console.log("DATA",data)
                    //LLAMAR SERVICIO QUE GUARDE LOS DATOS
                    this.showLoading = true
                    const resp = await OperateService.saveTemplateOperate(data, this.$store)
                    console.log("RESP SAVE", resp)
                    console.log("SAVE DATA")     
                    if(resp.status){
                        this.showLoading = false
                        this.$swal({
                            title: 'Registrado',
                            text: 'Los datos han sido registrados.',
                            icon: 'success',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                            })
                        this.$router.push('/plantilla-operativo')
                    }else{
                        this.showLoading = false
                        this.$swal({
                            title: 'Error!',
                            text: resp.data.message,
                            icon: 'error',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                            })
                    }
                } else {
                    this.showLoading = false
                    this.$swal({
                        title: 'Error!',
                        text: 'Falta completar campos obligatorios.',
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        },
                        buttonsStyling: false
                        })
                    console.log("ERROR asd")
                }
            })
        }
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
.select-obra ul{
    z-index: 1100;
}
</style>