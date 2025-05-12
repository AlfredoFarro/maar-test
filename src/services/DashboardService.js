/* eslint-disable */
import VueStoreService from './VueStoreService'; // O VueVueStoreService si así lo exportaste
import store from '@/store'; // <--- IMPORTANTE: Verifica que esta ruta sea correcta y que 'store' se importe bien

const DashboardService = {
  async getRegistrosPorProyectoChartData() {
      const resp = await VueStoreService.get("dashboard", store);
      return resp;
  },
};
export default DashboardService;