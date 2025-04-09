<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-new-speciality"
    :visible="isAdd"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    no-close-on-backdrop
    @change="val => $emit('update:is-add', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">Filtrar segun columnas</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>

      <!-- BODY -->
      <b-card-body class="">
        <div class="d-flex">
          <b-col md="6">
            <h5 class="mb-1">Visibles</h5>
            <drop-list
              :items="visibleFilters"
              class="list1 d-flex flex-column"
              mode="cut"
              @insert="onInsertVisibleFilters"
              @reorder="$event.apply(visibleFilters)"
            >
              <template v-slot:item="{ item }">
                <drag
                  class="item"
                  :class="{ disabled: isVisibleDisabled }"
                  :key="item.id"
                  :data="item"
                  :disabled="isVisibleDisabled"
                  @cut="remove(visibleFilters, item)"
                >
                  {{ item.label }}
                </drag>
              </template>
              <template v-slot:feedback="{ data }">
                <div
                  class="item feedback rounded-lg"
                  :key="data.id"
                >
                  {{ data.label }}
                </div>
              </template>
            </drop-list>
          </b-col>
          <b-col md="6">
            <h5 class="mb-1">No visibles</h5>
            <drop-list
              :items="invisibleFilters"
              class="list2 d-flex flex-column"
              mode="cut"
              @insert="onInsertInvisibleFilters"
              @reorder="$event.apply(invisibleFilters)"
            >
              <template v-slot:item="{ item }">
                <drag
                  class="item rounded-lg bg-light border border-light-emphasis"
                  :key="item.id"
                  :data="item"
                  @cut="remove(invisibleFilters, item)"
                >
                  {{ item.label }}
                </drag>
              </template>
              <template v-slot:feedback="{ data }">
                <div
                  class="item feedback rounded-lg"
                  :key="data.id"
                >
                  {{ data.label }}
                </div>
              </template>
            </drop-list>
          </b-col>
        </div>
      </b-card-body>

      <div class="d-flex justify-content-end p-2">
        <b-button
          variant="outline-primary"
          class="mr-1"
          @click="hide"
        >
          Cerrar
        </b-button>
        <b-button
          variant="primary"
          @click="sortFilters"
        >
          Aplicar
        </b-button>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
  /* eslint-disable*/
  import { BootstrapVue } from 'bootstrap-vue'
  import Vue from 'vue'
  import { Drag, Drop, DropList } from 'vue-easy-dnd'
  import Ripple from 'vue-ripple-directive'
  Vue.use(BootstrapVue)

  export default {
    components: {
      Drag,
      DropList,
      Drop,
    },
    directives: {
      Ripple,
    },
    props: {
      isAdd: {
        type: Boolean,
        default: true,
        required: false,
      },
      filtros: {
        type: Array,
        required: true,
      },
    },
    computed: {
      isVisibleDisabled() {
        return this.visibleFilters.length === 7
      },
    },
    watch: {
      filtros() {
        this.invisibleFilters = this.filtros.filter(field => !field.visible)
        this.visibleFilters = this.filtros.filter(field => field.visible)
      },
    },
    mounted() {},
    methods: {
      setVisibleFilters(value) {
        this.visibleFilters = this.visibleFilters.map((field, index) => ({
          ...field,
          visible: value,
        }))
      },
      setInvisibleFilters(value) {
        this.invisibleFilters = this.invisibleFilters.map((field, index) => ({
          ...field,
          visible: value,
        }))
      },
      async sortFilters() {
        const { visibleFilters, invisibleFilters } = this
        const filters = [...visibleFilters, ...invisibleFilters]
        this.$emit('update:filtros', filters)
        await this.$store.commit('filters/setFilter', filters)
        await this.$store.dispatch('filters/saveFilters', this.$store)
      },
      onInsertVisibleFilters(event) {
        const { data, index } = event
        let newItem = { ...data, visible: true }
        this.visibleFilters.splice(index, 0, newItem)
      },
      onInsertInvisibleFilters(event) {
        const { data, index } = event
        let newItem = { ...data, visible: false }
        this.invisibleFilters.splice(index, 0, newItem)
      },
      remove(array, value) {
        let index = array.indexOf(value)
        array.splice(index, 1)
      },
    },
    data() {
      return {
        filters: [],
        invisibleFilters: [],
        visibleFilters: [],
      }
    },
  }
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';

  .list1,
  .list2 {
    height: 100%;
    gap: 0.5rem;

    .item {
      border-radius: 0.5rem;
      border-style: solid;
      border-width: 1px;
      padding: 0.5rem;

      &.disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }

  .list1 {
    .item {
      background-color: #ecf7ff;
      border-color: #b4ddff;

      &.feedback {
        background-color: #f5fffa;
        border-style: dashed;
        border-color: #50bd87;
      }
    }
  }

  .list2 {
    .item {
      background-color: #ececec;
      border-color: #9e9e9e;

      &.feedback {
        background-color: #fff5f5;
        border-style: dashed;
        border-color: #f87171;
      }
    }
  }
</style>
