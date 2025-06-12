/* eslint-disable*/
import VueStoreService from './VueStoreService';
const FileTypeService = {
    async getFileType(filter,store){        
        var resp = await VueStoreService.get("filetype"+filter, store)      
        return resp;
    },
    
    async updateFileType(filetype_id,data,store){
        var resp = await VueStoreService.patch("filetype/"+filetype_id,data,store)
        return resp;
    },
    async deleteFileType(filetype_id,store){
        var resp = await VueStoreService.delete("filetype/"+filetype_id,store)
        return resp;
    },
    async saveFileType(data,store){
        var resp = await VueStoreService.post("filetype",data,store)
        return resp;
    },
}

export default FileTypeService;