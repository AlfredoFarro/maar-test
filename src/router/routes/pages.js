export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/authentication/login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/loginnuevo',
    name: 'loginnuevo',
    component: () => import('@/views/login/login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  
  // {
  //   path: '/register',
  //   name: 'auth-register',
  //   component: () => import('@/views/authentication/Register.vue'),
  //   meta: {
  //     layout: 'full',
  //     resource: 'Auth',
  //     redirectIfLoggedIn: true,
  //   },
  // },
  {
    path: '/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import('@/views/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import('@/views/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/miscellaneous/error',
    name: 'misc-error',
    component: () => import('@/views/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/ProfileSetting.vue'),
    meta: {
      pageTitle: 'Configuración del perfil',
      breadcrumb: [
        {
          text: 'Configuración del perfil',
          active: true,
        },
      ],
    },
  },
]
