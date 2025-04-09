/* eslint-disable */
// import auth from "@/middleware/auth";
export default [{
    path: "/seleccionar-proyecto",
    name: "seleccionar-proyecto",
    component: () => import("@/views/home.vue"),
    meta: {
      // middleware: auth,
      layout: "proyecto",
    },
  },
  //seleccionar tipo logueo
  {
    path: "/seleccionar-log-type",
    name: "seleccionar-log-type",
    component: () => import("@/views/postLog.vue"),
    meta: {
      // middleware: auth,
      layout: "proyecto",
    },
  },
  //RESTRICCIONES  X LIBERAR 
  {
    path: '/registros',
    name: 'registros',
    component: () => import('@/views/registros/index.vue'),
    meta: {
      pageTitle: 'Historial',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/registros/aprobar/:id',
    name: 'registros-aprobar',
    component: () => import('@/views/registros/index2.vue'),
    meta: {
      pageTitle: 'Historial Servicios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/registros-actividad',
    name: 'registros-actividad',
    component: () => import('@/views/registros-actividad/index.vue'),
    meta: {
      pageTitle: 'Historial',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/registros-actividad/aprobar/:id',
    name: 'registros-actividad-aprobar',
    component: () => import('@/views/registros-actividad/index2.vue'),
    meta: {
      pageTitle: 'Historial Actividades',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/registros-operativo',
    name: 'registros-operativo',
    component: () => import('@/views/registros-operativo/index.vue'),
    meta: {
      pageTitle: 'Historial Operativos',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/registros-operativo/aprobar/:id',
    name: 'registros-operativo-aprobar',
    component: () => import('@/views/registros-operativo/index2.vue'),
    meta: {
      pageTitle: 'Historial Operativos',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
 
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/views/usuarios/index.vue'),
    meta: {
      pageTitle: 'Usuarios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/usuarios-importar',
    name: 'usuarios-importar',
    component: () => import('@/views/usuarios/importar/index.vue'),
    meta: {
      pageTitle: 'Importar Usuarios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  //RESTRICCIONES  
  {
    path: '/cronograma',
    name: 'cronograma',
    component: () => import('@/views/cronograma/index.vue'),
    meta: {
      pageTitle: 'Cronograma',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/cronograma/registro/:id',
    name: 'cronograma-registro',
    component: () => import('@/views/cronograma/add.vue'),
    meta: {
      pageTitle: 'Crear Cronograma',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/cronograma/editar/:id',
    name: 'cronograma-editar',
    component: () => import('@/views/cronograma/edit.vue'),
    meta: {
      pageTitle: 'Editar Cronograma',
      breadcrumb: [{
        text: 'Editar',
        active: true,
      }, ],
    },
  },
  {
    path: '/actividad',
    name: 'actividad',
    component: () => import('@/views/actividad/index.vue'),
    meta: {
      pageTitle: 'Cronograma',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/actividad/registro/:id',
    name: 'actividad-registro',
    component: () => import('@/views/actividad/add.vue'),
    meta: {
      pageTitle: 'Crear Actividad',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/actividad/editar/:id',
    name: 'actividad-editar',
    component: () => import('@/views/actividad/edit.vue'),
    meta: {
      pageTitle: 'Editar Actividad',
      breadcrumb: [{
        text: 'Editar',
        active: true,
      }, ],
    },
  },
  {
    path: '/operativo',
    name: 'operativo',
    component: () => import('@/views/operativo/index.vue'),
    meta: {
      pageTitle: 'Mis Formularios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/operativo/registro/:id',
    name: 'operativo-registro',
    component: () => import('@/views/operativo/add.vue'),
    meta: {
      pageTitle: 'Crear Operativo',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/operativo/editar/:id',
    name: 'operativo-editar',
    component: () => import('@/views/operativo/index2.vue'),
    meta: {
      pageTitle: 'Mis Formularios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  
  {
    path: '/aprobaciones',
    name: 'aprobaciones',
    component: () => import('@/views/aprobaciones/index.vue'),
    meta: {
      pageTitle: 'Mis Pendientes',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/aprobaciones-actividad',
    name: 'aprobaciones-actividad',
    component: () => import('@/views/aprobaciones-actividad/index.vue'),
    meta: {
      pageTitle: 'Mis Pendientes',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/aprobaciones-operativo',
    name: 'aprobaciones-operativo',
    component: () => import('@/views/aprobaciones-operativo/index.vue'),
    meta: {
      pageTitle: 'Mis Pendientes',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/importar',
    name: 'importar',
    component: () => import('@/views/importar/index.vue'),
    meta: {
      pageTitle: 'Importar Servicios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/importar-actividad',
    name: 'importar-actividad',
    component: () => import('@/views/importar-actividad/index.vue'),
    meta: {
      pageTitle: 'Importar Actividades',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/formularios',
    name: 'formularios',
    component: () => import('@/views/formularios/index.vue'),
    meta: {
      pageTitle: 'Formularios',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/proyectos',
    name: 'proyectos',
    component: () => import('@/views/proyectos/index.vue'),
    meta: {
      pageTitle: 'Proyectos',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/sedes',
    name: 'sedes',
    component: () => import('@/views/sedes/index.vue'),
    meta: {
      pageTitle: 'Sedes',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/grupos',
    name: 'grupos',
    component: () => import('@/views/grupos/index.vue'),
    meta: {
      pageTitle: 'Grupos',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('@/views/perfil/index.vue'),
    meta: {
      pageTitle: 'Perfil',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla',
    name: 'plantilla',
    component: () => import('@/views/plantilla/index.vue'),
    meta: {
      pageTitle: 'Plantilla Servicio',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla/registro/:id',
    name: 'plantilla-registro',
    component: () => import('@/views/plantilla/add.vue'),
    meta: {
      pageTitle: 'Crear Plantilla Servicio',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla/editar/:id',
    name: 'plantilla-editar',
    component: () => import('@/views/plantilla/edit.vue'),
    meta: {
      pageTitle: 'Editar Plantilla Servicio',
      breadcrumb: [{
        text: 'Editar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-actividad',
    name: 'plantilla-actividad',
    component: () => import('@/views/plantilla-actividad/index.vue'),
    meta: {
      pageTitle: 'Plantilla Actividad',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-actividad/registro/:id',
    name: 'plantilla-actividad-registro',
    component: () => import('@/views/plantilla-actividad/add.vue'),
    meta: {
      pageTitle: 'Crear Plantilla Actividad',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-actividad/editar/:id',
    name: 'plantilla-actividad-editar',
    component: () => import('@/views/plantilla-actividad/edit.vue'),
    meta: {
      pageTitle: 'Editar Plantilla Actividad',
      breadcrumb: [{
        text: 'Editar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-operativo',
    name: 'plantilla-operativo',
    component: () => import('@/views/plantilla-operativo/index.vue'),
    meta: {
      pageTitle: 'Plantilla Operativo',
      breadcrumb: [{
        text: 'Listar',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-operativo/registro/:id',
    name: 'plantilla-operativo-registro',
    component: () => import('@/views/plantilla-operativo/add.vue'),
    meta: {
      pageTitle: 'Crear Plantilla Operativo',
      breadcrumb: [{
        text: 'Crear',
        active: true,
      }, ],
    },
  },
  {
    path: '/plantilla-operativo/editar/:id',
    name: 'plantilla-operativo-editar',
    component: () => import('@/views/plantilla-operativo/edit.vue'),
    meta: {
      pageTitle: 'Editar Plantilla Operativo',
      breadcrumb: [{
        text: 'Editar',
        active: true,
      }, ],
    },
  },
]