<template>
    <div class="social">
        <meta property="og:url" :content="shareUrl" />
        <meta property="og:type" content="website" />
        <meta property="og:title" :content="shareTitle" />
        <meta property="og:description" :content="shareDesc" />
        <meta property="og:image" :content="shareImage" />
        <meta property="og:site_name" content="뉴스킨" />   
        <button class="open" @click="(showSocial = true)">공유하기 레이어열기</button>
        <transition name="slideLR">
            <div v-show="showSocial" class="cont">
                <ul>
                    <li><button class="facebook" @click="share('facebook')">페이스북</button></li>
                    <li><button class="kakaotalk" @click="share('kakaoTalk')">카카오톡</button></li>
                    <li><button class="kakaostory" @click="share('kakaoStory')">카카오스토리</button></li>
                    <li><button class="blog" @click="share('blog')">블로그</button></li>
                </ul>
                <button class="close" @click="(showSocial = false)">공유하기 레이어닫기</button>
            </div>
        </transition>
    </div>
</template>
<script>
import $ from 'jquery'
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    props: ['shareUrl', 'shareTitle', 'shareDesc', 'shareImage'],
    data() {
        return {  
            showSocial : false      
        }
    },
    mounted () {
        if(!this.shareImage){
            this.shareImage = '/static/images/common/thumb_social.jpg'
        }
        transShareContent(this.shareUrl, this.shareTitle, this.shareDesc, this.cdnURL + this.shareImage)       
    },
    methods: {
        share(target){     
            switch(target){
                case 'facebook':
                    var facebookLink = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.shareUrl) + '&t=' + this.shareTitle
                    window.open(facebookLink, "facebook", "width=600px,height=400px,scrollbars=yes");
                    break;
        
                case 'kakaoTalk':
                    Kakao.Link
					.sendDefault({
						objectType : 'feed',
						content : {
							title : "뉴스킨 | " + this.shareTitle,
							description : this.shareDesc,
							imageUrl : this.cdnURL  + this.shareImage,
							link : {
								mobileWebUrl : this.shareUrl,
								webUrl : this.shareUrl
							}
						},
						buttons : [ {
							title : '웹으로 보기',
							link : {
								mobileWebUrl : this.shareUrl,
								webUrl : this.shareUrl
							}
						}, {
							title : '앱으로 보기',
							link : {
								mobileWebUrl : this.shareUrl,
								webUrl : this.shareUrl
							}
						} ]
                    });
                    break;

                case 'kakaoStory' :
                    var _url = this.shareUrl;
                    var _txt = "뉴스킨 | " + this.shareTitle;
                    
                    Kakao.Story.share({
                        url: _url,
                        text: _txt
                    });
                    break;
        
                case 'blog':
                    window.open('https://share.naver.com/web/shareView.nhn?url=' + encodeURIComponent(this.shareUrl) +'&title=' + this.shareTitle);
                    break;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
.social {overflow:hidden; position:absolute; right:0; top:0; width:205px; height:40px;
    .open {position:absolute; right:0; top:0; overflow:hidden; width:40px; height:40px; padding-left:40px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_social.png) no-repeat 0 0;}
    .cont {position:relative; z-index:1; height:40px; padding-right:13px; border-radius:20px; background:#eee; 
        ul {float:left; padding:9px 5px 0; margin-right:3px;
            li {float:left; width:40px; height:22px; text-align:center;
                button {display:block; overflow:hidden; width:22px; height:22px; padding-left:22px; margin:0 auto; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_social.png) no-repeat 0 0;}
                .facebook {background-position-x:0;}
                .kakaotalk {background-position-x:-22px;}
                .kakaostory {background-position-x:-44px;} 
                .blog {background-position-x:-66px;}
            }
        }
        .close {float:left; overflow:hidden; width:19px; height:19px; margin-top:10px; text-indent:100%; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_close.png) no-repeat 50% 50%;}
        &:after {content:""; display:block; clear:both;}
    }
}

@media all and (max-width:768px){
    .social {
        .open {background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_social_m.png); background-size:100%;}
    }
}
}
</style>