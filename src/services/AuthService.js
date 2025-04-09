/* eslint-disable*/
import VueStoreService from './VueStoreService';
 
const AuthService = {
    async login(data,store){
        var resp = await VueStoreService.post("auth/login",data,store)
        return resp;
    },
}
export default AuthService;