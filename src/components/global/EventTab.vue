<template>
    <nav class="tabInit swiper-container" :class="{fixed:fixed}">
        <ul class="swiper-wrapper">
            <li class="swiper-slide" :class="{on:onSubTabIndex==0}"><router-link :to="{name:'Event', query:{subIndex:0}}">진행중인 이벤트</router-link></li>
            <li class="swiper-slide" :class="{on:onSubTabIndex==1}"><router-link :to="{name:'Past', query:{subIndex:1}}">종료된 이벤트</router-link></li>
            <li class="swiper-slide" :class="{on:onSubTabIndex==2}"><router-link :to="{name:'Winner', query:{subIndex:2}}">당첨자 발표</router-link></li>
        </ul>
    </nav>
</template>
<script>
import $ from 'jquery'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    data() {
        return {
            onSubTabIndex: 0,
            tabSwiper : '',
            showSwipe : false
        }
    },
    mounted () {        
        this.onSubTabIndex = this.$route.query.subIndex ? this.$route.query.subIndex : this.onSubTabIndex
        if(this.isMobile){
            this.goTabSwiper()
            this.showSwipe = true
        }
    },
    methods: {        
        goTabSwiper(){
            this.tabSwiper = new Swiper ('.tabInit', {
              slidesPerView: 'auto',
              initialSlide : this.onSubTabIndex
          })
        },
        resize(){
            this.checkMobile()
            if(this.isMobile){
                if(!this.showSwipe){
                    this.goTabSwiper()
                    this.showSwipe = true
                }
            } else {
                if(this.showSwipe){
                    this.tabSwiper.destroy(true, true)
                    this.showSwipe = false
                }
            }
        }
    },
}
</script>
<style lang="scss" scope>
</style>
