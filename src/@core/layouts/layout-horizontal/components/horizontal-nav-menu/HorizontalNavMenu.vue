<template>
  <div class="navbar-container main-menu-content d-flex align-items-center justify-content-center">
    <horizontal-nav-menu-items :items="navMenuItems" />
  </div>
</template>

<script>
/* eslint-disable */
import {getUserAcessPermissions,getUserAccesPermissionsNew} from '@/auth/utils'
import { mapNavigationRender} from '@core/layouts/utils'
import navMenuItems1 from '@/navigation/horizontal'
import HorizontalNavMenuItems from './components/horizontal-nav-menu-items/HorizontalNavMenuItems.vue'

export default {
  components: {
    HorizontalNavMenuItems,
  },
  setup() {
    var dataUser = JSON.parse(localStorage.getItem("userData"))
   // let permissions = getUserAcessPermissions(dataUser.type)
    //se cambio multirole
    let permissions = getUserAccesPermissionsNew(dataUser.role.description)//getUserAcessPermissions(dataUser.role)
    console.log('permissions',permissions)

    navMenuItems1.forEach((element, index, arr) => mapNavigationRender(element, permissions, dataUser.role.code));
    var navMenuItems = navMenuItems1
    console.log('navMenuItems1',navMenuItems1)
    return {
      navMenuItems,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/horizontal-menu.scss";
</style>
