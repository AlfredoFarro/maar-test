
export default {
  namespaced: true,
  state: {
    filters: [],
  },
  getters: {},
  mutations: {
    setFilter(state, filters) {
      state.filters = filters
    },
    sortFilters(state) {
      state.filters = state.filters.map((filter, index) => ({
        ...filter,
        order: (index + 1).toString(),
      }))

      state.filters.sort((a, b) => a.order - b.order)
    },
  },
  actions: {
    async fetchFilters({ commit }, { viewName, store }) {
      try {
        /* const response = await RestrictionsService.getFilters(viewName, store)
        response.data.sort((a, b) => a.order - b.order)
        commit('setFilter', response.data) */
      } catch (error) {
        console.log(error)
      }
    },
    async saveFilters({ state, commit }, store) {
      try {
        /* commit('sortFilters')
        const response = await RestrictionsService.saveFilters(state.filters, store) */
      } catch (error) {
        console.log(error)
      }
    },
  },
}
