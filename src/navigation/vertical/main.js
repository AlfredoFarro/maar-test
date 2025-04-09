/* eslint-disable */
export default [
  {
    header: " ",
  },
  {
    title: "Módulo de Servicios",
    icon: "StopCircleIcon",
    children: [
      {
        id: "cronograma",
        title: "Cronograma",
        route: "cronograma",
      },
      {
        icon: "FolderIcon",
        id: "cronograma-registro",
        title: "Cronograma Agregar",
        route: "cronograma-registro",
        hide: true,
      },
      {
        icon: "FolderIcon",
        id: "cronograma-editar",
        title: "Cronograma Editar",
        route: "cronograma-editar",
        hide: true,
      },
      {
        id: "importar",
        title: "Importar Servicios",
        route: "importar",
      },
      {
        id: 'aprobaciones',
        title: 'Mis Pendientes',
        route: 'aprobaciones'
      },  
      {
        id: 'registros',
        title: 'Historial',
        route: 'registros'
      },  
      {
        icon: "FolderIcon",
        id: "registros-aprobar",
        title: "Registros Lista",
        route: "registros-aprobar",
        hide: true,
      },
    ]
  },
  {
    title: "Módulo de Actividades",
    icon: "StopCircleIcon",
    children: [
      {
        id: "actividad",
        title: "Cronograma",
        route: "actividad",
      },
      {
        icon: "FolderIcon",
        id: "actividad-registro",
        title: "Actividad Agregar",
        route: "actividad-registro",
        hide: true,
      },
      {
        icon: "FolderIcon",
        id: "actividad-editar",
        title: "Actividad Editar",
        route: "actividad-editar",
        hide: true,
      },
      {
        id: "importar-actividad",
        title: "Importar Actividades",
        route: "importar-actividad",
      },
      {
        id: 'aprobaciones-actividad',
        title: 'Mis Pendientes',
        route: 'aprobaciones-actividad'
      },  
      {
        id: 'registros-actividad',
        title: 'Historial',
        route: 'registros-actividad'
      },
      {
        icon: "FolderIcon",
        id: "registros-actividad-aprobar",
        title: "Registros Actividad Lista",
        route: "registros-actividad-aprobar",
        hide: true,
      },
    ]
  },
  {
    title: "Módulo de Operativos",
    icon: "StopCircleIcon",
    children: [
      {
        id: "operativo",
        title: "Mis Formularios",
        route: "operativo",
      },
      {
        icon: "FolderIcon",
        id: "operativo-registro",
        title: "Operativo Agregar",
        route: "operativo-registro",
        hide: true,
      },
      {
        icon: "FolderIcon",
        id: "operativo-editar",
        title: "Operativo Editar",
        route: "operativo-editar",
        hide: true,
      },
      {
        id: 'aprobaciones-operativo',
        title: 'Mis Pendientes',
        route: 'aprobaciones-operativo'
      },  
      {
        id: 'registros-operativo',
        title: 'Historial',
        route: 'registros-operativo'
      },  
      {
        icon: "FolderIcon",
        id: "registros-operativo-aprobar",
        title: "Registros Lista",
        route: "registros-operativo-aprobar",
        hide: true,
      },
    ]
  },
  /* {
    id: "cronograma",
    title: "Cronograma",
    route: "cronograma",
  },
  {
    icon: "FolderIcon",
    id: "cronograma-registro",
    title: "Cronograma Agregar",
    route: "cronograma-registro",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "cronograma-editar",
    title: "Cronograma Editar",
    route: "cronograma-editar",
    hide: true,
  },
  {
    id: "actividad",
    title: "Actividad",
    route: "actividad",
  },
  {
    icon: "FolderIcon",
    id: "actividad-registro",
    title: "Actividad Agregar",
    route: "actividad-registro",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "actividad-editar",
    title: "Actividad Editar",
    route: "actividad-editar",
    hide: true,
  }, */
  {
    id: "aprobaciones",
    title: "Aprobaciones",
    route: "aprobaciones",
    hide: true
  },
  {
    id: "registros",
    title: "Registros",
    route: "registros",
    hide: true
  },
  {
    id: "usuarios",
    title: "Usuarios",
    route: "usuarios",
    hide: true
  },
  {
    id: "usuarios-importar",
    title: "Usuarios",
    route: "usuarios-importar",
    hide: true
  },
  {
    id: 'perfil',
    title: 'Perfil',
    route: 'perfil',
    hide: true
  },
  /* {
    id: "importar",
    title: "Importar Servicios",
    route: "importar",
  },
  {
    id: "importar-actividad",
    title: "Importar Actividades",
    route: "importar-actividad",
  }, */
  {
    icon: "FolderIcon",
    id: "plantilla-registro",
    title: "Plantilla Servicio Agregar",
    route: "plantilla-registro",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "plantilla-editar",
    title: "Plantilla Servicio Editar",
    route: "plantilla-editar",
    hide: true,
  },
  
  {
    icon: "FolderIcon",
    id: "plantilla-actividad-registro",
    title: "Plantilla Actividad Agregar",
    route: "plantilla-actividad-registro",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "plantilla-actividad-editar",
    title: "Plantilla Actividad Editar",
    route: "plantilla-actividad-editar",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "plantilla-operativo-registro",
    title: "Plantilla Operativo Agregar",
    route: "plantilla-operativo-registro",
    hide: true,
  },
  {
    icon: "FolderIcon",
    id: "plantilla-operativo-editar",
    title: "Plantilla Operativo Editar",
    route: "plantilla-operativo-editar",
    hide: true,
  },
  
];
