<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-new-speciality"
    :visible="isAdd"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    no-close-on-backdrop
    @change="(val) => $emit('update:is-add', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
      >
        <h5 class="mb-0">Filtrar segun columnas</h5>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />
      </div>

      <!-- BODY -->
      <b-card-body class="">
        <b-card-text>
          <b-row>
            <b-col md="6" v-for="field in filtros" :key="field.id" class="justify-content-center">
              <b-checkbox
                :disabled="(visibleFields.length == 2 && field.visible) || field.key == 'actions'"
                v-model="field.visible"
                inline
                class="mb-1"
              >
                {{ field.label }}
              </b-checkbox>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card-body>
    </template>
  </b-sidebar>
</template>

<script>
/* eslint-disable*/
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ProjectsService from '@/services/ProjectsService'
import vSelect from 'vue-select'
Vue.use(BootstrapVue)
export default {
  directives: {
    Ripple
  },
  components: {
    // Form Validation
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    filtros: {
      type: Array,
      required: true
    }
  },
  computed: {
    visibleFields() {
      return this.filtros.filter((field) => field.visible)
    }
  },
  data() {
    return {
      required,
      // speciality: {
      //   title: ''
      // },
      isEdit: false,
      isDisabled: false,
      records: [],
      tipos: [
        {
          code: '001',
          name: 'Proyecto'
        },
        {
          code: '002',
          name: 'Subcontratista / Servicios'
        },
        {
          code: '003',
          name: 'Cliente'
        },
        {
          code: '004',
          name: 'Oficina Principal'
        }
      ],
      items: {
        project_id: null,
        code: '',
        description: '',
        tipo: ''
      },
      temp: {}
    }
  },
  mounted() {
    this.getProjects()
  },
  methods: {
    async getProjects() {
      const respProyectos = await ProjectsService.getProyectos('', this.$store)
      console.log('respProyectos', respProyectos)
      if (respProyectos.status) {
        this.records = respProyectos.data.rows
      }
    },
    setData(items) {
      if (Object.entries(items).length !== 0) {
        this.temp = items
        this.items = items
        this.isEdit = true
      } else {
        this.temp = {}
        this.items = {
          project_id: null,
          code: '',
          description: ''
        }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      this.$refs.refFormObserver.reset()
      this.isEdit = false
      this.items = {
        project_id: null,
        code: '',
        description: ''
      }
    },
    async onSubmit(data) {
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        if (success) {
          this.isDisabled = true
          let resp = ''
          let datos = {}
          datos.project_id = data.project_id
          datos.code = data.code
          datos.description = data.description
          if (this.isEdit == false) {
            resp = ''
          } else {
            let id = data.id
            resp = ''
          }
          console.log('datos', datos)
          if (resp.status) {
            this.$swal({
              title: this.isEdit == true ? 'Actualizado' : 'Registrado',
              text: 'El area ha sido ' + (this.isEdit == true ? 'actualizado.' : 'registrado.'),
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
            console.log('this.$parent.$parent', this.$parent.$parent)
            this.$parent.$parent.$parent.getData()
            this.$emit('update:is-add', false)
            this.resetForm()
          } else {
            this.$swal({
              title: 'Error!',
              text:
                ' Hubo un error al ' +
                (this.isEdit == true ? 'actualizar' : 'registrar') +
                ' el area',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          }
          this.isDisabled = false
        } else {
          console.log('no validado')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
