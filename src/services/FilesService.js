/* eslint-disable*/
import VueStoreService from './VueStoreService';
const FilesService = {
    async getFiles(filter,store){
        var resp = await VueStoreService.get(("file"+filter), store)
        return resp;
    },
    async saveFile(data,store){
        var resp = await VueStoreService.post("file",data,store)
        return resp;
    },
    async updateFile(file_id,data,store){
        var resp = await VueStoreService.patch("file/"+file_id,data,store)
        return resp;
    },
    async deleteFile(file_id,store){
        var resp = await VueStoreService.delete("file/"+file_id,store)
        return resp;
    },
}

export default FilesService;