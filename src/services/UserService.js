import VueStoreService from './VueStoreService';

const UserService = {
    async login(data,store){
        var resp = await VueStoreService.post("auth/login",data,store)
        return resp;
    },
    async register(data,store){
        var resp = await VueStoreService.post("register",data,store)
        return resp;
    },
    async confirm(data,store){
        var resp = await VueStoreService.post("confirm-code",data,store)
        return resp;
    },
}

export default UserService;