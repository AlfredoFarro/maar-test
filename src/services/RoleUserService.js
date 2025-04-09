/* eslint-disable*/
import VueStoreService from './VueStoreService';
const RoleUserService = {
    
    async saveUser(data,store){
        var resp = await VueStoreService.post("user/addRoleUser/",data,store)
        return resp;
    },
    async getRoles(url,store){
        var resp = await VueStoreService.get( "role/"+url,store)
        return resp;
    },
    async getUserRole(user_id,store){
        var resp = await VueStoreService.get( "user/roleUser/"+user_id,store)
        return resp;
    },
    async updateUserRole(user_id,data,store){
        var resp = await VueStoreService.put("user/addRoleUser/"+user_id,data,store)
        return resp;
    },

    async deleteUser(user_id,store){
        var resp = await VueStoreService.delete("user/"+user_id,store)
        return resp;
    },
    async getUsersByProject(project_id,store){
        var resp = await VueStoreService.get("user/searchByProject/"+project_id, store)
        return resp;
    },  
}

export default RoleUserService;