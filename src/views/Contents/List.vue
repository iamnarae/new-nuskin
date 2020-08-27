<template>
    <div id="c-wrapper">        
        <GnbContents @getSortList="sortList"  @getControlSearch="controlSearch" :Fixed="fixed" :menuIndex="menuIndex" :type="type" :category="category" :contentsTitle="contentsTitle" :gubun="gubun" />
        <div id="c-container">
            <header id="c-heading" class="mobileHidden">
                <h1>{{contentsTitle}}</h1>
                <p class="srmy">아름다운 삶을 위한 선택, 뉴스킨의 빛나는 {{contentsTitle}} 콘텐츠를 확인해보세요.</p>
            </header>
            <div class="boardHead">
                <nav class="tabInit swiper-container" :class="{fixed:fixed}">
                    <ul class="swiper-wrapper">
                        <li :class="{on:cateSeq==0}" class="swiper-slide"><router-link :to="{name:'Contents', query:{type:type, cate:''}}">전체보기</router-link></li>
                        <li v-for="list in category" :key="list.categorySeq" class="swiper-slide" :class="{on:cateSeq==list.categorySeq}"><router-link :to="{name:'Contents', query:{type:type, cate:list.categorySeq, menuIndex:menuIndex}}">{{list.categoryName}}</router-link></li>
                    </ul>
                </nav>
                <ul class="type mobileHidden">
                    <li :class="{on:!gubun}"><button @click="sortList();">전체</button></li>
                    <li :class="{on:gubun=='IMAGE'}"><button @click="sortList('IMAGE')">이미지</button></li> 
                    <li :class="{on:gubun=='VIDEO'}"><button @click="sortList('VIDEO')">영상</button></li>
                </ul>
            </div>
            <article class="listArea">
                <PromotionList @totalCount="promoCount" :type="type" :cateSeq="cateSeq" v-if="isPromo" />
                <ContentsList @setTitle="setTitle" :isPromo="isPromo" :pageSize="pageSize" :type="type" :cateSeq="cateSeq" :gubun="gubun" :menuIndex="menuIndex" />
            </article>           
            <transition name="slideUD">
                <aside class="quickSrch" v-show="showSearch">     
                    <QuickSearch @getControlSearch="controlSearch" />
                </aside>
            </transition>
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import $ from 'jquery'
import {eventBus} from '@/main'
import {mixin} from '@/components/mixins/mixins'
import GnbContents from '@/components/global/GnbContents.vue'
import PromotionList from '@/components/contents/PromotionList.vue'
import ContentsList from '@/components/contents/ContentsList.vue'
import QuickSearch from '@/components/contents/QuickSearch.vue'
export default {
    mixins : [mixin],
    components: {
        GnbContents,
        PromotionList,
        ContentsList,
        QuickSearch
    },
    data() {
        return {
            contentsTitle : '',
            category: [],
            cateSeq: '',
            type: '001',
            typeName: '',
            pageSize: 18,
            gubun: null,
            promoTotal: 0,
            isPromo: true,
            menuIndex: 1,
            showSearch: false,
            tabSwiper: '',
            onTabIndex: 0,
            showSwipe: false
        }
    },
    created () {
        this.type = this.$route.query.type ? this.$route.query.type : this.type
        this.cateSeq = this.$route.query.cate ? this.$route.query.cate : this.cateSeq
        this.menuIndex = this.$route.query.menuIndex ? this.$route.query.menuIndex : this.menuIndex
        this.setCate()
        this.setList()
        this.initPageSize = this.pageSize
    },
    mounted () {  
    },
    methods: {
        setTitle(text){
            this.contentsTitle = text
        },
        setCate(type){
            type = type ? type : this.type
            axios.get('/contents/category.do?type='+type).then(res => {
                this.category = res.data
                this.type = type
                if(this.isMobile){
                    setTimeout(()=>{
                        this.onTabIndex = $(".tabInit li.on").index()
                        this.goTabSwiper()
                        this.showSwipe = true
                    }, 1)
                }

            })
        },
        setList(cateSeq){
            cateSeq = cateSeq ? cateSeq : this.cateSeq
            if(cateSeq){
                this.cateSeq = cateSeq
                this.isPromo = false
            } else {
                this.cateSeq = ''
                this.isPromo = true
                eventBus.$emit('setPromoList', this.type, this.cateSeq) 
            } 
            this.sortList()
        },
        sortList(gubun){
            eventBus.$emit('sortList', this.type, this.cateSeq, gubun)
            this.gubun = gubun
            //$("html, body").stop().animate({scrollTop:this.headerHeight}, 300);
        },
        promoCount(count){
           this.promoTotal = count
           if(count > 0) {
               this.isPromo = true
           } else {
               this.isPromo = false
           }
        },
        controlSearch(){
            this.showSearch = !this.showSearch
        },
        goTabSwiper(){
            this.tabSwiper = new Swiper ('.tabInit', {
              slidesPerView: 'auto',
              initialSlide : this.onTabIndex
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
<style lang="scss" scoped>
#c-container {padding-top:150px !important;}
.boardHead {
    .tabInit {float:left; width:80%; margin:0;}
    .type {position:relative; float:right; padding-left:17px;
        &:before {content:""; position:absolute; left:0; top:3px; width:17px; height:19px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_type.png) no-repeat 0 0;}
        li {opacity:.6; float:left; padding-top:2px; margin-left:20px; line-height:1em;
            button {line-height:1em; font-weight:600;}
            &.on {opacity:1;} 
        }
    }
    &:after {content:""; display:block; clear:both;}
}
.listArea {position:relative; margin-top:25px;}

@media all and (max-width:768px){
    .boardHead {
        .tabInit {position:absolute; left:0; top:55px; right:0; float:none; width:auto; margin:0 !important;
            &.fixed {top:55px;}
        } 
    }
    .listArea {margin-top:102px;}
    .quickSrch {position:fixed; left:0; right:0; bottom:0; top:0; z-index:60; background:rgba(0,0,0,.3)}
}
</style>