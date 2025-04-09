<template>
  <div class="navbar-header d-xl-block d-none">
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <b-link
          class="navbar-brand"
          to="/"
        >
          <span class="brand-logo">
            <b-img
              :src="appLogoImageName"
              alt="logo"
            />
          </span>
          <span class="brand-logo">
            <b-img
              :src="appLogoImageRes"
              alt="logo"
            />
          </span>
          <h2 class="brand-text text-white mb-0">
            {{ appName }}
          </h2>
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BLink,
    BImg,
  },
  setup() {
    // App Name
    const {
      appName,
      appLogoImage,
      appLogoImageRes,
      appLogoImageName,
    } = $themeConfig.app
    return {
      appName,
      appLogoImage,
      appLogoImageName,
      appLogoImageRes,
    }
  },
}
</script>

<style>

</style>
