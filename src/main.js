import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueMeta from 'vue-meta'
Vue.use(VueMeta)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#ch-appContents')

export const eventBus = new Vue({
  methods:{
    // directLocation(loc){
    //   this.$emit("directLocation", loc)
    // },
    resetPage(query){
      this.$emit("resetPage", query)
    }
  }
})

// Vue.filter('localeNum', function(val){
//   return val.toLocaleString()
// })