<template>
    <div id="c-wrapper" :class="{fixed:fixed}">
        <Gnb :menuIndex="menuIndex" :Fixed="fixed" />
        <div id="c-container">    
            <header id="c-heading" class="mobileHidden">
                <h1>내 콘텐츠</h1>
                <p class="srmy">콘텐츠 선택 후 공유하여 나만의 콘텐츠를 만들어보세요</p>
            </header>
            <SubNav />
            <h1 class="pcHidden">찜한 콘텐츠</h1>
            <div class="myHead">
                <p class="total">TOTAL <strong>{{total}}</strong></p>
                <div class="fr">
                    <p class="caution">최대 발행 가능 콘텐츠 수는 <strong>{{max}}개</strong> 입니다</p>
                    <span class="mobileFix">
                        <button class="del" v-if="(checkTotal>0)" @click="delContents()"><strong>{{checkTotal}}</strong> 삭제</button>
                        <button class="myBtn" @click="showMyContents()">나만의 콘텐츠 만들기</button>
                    </span>
                </div>
            </div>
            <div class="boardArea">
                <ul class="boardList">
                    <template v-if="(lists.length > 0 && hasLoading)">
                        <li v-for="(list, index) in lists" :key="list.seq" :class="{check:list.check}">
                            <p class="thumb" :class="{video:list.contentsType=='003'}"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                            <div class="content">
                                <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                                <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}">{{list.title}}</router-link></p>
                                <p class="srmy ellLine2">{{list.description}}</p>
                                <p class="scrap"><Scrap :content="list" /></p>
                            </div>
                            <p class="chk">
                                <button v-if="(!list.check)" @click="check(list, index);">선택</button>
                                <span v-else @click="check(list, index);">{{list.orderNum}}</span>
                            </p>
                        </li>  
                    </template>
                    <li v-else-if="(lists.length == 0 && hasLoading)" class="none">저장된 콘텐츠가 없습니다</li>
                    <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
                </ul>
                <div class="btnArea" v-if="hasMore">
                    <button @click="more()" class="btnMore">더보기</button>
                </div>
            </div>
            <div class="popupArea" v-if="showRegist">
            <RegistContent @goShare="showShareContents" @hidePopup="hidePopup" @publishSeq="setShare" @resetCheckList="resetCheckList" :checkLists="checkLists" />
            </div>
            <div class="popupArea" v-if="showShare">
            <ShareContent @hidePopup="hidePopup" :shareContent="shareContent" :shareSeq="shareSeq" />
            </div>
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import {mapState} from 'vuex'
import Gnb from '@/components/global/Gnb.vue'
import SubNav from '@/components/global/MyTab.vue'
import Scrap from '@/components/common/Scrap.vue'
import RegistContent from '@/components/contents/RegistContent.vue'
import ShareContent from '@/components/contents/ShareContent.vue'
import {mixin} from '@/components/mixins/mixins'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export default {
    mixins : [mixin],
    components: {
        Gnb,
        SubNav,
        Scrap,
        RegistContent,
        ShareContent
    },
    data() {
        return {
            max : 30,
            lists : [],
            hasLoading : false,
            total : 0,
            cateSeq: '',
            type: '',
            page: 1,
            pageSize: 18,
            checkLists: [],
            hasMore : false,
            checkTotal: 0,
            showRegist: false,
            showShare: false,
            shareContent: null,
            shareSeq: '',
            menuIndex : 5
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created  () {
        this.goList(1);
    },
    methods: {
        goList(page, more){ //대분류, more버튼
            this.hasLoading = false
            axios.get('/contents/like/list.do?memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then((res, index) => {
                this.total = res.data.count
                var moreLists = []
                var i = 0
                if(more){
                    moreLists = res.data.lists
                    moreLists.forEach(list => {
                        this.lists.push(list)
                    })                    
                } else {
                    this.lists = res.data.lists
                    this.lists.forEach(list => {
                        this.$set(list, 'check', false)
                        this.$set(list, 'orderNum', '')
                    })
                }
                this.hasLoading = true
                if(res.data.count > page*this.pageSize){
                    this.hasMore = true
                } else {
                    this.hasMore = false
                }
            })
        },
        cateClass(num){
            return 'cate' + num
        },
        more(){
            this.goList((this.page+1), 'more')
            this.page++
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
        check(list, idx){
            if(this.lists[idx].check == false) {
                if(this.checkTotal < this.max) {
                    this.checkLists.push(list)
                    this.lists[idx].check = true
                    this.checkTotal++
                    this.lists[idx].orderNum = this.checkTotal
                } else {
                    alert('최대 발행 갯수는 '+ this.max + '개입니다.')
                }
            } else {
                var newIdx = null
                this.checkLists.forEach((check, index) => {
                    if(list.seq == check.seq) {
                        newIdx = index
                    }
                })
                this.checkLists.splice(newIdx, 1)
                this.lists[idx].check = false
                this.checkTotal--
                this.lists.forEach(list => {
                    if(list.orderNum > 1){
                        list.orderNum = list.orderNum - 1
                    }                    
                })
            }
        },
        delContents(){
            var result = confirm("삭제하시겠습니까?");
            if(result){
                this.checkLists.forEach(check => {
                    this.lists.forEach((list, index) => {
                        if(check.seq == list.seq){
                            this.lists.splice(index, 1)
                            const payload = {seq:list.seq, memberId:this.loginInfo.memberId}
                            axios.post('/contents/like.do', qs.stringify(payload))
                            .then(res => {
                                this.total--
                                if(list.my == "Y"){
                                    list.my = "N"
                                } else {
                                    list.my = "Y"
                                }
                                this.checkTotal = 0
                            })
                            .catch(err => {
                                console.log(err)
                            });
                        }
                    })
                })    
            }        
        },
        showMyContents(){
            if(this.checkLists.length > 0){
                this.showRegist = true 
            } else {
                alert('발행할 컨텐츠를 선택해주세요.')
            }
        },
        showShareContents(share){
            this.showShare = true
            this.shareContent = share
        },
        hidePopup(target){
            if(target == 'RegistContent') this.showRegist = false
            if(target == 'ShareContent') this.showShare = false
        },
        setShare(seq){
            this.shareSeq = seq
        },
        resetCheckList(){
            this.checkLists = []
            this.checkTotal = 0
            this.lists.forEach((list,index) => {
                this.$set(list, 'check', false)
                this.$set(list, 'orderNum', '')
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.myHead {overflow:hidden; margin-bottom:30px;
    .total {float:left; padding-top:27px; line-height:1em;}
    .caution {display:inline-block; height:42px; padding:12px 20px 0; border-radius:42px; line-height:1em; font-size:14px; color:#fff; vertical-align:top; background:#9aabc0;
        &:before {content:""; display:inline-block; width:24px; height:24px; margin:-3px 6px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_caution2.png) no-repeat 0 0;}
    }
    .del {display:inline-block; height:42px; padding:0 20px; margin-left:10px; border:1px solid #bbb; line-height:40px; font-size:14px; color:#6d6d6d; vertical-align:top; background:#eee;
        strong {color:#212121;}
    }
    .myBtn {display:inline-block; height:42px; padding:0 20px; margin-left:10px; line-height:42px; font-size:14px; color:#fff; vertical-align:top; background:#212121;
        &:before {content:""; display:inline-block; width:17px; height:19px; margin:-2px 5px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_contents.png) no-repeat 0 0;}
    }
}
.boardList {overflow:hidden; margin-left:-35px;
    li {position:relative; float:left; width:33.3%; min-height:480px; padding-left:35px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_go.png) no-repeat 35px 100%;
        .thumb {position:relative; overflow:hidden; height:230px;
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
            .scrap {position:absolute; right:0; top:-7px;}
        }
        .chk {position:absolute; right:20px; top:20px; z-index:2; width:44px; height:44px;
            button {opacity:.4; overflow:hidden; display:block; width:44px; height:44px; padding-left:40px; border:2px solid #fff; border-radius:50%; background:#000; white-space:nowrap;}
            span {display:block; width:44px; height:44px; border-radius:50%; text-align:center; line-height:44px; font-weight:600; color:#fff; cursor:pointer; background:#75a0d5;}
        }
        &.check {
            .thumb:before {content:""; position:absolute; left:0; right:0; top:0; bottom:0; z-index:1; border:4px solid #75a0d5;}
        }
        &+li:nth-child(3)~li {margin-top:80px;}
    }
}   
.popupArea {position:fixed; left:0; right:0; top:0; bottom:0; z-index:20; background:rgba(0,0,0,.3);}

@media all and (max-width:768px){
    #c-wrapper.fixed {padding-top:112px;}
    .myHead {margin-bottom:10px;
        .total {padding-top:10px; font-size:.8rem; letter-spacing:-.5px;}
        .caution {height:33px; padding:10px 15px 0; border-radius:33px; font-size:.8rem; letter-spacing:-.5px;
            &:before {width:16px; height:16px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_caution2_m.png); background-size:100%;}
        }
        .mobileFix {position:fixed; left:0; bottom:0; right:0; z-index:10; height:55px;}
        .del {float:left; width:40%; height:55px; padding:0; margin-left:0; line-height:53px; font-size:.9rem;}
        .myBtn {float:right; width:60%; height:55px; padding:0; margin-left:0; line-height:53px; font-size:.9rem;
            &:before {width:15px; height:16px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_contents_m.png); background-size:100%;}
            &:only-child {width:100%;}
        }
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
</style>