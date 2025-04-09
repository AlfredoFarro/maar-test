/* eslint-disable*/
import VueStoreService from './VueStoreService';
const OperateService = {
    async getOperates(url,store){
        var resp = await VueStoreService.get("detail/findAllHeaders"+url, store)
        return resp;
    },  
    async getOperateByID(operate_id,store){
        var resp = await VueStoreService.get("detail/getDetailByHeaderId/"+operate_id, store)
        return resp;
    },  
   
    async saveOperate(data,store){
        var resp = await VueStoreService.post("detail",data,store)
        return resp;
    },
    
    async updateOperate(operate_id,data,store){
        var resp = await VueStoreService.patch("detail/"+operate_id,data,store)
        return resp;
    },

    async deleteOperate(operate_id,store){
        var resp = await VueStoreService.delete("detail/"+operate_id,store)
        return resp;
    },
    async getTemplatesOperate(filter, store){
        var resp = await VueStoreService.get("admin-detail"+filter, store)      
        return resp;
    },
    async changeTemplatesOperateState(template_operate_id, store){
        var resp = await VueStoreService.post("admin-detail/changeActiveState/"+template_operate_id, {}, store)      
        return resp;
    },
    async getTemplateOperateById(template_operate_id, store){
        var resp = await VueStoreService.get("admin-detail/detailByHeader/"+template_operate_id, store)      
        return resp;
    },
    async saveTemplateOperate(data, store){
        var resp = await VueStoreService.post("admin-detail", data, store)      
        return resp;
    },
    async updateTemplateOperate(template_operate_id,data,store){
        var resp = await VueStoreService.patch("admin-detail/update/"+template_operate_id,data,store)
        return resp;
    },
    async deleteTemplateOperate(template_operate_id,store){
        var resp = await VueStoreService.delete("admin-detail/delete/"+template_operate_id,store)
        return resp;
    },
    async getFormsToApprove(url,store){
        var resp = await VueStoreService.get("form-admin/formsToApproveWeb"+url, store)
        return resp;
    },  
    async getFormsForProject(project_id,admin_id,store){
        var resp = await VueStoreService.get("form-admin/getRegistriesByProjectId/"+project_id + '/' + admin_id, store)
        return resp;
    },  
    async getAdminsByProjectId(project_id,store){
        var resp = await VueStoreService.get("form-admin/getAdminsByProjectId/"+project_id, store)
        return resp;
    },  
    async approvalForms(data,store){
        var resp = await VueStoreService.post("form-admin/approve-massive",data, store)
        return resp;
    },  
}

export default OperateService;