<template>
  <div id="c-app" class="ch-appContents" v-cloak>
    <transition name="container">
      <router-view :key="$route.fullPath" />
    </transition>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/global/Footer.vue'
import {mapMutations} from 'vuex'
export default {
  components : {
    Footer
  },
  created () {
	  this.$store.commit('checkLogin')
  },
}
</script>
<style lang="scss" src="./assets/css/default.scss"></style> 
<style lang="scss" src="./assets/css/fonts.scss"></style> 
<style lang="scss" src="./assets/css/common.scss"></style> 

