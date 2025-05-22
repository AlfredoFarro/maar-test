/* eslint-disable */
import VueStoreService from './VueStoreService';
import store from '@/store';

const DashboardService = {
  async getRegistrosPorProyectoChartData(filter,store2) {
    const resp = await VueStoreService.get('dashboard/registrosporproyecto' +filter, store2);
    return resp;
  },
  async getTipoHallazgosData(filter,store2) {
    const resp = await VueStoreService.get('dashboard/tipohallazgos'+filter, store2);
    return resp;
  },
  async getNivelDeRiesgoChartData(filter,store2) {
    const resp = await VueStoreService.get('dashboard/nivelderiesgo'+filter, store2);
    return resp;
  },
  async getCategoriasChartData(filter,store2) { // Nuevo método para Categorías
    const resp = await VueStoreService.get('dashboard/categoriaschart'+filter, store2);
    return resp;
  },
  async getProjectLocations(filter,store2) { // Nuevo método para Categorías
    const resp = await VueStoreService.get('dashboard/recordlocations'+filter, store2);
    return resp;
  },
};


export default DashboardService;