/* eslint-disable*/
import VueStoreService from './VueStoreService';
const GeneralService = {
    async getGeneral(url,store){
        var resp = await VueStoreService.get("project/generalApi"+url, store)
        return resp;
    }
    
}

export default GeneralService;