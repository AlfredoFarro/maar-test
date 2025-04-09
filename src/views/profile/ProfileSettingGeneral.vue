<template>
  <!-- eslint-disable -->
  <b-card>
    <!-- form -->
    <validation-observer ref="simpleRules">
      <b-form
        class="mt-0"
        @submit.prevent="updateProfile(idUser, datosProfile)"
      >
        <b-row>
          <b-col sm="6">
            <b-form-group label="Nombres" label-for="account-username">
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="datosProfile.name"
              >
                <b-form-input
                  v-model="datosProfile.name"
                  placeholder="Nombres"
                  name="username"
                  :state="errors.length > 0 ? false : null"
                  :class="{ 'border border-danger': errors.length > 0 }"
                />
                <small v-if="errors.length > 0" class="text-danger"
                  >El campo nombres es requerido</small
                >
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group label="Apellidos" label-for="account-name">
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="datosProfile.last_name"
              >
                <b-form-input
                  v-model="datosProfile.last_name"
                  name="name"
                  placeholder="Apellidos"
                  :state="errors.length > 0 ? false : null"
                  :class="{ 'border border-danger': errors.length > 0 }"
                />
                <small v-if="errors.length > 0" class="text-danger"
                  >El campo apellidos es requerido</small
                >
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group label="E-mail" label-for="account-e-mail">
              <validation-provider
                #default="{ errors }"
                rules="requeridoE|correo"
                name="datosProfile.email"
              >
                <b-form-input
                  v-model="datosProfile.email"
                  name="email"
                  placeholder="Email"
                  :state="errors.length > 0 ? false : null"
                  :class="{ 'border border-danger': errors.length > 0 }"
                />
                <small v-if="errors.length > 0" class="text-danger">{{
                  errors[0]
                }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mt-2 mr-1"
              type="submit"
              :disabled="isDisabled"
            >
              <b-spinner v-if="isDisabled" small />
              <span v-if="isDisabled" class="px-1">guardando...</span>
              <span v-else>Guardar</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="outline-secondary"
              type="reset"
              class="mt-2"
              @click.prevent="resetForm"
            >
              Reiniciar
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BAlert,
  BCard,
  BCardText,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
  BSpinner,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
// import ProfileService from "@/services/ProfileService";

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
    datos: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: JSON.parse(JSON.stringify(this.generalData)),
      profileFile: null,
      datosProfile: this.datos,
      idUser: this.datos.id,
      required,
      requeridoE,
      correo,
      isDisabled: false,
    };
  },
  methods: {
    resetForm() {
      this.datosProfile = this.datos;
    },
    // async updateProfile(id, data) {
    //   const isValid = await this.$refs.simpleRules.validate();
    //   if (!isValid) {
    //   } else {
    //     this.isDisabled = true
    //     delete data.id;
    //     const resp = await ProfileService.updateData(id, data, this.$store);
    //     if (resp.success) {
    //       this.isDisabled = false
    //       this.$swal({
    //         title: "Actualizado",
    //         text: "El usuario ha sido actualizado",
    //         icon: "success",
    //         customClass: {
    //           confirmButton: "btn btn-primary",
    //         },
    //         buttonsStyling: false,
    //       });
    //     } else {
    //       this.$swal({
    //         title: "Advertencia!",
    //         text: resp.msg,
    //         icon: "warning",
    //         customClass: {
    //           confirmButton: "btn btn-primary",
    //         },
    //         buttonsStyling: false,
    //       });
    //     }
    //   }
    // },
  },
};
</script>
