/* eslint-disable*/
import VueStoreService from './VueStoreService';
const TemplateService = {
    async getTemplates(url,store){
        var resp = await VueStoreService.get("detail/findAllHeaders"+url, store)
        return resp;
    },  
    async getTemplateByID(template_id,store){
        var resp = await VueStoreService.get("detail/getDetailByHeaderId/"+template_id, store)
        return resp;
    },  
   
    async saveTemplate(data,store){
        var resp = await VueStoreService.post("detail",data,store)
        return resp;
    },
    
    async updateTemplate(template_id,data,store){
        var resp = await VueStoreService.patch("detail/"+template_id,data,store)
        return resp;
    },

    async deleteTemplate(template_id,store){
        var resp = await VueStoreService.delete("detail/"+template_id,store)
        return resp;
    },
    
}

export default TemplateService;