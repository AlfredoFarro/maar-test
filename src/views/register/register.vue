<template>
    <div
      class="container full-bg"
      :style="{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 65, 145, 0.65), rgba(0, 30, 98, 0.85)), url(${require('@/assets/images/login_bg.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div class="header" v-if="v >= 6">
        <img src="@/assets/images/logo_2.svg" />
      </div>
      <div class="header" v-if="v < 6">
        <img src="@/assets/images/logo_1.svg" />
      </div>
      <form @submit.prevent="register">
        <div class="form-group">
          <label :style="{ color: color }">Nombre Completo</label>
          <input
            v-model="userData.fullname"
            type="text"
            class="form-control"
            :style="{ color: color }"
            name="fullname"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Nro de Documento</label>
          <input
            v-model="userData.document"
            type="text"
            class="form-control"
            :style="{ color: color }"
            name="document"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Confirmar Nro de Documento</label>
          <input
            v-model="confirmDocument"
            type="text"
            class="form-control"
            :style="{ color: color }"
            name="confirmDocument"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Correo</label>
          <input
            v-model="userData.email"
            type="email"
            class="form-control"
            :style="{ color: color }"
            name="email"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Contraseña</label>
          <input
            v-model="userData.password"
            type="password"
            class="form-control"
            :style="{ color: color }"
            name="password"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            :style="{ color: color }"
            name="confirmPassword"
          />
        </div>
        <button type="submit" class="btn gradient">Registrarse</button>
      </form>
  
      <!-- Modal para el código de verificación -->
      <div class="modal" v-if="showVerificationModal">
        <div class="modal-content">
          <h2>Ingresa el código de verificación</h2>
          <div class="form-group">
            <input
              v-model="verificationCode"
              type="text"
              class="form-control"
              placeholder="Código de verificación"
              :style="{ color: '#000' }"
            />
          </div>
          <div class="modal-buttons">
            <button @click="verifyCode" class="btn gradient">Verificar</button>
            <button @click="closeModal" class="btn gradient">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import UserService from '@/services/UserService'; // Importamos el servicio
  export default {
    data() {
      return {
        userData: {
          fullname: '',
          document: '',
          email: '',
          password: '',
        },
        confirmDocument: '',
        confirmPassword: '',
        color: '#fff',
        v: 6,
        showVerificationModal: false,
        verificationCode: ''
      }
    },
    methods: {
      async register() {
        if (this.userData.document !== this.confirmDocument) {
          alert('Los números de documento no coinciden.')
          return
        }
  
        if (this.userData.password !== this.confirmPassword) {
          alert('Las contraseñas no coinciden.')
          return
        }
        const resp = await UserService.register(this.userData, this.$store);
        console.log('response:',resp)
        localStorage.setItem('document', this.userData.document)
        localStorage.setItem('activationCode', resp.data.code)
        this.showVerificationModal = true
      },
      async verifyCode() {
        if (this.verificationCode.trim() === '') {
          alert('Por favor ingresa el código de verificación.')
          return
        }
        
        const storedCode = localStorage.getItem('activationCode')

        if (this.verificationCode === storedCode) {
            const payload = {
              document: this.userData.document,
              code: storedCode
            }            
            const resp = await UserService.confirm(payload, this.$store);  
            console.log('response:',resp)
            alert('Código verificado correctamente ✅')
            this.closeModal()
            // Aquí podrías redirigir o limpiar el formulario
             this.$router.push('/login')
        } else {
          alert('El código ingresado no es correcto ❌')
        }
        
        // Cerramos el modal y limpiamos el formulario o redirigimos
        this.closeModal()
        // this.$router.push('/dashboard') // Descomenta si quieres redirigir después
      },
      closeModal() {
        this.showVerificationModal = false
        this.verificationCode = ''
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }
  
  .full-bg{
    background: linear-gradient(
        to bottom,
        rgba(0, 65, 145, 0.65) 0%,
        rgba(0, 30, 98, 0.85) 100%
      ),
      url('/assets/images/login_bg.jpg')center/cover no-repeat;
      max-width: none;
      min-height: 117.6vh;
      padding: 0;
  }
  
  .header {
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    height: 125px;
    margin-top: 1rem;
  }
  
  .header img {
    max-height: 100%;
    max-width: 90%;
    height: auto;
  }
  
  form {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
    margin-top: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    display: block;
    color: #fff;
  }
  
  input {
    padding: 0.5rem;
    width: 100%;
    background-color: transparent;
    border: 1px solid rgba(0, 179, 152, 1);
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
  }
  
  input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  input:focus {
    outline: none;
    border: 2px solid #00b399;
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  button {
    margin-top: 2rem;
  }
  
  button.gradient {
    background: linear-gradient(to right, #00b399, #00a0c1);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s ease;
    width: 100%;
    font-size: 1rem;
  }
  
  button.gradient:hover {
    background: linear-gradient(to right, #00a0c1, #00b399);
  }
  
  button.cancel {
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s ease;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
  }
  
  button.cancel:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  small {
    display: block;
    text-align: center;
    text-decoration: underline;
    cursor: pointer;
    margin: 0.75rem auto 0;
    color: #fff;
    font-size: 0.9rem;
  }
  
  /* Estilos para el modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
  
  .modal-content h2 {
    color: #004191;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .modal-content input {
    border: 1px solid #00b399;
    color: #000;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .modal-buttons {
    display: flex;
    flex-direction: column;
  }
  
  .modal-buttons button:first-child {
    margin-top: 1.5rem;
  }
  </style>