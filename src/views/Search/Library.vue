<template>
    <div id="c-container"> 
        <div class="myHead">
            <p class="total">총 <strong>{{total}}</strong>개</p>
        </div>
        <article class="bbsArea">  
            <ul class="boardList">
                <template v-if="(lists.length > 0 && hasLoading)">
                    <li v-for="(list, index) in lists" :key="index">
                        <!-- <router-link :to="{name:'LibraryView', query:{seq:list.seq, type:type, keyword:keyword}, params:{page:page}}"> -->
                        <a @click="goContentsDetail(list)">
                        <p class="num">{{setNumber(index)}}</p>
                        <p class="type">{{list.typeName}}</p>
                        <p class="title">{{list.title}}</p>
                    </a></li>
                </template>
                <li v-else-if="(lists.length > 0 && !hasLoading)" class="none">로딩중...</li>
                <li v-else-if="(lists.length == 0)" class="none">검색된 자료가 없습니다</li>
            </ul>
            <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
        </article>
    </div><!-- //container -->
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex'
import Paging from '@/components/common/Paging.vue'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    components: {
        Paging
    },
    data() {
        return {
            searchWord : '',
            lists : [],
            hasLoading : false,
            total : 0,
            page : 1,
            pageSize : 10,
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created  () {
        this.initPage()
        this.goList()        
    },
    methods: {
        initPage(){
            this.searchWord = this.$route.query.searchProduct
        },
        goList(page){
            this.hasLoading = false
            this.page = page ? page : 1
            axios.get('/search/library.do?searchWord='+this.searchWord+'&page='+this.page+'&pageSize='+this.pageSize+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
                this.lists = res.data.lists 
                this.total = res.data.count
                this.hasLoading = true
            })
        },
        goPage(page){
            this.goList(page)
        },
        setNumber(index){
            return this.total - (index + this.pageSize * (this.page-1))
        },
        goContentsDetail(param){
            location.href = '/app/ch/library/view?seq='+param.seq+'&keyword='+this.searchWord
        }
    },
}
</script>
<style lang="scss" scoped>
.myHead {overflow:hidden; padding:40px 20px 20px; border-bottom:2px solid #000;
    .total {line-height:1em;}
}
.boardList {
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
    .myHead {margin-bottom:20px;
        .total {font-size:.9rem;}
    }
    .boardList {
        li {
            a {padding:20px 0 20px 40px;
                .num {top:20px; width:40px; line-height:1em;}
                .title {font-size:1.1rem;}
            }
        }
    }
}
</style>