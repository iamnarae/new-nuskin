<template>
    <div>
        <section id="gnbContents" :class="{fixed:Fixed}" @mouseleave="hideCate()"><div class="wrap">
            <ul class="location" v-if="!isMobile">
                <li class="home"><router-link :to="{name:'Index'}">CONTENTS</router-link></li>
                <li :class="{on:subCateA}"><p><a @mouseenter="controlCate('subCateA');" :class="{on:subCateA}" class="icoMore">{{contentsTitle}}</a></p>
                    <ul :class="{on:subCateA}">
                        <li><router-link :to="{name:'Contents', query:{type:'001'}}">브랜드</router-link></li>
                        <li><router-link :to="{name:'Contents', query:{type:'002'}}">제품</router-link></li>
                        <li><router-link :to="{name:'Contents', query:{type:'003'}}">비즈니스</router-link></li>
                    </ul>
                </li>
                <li :class="{on:subCateB}"><p><a @mouseenter="controlCate('subCateB')" :class="{on:subCateB}" class="icoMore">전체보기</a></p>
                    <ul :class="{on:subCateB}">
                        <li v-for="list in category" :key="list.categorySeq"><router-link :to="{name:'Contents', query:{type:type, cate:list.categorySeq}}">{{list.categoryName}}</router-link></li>
                    </ul>
                </li>
            </ul>  
            <div class="locationArea swiper-container" v-else>
                <ul class="location swiper-wrapper">
                    <li class="swiper-slide home"><router-link :to="{name:'Index'}">CONTENTS</router-link></li>
                    <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'001', menuIndex:'1'}}" :class="{on:menuIndex=='1'}">브랜드</router-link></li>
                    <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'002', menuIndex:'2'}}" :class="{on:menuIndex=='2'}">제품</router-link></li>
                    <li class="swiper-slide"><router-link :to="{name:'Contents', query:{type:'003', menuIndex:'3'}}" :class="{on:menuIndex=='3'}">비즈니스</router-link></li>
                    <li class="swiper-slide"><router-link :to="{name:'Library', query:{menuIndex:'4'}}" :class="{on:menuIndex=='4'}">자료실</router-link></li>
                    <li class="swiper-slide"><router-link :to="{name:'MyScrap', query:{menuIndex:'5'}}" :class="{on:menuIndex=='5'}">내 콘텐츠</router-link></li>
                </ul>
            </div>
            <transition name="slideUD">
                <div class="utils">
                    <ul class="type" v-if="(!isMobile && Fixed) || (isMobile)">
                        <li :class="{on:!gubun}"><button @click="sortList()">전체</button></li>
                        <li :class="{on:gubun=='IMAGE'}"><button @click="sortList('IMAGE')">이미지</button></li> 
                        <li :class="{on:gubun=='VIDEO'}"><button @click="sortList('VIDEO')">영상</button></li>
                    </ul>
                    <div class="fr">
                        <p class="myScrap"><router-link :to="{name:'MyScrap', query:{menuIndex:'5'}}">내 콘텐츠</router-link></p>
                        <p class="search" v-if="isMobile"><a @click="showQuickSearch()">검색</a></p>
                    </div>
                </div>
            </transition>
        </div></section>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mixin} from '@/components/mixins/mixins'

