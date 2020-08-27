<template>
    <div id="c-container"> 
        <div class="myHead">
            <p class="total">총 <strong>{{total}}</strong>개</p>
        </div>
        <ul class="eventList">
            <template v-if="(lists.length > 0 && hasLoading)">
                <li v-for="(list, index) in lists" :key="index">
                    <p class="thumb"><a @click="goContentsDetail(list)"><img :src="thumb(list.seq)" alt=""></a></p>
                    <p class="tag">{{list.typeName}}</p>
                    <p class="tit"><a @click="goContentsDetail(list)">{{list.title}}</a></p>
                    <p class="date">이벤트 기간 <span>{{formatDate(list.startDate)}} ~ <template v-if="(list.productExhaustionYn == 'Y')">제품소진시</template><template v-else>{{formatDate(list.endDate)}}</template></span></p>
                </li>
            </template>
            <li v-else-if="(lists.length > 0 && !hasLoading)" class="none">로딩중...</li>
            <li v-else-if="(lists.length == 0)" class="none">검색된 이벤트가 없습니다</li>
        </ul>
        <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
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
        this.goList(1)
    },
    methods: {
        initPage(){
            this.searchWord = this.$route.query.searchProduct
        },
        goList(page){
            this.hasLoading = false
            this.page = page ? page : 1
            axios.get('/search/event.do?searchWord='+this.searchWord+'&page='+this.page+'&pageSize='+this.pageSize).then(res => {
                this.lists = res.data.lists 
                this.total = res.data.count
                this.hasLoading = true
            })
        },
        cateClass(num){
            return 'cate' + num
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
        goPage(page){
            this.goList(page)
        },
        goContentsDetail(param){
            location.href = '/app/ch/event/view?seq='+param.seq
        }
    },
}
</script>
<style lang="scss" scoped>
.myHead {overflow:hidden; padding:40px 20px 20px; margin-bottom:30px; border-bottom:2px solid #000;
    .total {line-height:1em;}
}
.eventList {
    li {float:left; width:50%;
        &:nth-child(odd) {padding-right:20px;}
        &:nth-child(even) {padding-left:20px;}
        &:nth-child(2)~li {margin-top:90px;}
        .thumb img {width:100%; height:280px;}
        .tag {display:inline-block; height:26px; padding:0 10px; border:1px solid #2d8ab5; border-radius:13px; margin-top:30px; line-height:26px; font-size:13px; font-weight:600; color:#2d8ab5;}
        .tit {min-height:72px; margin-top:10px; font-size:26px; line-height:36px; font-weight:600;}
        .date {margin-top:15px; color:#6d6d6d; line-height:1em;
            span {margin-left:14px; color:#212121;}
        }
    }
    &:after {content:""; display:block; clear:both;}
}
@media all and (max-width:768px){
    .myHead {margin-bottom:20px;
        .total {font-size:.9rem;}
    }
    .eventList {
        li {float:none; width:100%;
            &:nth-child(odd) {padding-right:0;}
            &:nth-child(even) {padding-left:0;}
            &~li {margin-top:50px;}
            .thumb img {height:auto;}
            .tag {height:24px; margin-top:15px; line-height:22px; font-size:.95rem;}
            .tit {min-height:auto; margin-top:15px; font-size:1.5rem; line-height:1.4em;}
            .date {margin-top:25px;}
        }
    }
}
</style>