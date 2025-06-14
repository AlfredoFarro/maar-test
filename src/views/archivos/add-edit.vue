<template>
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
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar' }} Documento</h5>
        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide(); resetForm()" />
      </div>

      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <b-form class="p-2" @submit.prevent="handleSubmit">
          
          <!-- Tipo de documento -->
          <validation-provider name="Tipo de documento" rules="required" #default="{ errors }">
            <b-form-group label="Tipo de documento" label-for="fileType">
              <b-form-select
                v-model="formData.fileTypeId"
                :options="fileTypeOptions"
                id="fileType"
                :state="errors.length ? false : null"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>Seleccione tipo</b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subir archivo -->
          <b-form-group label="Archivo" label-for="file">
            <b-form-file
              id="file"
              v-model="formData.file"
              :state="formData.file ? true : null"
              placeholder="Seleccione un archivo..."
            />
          </b-form-group>

          <!-- Descripción -->
          <validation-provider name="Descripción" rules="required" #default="{ errors }">
            <b-form-group label="Descripción" label-for="description">
              <b-form-input
                id="description"
                v-model="formData.description"
                placeholder="Descripción del archivo"
                autocomplete="off"
                :state="errors.length ? false : null"
              />
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Usuario -->
          <validation-provider name="Usuario" rules="required" #default="{ errors }">
            <b-form-group label="Asignar a usuario" label-for="userId">
              <b-form-select
                v-model="formData.userId"
                :options="userOptions"
                id="userId"
                :state="errors.length ? false : null"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>Seleccione usuario</b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Botones -->
          <div class="d-flex mt-2 justify-content-end">
            <b-button :disabled="invalid || isSubmitting" variant="primary" class="mr-2" type="submit">
              <b-spinner v-if="isSubmitting" small />
              <span v-if="isSubmitting">Procesando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
            </b-button>
            <b-button variant="outline-secondary" @click="hide(); resetForm()">Cancelar</b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import FileTypeService from '@/services/FileTypeService'
import UserService from '@/services/UserService'
import FileService from '@/services/FilesService'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    isAdd: { type: Boolean, required: true }
  },
  data() {
    return {
      isEdit: false,
      isSubmitting: false,
      formData: {
        id: null,
        fileTypeId: null,
        file: null,
        description: '',
        userId: null
      },
      fileTypeOptions: [],
      userOptions: []
    }
  },
  watch: {
    isAdd(val) {
      if (val) {
        this.fetchDropdownData()
      }
    }
  },
  methods: {
    async fetchDropdownData() {
      const url = `?limit=10000`;
      try {
        
        const [fileTypes, users] = await Promise.all([
          FileTypeService.getFileType(url, this.$store),
          UserService.getUsers(url, this.$store)
        ])

        this.fileTypeOptions = fileTypes?.data?.rows?.map(t => ({
          value: t.id,
          text: t.name
        })) || []

        this.userOptions = users?.data?.rows?.map(u => ({
          value: u.id,
          text: u.fullname
        })) || []

      } catch (error) {
        console.error('Error cargando opciones:', error)
      }
    },

    setData(fileData = null) {
      if (fileData) {
        this.formData = {
          id: fileData.id,
          fileTypeId: fileData.filetypeId ,
          file: null, // No se precarga el archivo
          description: fileData.description,
          userId: fileData.userId 
        }
        this.isEdit = true
      } else {
        this.resetForm()
      }
    },

    resetForm() {
      this.formData = {
        id: null,
        fileTypeId: null,
        file: null,
        description: '',
        userId: null
      }
      this.isEdit = false
      this.$nextTick(() => {
        this.$refs.refFormObserver?.reset()
      })
    },

    async handleSubmit() {
      try {
        this.isSubmitting = true

        const payload = new FormData()
        payload.append('filetypeId', this.formData.fileTypeId)
        payload.append('description', this.formData.description)
        payload.append('userId', this.formData.userId)
        payload.append('name', this.formData.description)
        if (this.formData.file) {
          payload.append('file', this.formData.file)
        }

        const response = this.isEdit
          ? await FileService.updateFile(this.formData.id, payload, this.$store)
          : await FileService.saveFile(payload, this.$store)

        if (response?.status === true) {
          this.$parent?.$parent?.getAllData?.()
          this.$emit('update:is-add', false)
          this.resetForm()
        } else {
          throw new Error(response.message || 'Error al guardar')
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error)
      } finally {
        this.isSubmitting = false
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
