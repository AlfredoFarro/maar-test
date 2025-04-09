/* eslint-disable*/
import VueStoreService from './VueStoreService';
const SedeService = {
    async getSedes(url,store){
        var resp = await VueStoreService.get("sede"+url, store)
        return resp;
    },  
   
    async saveSede(data,store){
        var resp = await VueStoreService.post("sede",data,store)
        return resp;
    },
    
    async updateSede(sede_id,data,store){
        var resp = await VueStoreService.patch("sede/"+sede_id,data,store)
        return resp;
    },

    async deleteSede(sede_id,store){
        var resp = await VueStoreService.delete("sede/"+sede_id,store)
        return resp;
    },
    
}

export default SedeService;