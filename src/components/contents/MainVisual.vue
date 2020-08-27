<template>
    <section class="swiper-container visual" v-if="(lists.length > 0)">
        <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="list in lists" :key="list.seq" :style="thumb(list.seq)">
                <div class="content">
                    <p class="cate" :style="{color:list.color}"><span>{{list.typeName}}</span></p>
                    <p class="tit" v-html="transText(list.title)" :style="{color:list.color}"></p>
                    <p class="srmy" v-if="!isMobile" :style="{color:list.color}">{{list.intro}}</p>
                    <p class="bttn"><a :href="list.url" :target="target(list.targetYn)" :style="{color:list.color, borderColor:list.color}">자세히보기</a></p>
                </div>
            </li>
        </ul>
        <div class="visual-pagination"></div>
    </section>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
import $ from 'jquery'

export default {
    mixins : [mixin],
    props: ['isMain'],
    data() {
        return {            
            lists: [],
            hasLoading : false
        }
    },
    mounted () {
        this.goVisual();
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        goVisualSwiper(){
            const visualSwiper = new Swiper ('.visual', {
                slidesPerView: 1,
                autoplay: {
                    delay: 5000
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            })
        },
        goVisual(){ 
            this.hasLoading = false
            axios.get('/banner.do').then(res => {
                this.lists = res.data
                this.hasLoading = true
                setTimeout(()=>{
                    this.goVisualSwiper()
                }, 500)
            })
        },
        thumb(target){
            var thumbnail
            this.lists.forEach(data => {
                if(target === data.seq){
                    if(this.isMobile){
                        thumbnail = data.mobileImage
                    } else {
                        thumbnail = data.pcImage
                    }
                }
            });
            return 'background-image:url(' + this.cdnURL + thumbnail + ')'
        },
        transText(text){
            return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
        },
        goVisualSwiper(){
            var visualSwiper = new Swiper ('.visual', {
                autoplay: {
                    delay: 5000
                },
                pagination: {
                    el: '.visual-pagination',
                },
            })
        },
        target(yn){
            if(yn == 'N'){
                return '_blank'
            }
        }
    },
}
</script>
<style lang="scss">
.visual {height:530px;
    li {position:relative; height:530px;
        .content {max-width:1100px; padding:100px 0 0 20px; margin:0 auto;
            .cate {font-weight:600; color:#fff; font-weight:600; line-height:1em; font-family:'Malgun Sam';}
            .tit {overflow:hidden; margin-top:25px; font-size:48px; font-weight:600; color:#fff; line-height:60px; font-family:'Malgun Sam'; word-break:keep-all;}
            .srmy {max-width:650px; margin-top:20px; font-size:18px; color:#fff; line-height:24px; font-family:'Malgun Sam'; word-break:keep-all;}
            .bttn {margin-top:30px;
                a {display:inline-block; height:32px; padding:0 13px; border:1px solid #fff; font-size:14px; color:#fff; line-height:30px; font-family:'Malgun Sam';
                    &:after {content:"▶"; display:inline-block; margin:-3px 0 0 6px; font-size:10px; vertical-align:middle; }
                }
            }
        }
    }
    .visual-pagination {overflow:hidden; position:absolute; left:50% !important; bottom:80px !important; z-index:20; width:1100px; margin-left:-550px; padding-left:20px;
        .swiper-pagination-bullet {opacity:1; position:relative; float:left; width:25px; height:25px; background:none;
            &:before {content:""; position:absolute; left:50%; top:50%; width:8px; height:8px; margin:-4px 0 0 -4px; border-radius:50%; background:#fff;}
        }
        .swiper-pagination-bullet-active {border:1px solid #fff; border-radius:25px;}
    }
}

@media all and (max-width:768px){
    .visual {height:auto; padding-top:122% !important;
        .swiper-wrapper {position:absolute; left:0; top:0; right:0;
            li {height:100%; background-size:100%;
                .content {padding:40px 20px 0;
                    .cate {font-weight:600; color:#fff; font-weight:600; line-height:1em; font-family:'Malgun Sam';}
                    .tit {margin-top:15px; font-size:1.8rem; line-height:1.4em;}
                    .bttn {
                        a {font-size:.9rem;
                            &:after {font-size:.8rem;}
                        }
                    }
                }
            }
        }
        .visual-pagination {left:20px !important; bottom:40px !important; width:auto; margin-left:0; padding-left:0;
            .swiper-pagination-bullet {width:20px; height:20px;
                &:before {width:6px; height:6px; margin:-3px 0 0 -3px;}
            }
        }
    }
}
</style>