<template>
    <article class="popupLayer" ref="popup">
        <header>
            <h1>공유하기</h1>
            <button @click="hidePopup()" class="close">닫기</button>
        </header>
        <div class="content">
            <h2>{{title}}</h2>
            <p class="thumb"><img :src="thumb" alt=""></p>
            <div class="shareArea">
                <div class="urlArea">
                    <p class="url">{{shareUrl}}</p>
                    <button @click="copyUrl(shareUrl)">링크 복사</button>
                </div>
                <ul class="sns">
                    <li class="facebook"><button @click="chkShare('facebook')" :class="{checked:isSns[0]}">페이스북</button></li>
                    <li class="kakaoTalk"><button @click="chkShare('kakaoTalk')" :class="{checked:isSns[1]}">카카오톡</button></li>
                    <li class="kakaoStory"><button @click="chkShare('kakaoStory')" :class="{checked:isSns[2]}">카카오 스토리</button></li>
                    <li class="blog"><button @click="chkShare('blog')" :class="{checked:isSns[3]}">네이버 블로그</button></li>
                </ul>
            </div>
            <p class="caution">발행된 콘텐츠는 내가 발행한 콘텐츠 메뉴에서 다시 확인하실 수 있습니다. </p>
            <p class="btn"><button @click="goShare()">공유하기</button></p>
        </div>
    </article>
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex'
import {eventBus} from '@/main'
import {mixin} from '@/components/mixins/mixins'

