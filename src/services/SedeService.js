/* eslint-disable*/
import VueStoreService from './VueStoreService';
const SedeService = {
    async getProyectos(url,store){
        var resp = await VueStoreService.get("project"+url, store)
        return resp;
    },  
   
    async saveSede(data,store){
        var resp = await VueStoreService.post("project",data,store)
        return resp;
    },
    
    async updateSede(sede_id,data,store){
        var resp = await VueStoreService.patch("project/"+sede_id,data,store)
        return resp;
    },

    async deleteSede(sede_id,store){
        var resp = await VueStoreService.delete("project/"+sede_id,store)
        return resp;
    },
    
}

export default SedeService;