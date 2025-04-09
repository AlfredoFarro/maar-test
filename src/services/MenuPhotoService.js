/* eslint-disable*/
import VueStoreService from './VueStoreService';
const MenuPhotoService = {
    async getPhoto(url,store){
        var resp = await VueStoreService.get("image-front"+url, store)
        return resp;
    },  
    async createPhoto(data,store){
        var resp = await VueStoreService.post("image-front",data,store)
        return resp;
    },
}

export default MenuPhotoService;