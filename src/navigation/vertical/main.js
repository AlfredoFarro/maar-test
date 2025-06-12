/* eslint-disable */
export default [
  {
    header: " ",
  },
  {
    title: "Módulo de Dashboard",
    icon: "StopCircleIcon",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        route: "dashboard",
      },
      {
        id: "cronograma",
        title: "Reportes",
        route: "cronograma",
        hide:true,
      },
      {
        id: "cronograma",
        title: "Registros",
        route: "cronograma",
        hide:true,
      },
    ]
  },
  {
    title: "Reportes",
    icon: "StopCircleIcon",
    children: [
      {
        id: "cronograma",
        title: "Consolidado",
      },
      {
        id: "cronograma",
        title: "Tendencias",
      },
    ]
  },
  {
    title: "Registros",
    icon: "StopCircleIcon",
    children: [
      {
        id: "cronograma",
        title: "Registros consolidados",
        hide:true,
      },
      {
        id: "cronograma",
        title: "Registros con imágenes",
        hide:true,
      },
      {
        id: "cronograma",
        title: "Registros digitales",
        route: "registros-digitales",
      },
      {
        id: "archivos",
        title: "Archivos",
        route: "archivos",
        hide: true,
      },

    ]
  },
];
