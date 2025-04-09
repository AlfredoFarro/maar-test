<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view />
    </component>

    <scroll-to-top v-if="enableScrollToTop" />
  </div>
</template>

<script>
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'

// This will be populated in `beforeCreate` hook
import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'
import UserService from '@/services/UserService'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeBreakpoints, $themeColors, $themeConfig } from '@themeConfig'
import { watch } from '@vue/composition-api'
import { provideToast } from 'vue-toastification/composition'
import { bubbleToast } from '../src/router/bubble.js' // Ajusta la ruta según la ubicación de index.js

import { useCssVar, useWindowSize } from '@vueuse/core'

import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')
const LayoutProyecto = () => import('@/layouts/proyectos/LayoutProyecto.vue')

export default {
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,
    LayoutProyecto,
    ScrollToTop,
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
    }
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      if (this.$route.meta.layout === 'proyecto') return 'layout-proyecto'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
  },
  async mounted() {
    if (this.userData != undefined) {
      const respUserRole = await UserService.getUser(this.userData.id, this.$store)
      const role = this.userData.role.description

      console.log("ROLES", role)

      if (role != respUserRole.data.role.description) {
        // Remove userData from localStorage
        // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
        localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
        localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

        // Remove userData from localStorage
        localStorage.removeItem('userData')
        localStorage.removeItem('project_id')
        localStorage.removeItem('log_type')
        // Reset ability
        this.$ability.update(initialAbility)

        // Redirect to login page
        this.$router.push({ name: 'auth-login' })
      }
    }
  },
  created() {
    /* this.callBubbleToast() */
  },
  beforeCreate() {
    // Set colors in theme
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(
        useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2)
      )
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  },
  methods: {
    callBubbleToast() {
      const projectId = localStorage.getItem('project_id')
      const userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : null
      const userRole = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData')).role.description
        : null
      console.log('SOLO USER ROLE RESTRICTION', userRole)
      console.log('LLAMADA APP.VUE', projectId, userId, userRole)
      /* bubbleToast(projectId, userId, userRole) */
    },
    /* async bubbleToast(){
      const elements = document.querySelectorAll('.d-flex.align-items-center');

      const elementoDeseado = Array.from(elements).find(elemento => elemento.getAttribute('href') === '/provisionales');

      if (elementoDeseado) {
        const resp = await RestrictionsService.getCountBubble();
        console.log('resp BUBBLE', resp)
        const spanBubble = document.createElement('p');
        spanBubble.classList.add('bubble');
        spanBubble.textContent = '5';

        elementoDeseado.appendChild(spanBubble);
      } else {
        console.log('No se encontró ningún elemento que coincida con los criterios.');
      }
    }, */
  },
  setup() {
    const { skin, skinClasses } = useAppConfig()
    const { enableScrollToTop } = $themeConfig.layout

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    return {
      skinClasses,
      enableScrollToTop,
    }
  },
}
</script>

<style>
.alert {
  transition: 0.3s;
  display: block;
  overflow: hidden;
}
.p-2_5 {
  padding: 2rem !important;
}
.select-obra .vs__dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}
.bubble {
  background-color: #28c76f;
  padding: 5px 10px;
  border-radius: 25px;
  margin-left: 15px;
  margin-bottom: 0;
  color: white;
  text-align: center;
}
.modal-backdrop {
  width: 100% !important;
  height: 100% !important;
}
.b-sidebar {
  height: 100% !important;
}
.b-sidebar-backdrop {
  width: 100% !important;
  height: 100% !important;
}
</style>
