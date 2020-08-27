<template>
        <div class="popularArea swiper-container" v-if="(lists.length > 0)">
        <div class="head">
            <h1><span>POPULAR CONTENTS</span></h1>
            <div class="pagination" v-show="!isMobile"><span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span></div>
        </div>
        <ul class="popularList swiper-wrapper">
            <template v-if="(hasLoading)">
                <li v-for="list in lists" :key="list.seq" class="swiper-slide">
                    <router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.contentsType}}">
                        <p class="thumb" :class="{video:list.contentsType=='003'}"><img :src="thumb(list.seq)" alt=""></p>
                        <p class="tit"><span>{{list.title}}</span></p>
                    </router-link>
                    <p class="scrap"><Scrap :content="list" :design="scrapDesignType" :isMain="isMain" /></p>
                </li>
            </template>
            <li v-else class="none">로딩중...</li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
import Scrap from '@/components/common/Scrap.vue'

export default {
    props: ['isMain'],
    mixins : [mixin],
    components: {
        Scrap,
    },
    data() {
        return {
            lists: [],
            hasLoading : false,
            scrapDesignType: 'typeB',
            popularSwiper: '',
            swipePerView: 3,
            swipeWidth: 1335,
            showMobileSwipe: false,
            showPcSwipe: false
        }
    }, 
    mounted () {
        this.goList();
        if(this.isMobile){
            this.showMobileSwipe = true
            this.swipePerView = 1
            this.swipeWidth = 270
        } else {
            this.showPcSwipe = true
        }
    },      
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        goList(){ //대분류, 페이징, 소분류, 형식, more버튼
            this.hasLoading = false
            axios.get('/contents/popular.do?memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
                this.lists = res.data
                this.hasLoading = true
                setTimeout(()=>{
                    this.goPopularSwiper()
                }, 500)
            })
        },
        thumb(target){
            var thumbnail
            this.lists.forEach(data => {
                if(target === data.seq){
                    thumbnail = data.thumbnail
                }
            });
            return this.cdnURL + thumbnail
        },
        goPopularSwiper(){
            this.popularSwiper = new Swiper ('.popularArea', {
                initialSlide: 0,
                slidesPerView: this.swipePerView,
                slidesPerGroup: 1,
                width: this.swipeWidth,
                autoplay: {
                    delay: 5000
                },
                pagination: {
                    el: '.pagination',
                    clickable: true,
                },
            })            
        },
        resize(){
            this.checkMobile()
            if(this.isMobile){
                this.showPcSwipe = false
                if(!this.showMobileSwipe){
                    this.swipePerView = 1
                    this.swipeWidth = 270
                    this.popularSwiper.destroy(true, true)
                    this.goPopularSwiper()
                    this.showMobileSwipe = true
                }
            } else {
                this.showMobileSwipe = false
                if(!this.showPcSwipe){
                    this.swipePerView = 3
                    this.swipeWidth = 1335
                    this.popularSwiper.destroy(true, true)
                    this.goPopularSwiper()
                    this.showPcSwipe = true
                }
            }
        }
    },
}
</script>
<style lang="scss">
.popularArea {overflow:hidden; width:1335px;
    .head {overflow:hidden; margin:15px 0 50px; 
        h1 {float:left; margin-right:25px; font-size:22px; line-height:1em; font-weight:600;}    }
        .pagination {float:left; display:table; width:163px; margin-top:10px; font-size:0;
            .swiper-pagination-bullet {opacity:1; display:table-cell; height:2px; border-radius:0; background:#c4c4c4;}
            .swiper-pagination-bullet-active {background:#005e99;}
        }
    li {position:relative; float:left; padding-right:40px;
        .thumb {overflow:hidden;
            &.video:before {content:""; position:absolute; left:0; top:0; width:100px; height:100px; border-radius:15px 0 0; background:linear-gradient(135deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,0) 50%);}
            &.video:after {content:""; position:absolute; left:25px; top:18px; width:20px; height:27px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv.png) no-repeat 0 0;}
            img {width:415px; height:292px; border-radius:15px;}
        }
        .tit {position:absolute; left:0; right:20px; bottom:0; padding:0 100px 30px 30px; font-size:22px; line-height:1.4em; color:#fff; font-weight:600;
            &:after {content:""; position:absolute; left:0; right:20px; top:-50px; bottom:0; border-radius:0 0 15px 15px; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.5) 100%);}
            span {position:relative; z-index:1;}
        }
        .scrap {position:absolute; right:70px; bottom:35px;}
    }
}   

@media all and (max-width:768px){
    .popularArea {width:auto;
        .head {margin:25px 0 20px; 
            h1 {float:none; margin-right:0; font-size:1.3rem;}
        }
        li {width:270px !important; padding-right:20px;
            .thumb {
                &.video:before {z-index:1; width:100px; height:100px;}
                &.video:after {z-index:1; left:15px; top:15px; width:17px; height:25px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv_m.png); background-size:100%;}
                img {width:250px; height:175px;}
            }
            .tit {padding:0 80px 15px 15px; font-size:1rem; line-height:1.4em;
                &:after {right:0;}
            }
            .scrap {position:absolute; right:35px; bottom:15px;}
        }
    }
}
</style>