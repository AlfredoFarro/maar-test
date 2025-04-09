/* eslint-disable*/
import VueStoreService from './VueStoreService';
const FormService = {
    async getForms(filter,store){        
        var resp = await VueStoreService.get("form"+filter, store)      
        return resp;
    },
    async getProjectForms(filter,store){        
        var resp = await VueStoreService.get("service-project"+filter, store)      
        return resp;
    },
    async createProjectForms(data,store){        
        var resp = await VueStoreService.post("service-project",data, store)      
        return resp;
    },
    async updateProjectForm(form_id,data,store){
        var resp = await VueStoreService.patch("service-project/"+form_id,data,store)
        return resp;
    },
    async getFormById(form_id,store){        
        var resp = await VueStoreService.get("form/"+form_id, store)      
        return resp;
    },
    async saveForm(data,store){
        var resp = await VueStoreService.post("form",data,store)
        return resp;
    },
    async updateForm(form_id,data,store){
        var resp = await VueStoreService.patch("form/"+form_id,data,store)
        return resp;
    },
    async deleteForm(form_id,store){
        var resp = await VueStoreService.delete("form/"+form_id,store)
        return resp;
    },
}

export default FormService;