export default {
    mixins : [mixin],
    props: ['shareContent', 'shareSeq'],
    data() {
        return {
            title: '',
            thumb: '',
            description: '뉴스킨의 빛나는 콘텐츠들을 확인해보세요.',
            shareUrl: '',
            isSns : [false, false, false, false],
            shareTarget : null,
        }
    },
    created () {
        this.title = this.shareContent.title;
        this.thumb = this.shareContent.thumb;
        this.shareUrl = location.href + '/myPublish/detail?seq=' + this.shareSeq
        this.setPopup()
    },
    methods: {
        hidePopup() {
            this.$emit('hidePopup', 'ShareContent')
        },
        chkShare(target){
            switch (target) {
                case 'facebook':
                    this.isSns = [true, false, false, false]
                    break;
                case 'kakaoTalk':
                    this.isSns = [false, true, false, false]
                    break;
                case 'kakaoStory':
                    this.isSns = [false, false, true, false]
                    break;
                case 'blog':
                    this.isSns = [false, false, false, true]
                    break;
            }
            this.shareTarget = target
        },
        goShare(){
            if(this.shareTarget != null){
                this.share(this.shareTarget);
                this.hidePopup()
            } else {
                alert('공유할 채널을 선택해 주세요')
            }
        }, 
        setPopup(){
            setTimeout(fun => {
                if(!this.isMobile){
                    this.$refs.popup.style.marginTop = "-" + this.$refs.popup.clientHeight / 2 + "px"
                }
                this.$refs.popup.style.opacity = 1
            }, 200)       
        },
        share(target){     
            switch(target){
                case 'facebook':
                    var facebookLink = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.shareUrl) + '&t=' + this.title
                    window.open(facebookLink, "facebook", "width=600px,height=400px,scrollbars=yes");
                    break;
        
                case 'kakaoTalk':
                    Kakao.Link
					.sendDefault({
						objectType : 'feed',
						content : {
							title : "뉴스킨 | " + this.title,
							description : this.description,
							imageUrl : this.cdnURL  + this.thumb,
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
                    var _txt = "뉴스킨 | " + this.title;
                    
                    Kakao.Story.share({
                        url: _url,
                        text: _txt
                    });
                    break;
        
                case 'blog':
                    window.open('https://share.naver.com/web/shareView.nhn?url=' + encodeURIComponent(this.shareUrl) +'&title=' + this.title);
                    break;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.popupLayer {opacity:0; position:absolute; left:50%; top:50%; z-index:1; background:#fff; width:400px; margin:-200px 0 0 -200px; transition:all .2s;
    header {position:relative; height:68px; border-bottom:1px solid #000;
        h1 {padding:27px 0 0 20px; font-size:24px; font-weight:600; line-height:1rem;}
        .close {position:absolute; right:30px; top:24px; overflow:hidden; width:24px; height:24px; padding-left:24px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_close2.png) no-repeat 0 0;}
    }
    .content {padding:20px 20px 100px;
        h2 {margin-bottom:20px; font-size:20px; font-weight:600; line-height:1rem;}
        .thumb {text-align:center;}
        .shareArea {
            .urlArea {position:relative; height:50px; margin-top:10px; padding:0 170px 0 25px; background:#f3f3f3;
                .url {overflow:hidden; white-space:nowrap; line-height:50px; color:#888;}
                button {position:absolute; right:0; top:0; height:50px; padding:0 25px 0 20px;
                    &:before {content:""; display:inline-block; width:18px; height:19px; margin:-3px 10px 0 0; vertical-align:middle; line-height:50px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_copy.png) no-repeat 0 0;}
                    &:after {content:""; position:absolute; left:0; top:50%; width:1px; height:22px; margin-top:-11px; background:#c2c2c2;}
                }
            }
            .sns {overflow:hidden; margin:20px 0 30px;
                li {float:left; width:25%; text-align:center;
                    button {font-size:13px; line-height:1rem; color:#888;
                        &:before {content:""; display:block; width:54px; height:54px; margin:0 auto 10px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_sns.png) no-repeat 0 0;}
                        &.checked {color:#75a0d5;
                            &:before {background-position-y:-54px;}
                        }
                    }
                    &.facebook button:before {background-position-x:0;}
                    &.kakaoTalk button:before {background-position-x:-54px;}
                    &.kakaoStory button:before {background-position-x:-108px;}
                    &.blog button:before {background-position-x:-162px;} 
                }
            }
        }
        .caution {position:relative; padding:20px 0 0 12px; border-top:1px solid #dbdbdb; font-size:14px; color:#666; word-break:keep-all;
            &:before {content:""; position:absolute; left:0; top:28px; width:3px; height:3px; border-radius:3px; background:#a7a7a7;}
        }
        .btn {position:absolute; left:0; bottom:0; right:0; height:60px;
            button {display:block; width:100%; height:60px; line-height:60px; color:#fff; font-weight:600; background:#9aabc0;
                &:before {content:""; display:inline-block; width:20px; height:15px; margin:-3px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_check2.png) no-repeat 0 0;}
            }
        }
    }
}

@media all and (max-width:768px){
    .popupLayer {left:0; top:0; width:100%; height:100%; margin:0;
        header {height:44px;
            h1 {padding:13px 0 0 20px; font-size:1.1rem;}
            .close {right:15px; top:10px; width:24px; height:24px; padding-left:24px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_close2_m.png) no-repeat 50% 50%; background-size:14px;}
        }
        .content {padding:20px 20px 50px;
            h2 {font-size:1.3rem;}
            .shareArea {
                .urlArea {height:40px; padding:0 120px 0 15px;
                    .url {line-height:40px;}
                    button {height:40px; padding:0 15px 0 10px;}
                }
                .sns {margin:20px 0 25px;
                    li {
                        button {font-size:.9rem; letter-spacing:-2px;
                            &:before {width:50px; height:50px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_sns_m.png); background-size:200px;}
                            &.checked {
                                &:before {background-position-y:-50px;}
                            }
                        }
                        &.kakaoTalk button:before {background-position-x:-50px;}
                        &.kakaoStory button:before {background-position-x:-100px;}
                        &.blog button:before {background-position-x:-150px;} 
                    }
                }
            }
            .caution {font-size:.9rem; line-height:1.4em;}
            .btn {height:55px;
                button {height:55px; line-height:55px;}
            }
        }
    }
}
</style>
</style>