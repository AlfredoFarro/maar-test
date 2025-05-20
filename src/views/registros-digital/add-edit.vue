<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-sede"
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
        <h5 class="mb-0">
          {{ isViewMode ? 'Visualizar' : isEdit ? 'Editar' : 'Agregar nuevo' }} observación
        </h5>
        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click=";[hide(), resetForm()]"
        />
      </div>

      <!-- BODY -->
      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <b-form class="p-2" @submit.prevent="onSubmit(items)">
          <!-- Proyecto -->
          <validation-provider #default="{ errors }" name="proyecto" >
            <b-form-group label="Proyecto" label-for="proyecto">
              <v-select
                v-model="items.proyecto"
                :options="proyectos"
                label="name"  
                :reduce="proyecto => proyecto.id"  
                placeholder="Seleccione un proyecto"
                :loading="loadingProyectos"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Nombre y Apellidos -->
          <validation-provider #default="{ errors }" name="nombre" >
            <b-form-group label="Nombre y Apellidos" label-for="nombre">
              <b-form-input
                v-model="items.nombre"
                id="nombre"
                placeholder="Nombre completo"
                autocomplete="off"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- DNI -->
          <validation-provider #default="{ errors }" name="dni" >
            <b-form-group label="DNI" label-for="dni">
              <b-form-input
                v-model="items.dni"
                id="dni"
                placeholder="Número de DNI"
                autocomplete="off"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Fecha -->
          <validation-provider #default="{ errors }" name="fecha" >
            <b-form-group label="Fecha" label-for="fecha">
              <flat-pickr
                v-model="items.fecha"
                class="form-control"
                :config="config"
                placeholder="Seleccione fecha"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Área -->
          <validation-provider #default="{ errors }" name="area" >
            <b-form-group label="Área" label-for="area">
              <b-form-input
                v-model="items.area"
                id="area"
                placeholder="Área de trabajo"
                autocomplete="off"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Disciplina -->
          <validation-provider #default="{ errors }" name="disciplina">
            <b-form-group label="Disciplina" label-for="disciplina">
              <v-select
                v-model="items.disciplina"
                :options="disciplinasOptions"
                label="name"
                :reduce="disc => disc.id"
                placeholder="Seleccione una disciplina"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Estado (Seguro/Inseguro) -->
          <validation-provider #default="{ errors }" name="estado" >
            <b-form-group label="Estado" label-for="estado">
              <b-form-radio-group
                v-model="items.type"
                :options="estadoOptions"
                name="type"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Categorías -->
          <validation-provider #default="{ errors }" name="categorias" >
            <b-form-group label="Categorías" label-for="categorias">
              <v-select
                v-model="items.categorias"
                :options="categoriasCompletas"
                label="name"
                :reduce="cat => cat.id"  
                placeholder="Seleccione categorías"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Riesgos -->
          <validation-provider #default="{ errors }" name="riesgos" >
            <b-form-group label="Observaciones" label-for="riesgos">
              <v-select
                v-model="items.riesgos"
                :options="riesgoOptionsWithAll"
                label="name"
                :reduce="riesgo => riesgo"
                multiple
                placeholder="Seleccione riesgos"
                :loading="loadingRiesgos"
                :selectable="option => !items.riesgos.some(r => r.id === 0) || option.id === 0"
                @input="handleRiesgosSelection"
                :disabled="isViewMode"
                :class="{ 'view-mode-select': isViewMode }"
              />
              <small v-if="items.riesgos.some(r => r.id === 0)" class="text-info d-block mt-1">
                <feather-icon icon="InfoIcon" size="14"/> Todos los riesgos están seleccionados
              </small>
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>



          <!-- Descripción de la observación -->
          <validation-provider #default="{ errors }" name="descripcion" >
            <b-form-group label="Descripción de la observación" label-for="descripcion">
              <b-form-textarea
                v-model="items.descripcion"
                id="descripcion"
                placeholder="Describa la observación"
                rows="3"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Medidas correctivas -->
          <validation-provider #default="{ errors }" name="medidas" >
            <b-form-group label="Medidas Correctivas" label-for="medidas">
              <b-form-textarea
                v-model="items.medidas"
                id="medidas"
                placeholder="Describa las medidas correctivas"
                rows="3"
                :disabled="isViewMode"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="image" rules="" v-if="!isViewMode">
            <b-form-group  label="Imagen Frontal" label-for="image">
              <b-form-file v-model="items.url_front" id="image" placeholder="Seleccionar archivo..."
                accept="image/*"></b-form-file>
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="image" rules="" v-if="!isViewMode">
            <b-form-group  label="Imagen Trasera" label-for="image2">
              <b-form-file v-model="items.url_back" id="image2" placeholder="Seleccionar archivo..."
                accept="image/*"></b-form-file>
              <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
            </b-form-group>
          </validation-provider>
          <!-- Form Actions -->
          <div class="d-flex mt-4 justify-content-end" v-if="!isViewMode">
            <b-button
              :disabled="invalid || isViewMode"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled">Guardando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Agregar' }}</span>
            </b-button>
            <b-button
              type="button"
              variant="outline-secondary"
              @click=";[hide(), resetForm()]"
            >
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
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import SedeService from '@/services/SedeService'
import RegisterService from '@/services/RegisterService'
import DisciplineService from '@/services/DisciplineService'
import GroupService from '@/services/GroupService' 

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect,
    flatPickr
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      proyectosList: [], 
      isEdit: false,
      isDisabled: false,
      config: {
        dateFormat: 'd/m/Y',
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          },
          months: {
            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
          }
        }
      },
      estadoOptions: [
        { text: 'Seguro', value: 'Seguro' },
        { text: 'Inseguro', value: 'Inseguro' }
      ],
      categoriaOptions: [
        'Medio Ambiente',
        'Seguridad',
        'Salud',
        'Calidad'
      ],
      categoriasCompletas: [], 
      categoriaOptions: [],    
      proyectos: [], 
      loadingProyectos: false, 
      riesgoOptions: [], 
      disciplinasOptions: [], 
      loadingRiesgos: false,
      items: {
        proyecto: '',
        nombre: '',
        dni: '',
        fecha: new Date(),
        area: '',
        type: 'Seguro',
        categorias: [],
        riesgos: [],
        puntos: [],
        descripcion: '',
        medidas: '',
        url_front:null,
        url_back:null,
        disciplina: '',
      }
    }
  },
  mounted() {
    this.cargarProyectos();
    this.cargarRiesgos();
    this.cargarCategorias();
    this.cargarDisciplinas();
  },
  computed: {
    riesgoOptionsWithAll() {
      if (!this.riesgoOptions || this.riesgoOptions.length === 0) return [];

      // Solo mostrar opción "Todos" si no está en modo visualización
      if (!this.isViewMode) {
        return [{id: 0, name: 'Todos'}, ...this.riesgoOptions];
      }
      return this.riesgoOptions;
    },
    proyectos1() {
      return this.proyectosList || []; // Asegúrate que projects es el nombre correcto
    }
  },
  methods: {
    parseDateToISO1(dateStr) {
      // Asume formato DD/MM/YYYY
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`).toISOString();
    },
    async cargarCategorias() {
      try {
        const response = await GroupService.getGroups('', this.$store)

        if (response && response.data && response.data.rows) {
          // Mapea las categorías al formato que necesitas (array de strings)
          this.categoriaOptions = response.data.rows.map(cat => cat.name)

          // Si necesitas también los IDs para el formulario, puedes guardarlos en otro array
          this.categoriasCompletas = response.data.rows // Esto guarda objetos con id y name
        } else {
          console.error('Error al cargar categorías:', response?.message || 'Respuesta inválida')
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    },
    async cargarRiesgos() {
      this.loadingRiesgos = true;
      try {
        const response = await RegisterService.getRisk(`?limit=10000&filter=`, this.$store);
        console.log('Respuesta de riesgos:', response); // Esto muestra que response.data.rows existe

        // Corregimos la validación de la respuesta
        if (response && response.data && response.data.rows) {
          this.riesgoOptions = response.data.rows;
          console.log('Riesgos cargados:', this.riesgoOptions); // Verificamos los datos cargados
        } else {
          console.error('Error: La estructura de la respuesta no es la esperada', response);
        }
      } catch (error) {
        console.error('Error al cargar riesgos:', error);
      } finally {
        this.loadingRiesgos = false;
      }
    },
    async cargarDisciplinas() {
      this.loadingRiesgos = true;
      try {
        const response = await DisciplineService.getDiscipline(`?limit=10000&filter=`, this.$store);
        console.log('Respuesta de riesgos:', response); // Esto muestra que response.data.rows existe

        // Corregimos la validación de la respuesta
        if (response && response.data && response.data.rows) {
          this.disciplinasOptions = response.data.rows;
          console.log('Riesgos cargados:', this.disciplinasOptions); // Verificamos los datos cargados
        } else {
          console.error('Error: La estructura de la respuesta no es la esperada', response);
        }
      } catch (error) {
        console.error('Error al cargar riesgos:', error);
      } finally {
        this.loadingRiesgos = false;
      }
    },
    getProjects() {
      return this.proyectos // Retorna el array de proyectos que ya cargas
    },
    async cargarProyectos() {
      this.loadingProyectos = true;
      try {
        const response = await SedeService.getProyectos('', this.$store);
        if (response.status) {
          this.proyectos = response.data.rows;
        } else {
          console.error('Error al cargar proyectos:', response.data.message);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        this.loadingProyectos = false;
      }
    },
    handleRiesgosSelection(selected) {
      // Verificar si se seleccionó "Todos"
      const allSelected = selected.some(item => item.id === 0);
        
      if (allSelected) {
        // Si seleccionó "Todos", reemplazar con la opción "Todos" solamente
        this.items.riesgos = [{ id: 0, name: 'Todos' }];
      } else {
        // Si no, mantener la selección normal
        this.items.riesgos = selected;
      }
    },
    setData(item) {
      return new Promise(async (resolve) => {
        // Asegurarse de que los riesgos están cargados
        if (this.riesgoOptions.length === 0) {
          await this.cargarRiesgos();
        }
        if (this.disciplinasOptions.length === 0) {
          await this.cargarDisciplinas();
        }
        if (item) {
          // Verificar si tiene todos los riesgos
          const itemRiskIds = item.riesgos ? item.riesgos.map(r => r.id) : [];
          const allRiskIds = this.riesgoOptions.map(r => r.id);
          const hasAllRisks = allRiskIds.every(id => itemRiskIds.includes(id));
          
          this.items = {
            ...item,
            
            riesgos: hasAllRisks 
              ? [{ id: 0, name: 'Todos' }] // Mostrar solo "Todos" si tiene todos los riesgos
              : Array.isArray(item.riesgos) 
                ? item.riesgos 
                : [],
            puntos: Array.isArray(item.puntos) ? item.puntos : [],
            url_front: null,
            url_back: null,
            disciplina: item.disciplina || '' // Asegúrate de incluir la disciplina
          };

          this.isEdit = !item.isViewMode;
          this.isViewMode = item.isViewMode || false;
        } else {
          this.resetForm();
          this.isEdit = false;
          this.isViewMode = false;
        }
      
        this.$nextTick(() => resolve());
      });
    },
    resetForm() {
      this.items = {
        proyecto: '',
        nombre: '',
        dni: '',
        fecha: new Date(),
        area: '',
        type: 'Seguro',
        categorias: [],
        riesgos: [],
        puntos: [],
        descripcion: '',
        medidas: '',
        url_front:null,
        url_back:null,
      }
      if (this.$refs.refFormObserver) {
        this.$refs.refFormObserver.reset()
      }
    },
    
    async onSubmit() {
      this.isDisabled = true;

      try {
        // Preparar los riesgos (manteniendo tu lógica actual)
        const selectedRisks = this.items.riesgos.some(r => r.id === 0)
          ? this.riesgoOptions.map(r => r.id)  // Devuelve solo el ID (número)
          : this.items.riesgos.map(r => r.id); // Devuelve solo el ID (número)

        const selectedDisciplines = this.items.disciplina ? [this.items.disciplina] : [];
        // Crear FormData para manejar las imágenes
        const formData = new FormData();

        // Agrega todos tus campos existentes al FormData
        formData.append('projectId', this.items.proyecto);
        formData.append('worker_fullname', this.items.nombre);
        formData.append('worker_id_number', this.items.dni);
        formData.append('completed', this.items.fecha ? this.parseDateToISO1(this.items.fecha) : null);
        formData.append('area', this.items.area);
        formData.append('type', this.items.type);  // Añadir esta línea
        formData.append('categoryId', Number(this.items.categorias));
        formData.append('description', this.items.descripcion);
        formData.append('actions', this.items.medidas);
        formData.append('risks', JSON.stringify(selectedRisks));
        formData.append('disciplines', JSON.stringify(selectedDisciplines)); // Añadir disciplinas
        // Agrega las imágenes si están presentes
        if (this.items.url_front) {
          formData.append('files', this.items.url_front);
        }
        if (this.items.url_back) {
          formData.append('files', this.items.url_back);
        }

        
      
        // Configuración para FormData
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
      
        let response;
        if (this.isEdit) {
          response = await RegisterService.updateRecord(this.items.id, formData, this.$store, config);
        } else {
          response = await RegisterService.createRecord(formData, this.$store, config);
        }
      
        if (response && response.status !== false) {
          // En lugar de emitir un evento, llamamos directamente al método del padre
           this.$parent.$parent.currentPage = 1; // <--- Cambio clave 1
      
          // Actualizar los datos
          this.$parent.$parent.getAllData(); // <--- Esto ya lo tienes

          this.$emit('update:is-add', false);
          this.resetForm();

          this.$swal({
            title: 'Éxito',
            text: this.isEdit ? 'Registro actualizado correctamente' : 'Registro creado',
            icon: 'success'
          }).then(() => {
            // Forzar recarga si es necesario
            this.$forceUpdate();
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$swal({
          title: 'Error',
          text: error.message || 'Ocurrió un error',
          icon: 'error'
        });
      } finally {
        this.isDisabled = false;
      }
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.content-sidebar-header {
  border-bottom: 1px solid #ebe9f1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.text-danger {
  font-size: 0.857rem;
}
/* Estilos para el v-select en modo visualización */
.view-mode-select {
  &.vs--disabled {
    .vs__dropdown-toggle {
      background-color: white !important;
      border-color: #d8d6de !important;
      cursor: default !important;
    }
    
    .vs__selected {
      color: #6e6b7b !important;
      background-color: #f8f8f8 !important;
      border-color: #d8d6de !important;
    }
    
    .vs__search, 
    .vs__clear, 
    .vs__open-indicator {
      display: none !important;
    }
    
    .vs__actions {
      display: none !important;
    }
  }
}

/* Estilos para otros campos deshabilitados */
.form-control:disabled,
.form-control[readonly] {
  background-color: white !important;
  color: #6e6b7b !important;
  border-color: #d8d6de !important;
  cursor: default !important;
  opacity: 1 !important;
}

/* Estilos para radio buttons deshabilitados */
.custom-control-input:disabled ~ .custom-control-label {
  color: #6e6b7b !important;
  cursor: default !important;
}

/* Estilos para textareas deshabilitadas */
textarea:disabled {
  background-color: white !important;
  color: #6e6b7b !important;
  border-color: #d8d6de !important;
  cursor: default !important;
  resize: none !important;
}
/* Estilos para flatpickr deshabilitado */
.flatpickr-input[readonly] {
  background-color: white !important;
  cursor: default !important;
}
.view-mode-select {
  &.vs--disabled {
    .vs__selected {
      padding: 0.25rem 0.5rem;
      background-color: #005193 !important;
      border-color: #005193 !important;
      color: white !important;
      border-radius: 5px;
      margin: 2px;
      display: inline-flex;
    }
    
    .vs__deselect {
      display: none;
    }
  }
}
</style>