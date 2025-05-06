<template>
  <!-- eslint-disable -->
  
  <div class="w-100">

    <!-- <div class="container">
      <div class="container">
        <VueSignaturePad
          id="signatureD"
          style="width: 700px !important; height: 300px !important;"
          ref="signaturePad"
          scaleToDevicePixelRatio
          fitToContainer
          :options="{ onBegin, onEnd }"
        />
      </div>
      <div class="buttons">
        <button @click="undo">Undo</button>
        <button @click="save">Save</button>
        <button @click="change">Change Color</button>
        <button @click="resume">Resume Color</button>
      </div>
    </div> -->

    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
    
    <!-- <filters :filtros="fields" :is-add.sync="isAdd" ref="filters"> </filters> -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <validation-observer #default="{ invalid }" ref="refFormObserver">
        <!-- Form -->

        <b-form class="p-2" @submit.prevent="onSubmit(items)">
          
          <validation-provider #default="{ errors }" name="docType" rules="requeridoE">
            <b-form-group label="Tipo de Docuemnto" label-for="docType">
              <v-select
                id="docType"
                label="text"
                :reduce="(types) => types.value"
                :options = "types"
                v-model="items.docType"
                placeholder="Tipo de Documento"
                autocomplete="off"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="document" rules="requeridoE">
            <b-form-group label="Documento" label-for="document">
              <b-form-input
                v-model="items.document"
                id="document"
                placeholder="Documento"
                autocomplete="off"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="fullname" rules="requeridoE">
            <b-form-group label="Nombre" label-for="fullname">
              <b-form-input
                v-model="items.fullname"
                id="fullname"
                placeholder="Nombre"
                autocomplete="off"
                disabled
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
            name="email"
            rules="requeridoE|correo"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                trim
                :class="errors.length > 0 ? 'is-invalid' : null"
                placeholder="Email"
                v-model="items.email"
                autocomplete="username"
                disabled
                />
              <small
                class="text-danger alert"
                :style="{
                  height: (errors.length > 0 ? 20 : 0) + 'px',
                }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>

          <b-form-group>
            <div class="d-flex justify-content-between">
              <label for="password">Contraseña</label>
            </div>
              <b-input-group
                class="input-group-merge"
              >
                <b-form-input
                  id="password"
                  trim
                  v-model="items.password"
                  :type="passwordFieldType"
                  name="login-password"
                  autocomplete="new-password"
                  placeholder="Contraseña"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="passwordToggleIcon"
                    @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
          </b-form-group>

          <validation-provider #default="{ errors }" name="position" rules="requeridoE">
            <b-form-group label="Posición" label-for="position">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="positions"
                label="description"
                input-id="position"
                :reduce="(positions) => positions.id"
                v-model="items.positionId"
                placeholder="Posición"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="role" rules="requeridoE">
            <b-form-group label="Rol" label-for="role">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="roles"
                label="description"
                input-id="role"
                :reduce="(roles) => roles.id"
                v-model="items.roleId"
                placeholder="Rol"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          <validation-provider #default="{ errors }" name="group" rules="">
            <b-form-group label="Grupo" label-for="group">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                input-id="group"
                v-model="items.groupId"
                placeholder="Grupo"
                disabled
              />
              <small
                class="text-danger alert"
                :style="{ height: (errors.length > 0 ? 20 : 0) + 'px' }"
                >{{ errors[0] }}</small
              >
            </b-form-group>
          </validation-provider>
          
          
          <div>
            <b-form-group label="Subir Firma - Sello" label-for="migrate_categories">
              <div class="d-flex w-50 align-items-center mt-1 ml-1">
                <span class="mr-2">Firma</span>
                <b-form-checkbox v-model="typeFile" name="typeFile" switch @change="resetContainer(), settingCanvas()">
                </b-form-checkbox>
                <span class="ml-2">Sello</span>
              </div>
            </b-form-group>
            <div v-if="!typeFile" class="signatureContainer">
              <div>
                <p>Nueva Firma</p>
                <canvas id="myCanvas" class="newSignature"></canvas>

              </div>
              <div v-if="lastSignature" >
                <p>Firma Actual     | <span>Cantidad de Firmas: {{ items.countSignature }}</span></p>
                <img :src="lastSignature" class="actualSignature">
              </div>
            </div>
            <div v-else class="imageContainer">
              <b-form-group label="Foto" label-for="photo">
                <b-form-file
                  v-model="imgUploaded"
                  ref="photo"
                  id="photo"
                  accept=".jpg, .jpeg, .png"
                  placeholder="Seleccione una foto o arrástrelo aquí..."
                  drop-placeholder="Arrastre aqui..."
                  @change="onChangeFile($event)"
                ></b-form-file>
              </b-form-group>
              <cropper
                class="cropper"
                ref="cropper"
                v-if="imgUploaded"
                :src="imgUploaded"
                @change="imageEdited"
              ></cropper>
            </div>
            <div>
              <b-button id="clearButton" class="mt-2" @click="resetContainer">Limpiar</b-button>
              <!-- <b-button id="undoButton" class="mr-2">Deshacer</b-button>
              <b-button id="lockButton" class="mr-2">Guardar</b-button>
              
              <b-button id="downloadButton">Descargar Firmaa</b-button> -->
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex mt-2 justify-content-end">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isDisabled" small />
              <span class="px-1">Actualizar</span>
            </b-button>
            
          </div>
        </b-form>
      </validation-observer>
        </b-card-body>
      </b-card>
    </b-overlay>
    
  </div>
  
