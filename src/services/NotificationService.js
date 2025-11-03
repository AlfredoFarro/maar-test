/* eslint-disable */
import VueStoreService from './VueStoreService';

const NotificationService = {
  async getAll(url, store) {
    return await VueStoreService.get('notifications' + url, store);
  },

  async getById(id, store) {
    return await VueStoreService.get(`notifications/${id}`, store);
  },

  async create(data, store) {
    return await VueStoreService.post('notifications', data, store);
  },

  async update(id, data, store) {
    return await VueStoreService.patch(`notifications/${id}`, data, store);
  },

  async remove(id, store) {
    return await VueStoreService.delete(`notifications/${id}`, store);
  },

  async importExcel(file, store) {
    const form = new FormData();
    form.append('file', file);
    return await VueStoreService.postFile('notifications/bulk-upload', form, store);
  },

  async downloadTemplate(store) {
    return await VueStoreService.getFile2('notifications/import-template', store);
  }

};

export default NotificationService;
