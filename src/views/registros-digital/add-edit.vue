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
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nuevo' }} observación</h5>
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
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Estado (Seguro/Inseguro) -->
          <validation-provider #default="{ errors }" name="estado" >
            <b-form-group label="Estado" label-for="estado">
              <b-form-radio-group
                v-model="items.estado"
                :options="estadoOptions"
                name="estado"
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
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Riesgos -->
          <validation-provider #default="{ errors }" name="riesgos" >
            <b-form-group label="Riesgos" label-for="riesgos">
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
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-4 justify-content-end">
            <b-button
              :disabled="invalid"
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
        { text: 'Seguro', value: 'seguro' },
        { text: 'Inseguro', value: 'inseguro' }
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
      loadingRiesgos: false,
      items: {
        proyecto: '',
        nombre: '',
        dni: '',
        fecha: new Date(),
        area: '',
        estado: 'seguro',
        categorias: [],
        riesgos: [],
        puntos: [],
        descripcion: '',
        medidas: ''
      }
    }
  },
  mounted() {
    this.cargarProyectos();
    this.cargarRiesgos();
    this.cargarCategorias();
  },
  computed: {
    riesgoOptionsWithAll() {
      // Asegurarse de que riesgoOptions esté definido
      if (!this.riesgoOptions) return [];

      // Crear opción "Todos" con misma estructura que otros riesgos
      const todosOption = {id: 0, name: 'Todos'};

      // Asegurarse de que cada riesgo tenga la estructura correcta
      const riesgos = this.riesgoOptions.map(item => ({
        id: item.id,
        name: item.name
      }));

      return [todosOption, ...riesgos];
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
        const response = await RegisterService.getRisk('', this.$store);
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
      // Verificar si se está seleccionando "Todos" (id: 0)
      const isSelectingAll = selected.some(item => item.id === 0);

      // Verificar si ya tenía "Todos" seleccionado
      const hadAllSelected = this.items.riesgos.some(item => item.id === 0);

      // Si se selecciona "Todos" (ya sea que antes tenía o no)
      if (isSelectingAll) {
        // Limpiar toda selección anterior y dejar solo "Todos"
        this.items.riesgos = selected.filter(item => item.id === 0);
        return;
      }
    
      // Si estaba seleccionado "Todos" y ahora se quita
      if (hadAllSelected && !isSelectingAll) {
        // Permitir la nueva selección (sin "Todos")
        this.items.riesgos = selected;
        return;
      }
    
      // En cualquier otro caso, actualizar la selección normalmente
      this.items.riesgos = selected;
    },
    setData(item) {
      return new Promise((resolve) => {
        if (item) {
          this.items = {
            ...item,
            riesgos: Array.isArray(item.riesgos) ? item.riesgos : [],
            puntos: Array.isArray(item.puntos) ? item.puntos : []
          };
          this.isEdit = true;
        } else {
          this.resetForm();
          this.isEdit = false;
        }

        // Resolver la promesa después de que Vue haya actualizado la vista
        this.$nextTick(() => {
          resolve();
        });
      });
    },
    resetForm() {
      this.items = {
        proyecto: '',
        nombre: '',
        dni: '',
        fecha: new Date(),
        area: '',
        estado: 'seguro',
        categorias: [],
        riesgos: [],
        puntos: [],
        descripcion: '',
        medidas: ''
      }
      if (this.$refs.refFormObserver) {
        this.$refs.refFormObserver.reset()
      }
    },
    
    async onSubmit() {
      this.isDisabled = true;
        
      try {
        
        // Preparar los datos para enviar en el formato que espera tu API
        const formData = {
          projectId: this.items.proyecto,
          worker_fullname: this.items.nombre,
          worker_id_number: this.items.dni,
          completed: this.items.fecha ? this.parseDateToISO1(this.items.fecha) : null,
          area: this.items.area,
          flag: this.items.estado === 'seguro' ? 1 : 0,
          categoryId: Number(this.items.categorias),
          description: this.items.descripcion,
          actions: this.items.medidas,
          risks: this.items.riesgos
          ? this.items.riesgos
              .filter(r => r.id !== 0) // Filtra "Todos" si existe
              .map(r => ({ id: r.id }))
          : []
        };
      
        let response;
      
        if (this.isEdit) {
          // Actualizar registro existente
          response = await RegisterService.updateRecord(this.items.id, formData, this.$store);
        }
      
        if (response && response.status !== false) {
          // Emitir evento para actualizar la lista
          this.$emit('saved');
          this.$emit('update:is-add', false);
          this.resetForm();
        } else {
          throw new Error(response?.message || 'Error al actualizar el registro');
        }
      } catch (error) {
        console.error('Error al guardar registro:', error);
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
</style>