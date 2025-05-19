/* eslint-disable*/
import VueStoreService from './VueStoreService';
const RiskService = {
    async getDiscipline(filter,store){        
        var resp = await VueStoreService.get("discipline"+filter, store)      
        return resp;
    },
    
    async updateDiscipline(discipline_id,data,store){
        var resp = await VueStoreService.patch("discipline/"+discipline_id,data,store)
        return resp;
    },
    async deleteDiscipline(discipline_id,store){
        var resp = await VueStoreService.delete("discipline/"+discipline_id,store)
        return resp;
    },
    async saveDiscipline(data,store){
        var resp = await VueStoreService.post("discipline",data,store)
        return resp;
    },
}

export default RiskService;