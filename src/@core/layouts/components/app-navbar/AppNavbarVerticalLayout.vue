<template>
  <div class="navbar-container d-flex content align-items-center">
      <Maintainers :is-add.sync="isAdd" ref="localAdd"> </Maintainers>
      <NewProject :is-add-project.sync="isAddProject" ref="localAddProject"> </NewProject>

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">  
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>
    <ul class="nav navbar-nav">
      <li class="nav-item p-1">
        <h3 class="text-white">
          CRUZ DEL SUR
        </h3>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <!-- Bookmarks Container -->
      <!-- <bookmarks /> -->
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto d-flex justify-content-center">
      <!-- <locale /> -->
      <li class="nav-item">
        <b-button
        v-if="this.$route.name!='seleccionar-log-type' && project_id !== '' && project_id !== null"
        variant="warning"
        class="py-05 d-flex align-items-center justify-content-center"
        @click="changeProyect"
        >
        <p class="p-0 m-0">
            {{label}}
          </p>
          <!-- <feather-icon
            class="d-block d-lg-none"
            icon="RotateCwIcon"
            size="15"
            /> -->
          </b-button>
        </li>
        
        <li class="nav-item" v-show="manteiners">
          <b-button            
            size="sm"
            v-b-tooltip.noninteractive.hover.top="'Mantenedores'"
            variant="warning"
            class="py-05 mx-2 d-flex align-items-center justify-content-center"
            @click="seeManteiners"
          >
          <feather-icon icon="SettingsIcon" />
  
           
          </b-button>
        </li>
        <li class="nav-item" v-show="addProject && project_id == null">
          <b-button            
            size="sm"
            v-b-tooltip.noninteractive.hover.top="'Nuevo Proyecto'"
            variant="success"
            class="py-05 mx-2 d-flex align-items-center justify-content-center"
            @click="seeProject"
          >
          <feather-icon icon="PlusCircleIcon" />
  
           
          </b-button>
        </li>
      <dark-Toggler class="d-none d-lg-block" />
      <!-- <search-bar /> -->
      <!-- <cart-dropdown />
      <notification-dropdown /> -->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import { BLink, BNavbarNav, BButton } from 'bootstrap-vue'
// import Bookmarks from './components/Bookmarks.vue'
// import Locale from './components/Locale.vue'
import SearchBar from './components/SearchBar.vue'
import DarkToggler from './components/DarkToggler.vue'
import Maintainers from './Maintainers.vue'
import NewProject from './NewProject.vue'

// import CartDropdown from './components/CartDropdown.vue'
// import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'

export default {
  components: {
    BLink,
    Maintainers,
    NewProject,
    // Navbar Components
    BNavbarNav,
    // Bookmarks,
    // Locale,
    // SearchBar,
    DarkToggler,
    BButton,
    // CartDropdown,
    // NotificationDropdown,
    UserDropdown,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isAdd: false,
      isAddProject: false,
      project_id: JSON.parse(localStorage.getItem('project_id')),
      project_name: localStorage.getItem('project_name'),
      userData: JSON.parse(localStorage.getItem('userData')),    
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      label : 'Seleccionar Proyecto',
      log_type: localStorage.getItem('log_type'),
      period_week: ''
    }
  },
  computed: {
    addProject() {
      if(this.userData.role.description == 'superadmin' && this.$route.name=='seleccionar-proyecto'){
       
        return true;

      }
      return false;
    },
    manteiners() {
      if(this.$route.name!='seleccionar-log-type' && this.$route.name!='seleccionar-proyecto' && this.user_role != 'piloto')
        return true;
      return false;
    },
  },
  async mounted(){
  
    if(this.project_id){
      this.label = this.project_name
      
    }
    if(this.userData != undefined){
      const role = this.userData.role.description;
      
      /* if(role_restriction == 'admin' || role_restriction=='planner' || role_lesson=='admin-lesson') this.manteiners=true     */  
   
    }
  },
  methods: {
    changeProyect() {
      if(this.userData.role.description != 'superadmin'){
          return;
        }
      localStorage.removeItem('project_id')
      this.$router.push({ name: 'seleccionar-proyecto' })
    },
    seeManteiners(){
      this.isAdd = true
      
      /* this.$router.push({ name: 'formularios' }) */
      //ESTO ES PARA VER LISTA DE DISTINTAS OPCIONES
      //this.isAdd = true
    },
    seeProject(){
      this.isAddProject = true
    }
  },
}
</script>
<style scoped>
.py-05{
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