export default {
    mixins : [mixin],
    props : ['Fixed', 'contentsTitle', 'category', 'gubun', 'type', 'cateType', 'menuIndex'],
    data() {
        return {
            subCateA: false,
            subCateB: false,
            menuSwiper: '',
            showSwipe: false
        }
    },
    mounted () {
        if(this.isMobile){
            //this.onMenuIndex = this.$route.query.menuIndex ? this.$route.query.menuIndex : this.$route.query.type
            //this.onMenuIndex = this.onMenuIndex.substring(this.onMenuIndex.length, this.onMenuIndex.length-1)
            this.goMenuSwiper()
            this.showSwipe = true
        }
    },
    methods: { 
        controlCate(obj){
            if(obj === 'subCateA'){
                this.subCateA = !this.subCateA
            }
            if(obj === 'subCateB'){
                this.subCateB = !this.subCateB
            }
        },
        hideCate(){
            if(this.subCateA){
                this.subCateA = false
            }
            if(this.subCateB){
                this.subCateB = false
            }
        },
        sortList(gubun){
            this.$emit('getSortList', gubun)
        },
        showQuickSearch(){
            this.$emit('getControlSearch')
        },
        goMenuSwiper(){
          this.menuSwiper = new Swiper ('.locationArea', {
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
#gnbContents {position:absolute; left:0; right:0; top:0; z-index:20; height:50px; background:#75a0d5;
    .wrap {max-width:1100px; padding:0 20px; margin:0 auto;
        .location {float:left; height:50px;
            >li {position:relative; z-index:1; float:left; height:50px; padding:0 30px;
                p {height:50px;
                    a {display:block; min-height:50px; padding-top:15px;}
                }
                &.home {padding-left:0; padding-top:10px;
                    a:before {content:""; display:inline-block; width:38px; height:38px; margin:-5px 11px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_home.png) no-repeat 0 0;}
                }
                ul {visibility:hidden; padding:17px 30px 17px 30px; margin:0 -19px 0 -40px; background:#668cbb;
                    li {padding:10px 0;
                        a {opacity:.5; font-size:16px;}
                        a:hover, &.on a {opacity:1;}
                    }
                    &.on {visibility:visible}
                }
                &:before {content:""; position:absolute; left:-11px; top:0; width:11px; height:50px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_cate.png) no-repeat 0 0;}
                &:first-child:before {display:none;}    
                &:last-child {border-right:1px solid #9fbde2;
                    ul {margin-right:-30px;}
                }            
                &.on {background:#668cbb;}
                &.on:before {background-position-y:-50px;}
                &.on+li:not(.on):before  {z-index:2; background-color:#75a0d5; background-position-y:-100px;}
                &.on+li:not(.on) {z-index:2; background:#75a0d5;}
                &.on:last-child {border-right-color:#75a0d5;}
            }
            a {font-size:18px; line-height:1em; color:#fff;}
        }
        .type {position:relative; float:left; margin-left:30px; padding-left:17px;
            &:before {content:""; position:absolute; left:0; top:15px; width:17px; height:19px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_type.png) no-repeat 0 100%;}
            li {opacity:.6; float:left; padding-top:15px; margin-left:20px; line-height:1em;
                button {font-size:18px; line-height:1em; color:#fff;}
                &.on {opacity:1;} 
            }
        }
        .myScrap {float:right; padding-top:12px;
            a {font-size:18px; line-height:1em; color:#fff;
                &:before {content:""; display:inline-block; width:22px; height:18px; margin:-5px 4px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_scrap2.png) no-repeat 0 0;}
            }
        }
        &:after {content:''; display:block; clear:both;}
    }
    &.fixed {position:fixed;}
}


@media all and (max-width:768px){
    #gnbContents {z-index:40; height:55px;
        .wrap {
            .location {width:auto; height:55px;
                >li {width:auto; height:55px; padding:0 50px 0 0;
                    &.home {padding-top:0;
                        a:before {display:none;}
                    }
                    &:before {display:none;}
                    &:last-child {border-right:0; padding-right:0;}    
                }
                a {position:relative; opacity:.5; font-size:1.1rem; height:55px; padding-top:0; line-height:55px;
                    &.router-link-exact-active, &.on {opacity:1;}
                    &.router-link-exact-active:after, &.on:after {content:""; position:absolute; left:50%; bottom:-6px; width:6px; height:6px; margin-left:-3px; border-radius:100%; background:#fff;}
                }
            }
            .utils {position:fixed; left:0; right:0; bottom:0; height:55px; padding:0 20px 0; background:#2d8ab5;
                .type {margin-left:0; padding-top:3px;
                    &:before {top:18px; width:16px; height:18px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_type_m.png); background-size:100%;}
                    li {margin-left:10px;
                        button {font-size:.85rem;}
                    }
                }
                .myScrap {float:left; padding-top:10px;
                    a {font-size:.85rem;
                        &:before {display:block; width:19px; height:16px; margin:0 auto; vertical-align:top; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_scrap2_m.png); background-size:100%;}
                    }
                }
                .search {float:left; padding-top:10px; margin-left:30px;
                    a {font-size:.85rem; color:#fff; font-weight:500; line-height:1em;
                        &:before {content:""; display:block; width:17px; height:16px; margin:0 auto; vertical-align:top; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_search_m.png) no-repeat 0 0; background-size:100%;}
                    }
                }
            }
        }
    }
}
</style>