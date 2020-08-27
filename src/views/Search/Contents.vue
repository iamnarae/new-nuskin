<template>
    <div id="c-container"> 
        <div class="myHead">
            <p class="total">총 <strong>{{total}}</strong>개</p>
        </div>
        <div class="boardArea">
            <ul class="boardList">
                <template v-if="(lists.length > 0 && hasLoading)">
                    <li v-for="list in lists" :key="list.seq">
                        <p class="thumb" :class="{video:list.contentsType=='003'}"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                        <div class="content">
                            <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                            <!-- <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}">{{list.title}}</router-link></p> -->
                            <p class="tit ellLine2"><a @click="goContentsDetail(list)">{{list.title}}</a></p>
                            <p class="srmy ellLine2">{{list.description}}</p>
                        </div>
                    </li>
                </template>
                <li v-else-if="(lists.length > 0 && !hasLoading)" class="none">로딩중...</li>
                <li v-else-if="(lists.length == 0)" class="none">검색된 콘텐츠가 없습니다</li>
            </ul>
            <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
        </div>
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
            pageSize : 18,
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
            axios.get('/search/contents.do?searchWord='+this.searchWord+'&searchWord2='+this.searchWord+'&page='+this.page+'&pageSize='+this.pageSize+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
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
            location.href = '/app/ch/contents/view?seq='+param.seq+'&type='+param.type
        }
    },
}
</script>
<style lang="scss" scoped>
.myHead {overflow:hidden; padding:40px 20px 20px; margin-bottom:30px; border-bottom:2px solid #000;
    .total {line-height:1em;}
}
.boardArea {
    .boardList {overflow:hidden; margin-left:-35px;
        li {position:relative; float:left; width:33.3%; min-height:480px; padding-left:35px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_go.png) no-repeat 35px 100%;
            .thumb {position:relative; height:230px;
                img {width:100%; height:230px;}
                &.video:after {content:""; position:absolute; left:25px; top:18px; width:20px; height:27px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv.png) no-repeat 0 0;}
            }
            .content {position:relative; margin-top:35px;
                .cate {
                    span {display:inline-block; height:26px; padding:0 9px; border:1px solid #c66fc0; border-radius:13px; font-size:13px; line-height:26px; font-weight:600; color:#c66fc0;}
                &.cate2 span, &.cate5 span, &.cate8 span, &.cate11 span, &.cate14 span, &.cate17 span, &.cate20 span, &.cate23 span {border-color:#599dc0; color:#599dc0;}
                &.cate3 span, &.cate6 span, &.cate9 span, &.cate12 span, &.cate15 span, &.cate18 span, &.cate21 span, &.cate24 span {border-color:#ff6a5b; color:#ff6a5b;}
                }
                .tit {margin:20px 40px 0 0; font-size:26px; line-height:32px; font-weight:600; word-break:keep-all; word-wrap:break-word;}
                .srmy {margin-top:20px;}
            }
            .chk {position:absolute; right:20px; top:20px; width:44px; height:44px;
                button {opacity:.4; overflow:hidden; display:block; width:44px; height:44px; padding-left:44px; border:2px solid #fff; border-radius:50%; background:#000; white-space:nowrap;}
                span {display:block; width:44px; height:44px; border-radius:50%; text-align:center; line-height:44px; font-weight:600; color:#fff; background:#75a0d5;}
            }
            &+li:nth-child(3)~li {margin-top:80px;}
        }
    }
}
@media all and (max-width:768px){
    .myHead {margin-bottom:20px;
        .total {font-size:.9rem;}
    }
    .boardArea {
        .boardList {margin-left:0;
            li {float:none; width:100%; min-height:auto; padding-left:0; margin-top:50px; background:none;
                .thumb {position:relative; height:auto; padding-top:70.3%;
                    img {position:absolute; left:0; top:0; height:100%;}
                }
                .content {position:relative; margin-top:20px;
                    .cate {
                        span {font-size:.9rem;}
                    }
                    .tit {height:auto; margin-top:10px; font-size:1.3rem; line-height:1.3em;}
                    .srmy {display:none !important;}
                    .scrap {position:absolute; right:0; top:-7px;}
                }
                &+li:nth-child(3)~li {margin-top:50px;}
                &:first-child {margin-top:0;}
            }
        }  
    }
}
</style>