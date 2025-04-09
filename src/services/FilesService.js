/* eslint-disable*/
import VueStoreService from './VueStoreService';
const FilesService = {
    async getFiles(filter,store){
        var resp = await VueStoreService.get(("attachment"+filter), store)
        return resp;
    },
    async saveFile(data,store){
        var resp = await VueStoreService.post("attachment",data,store)
        return resp;
    },
    async getFileById(file_id,store){
        var resp = await VueStoreService.get( "attachment/"+file_id,store)
        return resp;
    },

    async deleteFile(file_id,store){
        var resp = await VueStoreService.delete("attachment/"+file_id,store)
        return resp;
    },
}

export default FilesService;