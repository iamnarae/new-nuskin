import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginInfo: 
      {
        "memberId": gVueAroConfig.loginInfo.memberId,
        "memberName" : gVueAroConfig.loginInfo.nm_kr,
        "memberTitle" : gVueAroConfig.loginInfo.memberTitle,
        "memberType" : gVueAroConfig.loginInfo.memberType
      }
    ,
    isLogin: false,
  },
  getters: { //computed
  },
  mutations: { //state를 변화시키는 마지막 로직, commit으로 접근
    checkLogin(state){
      if(state.loginInfo.memberId){
        state.isLogin = true
      } else {
        state.isLogin = false
      }
    }
  },
  actions: { //state를 변화시키기 위한 business 로직, dispatch로 접근
  },
  modules: {
  }
})
