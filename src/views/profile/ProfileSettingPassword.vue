<template>
  <b-card>
    <!-- eslint-disable -->
    <!-- form -->
    <validation-observer ref="simpleRules">
      <b-form @submit.prevent="changePass(dataPassword)">
        <b-row>
          <!-- old password -->
          <b-col md="6">
            <b-form-group
              label="Contraseña anterior"
              label-for="account-old-password"
            >
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="dataPassword.last_password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="{
                    'border border-danger rounded': errors.length > 0,
                  }"
                >
                  <b-form-input
                    id="account-old-password"
                    v-model="dataPassword.last_password"
                    name="old-password"
                    :type="passwordFieldTypeOld"
                    placeholder="Contraseña anterior"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconOld"
                      class="cursor-pointer"
                      @click="togglePasswordOld"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small v-if="errors.length > 0" class="text-danger"
                  >El campo es requerido</small
                >
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <!-- new password -->
          <b-col md="6">
            <b-form-group
              label-for="account-new-password"
              label="Nueva contraseña"
            >
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="dataPassword.password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="{
                    'border border-danger rounded': errors.length > 0,
                  }"
                >
                  <b-form-input
                    id="account-new-password"
                    v-model="dataPassword.password"
                    :type="passwordFieldTypeNew"
                    name="new-password"
                    placeholder="Nueva contraseña"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconNew"
                      class="cursor-pointer"
                      @click="togglePasswordNew"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small v-if="errors.length > 0" class="text-danger"
                  >El campo es requerido</small
                >
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ new password -->

          <!-- retype password -->
          <b-col md="6">
            <b-form-group
              label-for="account-retype-new-password"
              label="Repetir nueva contraseña"
            >
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="dataPassword.repassword"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="{
                    'border border-danger rounded': errors.length > 0,
                  }"
                >
                  <b-form-input
                    id="account-retype-new-password"
                    v-model="dataPassword.repassword"
                    :type="passwordFieldTypeRetype"
                    name="retype-password"
                    placeholder="Nueva contraseña"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconRetype"
                      class="cursor-pointer"
                      @click="togglePasswordRetype"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small v-if="errors.length > 0" class="text-danger"
                  >El campo es requerido</small
                >
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ retype password -->

          <!-- buttons -->
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mt-1 mr-1"
              type="submit"
              :disabled="isDisabled"
            >
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled" class="px-1">guardando...</span>
              <span v-else>Guardar</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
              class="mt-1"
            >
              Reiniciar
            </b-button>
          </b-col>
          <!--/ buttons -->
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BCard,
  BInputGroup,
  BInputGroupAppend,
  BSpinner
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import Ripple from "vue-ripple-directive";
// import ProfileService from '@/services/ProfileService';

export default {
  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BInputGroup,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
    BSpinner
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      dataPassword: {
        last_password: "",
        password: "",
        repassword: "",
      },
      passwordFieldTypeOld: "password",
      passwordFieldTypeNew: "password",
      passwordFieldTypeRetype: "password",
      required,
      idUser: null,
      isDisabled: false
    };
  },
  mounted(){
    let aux = JSON.parse(localStorage.getItem('userData'))
    this.idUser = parseInt(aux.id)
  },
  computed: {
    passwordToggleIconOld() {
      return this.passwordFieldTypeOld === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
    passwordToggleIconNew() {
      return this.passwordFieldTypeNew === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
    passwordToggleIconRetype() {
      return this.passwordFieldTypeRetype === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
  },
  methods: {
    togglePasswordOld() {
      this.passwordFieldTypeOld =
        this.passwordFieldTypeOld === "password" ? "text" : "password";
    },
    togglePasswordNew() {
      this.passwordFieldTypeNew =
        this.passwordFieldTypeNew === "password" ? "text" : "password";
    },
    togglePasswordRetype() {
      this.passwordFieldTypeRetype =
        this.passwordFieldTypeRetype === "password" ? "text" : "password";
    },
    async changePass(data){
      console.log('DATA PASS',data)
      const isValid = await this.$refs.simpleRules.validate();
      // if (!isValid) {
      // } else{
      //   this.isDisabled = true
      //   const resp = await ProfileService.changePassword(this.idUser,data,this.$store)
      //   if (resp.success) {
      //     this.isDisabled = false
      //     this.$swal({
      //       title: "Actualizado",
      //       text: "La contraseña ha sido actualizada",
      //       icon: "success",
      //       customClass: {
      //         confirmButton: "btn btn-primary",
      //       },
      //       buttonsStyling: false,
      //     });
      //   } else {
      //     this.$swal({
      //       title: "Advertencia!",
      //       text: resp.msg,
      //       icon: "warning",
      //       customClass: {
      //         confirmButton: "btn btn-primary",
      //       },
      //       buttonsStyling: false,
      //     });
      //   }
      // }
    }
  },
};
</script>
