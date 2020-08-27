<template>
    <article class="popupLayer" ref="popup">
        <header>
            <h1>{{pageTitle}}</h1>
            <button @click="hidePopup()" class="close">닫기</button>
        </header>
        <section class="content"> 
            <p class="field"><input type="text" id="title" v-model="title" placeholder="제목을 입력해주세요."><label for="title"></label></p>
            <h2>공유 이미지 선택하기</h2>
            <div class="choiceThumb">
                <label><img :src="thumbLists.n"><input type="radio" value="thumb1" v-model="pick"></label>
                <label><img :src="thumbLists.y"><input type="radio" value="thumb0" v-model="pick"></label>
            </div>
            <ul class="caution">
                <li>나만의 콘텐츠를 발행하면 내 콘텐츠 발행 내역에 자동 저장되며 이 후 언제든 공유하실 수 있습니다.</li>
                <li>공유 이미지는 대표이미지와 첫번째 선택하신 콘텐츠의 썸네일, 등록하신 이미지 중에 선택이 가능합니다.</li>
            </ul>
            <p class="btn">
                <button @click="registContents()" v-if="!modifyMode">발행하기</button>
                <template v-else>
                    <button @click="deleteContents()" class="delete">삭제</button>
                    <button @click="modifyContents()" class="modify">수정</button>
                </template>
            </p>
        </section>
    </article>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import {mapState} from 'vuex'
