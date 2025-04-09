/* eslint-disable*/
import axios from 'axios'
// import jsonData from "@/generalData.json";
import useJwt from '@/auth/jwt/useJwt'

export default {
  namespaced: true,
  state: {
    indexTab: 0
  },
  getters: {
    increaseTab(state) {
      return state.indexTab++
    },
    decreaseTab(state) {
      return state.indexTab--
    }
  },
  mutations: {
    setIndexTab(state, val) {
      state.indexTab = val
    }
  },
  actions: {
    async EXECUTE({
      commit
    }, requestOption) {
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
            data: res.data,
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
    async file({
      commit
    }, requestOption) {
      var respdata = await axios(requestOption)
        .then((res) => {
          console.log('res',res)
          if (res.data.statusCode == 202) {
            return {
              data: res,
              status: 202
            }
          }
          if (res.data.statusCode == 400) {
            return {
              data: res,
              status: false
            }
          }
          return {
            data: res,
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
              data: e.response,
              status: false,
              code: e.response.status
            };
          } else {
            return {
              data: e.response,
              status: false,
              code: e.response.status
            };
          }
        })
      return respdata
    },
    async GET_GENERAL({
      commit
    }, requestOption) {
      var respdata = await axios
        .get("/schema.json")
        .then(response => {         
          return response.data
        }).catch(e => {
          return e.response.data
        })
      return respdata;
    }
  }
}