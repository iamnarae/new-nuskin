<template>
    <div id="c-container" class="previewPage">
        <article class="boardview">
            <header>
                <div class="head">
                    <h1><span class="cate" :class="cateClass(detail.categorySeq)">{{detail.categoryName}}</span></h1>
                    <div class="btn">
                        <p class="scrap"><Scrap :content="detail" :design="btnType" /></p>
                        <Social :shareTitle="detail.title" :shareDesc="detail.description" :shareImage="thumb(detail.thumbnail)" :shareUrl="url" />
                    </div>
                </div>
                <h2>{{detail.title}}</h2>
                <div class="info">
                    <p class="tag"><span v-for="(tag, index) in detail.relationTag" :key="index"><Tag :tag="tag" /></span></p>
                    <p class="count">{{detail.viewCount}}</p>
                    <p class="scrap">{{detail.likeCount}}</p>
                    <p class="date">{{detail.registDate}}</p>
                </div>
            </header>
            <section class="content" v-if="(detail.contentsType == '001')" v-html="detail.contents">                
            </section>
            <section class="content cardType" v-else-if="(detail.contentsType == '002')">
                <div class="slideArea" ref="slide">
                    <div class="slideCont slide-container">
                        <p class="drag"></p>
                        <ul class="swiper-wrapper">
                            <li class="swiper-slide" v-for="card in detail.cardImages" :key="card.fileOriginalName"><img :src="thumb(card.file)" alt=""></li>
                        </ul>
                    </div>
                    <div class="controls">
                        <button class="prev">이전</button>
                        <p class="page"></p>
                        <button class="next">다음</button>
                    </div>
                </div>
            </section>
            <section class="content" v-else-if="(detail.contentsType == '003')">
                <div class="mv">
                    <iframe width="100%" height="100%" :src="('https://www.youtube.com/embed/' + detail.youtubeId + '?modestbranding=1&rel=0&showinfo=0')" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="mvText" v-html="detail.youtubeContents">
                </div>
            </section>
        </article><!-- //viewArea -->
        <article class="relative relativePdt" v-if="(relationSingleProduct.length > 0)">
            <h2>관련제품</h2>
            <PdtList :relationSingleProduct="relationSingleProduct" />
        </article><!-- //관련일반제품 -->
        <article class="relative relativePdt" v-if="(relationBundleProduct.length > 0)">
            <h2>관련제품</h2>
            <PdtList :relationBundleProduct="relationBundleProduct" />
        </article><!-- //관련묶음제품 -->
        <article class="relative relativeContents" v-if="(relationContents.length > 0)">
            <h2>관련컨텐츠</h2>
            <RelationContents :relationContents="relationContents"/>
        </article><!-- //관련컨텐츠 -->
        <article class="relative" v-if="(files.length > 0)">
            <h2>첨부파일</h2>
            <FileList :files="files" />
        </article>
    </div><!-- //container -->
</template>
<script>
import axios from 'axios'
import $ from 'jquery'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
import Social from '@/components/common/Social.vue'
import PdtList from '@/components/contents/PdtList.vue'
import RelationContents from '@/components/contents/RelationContents.vue'
import FileList from '@/components/common/FileList.vue'
import Pvnt from '@/components/common/Pvnt.vue'
import Scrap from '@/components/common/Scrap.vue'
import Tag from '@/components/common/Tag.vue'
import Gnb from '@/components/global/Gnb.vue'
import 'swiper/css/swiper.css'

