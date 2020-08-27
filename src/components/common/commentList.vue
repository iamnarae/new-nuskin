<template>
   <div class="commentList">
        <h4>댓글 <span class="colorA">{{commnetTotal}}</span></h4>
        <ul>
            <template v-if="(commnetList.length>0)">
                <li v-for="(list, index) in commnetList" :key="index" :class="{my:list.my == 'Y'}">
                    <div class="head">
                        <p class="user"><strong>{{list.memberName}}</strong> ({{list.memberId}})</p>
                        <p class="date">{{list.registDate}}</p>
                    </div>
                    <p class="text">{{list.contents}}</p>
                    <p class="del" v-if="(list.my == 'Y')"><button @click="deleteComment(list)">삭제</button></p>
                </li>
            </template>
            <li v-else class="none">작성된 댓글이 없습니다.</li>
        </ul>
        <Paging :page="page" :rows="commnetTotal" :pageSize="pageSize" @setPage="goPage" />
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import Paging from '@/components/common/Paging.vue'

export default {
    components: {        
        Paging,
    },
    props: ['eventSeq', 'page', 'commnetTotal', 'pageSize', 'commnetList'],
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        goPage(page){
            this.$emit('setPage', page)
        },
        deleteComment(list){
            const seq = list.seq      
            const memberId = this.loginInfo.memberId;
            this.$emit('deleteComment', {seq, memberId})
        }
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
.commentList {margin-top:60px;
    h4 {padding:0 20px 20px; margin:0 -20px; border-bottom:2px solid #212121; font-size:22px; line-height:1em; font-weight:600;}
    ul {
        li {display:table; width:100%; table-layout:fixed; padding:30px 0; border-bottom:1px solid #dbdbdb;
            .head {display:table-cell; width:240px; padding:0 20px; vertical-align:middle;
                .user {font-size:14px; color:#888;
                    strong {position:relative; bottom:-2px; font-size:18px; color:#212121;}
                }
                .date {margin-top:13px; font-size:14px; color:#aaa; line-height:1em;}
            }
            .text {display:table-cell; vertical-align:middle;}
            .del {display:table-cell; width:55px; padding-right:20px; text-align:right; vertical-align:top;
                button {display:inline-block; overflow:hidden; width:14px; height:14px; padding-left:14px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_del.png) no-repeat 0 0;}
            }
            &.my {background:#f0f3f7;}
            &.my:first-child {margin-top:20px;}
        }
    }
}

@media all and (max-width:768px){
    .commentList {margin-top:50px;
        h4 {padding:0 10px 20px; margin:0 -10px; font-size:1.6rem;}
        ul {
            li {position:relative; display:block; width:100%; padding:30px 15px;
                .head {display:block; width:100%; padding:0;
                    .user {font-size:.9rem;
                        strong {bottom:0; font-size:1.3rem;}
                    }
                    .date {margin-top:5px; font-size:.9rem;}
                }
                .text {display:block; margin-top:20px;}
                .del {position:absolute; right:15px; top:30px; width:auto; padding-right:0;}
            }
        }
    }
}
}
</style>