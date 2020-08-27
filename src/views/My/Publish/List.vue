<template>
    <div id="c-wrapper" :class="{fixed:fixed}">
        <Gnb :menuIndex="menuIndex" :Fixed="fixed" />
        <div id="c-container">    
            <header id="c-heading" class="mobileHidden">
                <h1>내 콘텐츠</h1>
                <p class="srmy">내가 발행한 콘텐츠를 한 눈에 살펴 보는 공간</p>
            </header>
            <SubNav />
            <h1 class="pcHidden">내가 발행한 콘텐츠</h1>
            <div class="myHead">
                <p class="total">TOTAL <strong>{{total}}</strong></p>
            </div>
            <div class="boardArea">
                <ul class="boardList">
                    <template v-if="(lists.length > 0 && hasLoading)">
                        <li v-for="list in lists" :key="list.seq">
                            <p class="thumb"><router-link :to="{name:'MyPublishDetail', query:{seq:list.seq}}"><img :src="thumb(list.thumbnail)" alt=""></router-link></p>
                            <div class="content">
                                <router-link :to="{name:'MyPublishDetail', query:{seq:list.seq}}">
                                    <p class="tit ellLine2">{{list.title}}</p>
                                    <p class="date">{{list.registDate}}</p>
                                </router-link>
                                <p class="btn">
                                    <button class="modify" @click="modify(list)">수정</button>
                                    <button class="share" @click="share(list)">공유</button>
                                </p>
                            </div>
                        </li>
                    </template>
                    <li v-else-if="(lists.length == 0 && hasLoading)" class="none">발행한 콘텐츠가 없습니다</li>
                    <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
                </ul>
                <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
            </div>
            <div class="popupArea" v-if="showModify">
            <RegistContent @hidePopup="hidePopup" :modifyContent="modifyContent" @modifyComplete="goList" />
            </div>
            <div class="popupArea" v-if="showShare">
            <ShareContent @hidePopup="hidePopup" :shareContent="shareContent" :shareSeq="shareSeq" />
            </div>
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex'
import Gnb from '@/components/global/Gnb.vue'
import SubNav from '@/components/global/MyTab.vue'
import Paging from '@/components/common/Paging.vue'
import RegistContent from '@/components/contents/RegistContent.vue'
import ShareContent from '@/components/contents/ShareContent.vue'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    components: {
        Gnb,
        SubNav,
        Paging,
        RegistContent,
        ShareContent
    },
    data() {
        return {
            lists : [],
            hasLoading : false,
            total : 0,
            page: 1,
            pageSize: 18,
            hasMore : false,
            defaultThumb : "https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/thumb_myContents.jpg",
            showModify: false,
            modifyContent: null,
            showShare: false,
            shareContent: null,
            shareSeq: '',
            menuIndex: 5
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created  () {
        this.goList(1)
    },
    methods: {
        goList(page, more){ //대분류, more버튼
            this.hasLoading = false
            this.page = page ? page : 1
            axios.get('/contents/my/list.do?page='+this.page+'&pageSize='+this.pageSize+'&memberId='+this.loginInfo.memberId).then((res, index) => {
                this.total = res.data.count
                this.lists = res.data.lists
                this.hasLoading = true
            })
        },
        thumb(target){
            if(target == ''){
                return this.defaultThumb
            } else {
                return this.cdnURL + target
            }
            
        },
        goPage(page){
            this.goList(page)
        },
        modify(list){
            this.showModify = true
            this.modifyContent = list
        },
        share(list){
            this.showShare = true
            this.shareSeq = list.seq
            const shareThumb = this.cdnURL + list.thumbnail
            this.shareContent = {thumb:shareThumb, title:list.title}
        },
        showShareContents(share){
            this.showShare = true
            this.shareContent = share
        },
        hidePopup(target){
            if(target == 'RegistContent') this.showModify = false
            if(target == 'ShareContent') this.showShare = false
        },
        setShare(seq){
            this.shareSeq = seq
        },
    },
}
</script>
<style lang="scss" scoped>
.myHead {overflow:hidden; margin-bottom:30px;
    .total {float:left; padding-top:27px; line-height:1em;}
    .caution {float:right; height:42px; padding:12px 20px 0; border-radius:42px; line-height:1em; font-size:14px; color:#fff; vertical-align:top; background:#9aabc0;
        &:before {content:""; display:inline-block; width:24px; height:24px; margin:-3px 6px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_caution2.png) no-repeat 0 0;}
    }
}
.boardList {overflow:hidden; margin-left:-35px;
    li {position:relative; float:left; width:33.3%; min-height:400px; padding-left:35px;
        .thumb {position:relative; overflow:hidden; height:230px;
            img {width:100%; height:230px;}
            &.video:after {content:""; position:absolute; left:25px; top:18px; width:20px; height:27px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv.png) no-repeat 0 0;}
        }
        .content {margin-top:35px;
            .cate {
                span {display:inline-block; height:26px; padding:0 9px; border:1px solid #c66fc0; border-radius:13px; font-size:13px; line-height:26px; font-weight:600; color:#c66fc0;}
                &.cate2 span, &.cate5 span, &.cate8 span, &.cate11 span, &.cate14 span, &.cate17 span, &.cate20 span, &.cate23 span {border-color:#599dc0; color:#599dc0;}
                &.cate3 span, &.cate6 span, &.cate9 span, &.cate12 span, &.cate15 span, &.cate18 span, &.cate21 span, &.cate24 span {border-color:#ff6a5b; color:#ff6a5b;}
            }
            .tit {overflow:hidden; height:68px; margin-top:20px; font-size:26px; line-height:1.3em; font-weight:600;}
            .date {position:absolute; left:35px; bottom:10px; color:#888; font-size:14px; line-height:1rem;}
            .btn {position:absolute; right:0; bottom:0; padding:0 5px; background:#eee;
                button {position:relative; float:left; height:42px; padding:0 15px; margin-left:1px; line-height:1rem; font-size:14px;
                    &:before {content:""; display:inline-block; margin:-3px 6px 0 0; vertical-align:middle;}
                    &.modify:before {width:18px; height:17px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_modify.png) no-repeat 0 0;}
                    &.share:before {width:17px; height:18px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_share.png) no-repeat 0 0;}
                    &~button:after {content:""; position:absolute; left:-1px; top:50%; width:1px; height:12px; margin-top:-6px; background:#bbb;}
                }
            }
        }
        .chk {position:absolute; right:20px; top:20px; width:44px; height:44px;
            button {opacity:.4; overflow:hidden; display:block; width:44px; height:44px; padding-left:44px; border:2px solid #fff; border-radius:50%; background:#000; white-space:nowrap;}
            span {display:block; width:44px; height:44px; border-radius:50%; text-align:center; line-height:44px; font-weight:600; color:#fff; background:#75a0d5;}
        }
        &+li:nth-child(3)~li {margin-top:80px;}
    }
}   
.popupArea {position:fixed; left:0; right:0; top:0; bottom:0; z-index:20; background:rgba(0,0,0,.3);}

@media all and (max-width:768px){
    #c-wrapper.fixed {padding-top:112px;}
    .myHead {margin-bottom:20px;
        .total {padding-top:0; font-size:.9rem;}
    }
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
                .date {position:static; margin-top:25px; font-size:.9;}
                .btn {overflow:hidden; position:static; padding:0; margin-top:15px;
                    button {width:50%; margin-left:0; font-size:.9rem;
                        &.modify:before {width:14px; height:13px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_modify_m.png); background-size:100%;}
                        &.share:before {width:14px; height:15px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_share_m.png); background-size:100%;}
                    }
                }
            }
            &+li:nth-child(3)~li {margin-top:50px;}
            &:first-child {margin-top:0;}
        }
    }  
}
</style>