<template>
  <!-- eslint-disable -->
  <div class="w-100 p-2">
    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
      <b-row v-if="records.length > 0">
        <b-col
          v-for="(item, index) in records"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="content_card_project xl-2"
          @click="selectProyect(item)"
        >
          <div class="card_project d-flex flex-column mb-2">
            <div class="card_img">
              <img :src="item.url ? apiurl + item.url : sideImg" :alt="'imagen_project_' + index" />
            </div>
            <div class="card_content px-3 py-2 d-flex flex-column">
              <span class="card_content_sub">Proyecto - {{ item.code }}</span>
              <span class="card_content_title mb-2">{{ item.description }}</span>
            </div>
          </div>
        </b-col>
      </b-row>
      <div class="p-2" v-if="records.length > 0">
        <b-row>
          <b-col sm="3">
            <b-form-group
              label-cols="4"
              label-cols-md="4"
              label-size="md"
              label="Entradas"
              label-for="input-md"
            >
              <b-form-select
                v-model="showEntrie"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="title"
                :options="entries"
                @change="changeSizePage"
              />
            </b-form-group>
          </b-col>
          <b-col sm="3" class="mt-75" style="font-size: 12px">
            <span> {{ totalElements }} Registros en total</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
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
      <div v-else>
        <h3>Sin proyectos</h3>
      </div>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
const APIURL = process.env.APIURLFILE
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import EnterpriseService from '@/services/EnterpriseService'
import { getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import router from '@/router/index'
import VueBus from 'vue-bus';
import { bubbleToast } from '../router/bubble.js'; // Ajusta la ruta según la ubicación de index.js

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueBus);

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple
  },
  data() {
    return {
      showLoading: false,
      fields: [
        { key: 'code', label: 'Codigo', sortable: false },
        { key: 'description', label: 'Descripción', sortable: false },
        { key: 'actions', label: 'Acciones' }
      ],
      form: {
        code: null,
        description: '',
        users: []
      },
      project_id: JSON.parse(localStorage.getItem('project_id')),
      records: [],
      documentSelect: [],
      arrayFilters: [],
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      totalElements: 0,
      id: 0,
      sort: 'id',
      order: 'desc',
      apiurl: APIURL,
      sideImg: require('@/assets/images/access/default.png')
    }
  },
  components: {
    vSelect
  },
  mounted() {
    this.getData()
    console.log("PROJECT ID", this.project_id)
    /* if (this.project_id != null) {
      let userData = getUserData()
      const nameRouter = getHomeRouteForLoggedInUser(userData ? userData : null)
      console.log("NAME ROUTER", nameRouter)
      router.push({ name: nameRouter })
      const projectId = localStorage.getItem('project_id');
      const userId =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).id:null
      const userRole =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).role.description:null

    } */
  },
  methods: {
    cambioPagina(e) {
      this.currentPage = e
      this.getData()
    },
    changeSizePage() {
      this.getData()
    },
    sortChanged(data) {
      this.sort = data.sortBy
      if (data.sortDesc) {
        this.order = 'desc'
      } else this.order = 'asc'
    },
    async getData() {
    
      let offset = this.showEntrie * (this.currentPage - 1)
      const url =
        `?limit=${this.showEntrie}&page=${this.currentPage}&order=${this.order}&sort=${this.sort}&filter=` +
        JSON.stringify(this.arrayFilters)
      const respProyectos = await EnterpriseService.getEnterprise(url, this.$store)
     
      if (respProyectos.status) {
        this.records = respProyectos.data.rows
        this.totalElements = respProyectos.data.responseFilter.total_rows
      }
    },
    
    selectProyect(item) {
      if (item.id != null) {
        console.log("ITEM", item)
        localStorage.setItem('project_id', item.id)
        localStorage.setItem('project_name', item.description)
        let userData = getUserData()
        const nameRouter = getHomeRouteForLoggedInUser(userData ? userData : null)
        console.log("NAME ROUTER", nameRouter)

        router.push({ name: nameRouter })
        const projectId = localStorage.getItem('project_id');
        const userId =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).id:null
        const userRole =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).role.description:null
      
        /* bubbleToast(projectId,userId,userRole); */

        
      }
    }
  },
  created() {
    // Escucha un evento personalizado llamado 'executeGetData'
    this.$bus.on('executeGetData', () => {
      // Llama a la función getData pasando las variables
      this.getData();
    });
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
.card_project {
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
  // background: linear-gradient(118deg, #005193, rgba(0, 25, 85, 0.7))
  background: linear-gradient(
    0deg,
    rgba(246, 249, 252, 1) 0%,
    rgba(234, 242, 249, 1) 48%,
    rgba(223, 235, 248, 1) 100%
  );
}
.card_project .card_content .card_content_sub {
  color: #59ccd0;
  font-weight: 600;
}
.card_project .card_content .card_content_title {
  font-size: 18px;
  font-weight: 600;
  color: #005193;
}
.card_img img {
  width: 100%;
  object-fit: cover;
  height: 200px;
  border-radius: 15px 15px 0px 0px;
  background-color: #fff !important;
}
.card_content .btn_edit:hover {
  background-color: transparent !important;
}
.card_content .btn_edit {
  color: #005193;
  font-weight: 600;
}
@media (min-width: 1500px) {
  .xl-2 {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
}
.content_card_project {
  cursor: pointer;
}
.content_card_project:hover {
  translate: 0 -15px;
  transition: all 0.2s ease-out;
}
</style>
