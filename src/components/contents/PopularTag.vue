<template>
    <div>
        <h2 class="pcHidden">추천 태그</h2>
        <ul class="popularTag">
            <template v-if="(lists.length > 0 && hasLoading)">
                <li v-for="list in lists" :key="list.seq">
                    <a @click="goSearch(gubun, list.tag)">#{{list.tag}}</a>
                </li>
            </template>
            <li v-else-if="(lists.length > 0 && !hasLoading)" class="none">로딩중...</li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'

export default {
    props: ['isMain', 'gubun'],
    mixins : [mixin],
    data() {
        return {
            lists: [],
            hasLoading : false,
        }
    }, 
    created () {
        this.goList();
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        goList(){ //대분류, 페이징, 소분류, 형식, more버튼
            this.hasLoading = false
            axios.get('/tag.do').then(res => {
                this.lists = res.data
                this.hasLoading = true
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.popularTag {overflow:hidden; height:50px; margin-top:50px;
    li {float:left; margin-right:15px;
        a {display:block; height:50px; padding:0 25px; border:2px solid #75a0d5; border-radius:25px; font-size:20px; font-weight:600; line-height:46px; color:#75a0d5;
            &:hover, &:focus {color:#372772; border-color:#372772;}
        }        
    }
}   

@media all and (max-width:768px){
    h2 {margin-top:50px; font-size:1.3rem; line-height:1em; color:#2d8ab5; font-weight:600;}
    .popularTag {overflow:visible; height:auto; margin-top:0;
        li {float:left; margin:20px 15px 0 0;
            a {position:relative; display:inline-block; height:auto; padding:0; border:0; font-size:1.5rem; line-height:1em; color:#212121;
                &:hover, &:focus {color:#212121;}
                &:after {content:""; position:absolute; left:0; right:0; bottom:-5px; height:1px; background:#212121;}
            }        
        }
        &:after {content:""; display:block; clear:both;}
    }  
}
</style>