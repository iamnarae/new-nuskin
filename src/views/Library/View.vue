<template>
    <div id="c-wrapper" :class="{fixed:fixed}">
        <Gnb :menuIndex="menuIndex" :Fixed="fixed" />
        <div id="c-container">   
            <header id="c-heading" class="typeB"> 
                <h1>자료실<span class="sub">{{detail.typeName}}</span></h1>
                <Social :shareTitle="detail.title" :shareDesc="desc" :shareUrl="url" />
            </header>
            <article class="viewArea">
                <header>
                    <h2>{{detail.title}}</h2>
                    <p class="date">{{detail.registDate}}</p>
                </header>
                <section class="content" v-html="detail.contents">
                </section>
            </article><!-- //viewArea -->
            
            <article class="relative">
                <h2>첨부파일</h2>
                <p class="caution">* 앱 다운로드 기능은 추후 가능, 웹에서는 정상적으로 이용 가능합니다.</p>
                <FileList :files="files" />
            </article>
            <keep-alive>
                <Pvnt :prev="prev" :next="next" />
            </keep-alive>
            <div class="btnArea">
                <router-link :to="{name:'Library', params:{page:page, type:type, keyword:keyword}}" class="btnList">목록으로</router-link>
            </div>
        </div><!-- //container -->
    </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import Gnb from '@/components/global/Gnb.vue'
import Social from '@/components/common/Social.vue'
import Pvnt from '@/components/common/Pvnt.vue'
import FileList from '@/components/common/FileList.vue'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    components: {
        Gnb,
        Social,
        Pvnt,
        FileList
    },
    data() {
        return {
            seq : null,
            detail : [],
            prev : [],
            next : [],
            page: '',
            type : '',
            keyword : '',
            files : [],
            desc : '뉴스킨에 대한 모든 것! 필요한 자료를 다운받아서 활용해보세요.',
            shareThumb : '123.jpg',
            url : '',
            menuIndex : 4
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"]),
    },
    created () {
        this.initPage()
        this.url = location.href
    },
    methods: {
         initPage(query){
            if(query){ //detail에서 detail로 이동시
                this.seq = query
            } else {
                this.seq = this.$route.query.seq 
                this.type = this.$route.query.type ? this.$route.query.type : ''
                this.keyword = this.$route.query.keyword ? this.$route.query.keyword : ''
                this.page = this.$route.params.page
            }
            axios.get('/contents/library/detail.do?memberTitle='+this.loginInfo.memberTitle+'&type='+this.type+'&keyword='+this.keyword+'&seq='+this.seq).then(res => {
                this.detail = res.data
                this.prev = this.detail.prev
                this.next = this.detail.next
                this.files = this.detail.files
            }).catch((response) => {
                console.log(response);
            }); 
        }
    },
}
</script>
<style lang="scss" scoped>
.viewArea {
    header {position:relative; padding:0 140px 40px 20px; margin:0 -20px; border-bottom:2px solid #212121;
        h2 {font-size:48px;}
        .date {position:absolute; right:20px; bottom:40px; color:#888; line-height:1em;}
    }
    .content {padding:40px 0 80px;
        .btn {margin-top:60px; text-align:center;
            a {display:inline-block; width:250px; height:54px; border-radius:27px; font-size:16px; line-height:54px; font-weight:600; color:#fff; background:#75a0d5;
                &:before {content:""; display:inline-block; width:18px; height:15px; margin:-2px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/statichttps://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_event.png) no-repeat 0 0;}
            }
        }
    }
}
.relative {padding:80px 0 50px; margin:0 -20px; border-bottom:1px solid #dbdbdb;
    h2 {padding:0 20px 20px; margin-bottom:50px; border-bottom:2px solid #212121; font-size:22px; line-height:1em; font-weight:600;}
    .caution {height:90px; margin-top:-90px; text-align:right;}
}

@media all and (max-width:768px){
    #c-heading {
        h1 {margin-top:5px;}
    }
    .viewArea {
        header {padding:0 10px 40px; margin:0 -10px;
            h2 {font-size:2rem; font-weight:600;}
            .date {bottom:20px; font-size:.95rem;;}
        }
        .content {padding:20px 0 60px;
            .endText {height:40px; margin:0 0 30px; font-size:1.1rem; line-height:40px;}
            .btn {margin-top:40px;
                a {width:auto; height:40px; padding:0 50px; font-size:1.1rem; line-height:40px; }
            }
        }     
    }
    .relative {padding:60px 0 80px; margin:0 -10px;
        h2 {padding:0 10px 15px; margin-bottom:10px; font-size:1.4rem;}
        .caution {height:auto; margin:0 0 10px; font-size:.8rem;}
    }
}
</style>