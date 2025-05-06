<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-new-speciality"
    :visible="isAddProject"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    no-close-on-backdrop
    @change="(val) => $emit('update:is-add-project', val)"
  >
    <template #default="{ hide }" >
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">Agregar nuevo Proyecto</h5>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click=";[hide(), resetForm()]" />
      </div>

      <validation-observer #default="{ invalid }" ref="refFormObserver">

        <b-form class="p-2" @submit.prevent="onSubmit(items)">
          <!-- <validation-provider #default="{ errors }" name="projectPhoto" rules="">
            <b-form-group label="Foto" label-for="aplication-img" class="mb-0">
              <div class="d-flex flex-row justify-content-center w-100 h-100">
                <b-media class="mb-2 flex-column flex-xl-row w-100" id="aplication-img">
                  <template #aside class="w-100">
                    <div class="d-flex justify-content-center w-100">
                      <b-avatar
                        ref="previewEl"
                        :variant="`light-info`"
                        size="120px"
                        class="avatar_img relative"
                        rounded
                      >
                        <img
                          class="w-100 h-100"
                          :src="tempUrl != '' ? apiurl + tempUrl : urlFile ? urlFile : sideImg"
                          alt=""
                        />
                      </b-avatar>
                    </div>
                  </template>
                </b-media>
                <div class="box_buttons d-flex flex-column mt-1 w-100">
                  <div class="text-center w-100">
                    <b-button @click.prevent="deleteImage(true)" variant="danger" class="w-100">
                      <feather-icon icon="Trash2Icon" size="18" />Eliminar</b-button
                    >
                  </div>
                  <div @click="$refs.fileImg.$el.click()" class="w-100 mt-1">
                    <b-form-file
                      :hidden="true"
                      plain
                      class="form_file"
                      id="inputTagFile"
                      @change="uploadImage"
                      ref="fileImg"
                      accept=".png,.jpg"
                    />
                    <label for="fileImg" class="block cursor-pointer w-100">
                      <div class="text-center">
                        <b-button
                          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                          variant="success"
                          size="md"
                          class="button_file w-100"
                        >
                          <feather-icon icon="UploadIcon" size="18" />
                          Subir
                        </b-button>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </b-form-group>
          </validation-provider> -->
          <validation-provider #default="{ errors }" name="code" rules="requeridoE">
            <b-form-group label="Codigo" label-for="code">
              <b-form-input
                id="code"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Codigo"
                v-model="items.code"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="name" rules="requeridoE">
            <b-form-group label="Nombre" label-for="name" class="mb-0">
              <b-form-input
                v-model="items.description"
                id="name"
                placeholder="Nombre"
                autocomplete="off"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
          <!-- <validation-provider #default="{ errors }" name="participation" rules="requeridoE">
            <b-form-group label="Participación" label-for="participation">
              <b-form-input
                id="participation"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Participación"
                v-model="items.participation"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="{ errors }"
            name="gerente"
            rules="requeridoE"
          >
            <b-form-group label="Gerente" label-for="gerente">
              <b-form-input
                id="gerente"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Gerente"
                v-model="items.manager"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="{ errors }"
            name="contractType"
            rules="requeridoE"
          >
            <b-form-group label="Tipo de Contrato" label-for="contractType">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="tipos"
                label="name"
                input-id="company"
                :reduce="(tipos) => tipos.name"
                placeholder="Tipo de Contrato"
                v-model="items.contract_type"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="amount" rules="requeridoE">
            <b-form-group label="Monto" label-for="amount">
              <b-form-input
                id="amount"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Monto"
                v-model="items.amount"
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="{ errors }"
            name="is_automatic"
            rules="requeridoE"
          >
            <b-form-group label="Liberación automatica por Dueño" label-for="is_automatic">
              
             
              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">No</span>
                <b-form-checkbox v-model="items.is_automatic" name="is_automatic" switch >                       
                </b-form-checkbox>                       
                  <span class="ml-2">Sí</span>
              </div>
            </b-form-group>

          </validation-provider>
          <b-form-group label="Migrar Areas" label-for="migrate_areas" v-if="!isEdit">
            <div class="d-flex w-50 align-items-center mt-1 ml-1">
              <span class="mr-2">No</span>
              <b-form-checkbox v-model="items.migrate_areas" name="migrate_areas" switch>
              </b-form-checkbox>
              <span class="ml-2">Sí</span>
            </div>
          </b-form-group>
          <b-form-group label="Migrar Categorias" label-for="migrate_categories" v-if="!isEdit">
            <div class="d-flex w-50 align-items-center mt-1 ml-1">
              <span class="mr-2">No</span>
              <b-form-checkbox v-model="items.migrate_categories" name="migrate_categories" switch>
              </b-form-checkbox>
              <span class="ml-2">Sí</span>
            </div>
          </b-form-group>
          <b-form-group label="Migrar Especialidad" label-for="migrate_specialization" v-if="!isEdit">
            <div class="d-flex w-50 align-items-center mt-1 ml-1">
              <span class="mr-2">No</span>
              <b-form-checkbox v-model="items.migrate_specialization" name="migrate_specialization" switch>
              </b-form-checkbox>
              <span class="ml-2">Sí</span>
            </div>
          </b-form-group>    -->
       
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="invalid"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled" class="px-1">guardando...</span>
              <span v-else>{{ isEdit ? 'Actualizar' : 'Agregar' }}</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click=";[hide(), resetForm()]"
            >
              Cancel
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
  <!-- <b-modal id="add-new-project" class="project-modal" :visible="isAddProject" bg-variant="white" ok-only backdrop size="project-size"
  @hidden="resetForm()" :title="isEdit ? 'Editar Proyecto' : 'Agregar nuevo Proyecto'"
    no-header centered no-close-on-backdrop hide-footer @change="(val) => $emit('update:is-add-project', val)">
      

      <validation-observer #default="{ invalid }" ref="refFormObserver">

        <b-form class="p-2">
          <form-wizard
              ref="wizard"
              color="#7367F0"
              :title="null"
              :subtitle="null"
              next-button-text="Siguiente"
              back-button-text="Atrás"
              finish-button-text="Finalizar"
              class="steps-transparent mb-3"
              @on-complete="saveData"
            >
              <tab-content
              title="Establecer Rest."
              icon="feather icon-folder"
              :before-change="validEstablecer">
              <div class="d-flex flex-row justify-content-center w-100 h-100">
                <div class="w-100">
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
                  </div>
                  <div class="w-100 ml-1">

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
                <validation-provider #default="{ errors }" name="contractType" rules="">
                  <b-form-group label="Tipo de Contrato" label-for="contractType">
                    
                      <b-form-input id="contractType" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="Tipo de Contrato"
                    v-model="items.contract_type" />
                    <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                    }}</small>
                  </b-form-group>
                </validation-provider>
                <validation-provider #default="{ errors }" name="amount" rules="requeridoE">
                  <b-form-group label="Monto" label-for="amount">
                    <b-form-input type="number" id="amount" trim :class="errors.length > 0 ? 'is-invalid' : null" placeholder="Monto"
                      v-model="items.amount" />
                    <small class="text-danger alert" :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }">{{ errors[0]
                    }}</small>
                  </b-form-group>
                </validation-provider>
                <validation-provider>
                  <b-form-group label="Visible para Lecciones" label-for="show_lesson">
                    <div class="d-flex w-50 align-items-center mt-1 ml-1">
                      <span class="mr-2">No</span>
                      <b-form-checkbox v-model="items.show_lesson" name="show_lesson" switch>
                      </b-form-checkbox>
                      <span class="ml-2">Sí</span>
                    </div>
                  </b-form-group>
                </validation-provider>
              </div>
              </div>
              </tab-content>
              <tab-content
                title="Datos Rest."
                icon="feather icon-clipboard"
                :before-change="validEstablecer">
                <div class="column-switch">
                  <div>
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
                  </div>
                  <div>
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
                  </div>
                </div>
                
              </tab-content>
          </form-wizard>
        </b-form>
      </validation-observer>
  </b-modal> -->
