/* eslint-disable*/
import VueStoreService from './VueStoreService';
const QueryService = {
    async getQuerys(filter,store){
      
        var resp = await VueStoreService.get("query"+filter, store)
        return resp;
    },
    async saveQuery(data,store){
        var resp = await VueStoreService.post("query",data,store)
        return resp;
    },
    async getQueryByUser(data,store){
        var resp = await VueStoreService.post("query/getByJobUser",data,store)
      
        return resp;
    },
    async getQueryById(query_id,store){
        var resp = await VueStoreService.get( "query/"+query_id,store)
        return resp;
    },
    async getQueryRestriction(query_id,store){
        var resp = await VueStoreService.get( "query/restriction/"+query_id,store)
        return resp;
    },
    async updateQuery(query_id,data,store){
        var resp = await VueStoreService.put("query/"+query_id,data,store)
        return resp;
    },
    async validateDeleteQuery (query_id,store){
        var resp = await VueStoreService.get("query/canDeleteQuery/" + query_id,store)
        return resp;
    },
    async deleteQuery(query_id,store){
        var resp = await VueStoreService.delete("query/"+query_id,store)
        return resp;
    },
}

export default QueryService;