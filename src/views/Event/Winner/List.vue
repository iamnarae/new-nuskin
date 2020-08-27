<template>
    <div id="c-container" :class="{fixed:fixed}">    
        <header id="c-heading" class="mobileHidden">
            <h1>EVENT</h1>
            <p class="srmy">뉴스킨에서 진행하는 다양한 이벤트와 푸짐한 혜택을 확인해보세요.</p>
        </header>
        <SubNav />
        <h1 class="pcHidden">당첨자 발표</h1>
        <div class="bbsArea">
            <table class="bbsList">
                <caption>당첨자발표 중요 목록</caption>
                <colgroup>
                    <col width="12%"><col width=""><col width="12%">
                </colgroup>
                <template v-if="(noticeLists.length>0)">
                    <tr v-for="list in noticeLists" :key="list.seq" class="notice">
                        <th><span class="impor">중요</span></th>
                        <td class="tit"><router-link :to="{name:'WinnerView', query:{seq:list.seq}}"><strong :class="getType(list.typeName)">{{list.typeName}}</strong>{{list.title}}</router-link></td>
                        <td class="date">{{list.date}}</td>
                    </tr>
                </template>
            </table>            
        </div>
        <div class="bbsArea">
            <table class="bbsList">
                <caption>당첨자발표 목록</caption>
                <colgroup>
                    <col width="12%"><col width=""><col width="12%">
                </colgroup>
                <template v-if="(lists.length > 0 && hasLoading)">
                    <tr v-for="(list, index) in lists" :key="index">
                        <th>{{lists.length - index}}</th>
                        <td class="tit"><router-link :to="{name:'WinnerView', query:{seq:list.seq}}"><strong :class="getType(list.typeName)">{{list.typeName}}</strong>{{list.title}}</router-link></td>
                        <td class="date">{{list.date}}</td>
                    </tr>
                </template>
                <tr v-else-if="(lists.length == 0 && hasLoading)" class="none"><td colspan="3">당첨자 내역이 없습니다</td></tr>
                <tr v-else-if="(!hasLoading)" class="innerLoading"><td colspan="3">로딩중...</td></tr>
            </table>
        </div>
        <Paging :page="page" :rows="total" :pageSize="pageSize" @setPage="goPage" />
    </div><!-- //container -->
</template>
<script>
import axios from 'axios'
import {mixin} from '@/components/mixins/mixins'
import SubNav from '@/components/global/EventTab.vue'
import Paging from '@/components/common/Paging.vue'

export default {
    mixins : [mixin],
    components: {
        SubNav,
        Paging
    },
    data() {
        return {
            noticeLists : [],
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
        getType(type){
            if(type === "당첨자 발표"){
                return 'cate1'
            } else if(type === "안내") {
                return 'cate2'
            } else {
                return 'cate3'
            }
        },
        goList(page){
            this.hasLoading = false
            this.page = page ? page : 1
            axios.get('/event/notice/list.do?page='+this.page+'&pageSize='+this.pageSize).then(res => {
                this.noticeLists = res.data.top
                this.lists = res.data.lists 
                this.total = res.data.count
                this.hasLoading = true
            })
        },
        goPage(page){
            this.goList(page)
        }
    },
}
</script>
<style lang="scss" scoped>
.bbsArea {border-top:2px solid #000;
    .bbsList {width:100%; 
        th {height:110px; border-bottom:1px solid #dbdbdb; font-weight:500; color:#888;
            .impor {display:inline-block; overflow:hidden; width:14px; height:14px; padding-left:14px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_impor.png) no-repeat 0 0;}
        }
        td {height:110px; border-bottom:1px solid #dbdbdb;
            strong {display:block;}
            &.date {color:#888;}
            &.tit {font-weight:600;}
            .cate1 {color:#f66a5b;}
            .cate2 {color:#008ab0;}
        } 
        .notice {
            th, td {background:#e2eaf4;}
        }
    }
    &~.bbsArea {border-top-width:0;}
}

@media all and (max-width:768px){
    .bbsArea {margin:0 -20px; border-bottom:9px solid #eee;
        .bbsList {
            th {height:auto; padding:20px 0 20px 10px;
                .impor {width:10px; height:11px; padding-left:10px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_impor_m.png); background-size:100%;}
            }
            td {height:auto; padding:20px 0; border-bottom:1px solid #dbdbdb;}
        }
        &~.bbsArea {border-top:1px solid #dbdbdb; border-bottom-width:0;}
    }
}
</style>