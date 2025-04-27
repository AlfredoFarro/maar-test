<template>
    <!-- eslint-disable -->
     <div>
        DASHBOARD
     </div>
  </template>
  
  <script>
  /* eslint-disable */
  import Vue from 'vue'
  import VuexyLogo from '@core/layouts/components/Logo.vue'
  import { BootstrapVue, BootstrapVueIcons, VBTooltip, VBPopover } from 'bootstrap-vue'
  import { required, email } from '@validations'
  import useJwt from '@/auth/jwt/useJwt'
  
  Vue.use(BootstrapVue)
  Vue.use(BootstrapVueIcons)
  export default {
    data() {
      return {
      }
    },
    computed: {

    },
    methods: {
    }
  }
  </script>
  
  <style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  @import '@core/scss/vue/pages/page-auth.scss';
  </style>