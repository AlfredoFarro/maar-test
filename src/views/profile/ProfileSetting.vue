<template>
  <!-- eslint-disable -->
  <b-tabs
    vertical
    content-class="col-12 col-md-9 mt-1 mt-md-0"
    pills
    nav-wrapper-class="col-md-3 col-12"
    nav-class="nav-left"
  >

    <!-- general tab -->
    <b-tab active>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="UserIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">General</span>
      </template>

      <profile-setting-general
        v-if="options.general"
        :general-data="options.general"
        :datos="datos"
      />
    </b-tab>
    <!--/ general tab -->

    <!-- change password tab -->
    <b-tab>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="LockIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">Change Password</span>
      </template>

      <profile-setting-password />
    </b-tab>
    <!--/ change password tab -->

  </b-tabs>
</template>

<script>
/* eslint-disable */
import { BTabs, BTab } from 'bootstrap-vue'
import ProfileSettingGeneral from './ProfileSettingGeneral.vue'
import ProfileSettingPassword from './ProfileSettingPassword.vue'

export default {
  components: {
    BTabs,
    BTab,
    ProfileSettingGeneral,
    ProfileSettingPassword,
  },
  data() {
    return {
      options: {},
      datos: {}
    }
  },
  beforeCreate() {    
    this.$http.get('/account-setting/data').then(res => { this.options = res.data })
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      let aux = JSON.parse(localStorage.getItem('userData'))
      this.datos.id = aux.id
      this.datos.name = aux.name
      this.datos.last_name = aux.last_name
      this.datos.email = aux.email
    }
  }
}
</script>
