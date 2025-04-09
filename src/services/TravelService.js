/* eslint-disable*/
import VueStoreService from './VueStoreService';
const TravelService = {
    async getTravels(filter,store){        
        var resp = await VueStoreService.get("travel"+filter, store)      
        return resp;
    },
    async getTravelsToApprove(filter,store){        
        var resp = await VueStoreService.get("travel/toApprov"+filter, store)      
        return resp;
    },
    async getTravelByProfileWeb(filter,store){        
        var resp = await VueStoreService.get("travel/getTravelByProfileWeb"+filter, store)      
        return resp;
    },
    async getTemplateTravel(filter, store){
        var resp = await VueStoreService.get("detail/detailByPST"+filter, store)      
        return resp;
    },
    async getTravelById(travel_id,store){        
        var resp = await VueStoreService.get("travel/"+travel_id, store)      
        return resp;
    },
    async reactivateTravel(travel_id,store){        
        var resp = await VueStoreService.patch("travel/reactivate/"+travel_id,{}, store)      
        return resp;
    },
    async reactivateAllTravel(travel_id,store){        
        var resp = await VueStoreService.patch("record-form/reactivateAllTravel/"+travel_id,{}, store)      
        return resp;
    },
    async reactivateForm(travel_id,store){        
        var resp = await VueStoreService.patch("record-form/reactivate/"+travel_id,{}, store)      
        return resp;
    },
    /* async getRecords(filter,store){        
        var resp = await VueStoreService.get("record-form/getAllRegistry"+filter, store)      
        return resp;
    }, */
    async getRecords(filter,store){        
        var resp = await VueStoreService.get("record-form/registryByUser"+filter, store)      
        return resp;
    },
    async getRecordsById(travel_id,store){        
        var resp = await VueStoreService.get("record-form/getFormsForRegistry/"+travel_id, store)      
        return resp;
    },
    async approvalForms(data,store){        
        var resp = await VueStoreService.post("record-form/approve-massive",data, store)      
        return resp;
    },
    async uploadFile(file,store){
        var resp = await VueStoreService.post("travel/upload-file",file,store)
        return resp;
    },
    async exportCrono(project_id,store){
        var resp = await VueStoreService.get("travel/download/"+project_id,store)
        return resp;
    },
    async saveTravel(data,store){
        var resp = await VueStoreService.post("travel",data,store)
        return resp;
    },
    async updateTravel(travel_id,data,store){
        var resp = await VueStoreService.patch("travel/"+travel_id,data,store)
        return resp;
    },
    async deleteTravel(travel_id,store){
        var resp = await VueStoreService.delete("travel/"+travel_id,store)
        return resp;
    },
    async getFormsToApprove(filter, store){
        var resp = await VueStoreService.get("record-form"+filter, store)
        return resp;
    },
    async downloadForm(form_id, store){
        var resp = await VueStoreService.get("record-form/downloadDeclaration/"+form_id, store)
        return resp;
    }
}

export default TravelService;