<template>
    <div class="boardArea">
        <ul class="boardList">
            <template v-if="(lists.length > 0 && hasLoading)">
                <li v-for="list in lists" :key="list.seq">
                    <p class="thumb" :class="{video:list.contentsType=='003'}"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                    <div class="content">
                        <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                        <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}">{{list.title}}</router-link></p>
                    </div>
                </li>
            </template>
            <li v-else-if="(lists.length == 0 && hasLoading)" class="none">콘텐츠가 없습니다</li>
            <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    props: ['relationContents'],
    data() {
        return {
            lists: [],
            hasLoading : false,
        }
    }, 
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created () {
        this.goList()
    },
    methods: {
        goList(){
            this.hasLoading = true
            this.lists = this.relationContents
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
        }
    },
}
</script>
<style lang="scss" scoped>
.boardList {overflow:hidden;
    li {position:relative; float:left; width:50%; min-height:174px; padding:0 20px 0 265px; margin-bottom:40px;
        .thumb {position:absolute; left:0; top:0; overflow:hidden; width:245px; height:174px;
            img {width:100%; height:100%; transition:all 0.2s;}
            &.video:after {content:""; position:absolute; left:25px; top:18px; width:20px; height:27px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_mv.png) no-repeat 0 0;}
            &:hover img {transform:scale(1.1);}
        }
        .content {position:relative;
            .cate {
                span {display:inline-block; height:26px; padding:0 9px; border:1px solid #c66fc0; border-radius:13px; font-size:13px; line-height:24px; font-weight:600; color:#c66fc0;}  
                &.cate2 span, &.cate5 span, &.cate8 span, &.cate11 span, &.cate14 span, &.cate17 span, &.cate20 span, &.cate23 span {border-color:#599dc0; color:#599dc0;}
                &.cate3 span, &.cate6 span, &.cate9 span, &.cate12 span, &.cate15 span, &.cate18 span, &.cate21 span, &.cate24 span {border-color:#ff6a5b; color:#ff6a5b;}
            }
            .tit {margin-top:10px; font-size:22px; line-height:28px; font-weight:600;}
        }
        &:after {content:""; opacity:.4; position:absolute; left:265px; bottom:20px; width:55px; height:12px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_go.png) no-repeat 0 0;}
        &+li:nth-child(3)~li {margin-top:0;}
    }
}   

@media all and (max-width:768px){
    .boardList {padding:0 10px;
        li {float:none; width:100%; min-height:93px; padding:0 0 0 145px; margin:30px 0 0;
            .thumb {width:130px; height:93px;}
            .content {
                .cate {
                    span {font-size:.9rem;}
                }
                .tit {font-size:1.1rem; line-height:1.4em;}
            }
            &:after {display:none;}
            &+li:nth-child(3)~li {margin-top:30px;}
        }
    }   
}
</style>