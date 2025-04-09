import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import back from './back'
import filters from './filters'
import verticalMenu from './vertical-menu'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    back,
    filters,
  },
  strict: process.env.DEV,
})
