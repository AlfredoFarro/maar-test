<template>
  <!-- eslint-disable -->
  <div>
    <add-edit :is-add.sync="isAdd" ref="proyectosAdd"> </add-edit>
    <b-card no-body>
      <b-card-header class="px-2 py-2 pb-0">
        <b-row class="w-100 h-100">
          <b-col md="3">
            <label>RUC</label>
            <b-form-input @input="filter" v-model="ruc" placeholder="Nombre" />
          </b-col>
          <b-col md="5">
            <div class="d-flex justify-content-center justify-content-md-start align-items-center mt-1 h-100">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="secondary"
                class="mr-1"
                @click.prevent="clean"
              >
                <span class="align-middle">Ver Todos</span>
              </b-button>
            </div>
          </b-col>
          <b-col md="4">
            <div class="d-flex align-items-center justify-content-center justify-content-md-end mt-1 h-100">
              <b-button variant="primary" class="mb-25" @click="addLocal">
                <span class="text-nowrap">Agregar elemento</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-card-header>
    </b-card>
<!--     <b-modal
          id="add-new-project"
          ref="add-new-project"
          centered
          :title="isEdit ? 'Actualizar Tareas Programadas' : 'Agregar Tareas Programadas'"
          ok-only
          hide-footer
          size="lg"
          no-close-on-backdrop
          @hide="resetForm"
        >
        <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">{{ isEdit ? 'Editar' : 'Agregar nuevo' }} Proyecto</h5>
  
          <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click=";[hide(), resetForm()]" />
        </div>
  
        <validation-observer #default="{ invalid }" ref="refFormObserver">
  
          <b-form class="p-2" @submit.prevent="onSubmit(items)">
            <validation-provider #default="{ errors }" name="projectPhoto" rules="">
              <b-form-group label="Foto" label-for="aplication-img" class="mb-0">
                <div class="d-flex flex-row justify-content-center w-100 h-100">
                  <b-media class="mb-2 flex-column flex-xl-row w-100" id="aplication-img">
                    <template #aside class="w-100">
                      <div class="d-flex justify-content-center w-100">
                        <b-avatar ref="previewEl" :variant="`light-info`" size="120px" class="avatar_img relative" rounded>
                          <img class="w-100 h-100" :src="tempUrl != '' ? apiurl + tempUrl : urlFile ? urlFile : sideImg"
                            alt="" />
                        </b-avatar>
                      </div>
                    </template>
                  </b-media>
                  <div class="box_buttons d-flex flex-column mt-1 w-100">
                    <div class="text-center w-100">
                      <b-button @click.prevent="deleteImage(true)" variant="danger" class="w-100">
                        <feather-icon icon="Trash2Icon" size="18" />Eliminar</b-button>
                    </div>
                    <div @click="$refs.fileImg.$el.click()" class="w-100 mt-1">
                      <b-form-file :hidden="true" plain class="form_file" id="inputTagFile" @change="uploadImage"
                        ref="fileImg" accept=".png,.jpg" />
                      <label for="fileImg" class="block cursor-pointer w-100">
                        <div class="text-center">
                          <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="success" size="md"
                            class="button_file w-100">
                            <feather-icon icon="UploadIcon" size="18" />
                            Subir
                          </b-button>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="code" rules="requeridoE">
              <b-form-group label="Codigo" label-for="code">
                <b-form-input id="code" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="Codigo"
                  v-model="items.code" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="description" rules="">
              <b-form-group label="Descripción" label-for="description" class="mb-1">
                <b-form-textarea id="description" placeholder="Descripción" rows="5" max-rows="5" no-resize
                  v-model="items.description"></b-form-textarea>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="participation" rules="requeridoE">
              <b-form-group label="Participación" label-for="participation">
                <b-form-input id="participation" trim :class="errors.length > 0 ? 'is-invalid' : null"
                  placeholder="Participación" v-model="items.participation" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="gerente" rules="requeridoE">
              <b-form-group label="Gerente" label-for="gerente">
                <b-form-input id="gerente" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="Gerente"
                  v-model="items.manager" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="contractType" rules="requeridoE">
              <b-form-group label="Tipo de Contrato" label-for="contractType">
                <v-select :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="tipos" label="name"
                  input-id="company" :reduce="(tipos) => tipos.name" placeholder="Tipo de Contrato"
                  v-model="items.contract_type" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="amount" rules="requeridoE">
              <b-form-group label="Monto" label-for="amount">
                <b-form-input id="amount" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="Monto"
                  v-model="items.amount" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="is_automatic" rules="requeridoE">
              <b-form-group label="Liberación automatica por Dueño" label-for="is_automatic">
  
                <div class="d-flex w-50 align-items-center mt-1 ml-1">
                  <span class="mr-2">No</span>
                  <b-form-checkbox v-model="items.is_automatic" name="is_automatic" switch>
                  </b-form-checkbox>
                  <span class="ml-2">Sí</span>
                </div>
              </b-form-group>
            </validation-provider>
            <validation-provider #default="{ errors }" name="url_powerbi" rules="">
  
              <b-form-group label="URL PowerBi" label-for="url_powerbi" v-if="isEdit">
                <b-form-input id="url_powerbi" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="URL PowerBi"
                  v-model="items.url_powerbi" />
                <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                }}</small>
              </b-form-group>
            </validation-provider>
  
  
            <b-form-group label="Migrar Areas" label-for="migrate_areas" v-if="!isEdit">
              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">No</span>
                <b-form-checkbox v-model="migrate_areas" name="migrate_areas" switch>
                </b-form-checkbox>
                <span class="ml-2">Sí</span>
              </div>
            </b-form-group>
            <b-form-group label="Migrar Categorias" label-for="migrate_categories" v-if="!isEdit">
              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">No</span>
                <b-form-checkbox v-model="migrate_categories" name="migrate_categories" switch>
                </b-form-checkbox>
                <span class="ml-2">Sí</span>
              </div>
            </b-form-group>
            <b-form-group label="Migrar Especialidad" label-for="migrate_specialization" v-if="!isEdit">
              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">No</span>
                <b-form-checkbox v-model="migrate_specialization" name="migrate_specialization" switch>
                </b-form-checkbox>
                <span class="ml-2">Sí</span>
              </div>
            </b-form-group>    
            
              <b-form-group label="Usuarios" label-for="users">
                <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="records"
                  label="name"
                  input-id="users"
                  :reduce="(records) => records.id"
                  placeholder="Usuarios"
                  v-model="items.users"
                  multiple
                />
                <small
                  class="text-danger alert"
                  :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                  >{{ errors[0] }}</small
                >
              </b-form-group>
            <div class="d-flex mt-2 justify-content-end">
              <b-button :disabled="invalid" v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2"
                type="submit">
                <b-spinner v-if="isDisabled" small />
                <span v-if="isDisabled" class="px-1">guardando...</span>
                <span v-else>{{ isEdit ? 'Actualizar' : 'Agregar' }}</span>
              </b-button>
              <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary"
                @click=";[hide(), resetForm()]">
                Cancel
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
        </b-modal> -->
  </div>
