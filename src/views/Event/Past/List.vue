<template>
    <div id="c-container" :class="{fixed:fixed}">    
        <header id="c-heading" class="mobileHidden">
            <h1>EVENT</h1>
            <p class="srmy">뉴스킨에서 진행하는 다양한 이벤트와 푸짐한 혜택을 확인해보세요.</p>
        </header>
        <SubNav />
        <h1 class="pcHidden">종료된 이벤트</h1>
        <ul class="eventList">
            <template v-if="(lists.length > 0 && hasLoading)">
                <li v-for="(list, index) in lists" :key="index">
                    <p class="thumb"><router-link :to="{name:'PastView', query:{seq:list.seq}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                    <p class="tag">{{list.typeName}}</p>
                    <p class="tit"><router-link :to="{name:'PastView', query:{seq:list.seq}}">{{list.title}}</router-link></p>
                    <p class="date">이벤트 기간 <span>{{formatDate(list.startDate)}} ~ {{formatDate(list.endDate)}}</span></p>
                    <p class="btn">
                        <router-link v-if="(list.eventNoticeSeq)" :to="{name:'WinnerView', query:{seq:list.eventNoticeSeq}}" >당첨자 확인</router-link>
                        <template v-else>
                            <span v-if="(list.progressStatus === 'SELECTION')">당첨자 선별중</span>
                        </template>
                    </p>
                </li>
            </template>
            <li v-else-if="(lists.length == 0 && hasLoading)" class="none">지난 이벤트가 없습니다</li>
            <li v-else-if="(!hasLoading)" class="innerLoading">로딩중...</li>
        </ul>
        <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
    </div><!-- //container -->
</template>
<script>
import axios from 'axios'
import SubNav from '@/components/global/EventTab.vue'
import Paging from '@/components/common/Paging.vue'
import {mixin} from '@/components/mixins/mixins'

export default {
    mixins : [mixin],
    components: {
        SubNav,
        Paging
    },
    data() {
        return {
            lists : [],
            hasLoading : false,
            page : 1,
            pageSize : 10,
            total : 0
        }
    },
    created () {
        this.goList()
    },
    methods: {
        goList(page){
            this.hasLoading = false
            this.page = page ? page : 1
            axios.get('/event/past/list.do?page='+this.page+'&pageSize='+this.pageSize).then(res => {
                this.lists = res.data.lists 
                this.total = res.data.count
                this.hasLoading = true
            })
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
        }
    },
}
</script>
<style lang="scss" scoped>
.eventList {
    li {position:relative; float:left; width:50%;
        &:nth-child(odd) {padding-right:20px;}
        &:nth-child(even) {padding-left:20px;}
        &:nth-child(2)~li {margin-top:90px;}
        .thumb img {width:100%; height:280px;}
        .tag {display:inline-block; height:26px; padding:0 10px; border:1px solid #2d8ab5; border-radius:13px; margin-top:30px; line-height:26px; font-size:13px; font-weight:600; color:#2d8ab5;}
        .tit {min-height:72px; margin-top:10px; font-size:26px; line-height:36px; font-weight:600;}
        .date {float:left; margin-top:15px; color:#6d6d6d; line-height:1em;
            span {margin-left:14px; color:#212121;}
        }
        .btn {float:right; height:42px; margin-bottom:-10px;
            span, a {display:block; width:120px; height:42px; text-align:center; font-size:14px; line-height:42px; font-weight:600; color:#6d6d6d; background:#ddd;}
            a {color:#fff; background:#212121;
                &:after {content:""; display:inline-block; width:6px; height:6px; margin:-2px 0 0 10px; border-top:2px solid #fff; border-right:2px solid #fff; vertical-align:middle;
                transform:rotate(45deg); /*@include mix-transform(rotateX(45deg));*/}
            }
        }
        &:after {content:""; display:block; clear:both;}
    }
    &:after {content:""; display:block; clear:both;}
}

@media all and (max-width:768px){
    .eventList {
        li {float:none; width:100%;
            &:nth-child(odd) {padding-right:0;}
            &:nth-child(even) {padding-left:0;}
            &~li {margin-top:50px;}
            .thumb img {height:auto;}
            .tag {height:24px; margin-top:15px; line-height:22px; font-size:.95rem;}
            .tit {min-height:auto; margin-top:15px; font-size:1.5rem; line-height:1.4em;}
            .date {float:none; margin-top:25px;}
            .btn {float:none; margin:20px 0 0;
                span, a {width:100%; font-size:.9rem;}
            }
        }
    }
}
</style>