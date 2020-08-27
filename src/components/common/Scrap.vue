<template>
    <div>
        <button @click="scrap(content)" :class="[{complete:content.my == 'Y'}, design]">찜</button>
        <transition name="fade">
            <div class="scrapLayer" v-if="showLayer">
                <p>내 콘텐츠에 저장되었습니다.</p>
            </div>
        </transition>
    </div>    
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
  mixins : [mixin],
    props: ['content', 'design', 'isMain'],
    data() {
        return {
            showLayer: false
        }
    },
    created () {
        
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        scrap(content){
            if(this.isLogin){
                const payload = {seq:content.seq, memberId:this.loginInfo.memberId}
                axios.post('/contents/like.do', qs.stringify(payload))
                .then(res => {
                    if(content.my == "Y"){
                        content.my = "N"
                    } else {
                        content.my = "Y"
                        this.showLayer = true
                        setTimeout(e => {
                            this.showLayer = false
                        }, 1000)

                    }
                })
                .catch(err => {
                    console.log(err)
                });        
            } else {
                alert('로그인을 해주세요.')
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
button {overflow:hidden; display:block; width:40px; height:40px; padding-left:40px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap.png) no-repeat 0 100%;
    &.complete {background-position-y:0;}
    &.typeB {width:48px; height:48px; padding-left:48px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap2.png);}
    &.typeC {background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap3.png);}
}
.scrapLayer {position:fixed; left:0; top:50%; right:0; z-index:30; margin-top:-23px; text-align:center;
    p {display:inline-block; height:45px; padding:0 30px; border-radius:45px; color:#fff; line-height:45px; background:rgba(0,0,0,.8);
        &:before {content:""; display:inline-block; width:20px; height:17px; margin:-2px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_scrap4.png) no-repeat 0 0;}
    }
}

@media all and (max-width:768px){
    button {background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap_m.png); background-size:100%;
        &.typeB {width:40px; height:40px; padding-left:40px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap2_m.png);}
        &.typeC {background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_scrap3_m.png);}
    }
    .scrapLayer {margin-top:-17px;
        p {height:34px; padding:0 20px; border-radius:34px; line-height:34px;
            &:before {width:14px; height:12px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_scrap4_m.png); background-size:100%;}
        }
    }
}
}
</style>