</template>

<script>
/* eslint-disable*/
import Vue from 'vue'
import { BootstrapVue, VBToggle } from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import addEdit from './add-edit.vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
Vue.use(BootstrapVue)
export default {
  directives: {
    'b-toggle': VBToggle,
    Ripple
  },
  data() {
    return {
      isAdd: false,
      isUpdate: false,
      see_more: false,
      ruc: '',
      company_id: null,
      roleFilter: null,
      records: [],
      showEntrie: 10,
      arrayFilters: [],
      userData: {}
    }
  },
  components: {
    vSelect,
    addEdit
  },
  mounted() {},
  methods: {
    clickSeeMore() {
      this.see_more = !this.see_more
    },
    addLocal() {
      /* this.$refs['add-new-project'].show()
      this.$refs['add-new-project'].setData({}) */
      this.isAdd = true
      this.$refs.proyectosAdd.setData({})
    },
    async filter() {
      var arrayFilter = []
      if (this.ruc != '' && this.ruc != null) {
        arrayFilter.push({
          keyContains: 'ruc',
          key: 'contains',
          value: this.ruc
        })
      }
      console.log('arrayFilter', arrayFilter)
      // await new Promise((resolve) => setTimeout(resolve, 100));
      this.$parent.$parent.arrayFilters = arrayFilter
      this.$parent.$parent.getData()
    },
    clean() {
      this.ruc = ''
      var arrayFilter = []
      this.$parent.$parent.arrayFilters = arrayFilter
      this.$parent.$parent.getData()
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.body_card {
  display: block;
  transition: 0.3s;
}
</style>
