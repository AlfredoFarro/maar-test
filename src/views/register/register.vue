<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="mb-0 px-1 py-1 px-lg-4 py-lg-3" no-body>
        <b-card-title class="mb-1 font-weight-bold text-center d-flex flex-column align-items-center" title-tag="h2">
          <img class="img_login" src="@/assets/images/logo/logo-jjc-grupo.svg" alt="">
          TARJETA MAAR - Registro
        </b-card-title>

        <validation-observer ref="registerForm" #default="{ invalid }">
          <b-form class="auth-register-form mt-1" @submit.prevent="register">
            
            <!-- Nombre Completo -->
            <b-form-group label="Nombre Completo">
              <validation-provider name="Nombre" rules="required" #default="{ errors }">
                <b-form-input
                  v-model="fullname"
                  placeholder="Nombre completo"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Documento -->
            <b-form-group label="Nro de Documento">
              <validation-provider name="Documento" rules="required|numeric" vid="document" #default="{ errors }">
                <b-form-input
                  v-model="document"
                  placeholder="Documento"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Confirmar Documento -->
            <b-form-group label="Confirmar Nro de Documento">
              <validation-provider
                name="Confirmar Documento"
                rules="required|confirmed:document"
                #default="{ errors }"
              >
                <b-form-input
                  v-model="confirmDocument"
                  placeholder="Confirmar Documento"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Correo -->
            <b-form-group label="Correo">
              <validation-provider name="Correo" rules="required|email" #default="{ errors }">
                <b-form-input
                  v-model="email"
                  placeholder="Correo"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Contraseña -->
            <b-form-group label="Contraseña">
              <validation-provider name="Contraseña" rules="required|min:6" vid="password" #default="{ errors }">
                <b-form-input
                  v-model="password"
                  :type="passwordFieldType"
                  placeholder="Contraseña"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Confirmar Contraseña -->
            <b-form-group label="Confirmar Contraseña">
              <validation-provider
                name="Confirmar Contraseña"
                rules="required|confirmed:password"
                #default="{ errors }"
              >
                <b-form-input
                  v-model="confirmPassword"
                  :type="passwordFieldType"
                  placeholder="Confirmar Contraseña"
                  :state="errors.length ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- Botón -->
            <b-button variant="primary" type="submit" block :disabled="invalid">
              Registrarse
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- Modal de verificación -->
      <b-modal
        id="verification-modal"
        v-model="showVerificationModal"
        title="Verificación requerida"
        hide-footer
        centered
      >
        <p>Ingrese el código de verificación enviado a su correo.</p>
        <b-form @submit.prevent="verifyCode">
          <b-form-group label="Código de verificación">
            <b-form-input
              v-model="verificationCode"
              placeholder="Ej: 123456"
            />
          </b-form-group>
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="verifyCode">Verificar</b-button>
            <b-button variant="secondary" @click="showVerificationModal = false">Cancelar</b-button>
          </div>
        </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, numeric, min, confirmed } from 'vee-validate/dist/rules'
import UserService from '@/services/UserService'
extend('required', required)
extend('email', email)
extend('numeric', numeric)
extend('min', min)
extend('confirmed', confirmed)

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      passwordFieldType: 'password',
      fullname: '',
      document: '',
      confirmDocument: '',
      email: '',
      password: '',
      confirmPassword: '',
      showVerificationModal: false,
      verificationCode: '',
    }
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then(async (success) => {
        if (success) {
          const response = await UserService.register(
            {
              fullname: this.fullname,
              document: this.document,
              email: this.email,
              password: this.password,
            },
            this.$store
          )
          console.log('response',response)
          localStorage.setItem('document', this.document)
          localStorage.setItem('activationCode', response.data.code)
          this.showVerificationModal = true
        }
      })
    },
    async verifyCode() {
      if (this.verificationCode.trim() === '') {
        alert('Por favor ingresa el código de verificación.')
        return
      }
      
      const storedCode = localStorage.getItem('activationCode')
      if (this.verificationCode === storedCode) {
          const payload = {
            document: this.document,
            code: storedCode
          }            
          const resp = await UserService.confirm(payload, this.$store);  
          console.log('response:',resp)
          alert('Código verificado correctamente ✅')
          this.showVerificationModal = false
          this.$router.push('/login')
      } else {
        alert('El código ingresado no es correcto ❌')
      }
      
      this.showVerificationModal = false
    },
  }
}
</script>

<style scoped lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/pages/page-auth.scss';

.img_login {

  max-width: 100px;
  margin-bottom: 2rem;
}
</style>