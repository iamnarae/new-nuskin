<template>
    <div id="c-container" :class="{fixed:fixed}">   
        <SubNav class="pcHidden" />
        <header id="c-heading" class="typeB"> 
            <h1>EVENT<span class="sub">{{detail.typeName}}</span></h1>
            <Social :shareTitle="detail.title" :shareDesc="desc" :shareImage="thumb(detail.thumbnail)" :shareUrl="url" />
        </header>
        <article class="viewArea">
            <header>
                <h2>{{detail.title}}</h2>
                <div class="info">
                    <p class="eventDate">이벤트 기간 <span class="colorA">{{formatDate(detail.startDate)}} ~ {{formatDate(detail.endDate)}}</span></p>
                    <p class="count">{{detail.viewCount}}</p>
                    <p class="date">{{detail.registDate}}</p>
                </div>
            </header>
            <section class="content">
                <p v-if="detail.progressStatus !== 'ING'" class="endText">
                    <span v-if="detail.progressStatus === 'SELECTION'">본 이벤트는 당첨자 선별중입니다.</span>
                    <span v-else>본 이벤트는 종료되었습니다.</span>
                </p>
                <div v-html="detail.contents"></div>
                <p v-if="isUrl" class="btn"><a :href="detail.url" target="_blank" title="새창열림">이벤트 바로가기</a></p>
            </section>
            <CommentList :eventSeq="seq" :commnetList="commnetList" :page="commentPage" :pageSize="commentPageSize" :commnetTotal="commnetTotal" @setPage="goCommentList" @deleteComment="deleteComment" />
        </article><!-- //viewArea -->
        <keep-alive>
            <Pvnt :prev="prev" :next="next" />
        </keep-alive>
        <div class="btnArea">
            <router-link :to="{name:'Event'}" class="btnList">목록으로</router-link>
        </div>
    </div><!-- //container -->
</template>
<script>
import axios from 'axios'
import SubNav from '@/components/global/EventTab.vue'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import Social from '@/components/common/Social.vue'
import CommentForm from '@/components/common/commentForm.vue'
import CommentList from '@/components/common/commentList.vue'
import Pvnt from '@/components/common/Pvnt.vue'
import {mixin} from '@/components/mixins/mixins'

export default {
    mixins : [mixin],
    components: {
        SubNav,
        Social,
        CommentForm,
        CommentList,
        Pvnt
    },
    data() {
        return {
            seq : null,
            detail : [],
            prev : [],
            next : [], 
            isUrl : false,
            currentIndex : null,
            commnetList : [],
            commentPage : 1,
            commentPageSize : 10,
            commnetTotal : 0,
            desc : '뉴스킨에서 진행하는 다양한 이벤트와 푸짐한 혜택을 확인해보세요.',
            url : ''
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created () {   
        this.initPage()
        eventBus.$on('resetPage', query => {
            this.initPage(query)
        })     
        this.url = location.href;
    },
    methods: {
         initPage(query){
            if(query){ //detail에서 detail로 이동시
                this.seq = query
            } else {
                this.seq = this.$route.query.seq 
            }
            axios.get('/event/past/detail.do?seq=' + this.seq).then(res => {
                this.detail = res.data
                this.prev = this.detail.prev
                this.next = this.detail.next
                if(this.detail.url){
                    this.isUrl = true
                }
            }).catch((response) => {
                console.log(response);
            }); 
            this.goCommentList();
        },
        goCommentList(page){
            this.commentPage = page ? page : 1
            axios.get('/event/comment/list.do?eventSeq='+this.seq+'&page='+this.commentPage +'&pageSize='+this.commentPageSize +'&memberId='+this.loginInfo.memberId).then(res => {
                this.commnetList = res.data.lists.filter(list => {
                    return list.status == "S"
                })
                this.commnetTotal = this.commnetList.length
            })        
        },
        deleteComment(payload){
            var result = confirm("삭제하시겠습니까?");
            if(result){
                axios.post('/event/comment/del.do', qs.stringify(payload))
                .then(res => {
                    this.goCommentList()
                })
                .catch(err => {
                    console.log(err)
                });
            }            
        },
        thumb(target){
            return this.cdnURL + target
        }
    },
}
</script>
<style lang="scss" scoped>
.viewArea {
    header {padding:0 20px 40px; margin:0 -20px; border-bottom:2px solid #212121;
        h2 {margin-bottom:30px; font-size:48px;}
        .info {position:relative; text-align:right;;
            .eventDate {position:absolute; left:0; top:0; padding-right:250px; font-size:18px; font-weight:600; line-height:1em; color:#6d6d6d;
                span {margin-left:18px;}
            }
            .count {position:relative; display:inline-block; padding-left:30px; margin-right:30px; line-height:1em;
                &:before {content:""; position:absolute; left:0; top:50%; width:20px; height:20px; margin-top:-9px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_view.png) no-repeat 0 0;}
            }
            .date {display:inline-block; color:#888; line-height:1em;}
        }
    }
    .content {padding:40px 0 80px;
        .endText {height:60px; margin:-25px 0 40px; border-radius:30px; font-size:18px; line-height:60px; font-weight:600; text-align:center; background:#eee;
            &:before {content:""; display:inline-block; width:28px; height:28px; margin:-3px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_caution.png) no-repeat 0 0;}
        }
        .btn {margin-top:60px; text-align:center;
            a {display:inline-block; width:250px; height:54px; border-radius:27px; font-size:16px; line-height:54px; font-weight:600; color:#fff; background:#75a0d5;
                &:before {content:""; display:inline-block; width:18px; height:15px; margin:-2px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_event.png) no-repeat 0 0;}
            }
        }
    }
}

@media all and (max-width:768px){
    h1 {padding-top:15px;}
    .viewArea {
        header {padding:0 10px 20px; margin:0 -10px;
            h2 {margin-bottom:15px; font-size:2rem; font-weight:600;}
            .info {padding-top:40px; text-align:right;
                .eventDate {padding-right:0; font-size:1.05rem;
                    span {margin-left:10px;}
                }
                .count {padding-left:25px; margin-right:20px; font-size:.95rem;}
                .date {font-size:.95rem;;}
            }
        }
        .content {padding:20px 0 60px;
            .endText {height:40px; margin:0 0 30px; font-size:1.1rem; line-height:40px;}
            .btn {margin-top:40px;
                a {width:auto; height:40px; padding:0 50px; font-size:1.1rem; line-height:40px; }
            }
        }     
    }
}
</style>