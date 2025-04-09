<template>
  <b-nav-item-dropdown
    v-if="userData"
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0 text-white">
          {{ userData ? userData.name : '' }}
        </p>
        <span class="user-status text-white">
          {{ userData ? userData.email : '' }}
        </span>
      </div>
      <b-avatar
        size="40"
        :src="userData.url ? apiurl + userData.url : sideImg"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon
          v-if="!userData.name"
          icon="UserIcon"
          size="22"
        />
      </b-avatar>
    </template>

    <!-- <b-dropdown-item
      :to="{ name: 'profile'}"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50"
      />
      <span>Profile</span>
    </b-dropdown-item> -->

    <b-dropdown-divider />
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>Logout</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  /* eslint-disable*/
  const APIURL = process.env.APIURLFILE
  import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'
import { avatarText } from '@core/utils/filter'
import { BAvatar, BDropdownDivider, BDropdownItem, BNavItemDropdown } from 'bootstrap-vue'

  export default {
    components: {
      BNavItemDropdown,
      BDropdownItem,
      BDropdownDivider,
      BAvatar,
    },
    data() {
      return {
        userData: JSON.parse(localStorage.getItem('userData')),
        avatarText,
        apiurl: APIURL,
        sideImg: require('@/assets/images/access/default.png'),
      }
    },
    mounted() {
      console.log('**********mounted')
    },
    methods: {
      logout() {
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
      },
    },
  }
</script>