</template>

<script>
/* eslint-disable */
import SedeService from '@/services/SedeService'
import EnterpriseService from '@/services/EnterpriseService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import { required } from '@validations'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import GroupService from '@/services/GroupService'
import UserService from '@/services/UserService'
import PositionService from '@/services/PositionService'
import RoleUserService from '@/services/RoleUserService'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import filters from './filters.vue'
import addEdit from './add-edit.vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const APIURL = process.env.APIURLFILE



Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      isDisabled: false,
      signatureEditing: true,
      disabled: false,
      lastSignature: null,
      base64Data: null,
      typeFile: false,
      imgUploaded: "",
      status: '',
      statusFilter: '',
      required,
      apiurl: APIURL,
      showLoading: false,
      show: false,
      project_id: JSON.parse(localStorage.getItem('project_id')),
      proyectos: [],
      positions: [],
      grupos: [],
      roles: [],
      types:[
        {
          text: 'DNI',
          value: 'DNI'
        },
        {
          text: 'Carnet de Extranjería',
          value: 'Carnet de Extranjería'
        },
      ],
      items: {
          docType: '',
          document: '',
          email: '',
          password: '',
          fullname: '',
          projectId: null,
          roleId: null,
          positionId: null,
          groupId: []
      },
      user_id: null,
      id: 0,
      sort: 'id',
      order: 'desc',
      userData: JSON.parse(localStorage.getItem('userData')),
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      navbar: null,
      filterContent: null,
      tableCard: null,
      tableContainer: null,
      selectableTable: null,
      tableHead: null,
      ths: null,
      trs: null,
    }
  },
  components: {
    vSelect,
    flatPickr,
    addEdit,
    filters,
    AppTimeline,
    ValidationProvider,
    ValidationObserver,
    AppTimelineItem,
    Cropper
},
  computed: {
    
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  mixins: [togglePasswordVisibility],

  
  mounted() {
    this.getData()

    this.canvas = document.getElementById('myCanvas');
    const windowWidth = window.innerWidth;

    if(windowWidth < 700){
      this.canvas.width = 290; // Ajustar ancho a 580px
      this.canvas.height = 120; // Ajustar alto a 250px
    } else{
      this.canvas.width = 590; // Ajustar ancho a 580px
      this.canvas.height = 250; // Ajustar alto a 250px
    }
    console.log("CANVAS", this.canvas)
    function handleTouchMove(e) {
      e.preventDefault(); // Evitar el evento de movimiento táctil
    }
    this.ctx = this.canvas.getContext('2d');
    /* this.canvas.addEventListener('touchmove', handleTouchMove); // Agregar evento touchmove */


    function resizeCanvas() {
      const windowWidth = window.innerWidth;
      console.log("CAMBIA")
      if (windowWidth < 700) {
        this.canvas.width = 290; // Ajustar ancho a 580px
        this.canvas.height = 120; // Ajustar alto a 250px
      } else {
        this.canvas.width = 590; // Ajustar ancho a 580px
        this.canvas.height = 250; // Ajustar alto a 250px
      }
    }
    window.addEventListener('resize', resizeCanvas);


    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2; // Puedes cambiar el grosor a tu gusto

    console.log("CTX", this.ctx)

    const history = [];
    let isLocked = false;

    let isDrawing = false;
    let x = 0;
    let y = 0;

    

    this.canvas.addEventListener('mousedown', (e) => {
      console.log("MOUSE DOWN")
      isDrawing = true;
      x = e.offsetX;
      y = e.offsetY;
      this.ctx.beginPath();

      this.ctx.moveTo(x, y);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (isDrawing) {
        console.log("MOUSE MOVE")
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
        history.push({ x: e.offsetX, y: e.offsetY }); // Guardar las posiciones del trazo

      }
    });

    this.canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      this.ctx.closePath();
      this.base64Data = this.canvas.toDataURL('image/png');
      console.log("Base64:", this.base64Data); // Mostrar la cadena base64 en la consola
    });

     // Eventos para pantallas táctiles
     this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      isDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(touch.clientX - rect.left, (touch.clientY - rect.top) + 80);
      /* startDrawing(touch.clientX - rect.left, touch.clientY - rect.top); */
    });

    this.canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      if (!isDrawing) return;
      this.ctx.lineTo(touch.clientX - rect.left, (touch.clientY - rect.top) + 80);
      this.ctx.stroke();
      /* draw(touch.clientX - rect.left, touch.clientY - rect.top); */
      e.preventDefault(); // Previene el scroll durante el dibujo
    });

    this.canvas.addEventListener('touchend', () => {
      if (!isDrawing) return;
      isDrawing = false;
      this.ctx.closePath();
      this.base64Data = this.canvas.toDataURL('image/png');
      /* stopDrawing(); */
    });

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', () => {
      console.log("CLEAR", this.canvas.width, this.canvas.height)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });
  },
  
  methods: {

    settingCanvas(){
      if(!this.fileType){

        this.getData()
        
        this.canvas = document.getElementById('myCanvas');
        const windowWidth = window.innerWidth;
        
        if(windowWidth < 700){
          this.canvas.width = 290; // Ajustar ancho a 580px
          this.canvas.height = 120; // Ajustar alto a 250px
        } else{
          this.canvas.width = 590; // Ajustar ancho a 580px
          this.canvas.height = 250; // Ajustar alto a 250px
        }
        console.log("CANVAS", this.canvas)
        function handleTouchMove(e) {
          e.preventDefault(); // Evitar el evento de movimiento táctil
        }
        this.ctx = this.canvas.getContext('2d');
        /* this.canvas.addEventListener('touchmove', handleTouchMove); // Agregar evento touchmove */
        
        
        function resizeCanvas() {
          const windowWidth = window.innerWidth;
          console.log("CAMBIA")
          if (windowWidth < 700) {
            this.canvas.width = 290; // Ajustar ancho a 580px
            this.canvas.height = 120; // Ajustar alto a 250px
          } else {
            this.canvas.width = 590; // Ajustar ancho a 580px
            this.canvas.height = 250; // Ajustar alto a 250px
          }
        }
        window.addEventListener('resize', resizeCanvas);
        
        
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2; // Puedes cambiar el grosor a tu gusto
        
        console.log("CTX", this.ctx)
        
        const history = [];
        let isLocked = false;
        
        let isDrawing = false;
        let x = 0;
        let y = 0;
        
        
        
        this.canvas.addEventListener('mousedown', (e) => {
          isDrawing = true;
          x = e.offsetX;
          y = e.offsetY;
          this.ctx.beginPath();
          
          this.ctx.moveTo(x, y);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
          if (isDrawing) {
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
            history.push({ x: e.offsetX, y: e.offsetY }); // Guardar las posiciones del trazo
            
          }
        });
        
        this.canvas.addEventListener('mouseup', () => {
          isDrawing = false;
          this.ctx.closePath();
          this.base64Data = this.canvas.toDataURL('image/png');
          console.log("Base64:", this.base64Data); // Mostrar la cadena base64 en la consola
        });
        
        // Eventos para pantallas táctiles
        this.canvas.addEventListener('touchstart', (e) => {
          const touch = e.touches[0];
          const rect = this.canvas.getBoundingClientRect();
          isDrawing = true;
          this.ctx.beginPath();
          this.ctx.moveTo(touch.clientX - rect.left, (touch.clientY - rect.top) + 50);
          /* startDrawing(touch.clientX - rect.left, touch.clientY - rect.top); */
        });

        this.canvas.addEventListener('touchmove', (e) => {
          const touch = e.touches[0];
          const rect = this.canvas.getBoundingClientRect();
          if (!isDrawing) return;
          this.ctx.lineTo(touch.clientX - rect.left, (touch.clientY - rect.top) + 50);
          this.ctx.stroke();
          /* draw(touch.clientX - rect.left, touch.clientY - rect.top); */
          e.preventDefault(); // Previene el scroll durante el dibujo
        });

        this.canvas.addEventListener('touchend', () => {
          if (!isDrawing) return;
          isDrawing = false;
          this.ctx.closePath();
          this.base64Data = this.canvas.toDataURL('image/png');
          /* stopDrawing(); */
        });
        
        const clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', () => {
          console.log("CLEAR", this.canvas.width, this.canvas.height)
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
      }
    },
    async getGroups(){
      const url = `?order=asc&sort=description&filter=` + JSON.stringify([{ keyContains: 'project.id', key: 'equals', value: this.project_id }])
      console.log('url', url)
      const respGrupos = await GroupService.getGroups(url, this.$store)
      if (respGrupos.status) {
        this.grupos = respGrupos.data.rows
        console.log('grupos', this.grupos)
      }
    },
    editSignature(){
      this.signatureEditing = true
      this.settingCanvas()
    },
    cancelSignature(){
      this.signatureEditing = false
    },
   
    
    change() {
      this.options = {
        penColor: "#00f",
      };
    },
    resume() {
      this.options = {
        penColor: "#c0f",
      };
    },
    
    
    openModal() {
     
      this.modalOpen = true;

    },
    closeModal() {
      this.modalOpen = false;
    },
    resetContainer() {
      this.imgUploaded = ""
      console.log("RESETEADO")
      this.base64Data = null
    },
    async onChangeFile(event) {
      const file = event.target.files ? event.target.files[0] : null;
      console.log("selected PHOTO", this.imgUploaded);
      if (file) {
        const acceptedTypes = [".jpg", ".jpeg", ".png"];
        const fileType = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (acceptedTypes.includes(fileType)) {
          const reader = new FileReader();
          reader.onload = async () => {
            console.log("READER", reader.result)
            this.imgUploaded = reader.result;
            console.log("selectedFile", this.imgUploaded);
          };
          reader.readAsDataURL(file);
          console.log("selectedFile red", this.imgUploaded);
        } else {
          this.imgUploaded = null;
          console.error("Por favor, selecciona un archivo JPG, JPEG o PNG válido.");
        }
      }
      this.imgUploaded = null
      console.log("IMAGEN aa", this.imgUploaded)
    },
    async imageEdited({ coordinates, canvas }) {
      console.log("CROPPER", coordinates, canvas);
    },
    async getData(id=null) {
      await this.getGroups()
      this.showLoading = true
      console.log("user data", this.userData)
      const respUser = await UserService.getUser(this.userData.id, this.$store)
      console.log("RESP USER", respUser)
      this.items.docType = respUser.data.docType
      this.items.document = respUser.data.document
      this.items.email = respUser.data.email
      this.items.fullname = respUser.data.fullname
      this.items.roleId = respUser.data.role
      this.items.positionId = respUser.data.position
      this.items.countSignature = respUser.data.countSignature
      this.items.groupId = []
      let groups = respUser.data.group
      if(!groups){
        this.items.groupId.push("Sin Grupo")
      }else{
        groups.forEach(group => {
          this.items.groupId.push(group.approver_group.description)
        });
      }
      console.log("ITEMS", this.items)
      if(respUser.data.hasSignature){
        this.lastSignature = respUser.data.signature
      }
      
      this.showLoading = false
    },
    
    
    async onSubmit(){
      console.log("SUBMIT")
      console.log(this.items)
      console.log(this.base64Data)
      this.showLoading = true
      let data
      if(this.typeFile){
        const { canvas } = this.$refs.cropper.getResult();
        this.base64Data = canvas.toDataURL('image/png');
        console.log("Image Cropped", this.base64Data)
      }
      if(this.items.password == '' || this.items.password == null){
        data = {
          docType: this.items.docType,
          document: this.items.document,
          email: this.items.email,
          fullname: this.items.fullname,
          signature: this.base64Data
        }
      }else{
        data = {
          docType: this.items.docType,
          document: this.items.document,
          email: this.items.email,
          fullname: this.items.fullname,
          password: this.items.password,
          signature: this.base64Data
        }
      }
      console.log("DATA",data)

      this.$swal
        .fire({
          title: 'Seguro que desea actualizar su perfil?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, actualizar',
          html: `
            <p>Usted acepta el tratamiento que realizará Transportes Cruz del Sur a su firma digital y reconoce que ha sido informado sobre el alcance a través del consentimiento firmado por su persona, de manera previa al presente registro.</p>
          `,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        })
        .then(async result => {
          if (result.value) {
            let response = await UserService.updateUserProfile(data, this.$store) 
            if(response.status){
              this.$swal({
                title: 'Actualizado',
                text: 'Los datos han sido actualizados.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.resetContainer()
              this.getData()
            } else {
              this.$swal({
                title: 'Error!',
                text: resp.data.message
                  ? resp.data.message
                  : 'Ocurrió un error al actualizar los datos del usuario.',
                icon: 'error',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
            }
          }
        })
        this.showLoading = false

    }   
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';



.container {
  width: "100%";
  padding: 8px 16px;
}


.content_main {
  .content_timeline {
    max-height: 450px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  .content_form {
    display: flex;
    justify-content: center;
  }
}
.select-obra .vs__dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}
.mt-02{
  margin-top: .2rem;
}

.sticky {
  position: sticky;
  z-index: 3;
}

.table-overflow {
  overflow-x: auto;
  width: 100%;

  thead {
    display: flex;
    overflow-x: auto;
    position: absolute;
    top: 0;

    &.fixed {
      position: fixed;
      transform: translateX(0px) !important;
      z-index: 2;
    }

    tr {
      display: flex;
      flex: 1 1 auto;

      th {
        flex: 0 0 auto;
        padding: 0.72rem 2rem !important;
      }
    }
  }

  tbody {
    overflow-x: auto;

    tr {
      display: flex;

      &.b-table-empty-row {
        td {
          flex: 0 0 100%;
        }
      }

      td {
        flex: 0 0 auto;
      }
    }
  }
}
/* #signatureD {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
} */

.signatureContainer {
  display: flex;
  gap: 2rem;
}
.actualSignature {
  border: 1px solid black;
  width: 350px;
  height: 150px;
}
.newSignature {
  border: 1px solid black;
  width: 700px;
  height: 300px;
}
//media queries para cambiar el diseño para las pantallas menores a 1000px de ancho
@media (max-width: 1000px) {
  .signatureContainer {
    flex-direction: column-reverse;
  }
  .actualSignature {
    width: 100%;
    height: auto;
  }
  
}
@media (max-width: 700px) {
  .newSignature{
    width: 350px;
    height: 150px;
  }
}
</style>
