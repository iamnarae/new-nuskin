<template>
    <nav class="tabInit swiper-container" :class="{fixed:fixed}">
        <ul class="swiper-wrapper">
            <li class="swiper-slide" :class="{on:onSubTabIndex==0}"><router-link :to="{name:'MyScrap', query:{menuIndex:5, subIndex:0}}">찜한 콘텐츠</router-link></li>
            <li class="swiper-slide" :class="{on:onSubTabIndex==1}"><router-link :to="{name:'MyView', query:{menuIndex:5, subIndex:1}}">최근 본 콘텐츠</router-link></li>
            <li class="swiper-slide" :class="{on:onSubTabIndex==2}"><router-link :to="{name:'MyPublish', query:{menuIndex:5, subIndex:2}}">내가 발행한 콘텐츠</router-link></li>
        </ul>      
    </nav>
</template>
<script>
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    data() {
        return {
            menuIndex : 5,
            onSubTabIndex: 0,
            tabSwiper: '',
            showSwipe: false
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
                if(!this.showSwipe){
                    this.tabSwiper.destroy(true, true)
                    this.showSwipe = false
                }
            }
        }
    },
    
}
</script>
<style lang="scss" scoped>
@media all and (max-width:768px){
    .tabInit {
        li {
            .router-link-active {border-radius:25px; font-weight:500; color:#fff; background:#212121;}
        }
        &.fixed {top:55px; margin:0 !important;}
    }
}
</style>

