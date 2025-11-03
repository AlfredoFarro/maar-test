<template>
  <!-- eslint-disable -->
  <div class="w-100">
    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
      <!-- Sidebar Add/Edit -->
      <add-edit
        :is-add.sync="isAdd"
        ref="addEditRef"
        @saved="onSaved"
      />

      <!-- Filtros -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <!-- Filtro por Acción disciplinaria -->
            <b-col md="6" lg="3">
              <b-form-group label="Acción disciplinaria" label-for="actionFilter">
                <b-form-select
                  id="actionFilter"
                  v-model="actionFilter"
                  :options="actionOptions"
                  @change="filter"
                />
              </b-form-group>
            </b-col>

            <!-- Botón Agregar -->
            <b-col md="6" lg="2" class="d-flex">
              <div class="d-flex align-items-center h-100 justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02">
                <b-button
                  class="mr-2"
                  variant="primary"
                  :disabled="!rolesAllowed.includes(user_role)"
                  @click="addItem"
                >
                  <span class="text-nowrap">
                    <feather-icon icon="PlusCircleIcon" /> Agregar
                  </span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <!-- Tabla -->
      <b-card no-body ref="tableCard">
        <div class="table-overflow">
          <b-table
            class="position-relative"
            empty-text="No existen"
            :fields="visibleFields"
            :hover="true"
            :items="records"
            no-border-collapse
            ref="selectableTable"
            show-empty
            @sort-changed="sortChanged"
          >
            <!-- Acción disciplinaria (texto “bonito”) -->
            <template #cell(action)="{ item }">
              <span>{{ actionLabel(item.action) }}</span>
            </template>

            <!-- Estado -->
            <template #cell(isActive)="{ item }">
              <div class="d-flex align-items-center">
                <span class="mr-2">{{ item.isActive ? 'Activo' : 'Inactivo' }}</span>
                <b-form-checkbox
                  switch
                  v-model="item.isActive"
                  :value="1"
                  :unchecked-value="0"
                  @change="changeStatus(item)"
                />
              </div>
            </template>

            <!-- Acciones -->
            <template #cell(actions)="{ item }">
              <b-button
                size="sm"
                variant="flat-success"
                v-b-tooltip.noninteractive.hover.left="'Editar'"
                :disabled="!rolesAllowed.includes(user_role)"
                @click="editItem(item)"
              >
                <feather-icon size="20" icon="Edit2Icon" />
              </b-button>
              <b-button
                size="sm"
                variant="flat-danger"
                class="ml-50"
                v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                :disabled="!rolesAllowed.includes(user_role)"
                @click="deleteAction(item)"
              >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
            </template>
          </b-table>
        </div>

        <!-- Footer: entradas, total, paginación local -->
        <div class="mx-2 mb-2">
          <b-row>
            <b-col sm="3">
              <b-form-group label-cols="4" label="Entradas">
                <b-form-select
                  v-model="showEntrie"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="entries"
                  @change="changeSizePage"
                />
              </b-form-group>
            </b-col>
            <b-col sm="3" class="mt-75" style="font-size: 12px">
              <span>{{ totalElements }} Registros en total</span>
            </b-col>
            <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-sm-end">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalElements"
                :per-page="showEntrie"
                class="mb-0 mt-1 mt-sm-0"
                prev-class="prev-item"
                next-class="next-item"
                @change="cambioPagina"
                pills
              >
                <template #prev-text>
                  <feather-icon icon="ChevronLeftIcon" size="15" />
                </template>
                <template #next-text>
                  <feather-icon icon="ChevronRightIcon" size="15" />
                </template>
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import addEdit from './add-edit.vue'
import DisciplinaryItemService from '@/services/DisciplinaryItemService'
import Vue from 'vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default {
  directives: { 'b-tooltip': VBTooltip },
  components: { addEdit },
  data() {
    return {
      // UI
      showLoading: false,
      isAdd: false,

      // Tabla (mismos anchos/estilo visual de tu ejemplo)
      fields: [
        { key: 'action',       label: 'ACCIÓN DISCIPLINARIA', sortable: true,  visible: true },
        { key: 'reason',       label: 'MOTIVO',               sortable: true,  visible: true, thStyle: { width: '420px' } },
        { key: 'observation',  label: 'OBSERVACIÓN',          sortable: true,  visible: true, thStyle: { width: '420px' } },
        { key: 'isActive',     label: 'ESTADO',               sortable: false, visible: true },
        { key: 'actions',      label: 'ACCIONES',             sortable: false, visible: true },
      ],

      // Filtro
      actionFilter: null,
      actionOptions: [
        { value: null, text: 'Todas' },
        { value: 'Amonestación escrita', text: 'Amonestación escrita' },
        { value: 'Suspensión', text: 'Suspensión' },
        { value: 'Falta Muy Grave RISST', text: 'Falta Muy Grave RISST' },
      ],
      arrayFilters: [],

      // Data + paginación local
      allData: [],
      records: [],
      allDataSorted: [],
      totalElements: 0,
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      sort: 'id',
      order: 'asc',

      // Roles
      user_role: JSON.parse(localStorage.getItem('userData')).role.description,
      rolesAllowed: ['administrador', 'gestor'],

      // ---- Soporte tabla “bonita”: refs/medidas/scroll sync ----
      navbar: null,
      filterContent: null,
      tableCard: null,
      tableContainer: null,
      selectableTable: null,
      tableHead: null,
      ths: null,
      trs: null,
    }
  },
  computed: {
    visibleFields() {
      return this.fields.filter(f => f.visible)
    },
  },
  watch: {
    records() {
      this.$nextTick(() => {
        if (!this.selectableTable) return
        this.trs = this.selectableTable.querySelector('tbody')?.querySelectorAll('tr')
        this.fixedElements()
      })
    },
    visibleFields() {
      this.$nextTick(() => {
        if (!this.selectableTable) return
        this.ths = this.selectableTable.querySelector('thead')?.querySelectorAll('th')
        this.fixedElements()
      })
    }
  },
  mounted() {
    this.filter()

    // refs para el header fijo + sincronía de scroll (igual a tu ejemplo)
    this.navbar = document.querySelector('.navbar') || { offsetHeight: 0 }
    this.filterContent = this.$refs.filterContent
    this.tableContainer = this.$el.querySelector('.table-overflow')
    this.tableCard = this.$refs.tableCard
    this.selectableTable = this.$refs.selectableTable.$el
    this.tableHead = this.selectableTable.querySelector('thead')
    this.ths = this.tableHead.querySelectorAll('th')

    this.setupScrollSync()
    new ResizeObserver(this.fixedElements).observe(this.tableCard)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll)
    window.removeEventListener('resize', this.fixedElements)
  },
  methods: {
    actionLabel(code) {
      const map = {
        AMONESTACION_ESCRITA: 'Amonestación escrita',
        SUSPENSION: 'Suspensión',
        FALTA_MUY_GRAVE_RISST: 'Falta Muy Grave RISST',
      }
      return map[code] || code || ''
    },

    // UI
    addItem() {
      this.isAdd = true
      this.$refs.addEditRef.setData({ action: this.actionFilter || null })
    },
    editItem(item) {
      this.isAdd = true
      this.$refs.addEditRef.setData({
        id: item.id,
        action: item.action,
        reason: item.reason || '',
        observation: item.observation || '',
        isEdit: true,
      })
    },
    deleteAction(item) {
      this.$swal({
        title: '¿Eliminar registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ml-1' },
        buttonsStyling: false,
      }).then(async (result) => {
        if (!result.value) return
        try {
          this.showLoading = true
          const resp = await DisciplinaryItemService.remove(item.id, this.$store)
          if (resp.status) {
            this.$swal({ icon: 'success', title: 'Eliminado', text: 'Registro eliminado correctamente' })
            this.getAllData()
          } else {
            this.$swal({ icon: 'error', title: 'Error', text: resp.data?.message || 'No se pudo eliminar' })
          }
        } finally {
          this.showLoading = false
        }
      })
    },
    async changeStatus(item) {
      const prev = item.isActive
      try {
        this.showLoading = true
        const payload = { isActive: item.isActive ? 1 : 0 }
        const resp = await DisciplinaryItemService.update(item.id, payload, this.$store)
        if (!resp.status) throw new Error(resp.data?.message || 'No se pudo actualizar estado')
      } catch (e) {
        item.isActive = prev
        this.$swal({ icon: 'error', title: 'Error', text: e.message || 'Error al cambiar estado' })
      } finally {
        this.showLoading = false
      }
    },

    // Filtros
    filter() {
      this.arrayFilters = []
      if (this.actionFilter) {
        this.arrayFilters.push({ keyContains: 'action', key: 'equals', value: this.actionFilter })
      }
      this.getAllData()
    },

    // Data + paginación/orden local
    async getAllData() {
      this.showLoading = true
      try {
        const url = `?limit=10000&order=asc&sort=action&filter=${encodeURIComponent(JSON.stringify(this.arrayFilters))}`
        const resp = await DisciplinaryItemService.getAll(url, this.$store)
        if (resp.status) {
          this.allData = resp.data.rows || []
          this.totalElements = resp.data.responseFilter?.total_rows || this.allData.length
          this.getSortedData(this.sort, this.order)
          this.currentPage = 1
          this.records = this.allDataSorted[0] || []
        } else {
          this.allData = []
          this.records = []
          this.totalElements = 0
        }
      } finally {
        this.showLoading = false
      }
    },
    cambioPagina(p) {
      this.currentPage = p
      this.records = this.allDataSorted[p - 1] || []
      this.$nextTick(this.fixedElements)
    },
    changeSizePage() {
      this.getSortedData(this.sort, this.order)
      this.currentPage = 1
      this.records = this.allDataSorted[0] || []
      this.$nextTick(this.fixedElements)
    },
    sortChanged(data) {
      this.sort = data.sortBy
      this.order = data.sortDesc ? 'desc' : 'asc'
      this.getSortedData(this.sort, this.order)
      this.currentPage = 1
      this.records = this.allDataSorted[0] || []
      this.$nextTick(this.fixedElements)
    },
    getAttributeValue(obj, attribute) {
      if (attribute.includes('.')) {
        const parts = attribute.split('.')
        let value = obj
        for (const p of parts) {
          if (value && Object.prototype.hasOwnProperty.call(value, p)) value = value[p]
          else return null
        }
        return value
      }
      return obj[attribute]
    },
    getSortedData(sortBy, sortOrder) {
      let sortedData = [...this.allData]
      sortedData.sort((a, b) => {
        const aVal = this.getAttributeValue(a, sortBy)
        const bVal = this.getAttributeValue(b, sortBy)
        const textA = (a.reason || a.observation || '').toLowerCase()
        const textB = (b.reason || b.observation || '').toLowerCase()

        if (sortBy === 'action' && aVal === bVal) return textA.localeCompare(textB)
        if (sortOrder === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      })

      this.allDataSorted = []
      for (let i = 0; i < sortedData.length; i += this.showEntrie) {
        this.allDataSorted.push(sortedData.slice(i, i + this.showEntrie))
      }
    },
    onSaved() {
      this.isAdd = false
      this.getAllData()
    },

    // ====== Helpers de tabla “bonita” (idénticos a tu ejemplo) ======
    fixedElements() {
      if (!this.selectableTable || !this.tableHead) return

      this.trs = this.selectableTable.querySelector('tbody')?.querySelectorAll('tr')
      if (!this.trs || this.trs.length === 0) return

      if (!this.trs[0].classList.contains('b-table-empty-row')) {
        const thsTotalWidth = [...this.ths].reduce((acc, th) => acc + th.offsetWidth, 0)

        if (thsTotalWidth > this.tableCard.offsetWidth) {
          this.ths.forEach((th) => { th.style.flex = '0 0 ' + th.offsetWidth + 'px' })
        } else {
          this.ths.forEach((th) => { th.style.flex = '1 1 ' + th.offsetWidth + 'px' })
        }

        this.trs.forEach((tr) => {
          const tds = tr.querySelectorAll('td')
          this.ths.forEach((th, index) => {
            if (!tds[index]) return
            tds[index].style.width = th.offsetWidth + 'px'
            if (thsTotalWidth > this.tableCard.offsetWidth) {
              tds[index].style.flex = '0 0 ' + th.offsetWidth + 'px'
            } else {
              tds[index].style.flex = '1 1 ' + th.offsetWidth + 'px'
            }
          })
        })
      } else {
        this.selectableTable.style.width = this.tableHead.querySelector('tr').offsetWidth + 1 + 'px'
      }

      this.tableHead.style.width = this.tableCard.offsetWidth - 1 + 'px'
    },
    setupScrollSync() {
      if (!this.tableHead || !this.tableContainer) return

      this.tableHead.addEventListener('scroll', () => {
        this.tableContainer.scrollLeft = this.tableHead.scrollLeft
        this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`
      })

      this.tableContainer.addEventListener('scroll', () => {
        this.tableHead.scrollLeft = this.tableContainer.scrollLeft
        this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`
      })

      window.addEventListener('scroll', this.handleWindowScroll)
      window.addEventListener('resize', this.fixedElements)
    },
    handleWindowScroll() {
      if (!this.navbar || !this.filterContent) return
      this.filterContent.style.top = this.navbar.offsetHeight + 'px'

      if (this.tableCard.offsetTop - this.navbar.offsetHeight - 7 - window.scrollY <= 0) {
        this.tableHead.classList.add('fixed')
        this.tableHead.style.top = this.navbar.offsetHeight + this.filterContent.offsetHeight + 'px'
      } else {
        this.tableHead.classList.remove('fixed')
        this.tableHead.style.top = null
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

/* === Visual idéntico a tu referencia === */
.sticky {
  position: sticky;
  z-index: 3;
}

.mt-02 { margin-top: .2rem; }
</style>
