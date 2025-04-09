<template>
    <b-card no-body ref="tableCard">
        <div>
          <!-- <b-button variant="info" class="mt-2 mb-2" @click="testSend()" >TEST SEND</b-button> -->
          <b-button variant="info" class="mt-2 mb-2" @click="addRow" :disabled="existRowEditing">Agregar Fila</b-button>

          <b-table :items="rows" :fields="camposTabla" :key-field="keyField">
            <template v-slot:cell(dni)="row">
              <validation-provider #default="{ errors }" rules="requeridoE">
                <b-form-input v-model="row.item.dni" :readonly="row.item.disabled" @keyup.enter="selectDNI(row.item)" class="form-control"/>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </template>
            <template v-slot:cell(name)="row">
              <validation-provider #default="{ errors }" rules="requeridoE">
                <b-form-input v-model="row.item.name" :readonly="row.item.disabled" @keyup.enter="selectName(row.item)" class="form-control"/>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </template>
            <template v-slot:cell(acciones)="row">
              <span>
                <b-button @click="editRow(row.item)" v-if="row.item.disabled" variant="flat-warning" v-b-tooltip.hover.top="'Editar'"><feather-icon icon="Edit2Icon" /></b-button>
                <b-button @click="saveRow(row.item)" v-else  variant="flat-success" v-b-tooltip.hover.top="'Guardar'"><feather-icon icon="SaveIcon" /></b-button>
                <b-button @click="deleteRow(row.index)" class="btn btn-danger" v-b-tooltip.hover.top="'Eliminar'"><feather-icon icon="Trash2Icon" /></b-button>
              </span>
            </template>
          </b-table>

          <b-button class="mt-2" @click="resetearTabla" :disabled="!rowSaved">Limpiar Tabla</b-button>
        </div>
      </b-card>
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
        rows: [],
        rowSaved: false,
        existRowEditing: false,
        camposTabla: [
            { key: 'dni', label: 'DNI', sortable: true },
            { key: 'name', label: 'Nombre', sortable: true },
            { key: 'acciones', label: 'Acciones' }
        ],
        keyField: 'dni',
        required,
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
    computed: {
        visibleFields() {
        return this.fields.filter((field) => field.visible)
        },
        existRowEditing() {
        return this.rows.some((fila) => !fila.disabled);
        },
    },  
    methods: {
        addRow() {
        if (!this.existRowEditing) {
            this.rows.push({ dni: '', name: '', disabled: false, inDatabase: false });
            this.rowSaved = false;
        }
        },
        saveRow(row) {
        if(row.dni.length === 8){
            console.log('Datos por guardar:', row);
            console.log('Datos guardados:', row);
            row.disabled = true;
            this.rowSaved = true;
            console.log("Datos TOTAL:", this.rows);
            }
        },
        
        editRow(row) {
            row.disabled = false;
            this.rowSaved = false;
        },
        deleteRow(index) {
            this.rows.splice(index, 1);
            if (this.rows.length === 0) {
                this.rowSaved = true;
            }
            this.visitorsToDelete.push(this.rows[index])
        },
        resetearTabla() {
            this.rows = [];
            this.rowSaved = true;
        },
        async selectDNI(item){
            if(item.dni.length === 8){
                console.log('item',item)
                this.loadingModalVisible = true;
                const respVisitor = {data: {dni: '12345678', fullname: 'Juan Perez'}}
                if (!respVisitor){
                console.log('VISTOR RESPUESTA SELECT DNI',respVisitor)
                item.dni = respVisitor.data.dni
                item.name = respVisitor.data.fullname
                console.log('CAMBIOS INICIO',item)
                
                this.rowSaved = true;
                item.disabled = true;

                console.log('CAMBIOS FINAL',item.dni)
                console.log('CAMBIOS FINAL',item)
                }else{
                console.log('INSERTANDO MANUALMENTE DATOS')
                }
                this.loadingModalVisible = false;
            }
        },    
        async selectName(item){
            console.log('item',item)
            const respVisitor = {data: {dni: '12345678', fullname: 'Juan Perez'}}
            if (!respVisitor){
                item.dni = respVisitor.data.dni
                item.name = respVisitor.data.fullname
                item.inDatabase = true;
                item.disabled = true;
                this.rowSaved = true;
                console.log('CAMBIOS FINAL',item.name)
                console.log('CAMBIOS FINAL',item)
            }else{
                console.log('INSERTANDO MANUALMENTE DATOS')
            }
        },    
    }
}
</script>

<style lang="scss">
.date-class {
  width: 100px;
}
</style>