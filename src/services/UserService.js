import VueStoreService from './VueStoreService';

const UserService = {
    async login(data,store){
        var resp = await VueStoreService.post("login",data,store)
        return resp;
    },
}

export default UserService;