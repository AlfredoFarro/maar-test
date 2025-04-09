<template>
  <ul>
    <div class="collapse-toggle-icon" @mouseenter="isMouseHovered = true" @mouseleave="isMouseHovered = false">

      <feather-icon
      :icon="collapseTogglerIconFeather"
      size="25"
      class="d-none d-xl-block  text-black icon-button"
      :class="{ 'center-icon': isVerticalMenuCollapsed || (isCollapsed && isMouseHovered) }"

      @click="toggleCollapsed"
      />
    </div>
    <component
      :is="resolveNavItemComponent(item)"
      class="mt-0"
      v-for="item in items"
      :key="item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { provide, ref } from '@vue/composition-api'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'
import store from '@/store'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    isVerticalMenuCollapsed: Boolean,
    updateVerticalMenuCollapse: Function,

  },
  data() {
    return {
      isMouseHovered: false,
      isCollapsed: false,
    }
  },
  computed: {
    collapseTogglerIconFeather() {
      return this.isVerticalMenuCollapsed ? 'ChevronsRightIcon' : 'ChevronsLeftIcon'
    },
 
  },
  methods: {
    toggleCollapsed() {
      const newCollapsedValue = !this.isVerticalMenuCollapsed;
      this.updateVerticalMenuCollapse(newCollapsedValue);
      this.isCollapsed = !this.isCollapsed;
    },
  },
  setup() {
    provide('openGroups', ref([]))

    return {
      resolveNavItemComponent,
    }
  },
}
</script>
<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
.collapse-toggle-icon{
  /* position: absolute;
  right: 25px;
  top: 10px; */
  display: flex;
  justify-content: flex-end;
  z-index: 1;
  
  margin: 10px 0 10px 5px;
  
}
.icon-button{
  cursor: pointer;

  transition: all 0.3s ease;
  &:hover{
    transform: scale(1.3);
  }
}
.center-icon{
  margin: 0 auto;
  justify-content: center;
}
</style>