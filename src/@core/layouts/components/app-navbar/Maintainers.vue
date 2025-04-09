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
    <template #default="{ hide }" >
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">Mantenedores</h5>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click=";[hide()]" />
      </div>

      <!-- BODY -->
      <div v-for="(item, index) in children">

        <div class="d-flex align-items-center px-2 py-1 link-maintainer" @click="goToRoute(item.route)" v-if="item.id">
          <feather-icon class="ml-1 mr-1 cursor-pointer" :icon="item.icon || 'CircleIcon'" size="20"/>
          <h5 class="mb-0">{{ item.title }}</h5>
        </div>
        <hr v-else>
        
      </div>
    </template>
  </b-sidebar>
</template>

<script>
/* eslint-disable*/
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import router from '@/router'


// import StoresService from '@/services/StoresService'
import vSelect from 'vue-select'
Vue.use(BootstrapVue)
export default {
  directives: {
    Ripple
  },
  components: {
},
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      required,
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      userData: JSON.parse(localStorage.getItem('userData')),
      children: [
      {
        icon: 'UserIcon',
        id: 'perfil',
        title: 'Perfil',
        route: 'perfil',
      },
      {
        icon: 'FolderIcon',
        id: 'proyectos',
        title: 'Proyectos',
        route: 'proyectos',
      },
      /* {
        icon: 'FolderIcon',
        id: 'formularios',
        title: 'Formularios',
        route: 'formularios',
      }, */
      {
        icon: 'Share2Icon',
        id: 'sedes',
        title: 'Sedes',
        route: 'sedes',
      },
      {
        id: '',      
      },
      {
        icon: 'GridIcon',
        id: 'grupos',
        title: 'Grupos',
        route: 'grupos',
      },
      {
        icon: 'UserIcon',
        id: 'usuarios',
        title: 'Usuarios',
        route: 'usuarios',
      },
      {
        icon: 'FolderIcon',
        id: 'plantilla',
        title: 'Plantilla Servicio',
        route: 'plantilla',
      },
      {
        icon: 'FolderIcon',
        id: 'plantilla-actividad',
        title: 'Plantilla Actividad',
        route: 'plantilla-actividad',
      },
      {
        icon: 'FolderIcon',
        id: 'plantilla-operativo',
        title: 'Plantilla Operativo',
        route: 'plantilla-operativo',
      },
      {
        id: '',      
      },
      
    ]
      
    }
  },
  mounted() {
    if(this.userData != undefined){

      if (this.user_role && this.user_role === 'piloto') {
        console.log('aqui 145');
        this.children = [
        {
          icon: 'UserIcon',
          id: 'perfil',
          title: 'Perfil',
          route: 'perfil',
        },
        ];
      }

    }
  },
  methods: {
   
    goToRoute(route){
      this.$router.push({ name: route })
    }
    
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

.link-maintainer:hover{
  background-color: #005193;
  cursor: pointer;
  color:white;
};
hr {
  margin-top: 0.1rem !important;
  margin-bottom: 0.1rem !important;
}


</style>
