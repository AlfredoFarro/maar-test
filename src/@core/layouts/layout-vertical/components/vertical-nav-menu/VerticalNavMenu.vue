<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      { 'expanded': !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered) },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light'
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row justify-content-between align-items-center">

          <!-- Logo & Text -->
          <li class="nav-item" >
            <b-link
              class="navbar-brand d-flex flex-column"
              to="/"
            >
              <span class="brand-logo">
                <b-img
                  :src="appLogoImage"
                  alt="logo"
                />
              </span>
            </b-link>
          </li>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none text-white"
                @click="toggleVerticalMenuActive"
              />
              <!-- <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon text-white"
                @click="toggleCollapsed"
              /> -->
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div
      :class="{'d-block': shallShadowBottom}"
      class="shadow-bottom"
    />
    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="evt => { shallShadowBottom = evt.srcElement.scrollTop > 0 }"
    >
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
        :isVerticalMenuCollapsed="isVerticalMenuCollapsed"
        :updateVerticalMenuCollapse="updateVerticalMenuCollapse"

      />
    </vue-perfect-scrollbar>
    
    <!-- /main menu content-->
  </div>
</template>

<script>
/* eslint-disable */
import {getUserAcessPermissions,getUserAccesPermissionsNew} from '@/auth/utils'
import { mapNavigationRender} from '@core/layouts/utils'
import navMenuItems1 from '@/navigation/vertical'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { BLink, BImg } from 'bootstrap-vue'
import { provide, computed, ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeConfig } from '@themeConfig'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'

export default {
  components: {
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    BImg,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  methods:{
    checkProyecto(){
      let project_id =  JSON.parse(localStorage.getItem('project_id'))
      let userData =  JSON.parse(localStorage.getItem('userData'))
      if(project_id && userData){
        /* if(userData.role_user[0].is_restriction || userData.role_user[0].role_lesson=='admin-lesson') {
          localStorage.removeItem('project_id')
          localStorage.removeItem('project_name') 
          
        } */
      }
      this.$router.push({ name: 'seleccionar-log-type'})
    },
    updateVerticalMenuCollapse(newVal) {
      this.isVerticalMenuCollapsed = newVal;
    }
  },
  setup(props) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'))

    // App Name
    const {
      appName,
      appLogoImage,
      appLogoImageRes,
      appLogoImageName,
    } = $themeConfig.app
    // let dataUser = JSON.parse(localStorage.getItem("userData"))
    // let mod = {
    //   header: 'Modulos'
    // }
    // if (dataUser != null) {
    //   dataUser.access.unshift(mod)
    // }
    // var dataUser = JSON.parse(localStorage.getItem("userData"))
    // console.log('dataUser',dataUser)
    // // let permissions = getUserAcessPermissions(dataUser.role)
    // // console.log('permissions',permissions)
    // let permisos = navMenuItems.forEach((element, index, arr) => mapNavigationRender(element, dataUser.access));
    // var navMenuItems = dataUser.access
    // console.log('dataUser.access',dataUser.access)
    //se cambio multirole
     var dataUser = JSON.parse(localStorage.getItem("userData"))
     if(dataUser){
      let permissions = getUserAccesPermissionsNew(dataUser.role.description)
      console.log('permissions VERTICAL NAV MENU',permissions)
     
      navMenuItems1.forEach((element, index, arr) => mapNavigationRender(element, permissions, dataUser.role.code));
     }
   
    var navMenuItems = navMenuItems1
    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
      appLogoImage,
      appLogoImageName,
      appLogoImageRes,
    }
  },
  created() {
    // Escucha el evento personalizado
    this.$on('toggle-collapsed', () => {
      isVerticalMenuCollapsed = !isVerticalMenuCollapsed; // Cambia el valor
    });
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
