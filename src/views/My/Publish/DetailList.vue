<template>
    <div id="c-wrapper" :class="{fixed:fixed}">
        <Gnb :menuIndex="menuIndex" :Fixed="fixed" />
        <div id="c-container"> 
            <div class="myHead">
                <h1>{{publishTitle}}</h1>
                <p class="date">{{registDate}}</p>
            </div>
            <div class="boardArea">
                <p class="total">TOTAL <strong>{{total}}</strong></p>
                <ul class="boardList">
                    <template v-if="(hasLoading)">
                        <li v-for="list in lists" :key="list.seq">
                            <p class="thumb" :class="{video:list.contentsType=='003'}"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                            <div class="content">
                                <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                                <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}">{{list.title}}</router-link></p>
                                <p class="srmy ellLine2">{{list.description}}</p>
                            </div>
                        </li>
                    </template>
                    <li v-else class="innerLoading">로딩중...</li>
                </ul>
            </div>
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex'
import Gnb from '@/components/global/Gnb.vue'
import SubNav from '@/components/global/MyTab.vue'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    components: {
        Gnb,
        SubNav
    },
    data() {
        return {
            publishTitle: '',
            registDate: '',
            lists : [],
            hasLoading : false,
            total : 0,
            cateSeq: '',
            type: '',
            menuIndex: 5
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
        initPage(query){
            if(query){ //detail에서 detail로 이동시
                this.seq = query
            } else {
                this.seq = this.$route.query.seq 
            }
        },
        goList(page, more){ //대분류, more버튼
            this.hasLoading = false
            axios.get('/contents/my/detail.do?seq='+this.seq+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then((res, index) => {
                this.publishTitle = res.data.title
                this.registDate = res.data.registDate
                this.total = res.data.contents.length
                this.lists = res.data.contents
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
    },
}
</script>
<style lang="scss" scoped>
.myHead {position:relative; padding:0 120px 30px 20px; margin:0 -20px; border-bottom:2px solid #212121;
    h1 {font-size:48px;}
    .date {position:absolute; right:20px; bottom:30px; color:#888; line-height:1em;}
}
.boardArea {margin-top:60px;
    .total {margin-bottom:40px; line-height:1em;}
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
    #c-wrapper.fixed {padding-top:112px;}
    .myHead {padding:0 10px 20px; margin:0 -10px;
        h1 {font-size:2rem; line-height:1.4em;}
        .date {position:static; margin-top:30px; text-align:right; font-size:.9rem; line-height:1em;}
    }
    .boardArea {margin-top:30px;
        .total {margin-bottom:20px;font-size:.9rem; line-height:1em;}
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
            &.typeB {
                li:first-child {margin-left:0;}
                li:nth-child(2)~li {margin-top:50px;}
            }
        }  
    }
}
</style>