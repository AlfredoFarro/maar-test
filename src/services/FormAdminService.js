/* eslint-disable*/
import VueStoreService from './VueStoreService';
const FormAdminService = {
    async getMyForms(adminId, filter,store){        
        var resp = await VueStoreService.get("form-admin/getMyformsWeb/"+ adminId + '/' + filter, store)      
        return resp;
    },
    
    async getMyAdminsWeb(filter,store){        
        var resp = await VueStoreService.get("form-admin/getMyAdminsWeb"+filter, store)      
        return resp;
    },
    
    async saveForm(data,store){
        var resp = await VueStoreService.post("form-admin/approve-massive",data,store)
        return resp;
    },
    
    async updateForm(form_id,data,store){
        var resp = await VueStoreService.post("form-admin/updateFormAdmin/"+form_id,data,store)
        return resp;
    },
   
    async deleteForm(form_id,store){
        var resp = await VueStoreService.delete("form-admin/deleteFormAdmin/"+form_id,store)
        return resp;
    },
}

export default FormAdminService;