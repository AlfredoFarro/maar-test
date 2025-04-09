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
      <form @submit.prevent="login">
        <div class="form-group">
          <label :style="{ color: color }">Correo</label>
          <input
            v-model="userData.email"
            type="text"
            :style="{ color: color }"
            class="form-control"
            name="email"
          />
        </div>
        <div class="form-group">
          <label :style="{ color: color }">Contraseña</label>
          <input
            v-model="userData.password"
            type="password"
            :style="{ color: color }"
            class="form-control"
            name="password"
          />
        </div>
        <button type="submit" class="btn gradient">Ingresar</button>
        <div class="form-group">
          <small :style="{ color: color }">¿Olvidaste tu contraseña?</small>
        </div>
        <div class="form-group">
          <small :style="{ color: color }">Registrar</small>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import UserService from '@/services/UserService'; // Importamos el servicio
  
  export default {
    data() {
      return {
        userData: {
          email: '',
          password: '',
        },
        internetFlag: true,
        v: 6,
        
        color: '#FFF',
      };
    },
    methods: {
      async login() {
        if (!this.internetFlag) {
          console.log('No hay conexión a internet');
          return;
        }
  
        try {
          // Usamos el servicio para hacer el login, pasando el store
          const resp = await UserService.login(this.userData, this.$store);  // Pasamos el store aquí
          console.log('response:',resp)
          
          // Verificamos si hay un error en la respuesta
          if (resp.data.error) {
            console.log('Error al hacer login');
            return;
          }

          if (resp) {
            console.log('Login exitoso:', resp.data.user);

            // Si la contraseña es 'maar', notificamos que debe cambiar la contraseña
            
          }
          /* if (resp.status) {
            console.log('LOGUEADO')
          } */
        } catch (err) {
          console.log('Error durante el login:', err);
        }
      }
    },
    mounted() {
      console.log('LOGIN');
    },
  };
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
    /* background: linear-gradient(
        to bottom,
        rgba(0, 65, 145, 0.65) 0%,
        rgba(0, 30, 98, 0.85) 100%
      ),
      url('/assets/images/login_bg.jpg'); */
    
   
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
    background-color: rgba(255, 255, 255, 0.05); /* transparencia tipo glass */
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
  
  small {
    display: block;
    text-align: center;
    text-decoration: underline;
    cursor: pointer;
    margin: 0.75rem auto 0;
    color: #fff;
    font-size: 0.9rem;
  }

  </style>