</template>

<script>
/* eslint-disable*/
import Vue from 'vue'
const APIURL = process.env.APIURLFILE
import { BootstrapVue } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select'
import EnterpriseService from '@/services/EnterpriseService'
import UserService from '@/services/UserService'
import home from '@/views/home.vue'
import VueBus from 'vue-bus';

Vue.use(BootstrapVue)
Vue.use(VueBus);

export default {
  directives: {
    Ripple
  },
  components: {
    // Form Validation
    ValidationProvider,
    ValidationObserver,
    vSelect,
    FormWizard,
    TabContent,
},
  props: {
    isAddProject: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      migrate_areas:false,
      migrate_categories:false,
      migrate_specialization:false,
      optionsAutomatic: [
        {
          value: 'no',
          text: 'No'
        },
        {
          value: 'si',
          text: 'Si'
        },     
      ],
      required,
      // speciality: {
      //   title: ''
      // },
      isEdit: false,
      isDisabled: false,
      tipos: [
        {
          id: 'Lineas de Conduccion',
          name: 'Lineas de Conduccion'
        },
        {
          id: 'Obras Civiles',
          name: 'Obras Civiles'
        },
        {
          id: 'PADs',
          name: 'PADs'
        },
        {
          id: 'Movimiento de Tierras',
          name: 'Movimiento de Tierras'
        }, 
        {
          id: 'Desarrollo y explotación subterraneo',
          name: 'Desarrollo y explotación subterráneo'
        },
        {
          id: 'Desarrollo y explotacion T. abierto',
          name: 'Desarrollo y explotación T. abierto'
        },
        {
          id: 'Vivienda',
          name: 'Vivienda'
        },
        {
          id: 'Centros Comerciales',
          name: 'Centros Comerciales'
        },
        {
          id: 'Oficinas',
          name: 'Oficinas'
        },
        {
          id: 'Hoteles',
          name: 'Hoteles'
        },
        {
          id: 'Talleres y almacenes',
          name: 'Talleres y almacenes'
        },
        {
          id: 'Obras de Saneamiento',
          name: 'Obras de Saneamiento'
        },
        {
          id: 'Puentes',
          name: 'Puentes'
        },
        {
          id: 'Intercambios viales y pistas',
          name: 'Intercambios viales y pistas'
        },
        {
          id: 'Aeropuertos',
          name: 'Aeropuertos'
        },
        {
          id: 'Obras subterraneas',
          name: 'Obras subterráneas'
        },
        {
          id: 'Obras hidraulicas',
          name: 'Obras hidráulicas'
        },
        {
          id: 'Obras Portuarias',
          name: 'Obras Portuarias'
        },
        {
          id: 'Edificaciones Industriales',
          name: 'Edificaciones Industriales'
        },
        {
          id: 'Carreteras',
          name: 'Carreteras'
        },
      ],
      tempUrl: '',
      apiurl: APIURL,
      sideImg: require('@/assets/images/access/default.png'),
      urlFile: '',
      items: {
        code: '',
        description: '',
      },
      temp: {},
      // records: []
    }
  },
  mounted() {
    
  },
  methods: {
    // async getUsers() {
    //   const resp = await UserService.getUsers('', this.$store)
    //   console.log('resp', resp)
    //   if (resp.status) {
    //     this.records = resp.data.rows
    //   }
    // },
    validEstablecer() {
      return new Promise((resolve, reject) => {
      
        this.$refs.refFormObserver.validate().then((success) => {
          if (success) { 
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    setData(items) {
      if (Object.entries(items).length !== 0) {
        this.temp = items
        this.items.id = items.id
        this.items.code = items.code
        this.items.manager = items.manager
        this.items.description = items.description
        this.items.contract_type = items.contract_type
        this.items.participation = items.participation
        this.items.amount = items.amount
        this.items.show_lesson = items.show_lesson

        /* this.items.is_automatic = items.is_automatic */
        console.log(items.is_automatic,"QUE AUTO ES")

        if(items.is_automatic == 'si'){
          this.items.is_automatic = true
        }else{
          this.items.is_automatic = false
        }
        // this.items.users = items.users
        this.tempUrl = items.photo
        this.isEdit = true
        console.log(this.items.is_automatic,"ES AUTOMATICO??")
      } else {
        this.temp = {}
        this.items = {
          code: '',
          description: '',
        }
        this.isEdit = false
      }
      console.log('temp EN ADD', this.temp)
    },
    resetForm() {
      /* this.$refs.refFormObserver.reset() */
      this.isEdit = false
      this.items = {
        code: '',
        description: '',
        
      }
     
    },
    deleteImage(val) {
      this.$refs.fileImg.files = []
      this.items.photo = null
      this.urlFile = ''
      this.tempUrl = ''
      // this.delete_image = val
    },
    uploadImage(e) {
      const file = e.target.files[0]
      if (file != undefined) {
        let nameFile = file.name
        let ext = nameFile.slice(((nameFile.lastIndexOf('.') - 1) >>> 0) + 2)
        if (ext == 'png' || ext == 'jpg') {
          // this.delete_image = false
          let inputImage = document.getElementById('inputTagFile').files[0]
          console.log('inputImage', inputImage)
          this.urlFile = URL.createObjectURL(file)
          this.items.photo = inputImage
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error!',
            text: 'Tipo de archivo no permitido.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
        }
      }
    },
    async onSubmit() {
      let data = this.items

      /* data.amount = parseFloat(data.amount) */
      console.log('data', data)
      this.$refs.refFormObserver.validate().then(async (success) => {
        this.showLoading = true

        if (success) {
          let resp = ''
          resp = await EnterpriseService.saveEnterprise(data, this.$store)
          
          console.log('datos', data)
          console.log('resp', resp)
          if (resp.status) {
            this.$swal({
              title: 'Regitrado',
              text: 'El proyecto ha sido registrado.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
            
            this.$bus.emit('executeGetData');
            this.$emit('update:is-add-project', false)

            this.resetForm()
            

          } else {
            this.$swal({
              title: 'Error!',
              text:
                ' Hubo un error al registrar' +
                ' el proyecto',
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

.link-maintainer:hover{
  background-color: #005193;
  cursor: pointer;
  h5{
    color:white;
  }
};
hr {
  margin-top: 0.1rem !important;
  margin-bottom: 0.1rem !important;
};
div.modal-dialog.modal-project-size.modal-dialog-centered{
  max-width: 70vw !important;

}
.column-switch{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

</style>
