/* eslint-disable*/
import VueStoreService from './VueStoreService';
const RegisterService = {
    async getRisk(filter,store){        
        var resp = await VueStoreService.get("risk"+filter, store)      
        return resp;
    },
    async getRecord(filter,store){        
        var resp = await VueStoreService.get("record"+filter, store)      
        return resp;
    },
    async updateRecord(record_id,data,store){
        var resp = await VueStoreService.patch("record/"+record_id,data,store)
        return resp;
    },
}

export default RegisterService;