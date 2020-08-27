<template>
    <section id="c-gnb" :class="{fixed:Fixed}">
        <div class="wrap swiper-container">
        <ul class="location swiper-wrapper">
            <li class="swiper-slide home"><router-link :to="{name:'Index'}">CONTENTS</router-link></li>
            <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'001', menuIndex:'1'}}" :class="{on:menuIndex=='1'}">브랜드</router-link></li>
            <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'002', menuIndex:'2'}}" :class="{on:menuIndex=='2'}">제품</router-link></li>
            <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'003', menuIndex:'3'}}" :class="{on:menuIndex=='3'}">비즈니스</router-link></li>
            <li class="swiper-slide"><router-link :to="{name:'Library', query:{menuIndex:'4'}}" :class="{on:menuIndex=='4'}">자료실</router-link></li>
            <li class="swiper-slide" v-if="isMobile"><router-link :to="{name:'MyScrap', query:{menuIndex:'5'}}" :class="{on:menuIndex=='5'}">내 콘텐츠</router-link></li>
        </ul>
        <p class="myScrap" v-if="!isMobile"><router-link :to="{name:'MyScrap'}">내 콘텐츠</router-link></p>
    </div></section>
</template>
<script>
import {eventBus} from '@/main'
import {mixin} from '@/components/mixins/mixins'
import $ from 'jquery'
export default {
    mixins : [mixin],
    props: ['Fixed', 'isMain', 'cateType', 'menuIndex'],
    data() {
        return {  
            menuSwiper : '',
            showSwipe : false
        }
    },
    mounted () {
        if(this.isMobile){
            this.goMenuSwiper()
            this.showSwipe = true
        }
    },
    methods: {        
        goMenuSwiper(){
          this.menuSwiper = new Swiper ('.swiper-container.wrap', {
              slidesPerView: "auto",
              initialSlide : this.menuIndex
          })
        },
        resize(){
            this.checkMobile()
            if(this.isMobile){
                if(!this.showSwipe){
                    this.goMenuSwiper()
                    this.showSwipe = true
                }
            } else {
                if(this.showSwipe){
                    this.menuSwiper.destroy(true, true)
                    this.showSwipe = false
                }
            }
        }
    },
}
</script>
<style lang="scss" scoped>
#c-gnb {height:50px; background:#75a0d5;
    .wrap {max-width:1100px; padding:0 20px; margin:0 auto;
        .location {float:left; width:auto; height:50px;
            >li {position:relative; z-index:1; float:left; width:auto; height:50px; padding-top:13px;
                &.home {padding-top:10px;
                    a:before {content:""; display:inline-block; width:38px; height:38px; margin:-5px 11px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_home.png) no-repeat 0 0;}
                }
                &+li {padding-left:50px;}
            }
            a {font-size:18px; line-height:1em; color:#fff;}
        }
        .myScrap {float:right; padding-top:13px;
            a {font-size:18px; line-height:1em; color:#fff;
                &:before {content:""; display:inline-block; width:22px; height:18px; margin:-4px 4px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_scrap2.png) no-repeat 0 0;}
            }
        }
        &:after {content:''; display:block; clear:both;}
    }
    &.fixed {position:fixed; left:0; right:0; top:0; z-index:20;}
}

@media all and (max-width:768px){
    #c-gnb {height:55px;
        .wrap {
            .location {height:55px;
                >li {height:55px; padding:0 50px 0 0;
                    &.home {padding-top:0;
                        a:before {display:none;}
                    }
                    &+li {padding-left:0;}
                    &:last-child {padding-right:0;}
                }
                a {position:relative; opacity:.5; font-size:1.1rem; line-height:55px;
                    &.router-link-exact-active, &.on {opacity:1;}
                    &.router-link-exact-active:after, &.on:after {content:""; position:absolute; left:50%; bottom:-6px; width:6px; height:6px; margin-left:-3px; border-radius:100%; background:#fff;}
                }
            }
            .myScrap {float:left; padding:0 0 0 50px;
                a {opacity:.5; font-size:1.1rem; line-height:55px;
                    &:before {display:none;}
                }
            }
        }
    }
}
</style>