export default {
    mixins : [mixin],
    components: {
        Gnb,
        Social,
        Pvnt,
        FileList,
        PdtList,
        RelationContents,
        Scrap,
        Tag,
    },
    data() {
        return {
            seq : null,
            detail : [],
            prev : [],
            next : [],
            files : [],
            relationContents : [],
            relationSingleProduct: [],
            relationBundleProduct: [],
            cateSeq: '',
            contentsListType: "typeA",
            swipePerView: 3,
            swipeSpace: 10,
            pageSize: 100,
            url : '',
            menuIndex : 1,
            btnType : 'typeC'
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    created () {
        this.initPage()
        this.url = location.href
        if(this.isMobile){
            this.swipePerView = 1
            this.swipeSpace = 0
        }
    },
    methods: {
         initPage(query){
            this.seq = this.$route.query.seq 
            this.cateSeq = this.$route.query.cate ? this.$route.query.cate : this.cateSeq
            axios.get('/contents/detail.do?seq='+this.seq+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
                this.detail = res.data
                this.prev = this.detail.prev
                this.next = this.detail.next
                this.files = this.detail.files
                this.relationContents = this.detail.relationContents ? this.detail.relationContents : null
                this.relationSingleProduct = this.detail.relationSingleProduct ? this.detail.relationSingleProduct : null
                this.relationBundleProduct = this.detail.relationBundleProduct ? this.detail.relationBundleProduct : null
                if(this.detail.cardImages){
                   this.swiperHeight = this.detail.cardImages[0].clientHeight 
                   setTimeout(()=>{
                       this.goCardSwiper()
                    }, 500)
                }
            }).catch((response) => {
                console.log(response);
            });
        },        
        thumb(target){
            return this.cdnURL + target
        },
        cateClass(num){
            return 'cate' + num
        },
        scrap(){
            const payload = {seq:this.seq, memberId:this.loginInfo.memberId}
            axios.post('/contents/like.do', qs.stringify(payload))
            .then(res => {
                this.detail.my = "Y"
            })
            .catch(err => {
                console.log(err)
            });
        },
        goCardSwiper(){
            var careSwiper = new Swiper ('.slideCont', {
                initialSlide: 0,
                slidesPerView: this.swipePerView,
                spaceBetween: this.swipeSpace, 
                centeredSlides: true,
                pagination: { 
                    el: '.page', 
                    type: 'fraction'
                },
                navigation: {
                    nextEl: '.next',
                    prevEl: '.prev'
                }
            })
        }
    }, 
}
</script>
<style lang="scss" scoped>
.boardview {
    header {padding:0 20px; margin:0 -20px 40px;
        .head {position:relative;
            h1 {float:left;
                span {display:inline-block; height:26px; padding:0 9px; border:1px solid #c66fc0; border-radius:13px; font-size:13px; line-height:24px; font-weight:600; color:#c66fc0;}                
                span.cate2, span.cate5, span.cate8, span.cate11, span.cate14, span.cate17, span.cate20, span.cate23 {border-color:#599dc0; color:#599dc0;}
                span.cate3, span.cate6, span.cate9, span.cate12, span.cate15, span.cate18, span.cate21, span.cate24 {border-color:#ff6a5b; color:#ff6a5b;}
            }
            .btn {float:right; padding-right:50px;
                .scrap {position:relative; z-index:1;}
            }
            &:after {content:""; display:block; clear:both;}
        }
        h2 {margin-bottom:30px; font-size:48px; word-break:keep-all;}
        .info {position:relative; text-align:right;
            .tag {overflow:hidden; position:absolute; left:0; top:0; padding-right:250px; font-size:18px; font-weight:600; line-height:1em; color:#6d6d6d;
                a {float:left; height:29px; padding:0 15px; border:1px solid #999; margin-right:10px; font-size:16px; line-height:27px;}
            }
            .count, .scrap {position:relative; display:inline-block; padding-left:30px; margin-right:30px; line-height:1em;
                &:before {content:""; position:absolute; left:0; top:50%; width:20px; height:20px; margin-top:-8px; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_view.png) no-repeat 0 0;}
            }
            .scrap:before {background-position-y:100%;}
            .date {display:inline-block; color:#888; line-height:1em;}
        }
    }
    .content {padding:0 0 80px;
        .mv {position:relative; text-align:center; padding-top:56.25%;
            iframe {position:absolute; left:0; top:0; width:100%; height:100%;}
        }
        .mvText {margin-top:30px; text-align:center;}
    }
    .slideArea {overflow:hidden; position:relative; text-align:center;
        .slideCont {position:relative; margin:0 -350px;
            .drag {position:absolute; left:350px; top:0; bottom:0; width:calc(33.3% - 356px); background:#f1f1f1;
                &:before {content:""; position:absolute; left:50%; top:50%; width:102px; height:130px; margin:-51px 0 0 -51px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_drag.png) no-repeat 0 0;}
            }  
            ul {
                li {
                    &.swiper-slide-prev:after, &.swiper-slide-next:after {content:""; position:absolute; left:0; right:0; top:0; bottom:0; background:rgba(255,255,255,.5);}
                }
            }
        }
        .controls {text-align:center; margin-top:30px;
            .prev, .next {overflow:hidden; display:inline-block; width:16px; height:30px; margin-top:-15px; text-indent:100%; white-space:nowrap; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_slide.png) no-repeat 0 0;}
            .next {background-position-x:100%;}
            .page {position:relative; display:inline-block; width:auto; height:45px; padding:0 18px 0 38px; margin:0 40px; border-radius:45px; font-size:14px; line-height:45px; color:#fff; vertical-align:middle; background:#a3a3a3 url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_page.png) no-repeat 16px 50%;}
        }
        
    }
}
.relative {padding:80px 0 50px; margin:0 -20px; border-bottom:1px solid #dbdbdb;
    h2 {padding:0 20px 20px; margin-bottom:50px; border-bottom:2px solid #212121; font-size:22px; line-height:1em; font-weight:600;} 
}

@media all and (max-width:768px){
    .boardview {
        header {
            .head {
                h1 {padding-top:5px;
                    span {font-size:.9rem;}
                }
            }
            h2 {margin:10px 0 0; font-size:1.8rem; line-height:1.4em;}
            .info {margin-top:5px;
                .tag {position:static; padding-right:0; font-size:1rem;
                    a {height:23px; padding:0 10px; margin-top:10px; font-weight:normal; font-size:1rem; line-height:21px;}
                }
                .count, .scrap {float:left; padding-left:20px; margin:25px 15px 0 0; font-size:.9rem;
                    &:before {width:15px; height:15px; margin-top:-6px; background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_view_m.png); background-size:100%;}
                }
                .date {float:right; margin-top:25px; font-size:.9rem;}
                &:after {content:""; display:block; clear:both;}
            }
        }
        .slideArea {overflow:visible;
            .slideCont {overflow:hidden; margin:0 20px;
                .drag {display:none;}  
                ul {
                    li {
                        &.swiper-slide-prev:after, &.swiper-slide-next:after {display:none;}
                    }
                }
            }
            .controls {margin-top:20px;
                .prev, .next {opacity:.4; position:absolute; left:-5px; top:50%;}
                .next {left:initial; right:-5px;}
                .page {height:30px; padding:0 14px 0 30px; margin:0; font-size:.9rem; line-height:30px; background:#a3a3a3 url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_page.png) no-repeat 14px 50%;}
            }
            
        }
    }
    .relative {padding:60px 0 80px; margin:0 -10px;
        h2 {padding:0 10px 15px; margin-bottom:10px; font-size:1.4rem;}
        &.relativePdt, &.relativeContents {padding-bottom:0; border-bottom:0;}
    }  
}
</style>