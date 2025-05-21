/* eslint-disable */
import VueStoreService from './VueStoreService';
import store from '@/store';

const DashboardService = {
  async getRegistrosPorProyectoChartData(filter,store2) {
    const resp = await VueStoreService.get('dashboard/registrosporproyecto' +filter, store2);
    return resp;
  },
  async getTipoHallazgosData() {
    const resp = await VueStoreService.get('dashboard/tipohallazgos', store);
    return resp;
  },
  async getNivelDeRiesgoChartData() {
    const resp = await VueStoreService.get('dashboard/nivelderiesgo', store);
    return resp;
  },
  async getCategoriasChartData() { // Nuevo método para Categorías
    const resp = await VueStoreService.get('dashboard/categoriaschart', store);
    return resp;
  },
  async getProjectLocations() { // Nuevo método para Categorías
    const resp = await VueStoreService.get('dashboard/projectlocations', store);
    return resp;
  },
};


export default DashboardService;