/* eslint-disable*/
import VueStoreService from './VueStoreService';
const EnterpriseService = {
    async getEnterprise(filter,store){        
        var resp = await VueStoreService.get("enterprise"+filter, store)      
        return resp;
    },
    async saveEnteprise(formData, store) { // Recibe FormData
        var resp = await VueStoreService.post("enterprise", formData, store, {
          headers: {
            'Content-Type': 'multipart/form-data', // Asegúrate de enviar el encabezado correcto
          },
        });
        return resp;
      },
    async getEnterpriseById(enterprise_id,store){
        var resp = await VueStoreService.get( "enterprise/"+enterprise_id,store)
        return resp;
    },
    async updateEnterprise(enterprise_id, formData, store) { // Recibe FormData
        var resp = await VueStoreService.patch("enterprise/" + enterprise_id, formData, store, {
          headers: {
            'Content-Type': 'multipart/form-data', // Asegúrate de enviar el encabezado correcto
          },
        });
        return resp;
      },
    async deleteEnterprise(enterprise_id,store){
        var resp = await VueStoreService.delete("enterprise/"+enterprise_id,store)
        return resp;
    },


    async getProyectosByLessons(filter,store){        
        var resp = await VueStoreService.get("project/listByLesson"+filter, store)      
        return resp;
    },
    async getProyectosAll(filter,store){
        var resp = await VueStoreService.get("project/allUsers"+filter, store)
        return resp;
    },
    async validateDeleteProject (project_id,store){
        var resp = await VueStoreService.get("project/canDeleteProject/" + project_id,store)
        return resp;
    },
}

export default EnterpriseService;