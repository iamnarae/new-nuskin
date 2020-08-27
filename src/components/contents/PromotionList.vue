<template>
    <div class="swiper-container promotion" v-if="(lists.length > 0)">
        <ul class="list swiper-wrapper">
            <template v-if="(hasLoading)">
                <li class="swiper-slide" v-for="list in lists" :key="list.seq">
                    <p class="thumb"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}"><img :src="thumb(list.seq)" alt=""></router-link></p>
                    <div class="content">                        
                        <p class="cate" :class="cateClass(list.categorySeq)"><span>{{list.categoryName}}</span></p>
                        <p class="tit ellLine2"><router-link :to="{name:'ContentsView', query:{seq:list.seq, type:list.type}}">{{list.title}}</router-link></p>                        
                    </div>
                </li>
            </template>
            <!-- <li v-else class="none">로딩중...</li> -->
        </ul>
        <div class="swiper-pagination"><span class="swiper-pagination-bullet"></span></div>
    </div>
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import {mapState} from 'vuex'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    props: ['type', 'cateSeq', 'isMain'], 
    data() {
        return {
            lists: [],
            hasLoading : false,
            hasMore : false,
            promoCount: 0,
        }
    }, 
    computed: {    
        ...mapState(["isLogin", "loginInfo"]),
    },
    created () {
        this.goList(this.type, this.cateSeq)
        if(!this.isMain){
            eventBus.$on('setPromoList', (type, cateSeq) => {
                this.goList(type, cateSeq)
            })
        }
    },
    mounted () {
    },    
    methods: {
        goList(type, cateSeq){ //대분류, 소분류
            this.hasLoading = false
            type = type ? type : this.type
            cateSeq = cateSeq ? cateSeq : ''
            axios.get('/contents/banner.do?type='+type+'&categorySeq='+cateSeq+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
                this.lists = res.data
                this.hasLoading = true
                this.$emit("totalCount", this.lists.length)
                setTimeout(()=>{
                    this.goPromoSwiper()
                }, 500)
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
        cateClass(num){
            return 'cate' + num
        },
        goPromoSwiper(){
          var promoSwiper = new Swiper ('.promotion', {
              slidesPerView: 1,
              loop: true,
              autoplay: {
                  delay: 5000
              },
              pagination: {
                  el: '.swiper-pagination',
              },
          })
        }
    },
}
</script>
<style lang="scss">
.promotion.swiper-container {overflow:hidden; position:absolute; left:0; top:0; width:calc((100% - 70px) / 3); height:480px;
    li {position:relative;
        .thumb {height:230px;
            img {width:100%; height:230px; transition:all 0.2s;}
            &:hover img {transform:scale(1.1);}
        }
        .content {position:absolute; left:0; right:0; bottom:0; top:230px; padding:35px 25px 0; background:rgb(60,51,108); background:linear-gradient(135deg, rgba(60,51,108,1) 0%, rgba(22,140,170,1) 100%);
            .cate {
                span {display:inline-block; height:26px; padding:0 10px; border-radius:13px; font-size:13px; line-height:26px; font-weight:600; color:#c66fc0; background:#fff;}
                &.cate2 span, &.cate5 span, &.cate8 span, &.cate11 span, &.cate14 span, &.cate17 span, &.cate20 span, &.cate23 span {border-color:#599dc0; color:#599dc0;}
                &.cate3 span, &.cate6 span, &.cate9 span, &.cate12 span, &.cate15 span, &.cate18 span, &.cate21 span, &.cate24 span {border-color:#ff6a5b; color:#ff6a5b;}
            }
            .tit {height:80px; margin-top:20px; font-size:34px; line-height:40px; font-weight:600; color:#fff;}
            .tit a {color:#fff;}
        }       
    }
}
.swiper-pagination {position:absolute; left:30px !important; bottom:28px !important; width:auto !important;
    .swiper-pagination-bullet {opacity:.2; display:inline-block; width:26px; height:4px; border-radius:0; margin-right:2px; background:#fff;
        &.swiper-pagination-bullet-active {opacity:1;}
    }
}  

@media all and (max-width:768px){
    .promotion.swiper-container {position:relative; left:initial; top:initial; width:100%; height:auto;
        li {
            .thumb {position:relative; height:auto; padding-top:70.3%;
                img {position:absolute; left:0; top:0; height:100%;}
            }
            .content {position:static; padding:25px 20px 50px;
                .cate {
                    span {height:25px; font-size:.9rem; line-height:25px;}
                }
                .tit {height:60px; margin-top:15px; font-size:1.5rem; line-height:30px;}
            }       
        }
    }
    .swiper-pagination  {left:20px !important; bottom:25px !important;
        .swiper-pagination-bullet {height:2px;}
    } 
}
</style>