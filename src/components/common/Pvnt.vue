<template>
    <ul class="pvnt">
        <li :class="{is:prev.seq}" class="prev">
            <a v-if="prev.seq" @click="goPage(prev.seq)"><span class="tit">이전</span>{{prev.title}}</a>
            <span v-else>이전글이 없습니다.</span>
        </li>
        <li :class="{is:next.seq}" class="next">
            <a v-if="next.seq" @click="goPage(next.seq)"><span class="tit">다음</span>{{next.title}}</a>
            <span v-else>다음글이 없습니다.</span>
        </li>
    </ul>
</template>
<script>
import { eventBus } from '@/main'
export default {
    props: ['prev', 'next', 'type'],
    methods: {
         goPage(query){
            this.$router.push({query:{seq:query, type:this.type}})
            eventBus.resetPage(query)
         },
    },
}
</script>
<style lang="scss" scoped>
.pvnt {overflow:hidden; height:82px; padding:30px 20px; margin:0 -20px; border-top:1px solid #000; border-bottom:1px solid #dbdbdb;
    li {position:relative; float:left; overflow:hidden; width:50%; color:#313131; font-size:18px; line-height:20px; font-weight:600; white-space:nowrap; text-overflow:ellipsis;
        .tit {position:absolute; top:0; color:#313131; font-size:18px; line-height:20px; font-weight:600;}
        &.prev {padding-left:100px;
            .tit {left:0;}
        }
        &.next {padding-right:100px; text-align:right;
            .tit {right:0;}
        }
        &:not(.is) {opacity:.7; padding:0;}
    }
}

@media all and (max-width:768px){
    .pvnt {overflow:hidden; height:auto; padding:0; margin-top:50px;
        li {float:none; width:100%; padding:0 20px 0 70px; font-size:1.1rem; line-height:55px; font-weight:500;
            .tit {left:20px; font-size:1.1rem; line-height:55px; font-weight:500;}
            &.prev {padding-left:70px;
                .tit {left:20px;}
            }
            &.next {height:56px; padding-right:0; text-align:left; border-top:1px solid #dbdbdb;
                .tit {right:initial;}
            }
            &:not(.is) {padding-left:20px;}
        }
    }
}
</style>