/* eslint-disable*/
import VueStoreService from './VueStoreService';
const RiskService = {
    async getRisk(filter,store){        
        var resp = await VueStoreService.get("risk"+filter, store)      
        return resp;
    },
    
    async updateRisk(risk_id,data,store){
        var resp = await VueStoreService.patch("risk/"+risk_id,data,store)
        return resp;
    },
    async deleteRecord(risk_id,store){
        var resp = await VueStoreService.delete("risk/"+risk_id,store)
        return resp;
    },
    async saveRisk(data,store){
        var resp = await VueStoreService.post("risk",data,store)
        return resp;
    },
}

export default RiskService;