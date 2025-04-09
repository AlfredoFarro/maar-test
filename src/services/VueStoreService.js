/* eslint-disable*/
import axios from 'axios'

require("dotenv").config();
const API_URL = process.env.APIURL
const VueVueStoreService = {
    async get(url, store) {
        var request= {
            headers:this.getHeaders(),
            method: "GET",
            url : API_URL+ url,
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    },

    async EXECUTE(requestOption) {
        var respdata = await axios(requestOption)
          .then((res) => {
            // console.log('res',res)
            if (res.data.success == false) {
              return {
                data: res.data.data,
                status: false
              }
            }
            if (res.data.statusCode == 202) {
              return {
                data: res.data.data,
                status: 202
              }
            }
            if (res.data.statusCode == 400) {
              return {
                data: res.data,
                status: false
              }
            }
            
            return {
              data: res.data.data,
              status: true
            }
          })
          .catch((e) => {
            if (e.response) {
              console.log('e.response', e.response)
              if (e.response.data.error_code == 401 || e.response.data.error_code == 403) {
                localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
                localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
                localStorage.removeItem('userData')
                window.location.href = '/login'
              }
              return {
                data: e.response.data.data,
                status: false,
                code: e.response.status
              };
            } else {
              console.log('e.response', e.response)
              return {
                data: e.response,
                status: false,
                code: e.response.status
              };
            }
          })
        return respdata
      },
    async get2(url) {
        var request= {
            headers:this.getHeaders(),
            method: "GET",
            url : API_URL+ url,
        }
        const resp = this.EXECUTE(request)
        return resp;
    },
    async getFile(url, store) {
        var request= {
            headers:this.getHeaders(),
            method: "GET",
            url : API_URL+ url,
        }
        const resp = await store.dispatch("back/file",request)
        return resp;
    },
    async getWithData(url,data,store){
      var request = {
          headers:this.getHeaders(),
          method: "GET",
          url : API_URL+ url,
          data: data
      }
      const resp = await store.dispatch("back/EXECUTE",request)
      return resp;
  }, 
    async getApi(url, store) {
        var request= {
            headers:this.getHeaders(),
            method: "GET",
            url : 'http://165.227.206.194:3000/'+ url,
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    },
    async delete(url,store){
        var request = {
            headers:this.getHeaders(),
            method: "DELETE",
            url : API_URL+ url,
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    }, 
    async deleteWithData(url,data,store){
        var request = {
            headers:this.getHeaders(),
            method: "DELETE",
            url : API_URL+ url,
            data: data
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    }, 
    async post(url,data,store){
        var request = {
            headers:this.getHeaders(),
            method: "POST",
            url : API_URL+ url,
            data:data
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    }, 
    async put(url,data,store){
        var request = {
            headers:this.getHeaders(),
            method: "PUT",
            url : API_URL+ url,
            data:data
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    },
    async patch(url,data,store){
        var request = {
            headers:this.getHeaders(),
            method: "PATCH",
            url : API_URL+ url,
            data:data
        }
        const resp = await store.dispatch("back/EXECUTE",request)
        return resp;
    }, 
    getHeaders(){
        return  {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
    },
}
export default VueVueStoreService;