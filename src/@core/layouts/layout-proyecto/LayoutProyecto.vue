<template>
  <div
    class="vertical-layout h-100"
    :class="[layoutClasses]"
    :data-col="isNavMenuHidden ? '1-column' : null"
  >
    <!-- Navbar -->
    <b-navbar
      :toggleable="false"
      :variant="navbarBackgroundColor"
      class="header-navbar navbar navbar-shadow align-items-center"
      :class="[navbarTypeClass]"
      style="left: 0 !important;"
    >
      <slot
        name="navbar"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :navbarBackgroundColor="navbarBackgroundColor"
        :navbarTypeClass="[...navbarTypeClass, 'header-navbar navbar navbar-shadow align-items-center']"
      >
        <app-navbar-vertical-layout
          :toggle-vertical-menu-active="toggleVerticalMenuActive"
        />
      </slot>
    </b-navbar>
    <!--/ Navbar -->

    <!-- Vertical Nav Menu -->
    <!-- /Vertical Nav Menu Overlay -->

    <!-- Content -->

    <!-- CONTENT TYPE: Left -->
    <transition
      :name="routerTransition"
      mode="out-in"
    >
      <component
        :is="layoutContentRenderer"
        :key="layoutContentRenderer === 'layout-content-renderer-left' ? $route.meta.navActiveLink || $route.name : null"
        style="margin-left: 0px !important;"
      >
        <template
          v-for="(index, name) in $scopedSlots"
          v-slot:[name]="data"
        >
          <slot
            :name="name"
            v-bind="data"
          />
        </template>
      </component>
    </transition>
    <!--/ Content -->

    <!-- Footer -->
    <footer
      class="footer footer-light"
      :class="[footerTypeClass]"
      style="margin-left: 0px !important;"
    >
      <slot name="footer">
        <app-footer />
      </slot>
    </footer>
    <!-- /Footer -->

    <slot name="customizer" />
  </div>
</template>

<script>
import { onUnmounted } from '@vue/composition-api'
import AppNavbarVerticalLayout from '@core/layouts/components/app-navbar/AppNavbarVerticalLayout.vue'
import AppFooter from '@core/layouts/components/AppFooter.vue'
import useAppConfig from '@core/app-config/useAppConfig'
import { BNavbar } from 'bootstrap-vue'
import LayoutContentRendererDefault from '@core/layouts/components/layout-content-renderer/LayoutContentRendererDefault.vue'
import LayoutContentRendererLeft from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeft.vue'
import LayoutContentRendererLeftDetached from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeftDetached.vue'
import useVerticalLayout from './useVerticalLayout'

export default {
  components: {
    // AppBreadcrumb,
    AppNavbarVerticalLayout,
    AppFooter,
    BNavbar,
    LayoutContentRendererLeftDetached,
    LayoutContentRendererLeft,
    LayoutContentRendererDefault,
  },
  computed: {
    layoutContentRenderer() {
      const rendererType = this.$route.meta.contentRenderer
      if (rendererType === 'sidebar-left') return 'layout-content-renderer-left'
      if (rendererType === 'sidebar-left-detached') return 'layout-content-renderer-left-detached'
      return 'layout-content-renderer-default'
    },
  },
  setup() {
    const {
      routerTransition, navbarBackgroundColor, navbarType, footerType, isNavMenuHidden,
    } = useAppConfig()

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      layoutClasses,
      overlayClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    // Resize handler
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/themes/bordered-layout.scss";
</style>
