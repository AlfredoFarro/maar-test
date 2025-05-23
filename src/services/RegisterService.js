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
    async deleteRecord(record_id,store){
        var resp = await VueStoreService.delete("record/"+record_id,store)
        return resp;
    },
    async saveRecord(data,store){
        var resp = await VueStoreService.post("record",data,store)
        return resp;
    },
    async downloadExcelRecords(queryString, store) {
        const response = await VueStoreService.get("record/excel" + queryString, store, {
            responseType: 'blob'
        });
        return response;
    }
}

export default RegisterService;