import VueStoreService from './VueStoreService';

const UserService = {
    async login(data,store){
        var resp = await VueStoreService.post("login",data,store)
        return resp;
    },
    async register(data,store){
        var resp = await VueStoreService.post("register",data,store)
        return resp;
    },
    async confirm(data,store){
        var resp = await VueStoreService.post("confirm",data,store)
        return resp;
    },
    async registerU(data,store){
        var resp = await VueStoreService.post("user/register",data,store)
        return resp;
    },
    async getUsers(url,store){
        var resp = await VueStoreService.get("user"+url, store)
        return resp;
    },  
    async updateUser(user_id,data,store){
        var resp = await VueStoreService.patch("user/"+user_id,data,store)
        return resp;
    },

    async deleteUser(user_id,store){
        var resp = await VueStoreService.delete("user/"+user_id,store)
        return resp;
    },
    async getRoles(filter,store){
        var resp = await VueStoreService.get("role"+filter, store)
        return resp;
    },
}

export default UserService;