import {eventBus} from '@/main'
import {mixin} from '@/components/mixins/mixins'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
    mixins : [mixin],
    props: ['checkLists', 'modifyContent'],
    data() {
        return {
            pageTitle: '나만의 콘텐츠 만들기',
            title: '',
            pick: '',
            lists: [],
            isThumb: "N",
            shareThumb : null,
            modifyMode : false,
            thumbLists : {n:null, y:null},
            firstSeq : ''
        }
    },
    created () {
        if(this.modifyContent) {
            axios.get('/contents/my/detail.do?seq='+this.modifyContent.seq+'&memberId='+this.loginInfo.memberId+'&memberTitle='+this.loginInfo.memberTitle).then(res => {
                this.firstSeq = res.data.contents[0].seq                
                this.thumb()
            })
            this.pageTitle = "나만의 콘텐츠 수정하기"
            this.modifyMode = true
            this.title = this.modifyContent.title
            if(this.modifyContent.representativeYn == "Y"){
                this.pick = "thumb0"
            } else {
                this.pick = "thumb1"
            }
        } else {
            this.firstSeq = this.checkLists[0].seq
            this.thumb()
        }     
              
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"])
    },
    methods: {
        thumb(){
            axios.get('/contents/my/shareimage.do?contentsSeq='+this.firstSeq).then(res => {
                res.data.forEach(list => {
                    if(list.representativeYn == 'N') {
                        this.$set(this.thumbLists, 'n', this.cdnURL+list.thumbnail)
                    } else if(list.representativeYn == 'Y') {
                        this.$set(this.thumbLists, 'y', this.cdnURL+list.thumbnail)
                    }
                    setTimeout(fun =>{
                        this.setPopup()
                    }, 300);
                })
            });
        },
        registContents(){
            if(this.pick == 'thumb0'){
                this.isThumb =  "Y"
                this.shareThumb = this.thumbLists.y
            } else {
                this.isThumb =  "N"
                this.shareThumb = this.thumbLists.n
            }
            if(!this.title){
                alert('제목을 입력해주세요')
            } else {
                if(!this.pick){
                    alert('대표이미지를 선택해주세요')
                } else {
                    var formData = new FormData();
                    formData.append('memberId', this.loginInfo.memberId);
                    formData.append('title', this.title);
                    formData.append('representativeYn', this.isThumb);
                    this.checkLists.forEach(el => {
                        formData.append('contentsSeq', el.seq);
                    })
                    axios.post('/contents/my/ins.do', formData)
                    .then(res => {
                        this.$emit("publishSeq", res.data.seq)
                        this.hidePopup()
                        this.goShare()
                        this.$emit("resetCheckList")
                    })
                    .catch(err => {
                        console.log(err)
                    });     
                }
            }
               
        },
        modifyContents(){
            if(this.pick == 'thumb0'){
                this.isThumb =  "Y"
                this.shareThumb = this.thumbLists.y
            } else {
                this.isThumb =  "N"
                this.shareThumb = this.thumbLists.n
            }
            if(!this.title){
                alert('제목을 입력해주세요')
            } else {
                if(!this.pick){
                    alert('대표이미지를 선택해주세요')
                } else {
                    var formData = new FormData();                    
                    formData.append('memberId', this.loginInfo.memberId);
                    formData.append('title', this.title);
                    formData.append('representativeYn', this.isThumb);
                    formData.append('seq', this.modifyContent.seq);
                    axios.post('/contents/my/upd.do', formData)
                    .then(res => {
                        this.hidePopup()
                        this.$emit("modifyComplete")
                    })
                    .catch(err => {
                        console.log(err)
                    });     
                }
            }
               
        },
        deleteContents(){
            var result = confirm("삭제하시겠습니까?");
            if(result){
                var formData = new FormData();                    
                formData.append('memberId', this.loginInfo.memberId);
                formData.append('seq', this.modifyContent.seq);
                axios.post('/contents/my/del.do', formData)
                .then(res => {
                    this.hidePopup()
                    this.$emit("modifyComplete")
                })
                .catch(err => {
                    console.log(err)
                });
            }            
        },
        hidePopup() {
            this.$emit('hidePopup', 'RegistContent')
        },
        setPopup(){
            setTimeout(fun => {
                if(!this.isMobile){
                    this.$refs.popup.style.marginTop = "-" + this.$refs.popup.clientHeight / 2 + "px"
                }
                this.$refs.popup.style.opacity = 1
            }, 200)       
        },
        goShare(){
            this.$emit('goShare', {thumb:this.shareThumb, title:this.title})
        }
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
        .field {position:relative; height:48px; padding:1px 20px; border:1px solid #dbdbdb;
            input {width:100%; height:46px; padding:0; line-height:46px; border:0; background:none;}
            label {position:absolute; left:21px; top:12px; color:#aaa;}
            input:focus~label {z-index:-1;}
        }
        h2 {margin:30px 0 20px; font-size:20px; font-weight:600; line-height:1rem;}
        .choiceThumb {overflow:hidden;
            label {float:left; width:170px; text-align:center;
                img {display:block;}
                input {margin-top:10px; width:32px; height:32px; border:0; border-radius:100%; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_check.png) no-repeat 0 0;}
                input:checked {background-position-y:100%;}
                &~label {margin-left:20px;}
            }
        }
        .caution {padding-top:10px; margin-top:20px; border-top:1px solid #dbdbdb;
            li {position:relative; padding-left:12px; margin-top:10px; font-size:14px; color:#666; word-break:keep-all;
                &:before {content:""; position:absolute; left:0; top:8px; width:3px; height:3px; border-radius:3px; background:#a7a7a7;}
            }
        }
        .btn {position:absolute; left:0; bottom:0; right:0; height:60px;
            button {float:left; width:100%; height:60px; line-height:60px; color:#fff; font-weight:600; background:#9aabc0;
                &:before {content:""; display:inline-block; width:20px; height:15px; margin:-3px 10px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_check2.png) no-repeat 0 0;}
                &.delete {width:30%; color:#000; background:#dfe4eb;}
                &.delete:before {display:none;}
                &.modify {width:70%;}
                
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
            .field {height:42px; padding:1px 10px;
                input {height:40px; line-height:40px;}
                label {left:21px; top:10px;}
            }
            h2 {font-size:1.3rem;}
            .choiceThumb {
                label {width:50%; padding-right:10px;
                    &~label {padding-left:10px; padding-right:0; margin-left:0;}
                }
            }
            .caution {
                li {font-size:.9rem; line-height:1.4em;}
            }
            .btn {height:55px;
                button {height:55px; line-height:55px;}
            }
        }
    }
}
</style>