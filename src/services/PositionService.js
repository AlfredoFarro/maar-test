/* eslint-disable*/
import VueStoreService from './VueStoreService';
const PositionService = {
    async getPositions(url,store){
        var resp = await VueStoreService.get("position"+url, store)
        return resp;
    },  
    async getUsersByCode(code,store){
        var resp = await VueStoreService.get("approver-group/"+code, store)
        return resp;
    },  
    async getUsersById(code,store){
        var resp = await VueStoreService.get("approver-group/groupId/"+code, store)
        return resp;
    },  
   
    async saveGroup(data,store){
        var resp = await VueStoreService.post("approver-group",data,store)
        return resp;
    },
    
    async updateGroup(group_id,data,store){
        var resp = await VueStoreService.patch("approver-group/"+group_id,data,store)
        return resp;
    },

    async deleteGroup(group_id,store){
        var resp = await VueStoreService.delete("approver-group/"+group_id,store)
        return resp;
    },
    
}

export default PositionService;