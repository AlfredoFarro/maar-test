<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-discipline"
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
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar' }} Tipo de Documento</h5>
        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide(); resetForm()"/>
      </div>

      <!-- Formulario -->
      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <b-form class="p-2" @submit.prevent="handleSubmit">
          
          <!-- Campo Nombre -->
          <validation-provider #default="{ errors }" name="Nombre" rules="required">
            <b-form-group label="Tipo de documento" label-for="name">
              <b-form-input
                v-model="discipline.name"
                id="name"
                placeholder="Ej: Documentos Médicos"
                autocomplete="off"
                :state="errors.length ? false : null"
              />
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <!-- Campo Color -->
          <b-form-group label="Color de identificación" label-for="color">
            <b-form-input
              v-model="discipline.color"
              id="color"
              type="color"
            />
          </b-form-group>
          <!-- Botones -->
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="invalid || isSubmitting"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isSubmitting" small />
              <span v-if="isSubmitting">Procesando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
            </b-button>
            <b-button variant="outline-secondary" @click="hide(); resetForm()">
              Cancelar
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import DisciplineService from '@/services/DisciplineService'
import FileTypeService from '@/services/FileTypeService'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      discipline: {
        id: null,
        name: '',
        color: '#000000', // color predeterminado
      },
      isEdit: false,
      isSubmitting: false
    }
  },
  methods: {
    setData(disciplineData = null) {
      if (disciplineData) {
        this.discipline = {
          id: disciplineData.id,
          name: disciplineData.name,
          color: disciplineData.color || '#000000', // fallback por si no viene color
        }
        this.isEdit = true
      } else {
        this.resetForm()
      }
    },
    
    resetForm() {
      this.discipline = {
        id: null,
        name: ''
      }
      this.isEdit = false
      this.$nextTick(() => {
        if (this.$refs.refFormObserver) {
          this.$refs.refFormObserver.reset()
        }
      })
    },
    
    async handleSubmit() {
      try {
        this.isSubmitting = true;

        const response = this.isEdit 
          ? await FileTypeService.updateFileType(this.discipline.id, { name: this.discipline.name, color: this.discipline.color  }, this.$store)
          : await FileTypeService.saveFileType({ name: this.discipline.name, color: this.discipline.color }, this.$store);
      
        const res = response;
        console.log("respuesta", res);
      
        if (res.status === true) {
          /* this.$bvToast.toast(res.message || 'Operación exitosa', {
            title: 'Éxito',
            variant: 'success',
            solid: true
          }); */
        
          this.$parent.$parent.getAllData()
          this.$emit('update:is-add', false)     
          
        
          this.resetForm();
        } else {
          const errorMsg = res.message || 'Respuesta inesperada del servidor';
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('Error en handleSubmit:', error);
        /* this.$bvToast.toast(error.message || 'Error al procesar la solicitud', {
          title: 'Error',
          variant: 'danger',
          solid: true
        }); */
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

.content-sidebar-header {
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}

.sidebar-lg {
  width: 500px;
}
</style>