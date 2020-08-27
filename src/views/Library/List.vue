<template>
    <div id="c-wrapper" :class="{fixed:fixed}">
        <Gnb :menuIndex="menuIndex" :Fixed="fixed" />
        <div id="c-container">
            <header id="c-heading" class="mobileHidden">
                <h1>자료실</h1>
                <p class="srmy">뉴스킨에 대한 모든 것! 필요한 자료를 다운받아서 활용해보세요.</p>
            </header>
            <nav class="tabInit swiper-container" :class="{fixed:fixed}">
                <ul class="swiper-wrapper">
                    <li :class="{on:type == ''}" class="swiper-slide"><button @click="sortList('', 0)">전체</button></li>
                    <li v-for="(list, index) in cateLists" :key="index" :class="{on:type == list.code2}" class="swiper-slide"><button @click="sortList(list.code2, index+1)">{{list.name2}}</button></li>
                </ul>      
            </nav> 
            <h1 class="pcHidden">자료실</h1>
            <article class="bbsArea">  
                <ul class="boardList">
                    <template v-if="(lists.length > 0 && hasLoading)">
                        <li v-for="(list, index) in lists" :key="index"><router-link :to="{name:'LibraryView', query:{seq:list.seq, type:type, keyword:keyword}, params:{page:page}}">
                            <p class="num">{{setNumber(index)}}</p>
                            <p class="type">{{list.typeName}}</p>
                            <p class="title">{{list.title}}</p>
                        </router-link></li>
                    </template>
                    <li v-else-if="(lists.length == 0 && hasLoading)" class="none">콘텐츠가 없습니다</li>
                    <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
                </ul>
                <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
            </article>
            <Search @search="goSearch" />
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template> 
<script>
import $ from 'jquery'
import axios from 'axios'
import {mapState} from 'vuex'
import Gnb from '@/components/global/Gnb.vue'
import Paging from '@/components/common/Paging.vue'
import Search from '@/components/common/Search.vue'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    components: {
        Gnb,
        Paging,
        Search
    },
    data() {
        return {
            lists : [],
            cateLists : [],
            type : '',
            hasLoading : false,
            total : 0,
            keyword : '',
            page : 1,
            pageSize : 10,
            menuIndex : 4,
            onTabIndex: 0,
            tabSwiper: '',
            showSwipe: false
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created () {
        axios.get('/code.do?code1=003').then(res => {
            this.cateLists = res.data 
        })
        if(this.$route.params.page){
            this.goList(this.$route.params.type, this.$route.params.page, this.$route.params.keyword)
        } else {
            this.goList(this.type, '', '')            
        }
    },
    methods: {
        goList(type, page, keyword){
            this.hasLoading = false
            this.type = type ? type : ''
            this.page = page ? page : 1
            this.keyword = keyword ? keyword : ''
            axios.get('/contents/library/list.do?page='+this.page+'&pageSize='+this.pageSize+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle+'&type='+this.type+'&keyword='+keyword).then(res => {
                this.lists = res.data.lists 
                this.total = res.data.count
                this.hasLoading = true
                if(this.isMobile){
                    setTimeout(()=>{
                        this.onTabIndex = $(".tabInit li.on").index()
                        this.goTabSwiper()
                        this.showSwipe = true
                    }, 1)
                }
            })
        },
        sortList(type,idx){
            this.goList(type, 1, this.keyword)    
        },
        goSearch(keyword){
            this.goList(this.type, 1, keyword)            
        },
        goPage(page){
            this.goList(this.type, page, this.keyword)
        },
        setNumber(index){
            return this.total - (index + this.pageSize * (this.page-1))
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
.boardList {margin-top:35px; border-top:2px solid #000;
    li {border-bottom:1px solid #dbdbdb;
        a {position:relative; display:block; padding:30px 0 30px 80px;
            .num {position:absolute; left:0; top:45px; width:60px; text-align:center; color:#888;}
            .type {margin-bottom:10px; font-weight:600; line-height:1em;}
            .title {font-size:18px;}
            &:hover, &:focus {background:#f3f5f7;}
        }
    }
}

@media all and (max-width:768px){
    #c-wrapper.fixed {padding-top:112px;}
    .boardList {margin-top:0;
        li {
            a {padding:20px 0 20px 40px;
                .num {top:20px; width:40px; line-height:1em;}
                .title {font-size:1.1rem;}
            }
        }
    }
    .tabInit.fixed {top:55px; margin:0 !important;}
}
</style>