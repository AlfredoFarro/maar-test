<template>
  <!-- eslint-disable -->
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0 px-1 py-1 px-lg-4 py-lg-3" no-body>
        <b-card-title class="mb-1 font-weight-bold text-center d-flex flex-column align-items-center" title-tag="h2">
          <img class="img_login" src="@/assets/images/logo/logo_white.png" alt="">
          CRUZ DEL SUR
        </b-card-title>
        <!-- form -->
        <validation-observer ref="loginForm" #default="{ invalid }">
          <b-form class="auth-login-form mt-1" @submit.prevent="login">
            <!-- Documento -->
            <b-form-group label-for="login-usernam,e" label="Documento">
              <validation-provider #default="{ errors }" name="username" rules="requeridoE">
                <b-form-input
                  id="username"
                  v-model="username"
                  name="login-usernam,e"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Documento"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Contraseña</label>
              </div>
              <validation-provider #default="{ errors }" name="Password" rules="required">
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="login-password"
                    placeholder="Contraseña"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button variant="primary" type="submit" block :disabled="invalid">
              Iniciar Sesion
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import { BootstrapVue, BootstrapVueIcons, VBTooltip, VBPopover } from 'bootstrap-vue'
import { required, email } from '@validations'
import useJwt from '@/auth/jwt/useJwt'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import AuthService from '@/services/AuthService'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import router from '@/router/index'
import { bubbleToast } from '../../router/bubble.js'; // Ajusta la ruta según la ubicación de index.js

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
  directives: {
    'b-tooltip': VBTooltip
  },
  components: {
    vSelect,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      role: '',
      password: '',
      username: '',
      sideImg: require('@/assets/images/access/gqr-logo.webp'),

      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(async (success) => {
        if (success) {
          const response = await AuthService.login(
            {
              document: this.username,
              password: this.password,
              via: "web"
            },
            this.$store
          )
          console.log('response',response)
          if (response.status) {
            var userData = response.data
            userData.ability = [{ action: 'manage', subject: 'all' }]
            userData.role.description = userData.role.description
            useJwt.setToken(userData.token)
            useJwt.setRefreshToken(userData.token)
            localStorage.setItem('userData', JSON.stringify(userData))
            this.$ability.update(userData.ability)         
            const projectId = localStorage.getItem('project_id');
            const userId =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).id:null

            if(userData.role.description == "supervisor" || userData.role.description == "planner" || userData.role.description == "gestor" || userData.role.description == "monitor"){
              localStorage.setItem('project_id', userData.project.id)
              localStorage.setItem('project_name', userData.project.description)
              console.log("LOG A CRONOGRAMA")
              this.$router.push({ name: 'cronograma'})
            }else if(userData.role.description == "administrador"){
              console.log("LOG A PROYECTOS")
              this.$router.push({ name: 'seleccionar-proyecto'})
            }else if(userData.role.description == "piloto"){
              console.log("LOG A PERFIL")
              this.$router.push({ name: 'perfil'})
            }
            else {
              this.$swal({
                title: 'Error!',
                text: "Sin permiso alguno",
                icon: 'error',
                customClass: {
                  confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
              })
            }
          } else {
            this.$swal({
              title: 'Error!',
              text: response.message,
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/pages/page-auth.scss';
.bg-yellow {
  background-color: #fcec3870;
}
.img_login{
  filter: invert(1);
  max-width: 100px;
  margin-bottom: 2rem;
}
</style>
