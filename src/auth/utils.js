/* eslint-disable */
import useJwt from '@/auth/jwt/useJwt'
import navMenuItems1 from "@/navigation/vertical";
import navMenuItems2 from "@/navigation/horizontal";
/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return localStorage.getItem('userData')
}

export const getUserData = () => JSON.parse(localStorage.getItem('userData'))
export const cleanStorageBySocket=()=>{
    localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
    localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)   
    localStorage.removeItem('userData')
    localStorage.removeItem('project_id')
    // Reset ability
    return true
}
/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if(!userRole) return { name: 'auth-login' }
  return 'dashboard'
  /* const log_type = localStorage.getItem('log_type')
  const {is_lesson =false, is_restriction = false,role_lesson,role_restriction} = userRole.role_user[0];
  if(log_type == 'Restricciones'){
    if(role_restriction === 'user'){
      return 'provisionales'
    }
    return 'restricciones'
  }
  else if(log_type == "Lecciones"){
    return 'lecciones'
  } else if(log_type == "Corporativo"){
    if(role_restriction == 'user-collection'){
      return 'graph-projects'
    }else{
      return 'proyectos'
    }
  } else return 'rfi' */
  
}
//se cambio multirole
export const getUserAccesPermissionsNew =(role)=>{
  /* const {is_restriction,is_lesson,role_restriction,role_lesson} = role
  let perRestriction  = [];
  let perLesson = [];
  if(is_restriction){
    perRestriction = getUserAcessPermissions(role_restriction);
  }
  if(is_lesson){
    perLesson = getUserAcessPermissions(role_lesson);
  }
  const permissions = perRestriction.concat(perLesson); */
  const permissions = getUserAcessPermissions(role); 
  
  return permissions
}
export const getUserAcessPermissions = (role) => {

  let permissions = [];
  switch (role) {  
    
    case "administrador":
      permissions = [
        "observaciones",
        "registros-digitales",
        "dashboard",
        "categorias",
        "empresas",
        "proyectos",
        "cronograma",
        "cronograma-registro",
        "cronograma-editar",
        "actividad",
        "actividad-registro",
        "actividad-editar",
        "operativo",
        "operativo-registro",
        "operativo-editar",
        "usuarios",
        "usuarios-importar",
        "registros",
        "registros-aprobar",
        "registros-actividad",
        "registros-actividad-aprobar",
        "registros-operativo",
        "registros-operativo-aprobar",
        /* "aprobaciones",
        "aprobaciones-actividad",
        "aprobaciones-operativo", */
        "seleccionar-proyecto",
        "importar",
        "importar-actividad",
        'formularios',
        'sedes',
        'proyectos',
        'grupos',
        'perfil',
        'plantilla',
        'plantilla-registro',
        'plantilla-editar',
        'plantilla-actividad',
        'plantilla-actividad-registro',
        'plantilla-actividad-editar',
        'plantilla-operativo',
        'plantilla-operativo-registro',
        'plantilla-operativo-editar',
      ];
      break;
    case "jefe de proyectos":
      permissions = [
        "observaciones",
        "registros-digitales",
        "dashboard",
        "categorias",
        "empresas",
        "proyectos",
        "cronograma",
        "cronograma-registro",
        "cronograma-editar",
        "actividad",
        "actividad-registro",
        "actividad-editar",
        "operativo",
        "operativo-registro",
        "operativo-editar",
        "usuarios",
        "usuarios-importar",
        "registros",
        "registros-aprobar",
        "registros-actividad",
        "registros-actividad-aprobar",
        "registros-operativo",
        "registros-operativo-aprobar",
        /* "aprobaciones",
        "aprobaciones-actividad",
        "aprobaciones-operativo", */
        "seleccionar-proyecto",
        "importar",
        "importar-actividad",
        'formularios',
        'sedes',
        'proyectos',
        'grupos',
        'perfil',
        'plantilla',
        'plantilla-registro',
        'plantilla-editar',
        'plantilla-actividad',
        'plantilla-actividad-registro',
        'plantilla-actividad-editar',
        'plantilla-operativo',
        'plantilla-operativo-registro',
        'plantilla-operativo-editar',
      ];
      break;
    case "gestor":
      permissions = [
        "cronograma",
        "cronograma-registro",
        "cronograma-editar",
        "actividad",
        "actividad-registro",
        "actividad-editar",
        "operativo",
        "operativo-registro",
        "operativo-editar",
        "usuarios",
        "usuarios-importar",
        "registros",
        "registros-aprobar",
        "registros-actividad",
        "registros-actividad-aprobar",
        "registros-operativo",
        "registros-operativo-aprobar",
        "aprobaciones",
        "aprobaciones-actividad",
        "aprobaciones-operativo",
        "seleccionar-proyecto",
        "importar",
        "importar-actividad",
        'formularios',
        'sedes',
        'proyectos',
        'grupos',
        'perfil',
        'plantilla',
        'plantilla-registro',
        'plantilla-editar',
        'plantilla-actividad',
        'plantilla-actividad-registro',
        'plantilla-actividad-editar',
        'plantilla-operativo',
        'plantilla-operativo-registro',
        'plantilla-operativo-editar',
      ];
      break;
    case "planner":
      permissions = [
        "cronograma",
        "cronograma-registro",
        "cronograma-editar",
        "actividad",
        "actividad-registro",
        "actividad-editar",
        "operativo",
        "operativo-registro",
        "operativo-editar",
        "usuarios",
        "usuarios-importar",
        "registros",
        "registros-aprobar",
        "registros-actividad",
        "registros-actividad-aprobar",
        "registros-operativo",
        "registros-operativo-aprobar",
        "aprobaciones",
        "aprobaciones-actividad",
        "aprobaciones-operativo",
        "seleccionar-proyecto",
        "importar",
        "importar-actividad",
        'formularios',
        'sedes',
        'proyectos',
        'grupos',
        'perfil',
        'plantilla',
        'plantilla-registro',
        'plantilla-editar',
        'plantilla-actividad',
        'plantilla-actividad-registro',
        'plantilla-actividad-editar',
        'plantilla-operativo',
        'plantilla-operativo-registro',
        'plantilla-operativo-editar',
      ];
      break;
    case "monitor":
      permissions = [
        "cronograma",
        "cronograma-registro",
        "cronograma-editar",
        "actividad",
        "actividad-registro",
        "actividad-editar",
        "operativo",
        "operativo-registro",
        "operativo-editar",
        "usuarios",
        "usuarios-importar",
        "registros",
        "registros-aprobar",
        "registros-actividad",
        "registros-actividad-aprobar",
        "registros-operativo",
        "registros-operativo-aprobar",
        "seleccionar-proyecto",
        /* "aprobaciones",
        "aprobaciones-actividad",
        "aprobaciones-operativo", */
        'formularios',
        'sedes',
        'proyectos',
        'grupos',
        'perfil',
        'plantilla',
        'plantilla-registro',
        'plantilla-editar',
        'plantilla-actividad',
        'plantilla-actividad-registro',
        'plantilla-actividad-editar',
        'plantilla-operativo',
        'plantilla-operativo-registro',
        'plantilla-operativo-editar',
      ];
      break;
    case "piloto":
      permissions = [
        'perfil',
      ];
      break;
  
      default:
        permissions = [
          "lecciones",        
          "seleccionar-proyecto",
          "seleccionar-log-type",
          "lecciones-inbox",
          "lecciones-registro",
          "lecciones-editar",
          "lecciones-vista",
        ];
        break;
       
  }

  return permissions;
};


export const validateAccess = (route, permissions, role) => {
  let hasAccess = false;

  navMenuItems1.forEach((element) => {
    if (element.route && element.route.id == route.id) {
      if (permissions.indexOf(element.id) != -1) {
        hasAccess = true;
      }
    } else {
      if (element.children) {
        element.children.forEach((child) => {
          if (child.route && child.route.id == route.id) {
            if (permissions.indexOf(child.id) != -1) {
              hasAccess = true;
            }
          }
        });
      }
    }
  });

  return hasAccess;
};
export const validateAccess2 = (route, permissions, role) => {
  let hasAccess = false;  
  
  navMenuItems2.forEach((element) => {   
   
    if (element.route == route.name) {
      if (permissions.indexOf(element.id) != -1) {
      
        hasAccess = true;
      }
    } else {
      if (element.children) {
        element.children.forEach((child) => {
          if (child.route && (child.route.name ? child.route.name : child.route) == route.name) {
            if (permissions.indexOf(child.id) != -1) {
             
              hasAccess = true;
            }
          }
        });
      }
    }
  });
 
  return hasAccess;
};