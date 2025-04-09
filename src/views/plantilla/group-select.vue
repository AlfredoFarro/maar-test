<template>
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
                                <b-form-input 
                                    id="sede"
                                    v-model="items.sedeId"
                                    class="form-control"
                                    placeholder="Sede"
                                />
                                </b-form-group>
                            </div>
                            <div class="w-100 mb-1 mb-lg-0 mt-02">
                                <b-form-group label="Código de Grupo" label-for="code_group" class="mr-2">
                                <b-form-input 
                                    id="code_group"
                                    v-model="items.code_group"
                                    @keyup.enter="searchGroup(items.code_group)"
                                    class="form-control"
                                    placeholder="Código de Grupo"
                                />
                                </b-form-group>
                            </div>
                            <div class="w-100 mb-1 mb-lg-0 mt-02">
                                <b-form-group label="Grupo" label-for="group" class="mr-2">
                                <b-form-input 
                                    id="group"
                                    v-model="items.group"
                                    :disabled="true"
                                    class="form-control"
                                    placeholder="Grupo"
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
                                    :disabled="items.group == ''"
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
                                    @click="saveSubmit()"
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
                <b-table :items="records" :fields="fields"/>
            </b-card>
        </b-overlay>
    </div>
            
</template>

<script>
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

const APIURL = process.env.APIURLFILE
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
    directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data(){
    return{
        fields: [
            { key: 'dni', label: 'DNI', sortable: true },
            { key: 'name', label: 'Nombre', sortable: true },
            { key: 'profile', label: 'Perfil', sortable: true}
        ],
        records: [],
        keyField: 'dni',
        required,
        items: {
            code_group: '',
            group: '',
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
    },
    
    methods: {
        async searchGroup(item){
            console.log('Buscando grupo', item)
            this.items.group = item;
            //LLAMAR SERVICIO QUE BUSQUE GRUPO POR EL CODIGO
        },    
        async searchUsers(){
            console.log('Buscando usuarios')
            //LLAMAR SERVICIO QUE BUSQUE USUARIOS POR EL GRUPO
            this.records = [
                {dni: '12345678', name: 'Juan Perez', profile: 'Administrador'},
                {dni: '87654321', name: 'Maria Lopez', profile: 'Usuario'},
                {dni: '12348765', name: 'Carlos Perez', profile: 'Usuario'},
                {dni: '87651234', name: 'Ana Lopez', profile: 'Usuario'},
                {dni: '12347865', name: 'Pedro Perez', profile: 'Usuario'},
                {dni: '87651234', name: 'Ana Lopez', profile: 'Usuario'},
                {dni: '12345678', name: 'ASASDAez', profile: 'Administrador'},
                {dni: '87654321', name: 'Maria Lopez', profile: 'Usuario'},
                {dni: '12348765', name: 'Carlos Perez', profile: 'Usuario'},
                {dni: '87651234', name: 'Ana Lopez', profile: 'Usuario'},
                {dni: '12347865', name: 'Pedro Perez', profile: 'Usuario'},
                {dni: '87651234', name: 'Ana Lopez', profile: 'Usuario'},
              
            ]
        },
        async saveSubmit(){
            console.log('Guardando registros')
            //LLAMAR SERVICIO QUE GUARDE LOS REGISTROS
        }

    }
}
</script>

<style lang="scss">
.date-class {
  width: 100px;
}
</style>