<template>
    <div class="boardArea on">
        <ul class="boardList" :class="{typeB:isPromo}">
            <template v-if="(lists.length > 0 && hasLoading)">
                <li v-for="list in lists" :key="list.seq">
                    <p class="thumb" :class="{video:list.contentsType=='003'}"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type, cate:cateSeq}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                    <div class="content">
                        <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                        <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type, cate:cateSeq}}">{{list.title}}</router-link></p>
                        <p class="srmy ellLine2">{{list.description}}</p>
                        <p class="scrap"><Scrap :content="list" :isMain="isMain" /></p>
                    </div>
                </li>
            </template>
            <li v-else-if="(lists.length == 0 && hasLoading)" class="none">콘텐츠가 없습니다</li>
            <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
        </ul>
        <div class="btnArea" v-if="hasMore && hasLoading">
            <button @click="more()" class="btnMore">더보기</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
import Scrap from '@/components/common/Scrap.vue'
import $ from 'jquery'

export default {
    mixins : [mixin],
    components: {
        Scrap,
    },
    props: ['isPromo', 'pageSize', 'type', 'cateSeq', 'gubun', 'relationContents', 'isMain', 'menuIndex'],
    data() {
        return {
            lists: [],
            hasLoading : false,
            page : 1,
            hasMore : false,
            nextSize : '',
            listStyle : null,
            scrollHeight : 0
            //cateSeq: ''
        }
    }, 
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created () {
        if(this.isPromo) {
           this.nextSize = this.pageSize - 1
        } else {
           this.nextSize = this.pageSize
        }
        this.goList(this.type, '', this.cateSeq, this.gubun)
        if(!this.isMain){
            eventBus.$on('sortList', (type, cateSeq, gubun) => {
                $(".boardArea").addClass("on")
                this.goList(type, '', cateSeq, gubun)
                this.page = 1      
            })
        }
        axios.get('/code.do?code1=001').then(res => {
            res.data.forEach(type=>{
                if(type.code2 == this.type){
                     this.$emit('setTitle', type.name2)
                }
            })
        })
        this.cateSeq = this.$route.query.cate ? this.$route.query.cate : this.cateSeq
    },
    methods: {
        goList(type, page, cateSeq, gubun, more){ //대분류, 페이징, 소분류, 형식, more버튼      
            this.hasLoading = false
            type = type ? type : this.type
            page = page ? page : this.page
            cateSeq = cateSeq ? cateSeq : ''
            gubun = gubun ? gubun : ''
            setTimeout(() => {
                axios.get('/contents/list.do?page='+page+'&pageSize='+this.nextSize+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle+'&type='+type+'&categorySeq='+cateSeq+'&gubun='+gubun).then(res => {
                    var moreLists = []
                    if(more){
                        moreLists = res.data.lists
                        moreLists.forEach(list => {
                            this.lists.push(list)
                        })      
                    } else {
                        this.lists = res.data.lists
                    }
                    if(more){
                        setTimeout(() => {
                            window.scrollTo(0, this.scrollHeight)
                        }, 1)
                    }
                    this.hasLoading = true
                    $(".boardArea").removeClass("on")
                    if(res.data.count > page*this.pageSize){
                        this.hasMore = true
                    } else {
                        this.hasMore = false
                    }
                })
            }, 500)
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
        cateClass(num){
            return 'cate' + num
        },
        more(){
            this.scrollHeight = window.pageYOffset
            this.nextSize = this.pageSize
            this.goList(this.type, (this.page+1), this.cateSeq, this.gubun, 'more')
            this.page++
        },
    },
}
</script>
<style lang="scss" scoped>
.boardList {overflow:hidden; margin-left:-35px;
    li {float:left; width:33.3%; min-height:480px; padding-left:35px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_go.png) no-repeat 35px 100%;
        .thumb {position:relative; overflow:hidden; height:230px;
            img {width:100%; height:230px; transition:all 0.2s;}
            &.video:before {content:""; position:absolute; left:0; top:0; width:100px; height:100px; background:linear-gradient(135deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,0) 50%);}
            &.video:after {content:""; position:absolute; left:25px; top:18px; width:20px; height:27px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv.png) no-repeat 0 0;}
            &:hover img {transform:scale(1.1);}
        }
        .content {position:relative; margin-top:35px;
            .cate {
                span {display:inline-block; height:26px; padding:0 9px; border:1px solid #c66fc0; border-radius:13px; font-size:13px; line-height:26px; font-weight:600; color:#c66fc0;}
                &.cate2 span, &.cate5 span, &.cate8 span, &.cate11 span, &.cate14 span, &.cate17 span, &.cate20 span, &.cate23 span {border-color:#599dc0; color:#599dc0;}
                &.cate3 span, &.cate6 span, &.cate9 span, &.cate12 span, &.cate15 span, &.cate18 span, &.cate21 span, &.cate24 span {border-color:#ff6a5b; color:#ff6a5b;}
            }
            .tit {max-height:64px; margin:20px 40px 0 0; font-size:26px; line-height:32px; font-weight:600; word-break:keep-all; word-wrap:break-word;}
            .srmy {height:48px; margin-top:20px; line-height:24px;}
            .scrap {position:absolute; right:0; top:-7px;}
        }
        &+li:nth-child(3)~li {margin-top:80px;}
    }
    &.typeB {  
        li:first-child {margin-left:33.3%;}
        li:nth-child(2)~li {margin-top:80px;}
    }
}   
.boardArea.on {position:relative; z-index:1;}

@media all and (max-width:768px){
    .promotion+.boardArea {margin-top:50px;}
    .boardList {margin-left:0;
        li {float:none; width:100%; min-height:auto; padding-left:0; margin-top:50px; background:none;
            .thumb {position:relative; height:auto; padding-top:70.3%;
                img {position:absolute; left:0; top:0; height:100%;}
                &.video:before {z-index:1; width:100px; height:100px;}
                &.video:after {z-index:1; left:15px; top:15px; width:17px; height:25px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv_m.png); background-size:100%;}
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