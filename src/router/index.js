import Vue from 'vue'
import VueRouter from 'vue-router'

/* eslint-disable */
// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserAcessPermissions,getUserAccesPermissionsNew, validateAccess, validateAccess2, getUserData, getHomeRouteForLoggedInUser,cleanStorageBySocket } from '@/auth/utils'
// import apps from './routes/apps'
import pages from './routes/pages'
import main from './routes/main'

import { bubbleToast } from './bubble.js'; // Ajusta la ruta según la ubicación de index.js

// Luego, puedes llamar a la función en el lugar adecuado dentro de tu componente Vue.

import { Manager } from 'socket.io-client'
Vue.use(VueRouter)
const API_URL = process.env.APIURL
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/' },
    // ...apps,
    ...pages,
    ...main,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
  options: { ignoreDuplicates: true }

})


router.beforeEach((to, _, next) => {
  let userData = getUserData()
  /* const manager = new Manager(API_URL+'socket.io/socket.io.js')
  const socket = manager.socket('/')
  socket.on('logout-user', (data) =>{
  
    if(data.user.id == userData.id){
       let result = cleanStorageBySocket();
      return next({ name: 'auth-login' })
    }
    
  }) */
  const isLoggedIn = isUserLoggedIn()
  if (to.fullPath == '/lecciones-general') {
    return next()
  }
  
  if(isLoggedIn){
    
    
    //se cambio multirole
    /* let permissions = getUserAccesPermissionsNew(userData.role_user[0]) */
    let permissions = getUserAccesPermissionsNew(userData.role.description)
    let hasPermission = validateAccess(to, permissions, userData.role.description)
    let hasPermission2 = validateAccess2(to, permissions, userData.role.description)
    const nameRouter = getHomeRouteForLoggedInUser(userData ? userData : null)
    console.log("NAME ROUTER INDEX", nameRouter)
   

    if(!hasPermission && to.name!="auth-login" && to.name!="misc-not-authorized" && to.name!=nameRouter && to.name!=undefined) {
      console.log("NO TIENE PERMISO")
      return next({ name: 'misc-not-authorized' })
    }
    if(!hasPermission2 && to.name!="auth-login" && to.name!="misc-not-authorized" && to.name!=nameRouter && to.name!=undefined) {
      console.log("NO TIENE PERMISO 22")
      console.log("TO NAME", to.name)
      console.log("HAS ACCESS", hasPermission2)
      console.log("permisos", permissions)
      console.log("USER DATA ROLE", userData.role.description)
      return next({ name: 'misc-not-authorized' })
    }
  }
  if (!canNavigate(to)) {
    if (!isLoggedIn) {
      return next({ name: 'auth-login' })
    }
    return next({ name: 'misc-not-authorized' })
  } else {   
    if (to.fullPath == "/") {
      console.log("TO FULL PATH", to.fullPath)
      const nameRouter = getHomeRouteForLoggedInUser(userData ? userData : null)      
      next({ name: nameRouter })
    }
  }

  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    // const nameRouter = getHomeRouteForLoggedInUser(userData ? userData.role : null)
    // console.log('nameRouter',nameRouter)
    // next({ name: nameRouter })
    next("/")
  }
  
  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }

  /* const projectId = localStorage.getItem('project_id');
 

  const userId =localStorage.getItem('userData') ?  JSON.parse(localStorage.getItem('userData')).id:null
  bubbleToast(projectId,userId); */

})

export default router
