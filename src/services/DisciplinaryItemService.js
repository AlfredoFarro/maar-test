/* eslint-disable */
import VueStoreService from './VueStoreService';

const DisciplinaryItemService = {
  async getAll(url, store) {
    return await VueStoreService.get('disciplinary-items' + url, store);
  },

  async getById(id, store) {
    return await VueStoreService.get(`disciplinary-items/${id}`, store);
  },

  async create(data, store) {
    return await VueStoreService.post('disciplinary-items', data, store);
  },

  async update(id, data, store) {
    return await VueStoreService.patch(`disciplinary-items/${id}`, data, store);
  },

  async remove(id, store) {
    return await VueStoreService.delete(`disciplinary-items/${id}`, store);
  },
};

export default DisciplinaryItemService;
