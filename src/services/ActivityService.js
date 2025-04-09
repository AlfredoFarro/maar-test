/* eslint-disable*/
import VueStoreService from './VueStoreService';
const ActivityService = {
    async getActivitys(filter,store){        
        var resp = await VueStoreService.get("activity"+filter, store)      
        return resp;
    },
    async getActivitiesToApprove(filter,store){        
        var resp = await VueStoreService.get("activity/toApprov"+filter, store)      
        return resp;
    },
    async getActivityByProfileWeb(filter,store){        
        var resp = await VueStoreService.get("activity/getActivityByProfileWeb"+filter, store)      
        return resp;
    },
    async getTemplateActivity(filter, store){
        var resp = await VueStoreService.get("detail/detailByPST"+filter, store)      
        return resp;
    },
    async getActivityById(activity_id,store){        
        var resp = await VueStoreService.get("activity/"+activity_id, store)      
        return resp;
    },
    async reactivateActivity(activity_id,store){        
        var resp = await VueStoreService.patch("activity/reactivate/"+activity_id,{}, store)      
        return resp;
    },
    async reactivateAllActivity(activity_id,store){        
        var resp = await VueStoreService.patch("record-activity-user/reactivateAllActivity/"+activity_id,{}, store)      
        return resp;
    },
    async reactivateForm(activity_id,store){        
        var resp = await VueStoreService.patch("record-activity-user/reactivate/"+activity_id,{}, store)      
        return resp;
    },
    async getRecords(filter,store){        
        var resp = await VueStoreService.get("record-activity-user/registryByUser"+filter, store)      
        return resp;
    },
    async getRecordsById(activity_id,store){        
        var resp = await VueStoreService.get("record-activity-user/getFormsForRegistry/"+activity_id, store)      
        return resp;
    },
    async approvalForms(data,store){        
        var resp = await VueStoreService.post("record-activity-user/approve-massive",data, store)      
        return resp;
    },
    async uploadFile(file,store){
        var resp = await VueStoreService.post("activity/upload-file",file,store)
        return resp;
    },
    async saveActivity(data,store){
        var resp = await VueStoreService.post("activity",data,store)
        return resp;
    },
    async updateActivity(activity_id,data,store){
        var resp = await VueStoreService.patch("activity/"+activity_id,data,store)
        return resp;
    },
    async deleteActivity(activity_id,store){
        var resp = await VueStoreService.delete("activity/"+activity_id,store)
        return resp;
    },
}

export default ActivityService;