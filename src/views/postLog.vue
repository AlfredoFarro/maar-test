<template>
  <!-- eslint-disable -->
  <div class="w-100 p-2">
    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
      <b-row class="containerSelect">
        <b-col class="columnStyle">
          <b-button size="lg" class="mb-2 btn_log" @click="goSelectProyect('Restricciones')" :disabled="!userData.role_user[0].is_restriction || userData.role_user[0].role_restriction == 'user-office' || userData.role_user[0].role_restriction == 'user-collection'">Restricciones</b-button>
          <b-button size="lg" class="mb-2 btn_log" @click="goSelectProyect('RFI')" disabled>RFI</b-button>
          <b-button size="lg" class="mb-2 btn_log" @click="goSelectProyect('Lecciones')" :disabled="!userData.role_user[0].is_lesson">Lecciones Aprendidas</b-button>
          <b-button size="lg" class="mb-2 btn_log" @click="goSelectProyect('Corporativo')" :disabled="userData.role_user[0].role_restriction != 'admin' && userData.role_user[0].role_restriction != 'user-office' && userData.role_user[0].role_restriction != 'user-collection' ">Corporativo</b-button>
        </b-col>
        <b-col class="img_team" >
          <img :src=sideImg alt="Grupo JJC" class="img_class" style="margin-bottom: 10px;">
          
          <b-form-group v-if="userData.role_user[0].role_restriction == 'admin'" >
            <b-form-file
            v-if="showPhotoInputs"
            v-model="newPhoto"
            placeholder="Seleccione una nueva foto o arrastre aqui..."
            drop-placeholder="Arrastre aqui..."
            id="file"
            style="width: 500px; margin-right: 10px;"
            />
            <b-button v-if="showPhotoInputs" :disabled="!newPhoto" @click="saveFile" :variant="'success'" style="margin-right: 10px;">
              Guardar
            </b-button>
            <b-button size="md" @click="togglePhotoInputs">
              {{ showPhotoInputs ? 'Cancelar' : 'Cambiar Foto' }}
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
      
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
const APIURL = process.env.APIURLFILE
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import Vue from 'vue'
import VueBus from 'vue-bus'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import { bubbleToast } from '../router/bubble.js'; // Ajusta la ruta según la ubicación de index.js
import MenuPhotoService from '@/services/MenuPhotoService'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueBus);

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      showLoading: false,
      api_url: APIURL,
      project_id: JSON.parse(localStorage.getItem('project_id')),
      userData: JSON.parse(localStorage.getItem('userData')),
      id: 0,
      sort: 'id',
      order: 'desc',
      apiurl: APIURL,
      sideImg: null,
      newPhoto: null,
      showPhotoInputs: false,
    }
  },
  components: {
    vSelect
  },
  async mounted() {
    console.log("USER DATA", this.userData)
    const respPhoto = await MenuPhotoService.getPhoto('',this.$store)
    console.log("RESP PHOTO", respPhoto)
    if(respPhoto.data){
      this.sideImg = this.api_url + respPhoto.data.image_url
    }else{
      this.sideImg = require('@/assets/images/JJC.jpg')
    }
  },
  methods: {
    async saveFile(){
      this.showLoading = true
      console.log(this.sideImg)
      console.log(this.newPhoto)

      let datos = new FormData()
      datos.append('file', this.newPhoto)
      const respPhoto = await MenuPhotoService.createPhoto(datos,this.$store)
      console.log("RESP PHOTO CREATE", respPhoto)
      if(respPhoto.status){
        this.sideImg = this.api_url + respPhoto.data.image_url
      }
      console.log("SIDE IMAGE", this.sideImg)
      this.showLoading = false
    },
    togglePhotoInputs() {
      this.showPhotoInputs = !this.showPhotoInputs;
      this.newPhoto = null;
    },
    goSelectProyect(buttonClicked){
      localStorage.setItem('log_type', buttonClicked)
      const projectId = localStorage.getItem('project_id');
      console.log('projectId',projectId)
      const userId =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).id:null
      const userRole =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).role_user[0].role_restriction:null

      if(buttonClicked=='Lecciones'){
        bubbleToast(projectId,userId,userRole);
        /* localStorage.setItem('project_id', null)
        localStorage.setItem('project_name', "") */
        this.$router.push({ name: 'lecciones'})
      }else if(buttonClicked=='Corporativo'){
        /* localStorage.setItem('project_id', null)
        localStorage.setItem('project_name', "") */

        if(this.userData.role_user[0].role_restriction == 'user-office'){
          console.log('alertas')
          this.$router.push({ name: 'alertas-cowner'})
        }else if(this.userData.role_user[0].role_restriction == 'user-collection'){
          console.log('alertas')
          this.$router.push({ name: 'graph-projects'})

        }else {
          this.$router.push({ name: 'proyectos'})
        }
      }else {
        if(this.userData.projects.length == 1){
          console.log("ENTER CONSOLE")
          localStorage.setItem('project_name', this.userData.projects[0].description)
          localStorage.setItem('project_id', this.userData.projects[0].id)
        }
        this.$router.push({ name: 'seleccionar-proyecto'})
      }
    

    },
    
    
  },
  
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.btn_log{
  background-color: #005193 !important;
  width: 300px;
  height: 80px;
}
.img_team{
  width: 500px !important;
  height: 600px;
}
.containerSelect{
  /* display: grid !important;
  grid-template-columns: 1fr 3fr;
  gap: 5rem; */
}
.columnStyle{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow:0 !important;
}
.img_class{
  height: 100%;
  object-fit: cover; /* la imagen se ajustará manteniendo la relación de aspecto y cubriendo el contenedor */

}
</style>
