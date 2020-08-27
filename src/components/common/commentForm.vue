<template>
    <div class="commentForm">
        <fieldset>
            <legend>댓글등록</legend>
            <h3>소중한 댓글을 입력해주세요.</h3>
            <p class="field">
                <textarea v-model="contents" @click="focusComment" placeholder="주제와 무관한 댓글, 악플은 관리자에 의해 삭제될 수 있습니다."></textarea>
                <button @click="regist">등록</button>
            </p>
        </fieldset>
    </div>
</template>
<script>
import axios from 'axios'
import {mapState, mapActions} from 'vuex'
export default {
    props: ['eventSeq'],
    data() {
        return {
            memberId : '',
            memberName : '',
            contents: '',
        }
    },
    computed: {    
        ...mapState(["isLogin", "loginInfo"]),
    },
    methods: {
        regist(){
            if(this.isLogin){
                this.memberId = this.loginInfo.memberId 
                this.memberName = this.loginInfo.memberName 
                const {eventSeq, memberId, memberName, contents} = this
                this.$emit('addComment', {eventSeq, memberId, memberName, contents})
                this.clearField()
            } else {
                alert('로그인을 해주세요')
            }
        },
        clearField() {
            this.contents = '';
        },
        focusComment(){
            if(!this.isLogin){
                alert('로그인을 해주세요')
            } else {

            }
        }
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
.commentForm {
    h3 {margin-bottom:15px; font-size:22px; line-height:28px; font-weight:600;
        &:before {content:""; display:inline-block; width:30px; height:28px; margin:-4px 8px 0 0; vertical-align:middle; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_comment.png) no-repeat 0 0;}
    }
    .field {position:relative; padding-right:165px;
        textarea {display:block; height:110px; padding:20px; border:1px solid #dbdbdb; background:#f3f3f3;}
        button {position:absolute; right:0; top:0; width:150px; height:110px; text-align:center; color:#fff; font-size:16px; line-height:110px; font-weight:600; background:#212121;}
    }
}

@media all and (max-width:768px){
    .commentForm {
        h3 {margin-bottom:30px; font-size:1.6rem;}
        .field {padding-right:0;
            textarea {height:110px;}
            button {position:static; width:100%; height:50px; font-size:1rem; line-height:50px;}
        }
    }
}
}
</style>