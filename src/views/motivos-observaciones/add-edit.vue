<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-ditem"
    :visible="isAdd"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow backdrop no-header right no-close-on-backdrop
    @change="(val) => $emit('update:is-add', val)"
  >
    <template #default="{ hide }">
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar' }} motivo/observación</h5>
        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide(); resetForm()" />
      </div>

      <validation-observer #default="{ invalid }" ref="refFormObserver">
        <b-form class="p-2" @submit.prevent="handleSubmit">
          <validation-provider #default="{ errors }" name="Acción" rules="required">
            <b-form-group label="Acción disciplinaria" label-for="action">
              <b-form-select
                id="action"
                v-model="form.action"
                :options="actionOptions"
                :state="errors.length ? false : null"
              />
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <b-form-group label="Motivo">
            <b-form-textarea
              v-model="form.reason"
              rows="3"
              placeholder="Escribe el motivo…"
              autocomplete="off"
            />
          </b-form-group>

          <b-form-group label="Observación">
            <b-form-textarea
              v-model="form.observation"
              rows="3"
              placeholder="Escribe la observación…"
              autocomplete="off"
            />
          </b-form-group>

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
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import DisciplinaryItemService from '@/services/DisciplinaryItemService'

export default {
  components: { ValidationProvider, ValidationObserver },
  props: { isAdd: { type: Boolean, required: true } },
  data() {
    return {
      form: {
        id: null,
        action: null,
        reason: '',        
        observation: '',
      },
      isEdit: false,
      isSubmitting: false,
      actionOptions: [
        { value: 'Amonestación escrita', text: 'Amonestación escrita' },
        { value: 'Suspensión', text: 'Suspensión' },
        { value: 'Falta Muy Grave RISST', text: 'Falta Muy Grave RISST' },
      ],
    }
  },
  methods: {
    setData(payload = null) {
      if (payload) {
        this.form = {
          id: payload.id || null,
          action: payload.action || null,
          reason: payload.reason || '',             
          observation: payload.observation || '', 
        }
        this.isEdit = !!payload.isEdit
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.form = { id: null, action: null, reason: '', observation: '' }
      this.isEdit = false
      this.$nextTick(() => this.$refs.refFormObserver?.reset())
    },
    async handleSubmit() {
      try {
        this.isSubmitting = true

        if (!this.form.action) throw new Error('Selecciona una acción disciplinaria')

        const reason = (this.form.reason || '').trim() || null
        const observation = (this.form.observation || '').trim() || null

        if (!this.isEdit && !reason && !observation) {
          throw new Error('Ingresa al menos un Motivo u Observación.')
        }

        const payload = { action: this.form.action, reason, observation }

        const resp = (this.isEdit && this.form.id)
          ? await DisciplinaryItemService.update(this.form.id, payload, this.$store)
          : await DisciplinaryItemService.create(payload, this.$store)

        if (!resp?.status) throw new Error(resp?.data?.message || 'No se pudo guardar')

        this.$emit('saved')
        this.resetForm()
      } catch (e) {
        this.$swal({ icon: 'error', title: 'Error', text: e.message || 'Ocurrió un error' })
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

<style lang="scss">
.content-sidebar-header { border-bottom: 1px solid #ddd; margin-bottom: 1rem; }
.sidebar-lg { width: 520px; }
</style>
