<template>
    <div class="c-quick">
        <div class="btnTop" :class="{show:scrollY > 0}"><button @click="goTop(); return false"><canvas id="canvas" width="50" height="50"></canvas><em>TOP</em></button></div>
    </div>
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
// import BackToTop from 'vue-backtotop'
// Vue.use(BackToTop)
export default {
    components: {
    //    BackToTop
    },
    data(){
        return{
            scrollY: 0,
            end: 0
        }
    },
    methods:{
        handleScrollTop() {
            this.scrollY = window.scrollY
            this.end = window.scrollY * 360 / (document.documentElement.scrollHeight - window.innerHeight);
			this.drawScreen(this.end);
        },
        drawScreen(end){
            const theCanvas = document.getElementById("canvas")
            const context = theCanvas.getContext("2d")
            context.clearRect(0,0,50,50);
            context.beginPath();
            context.strokeStyle = "#3f94bb";
            context.lineWidth = 2;
            context.arc(25,25,24,(Math.PI/180)*(0-90), (Math.PI/180)*(end-90), false);
			context.stroke();
			context.closePath();
        },
        goTop(){
            $("html, body").stop().animate({scrollTop:0}, 200);
        }
    },
    created(){
        window.addEventListener('scroll', this.handleScrollTop)
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handhandleScrollTopleScroll)
    }
}
</script>
<style lang="scss" scoped>
.c-quick {
    .btnTop {opacity:0; position:fixed; right:30px; bottom:100px; z-index:50; width:50px; height:50px; border-radius:50%; background:rgba(255,255,255,.5);
        button {display:block; right:initial !important; bottom:initial !important; width:50px; height:50px; border:1px solid #d7d7d7; border-radius:50%; text-align:center; 
            canvas {position:absolute; left:0; top:0; z-index:1;}
            em {position:relative; z-index:2; width:50px; height:50px; overflow:hidden; display:block; text-indent:100%; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/common/ico_top.png) no-repeat 50% 50%;}
        }
        &.show {opacity:1; transition:opacity .2s;}
        &.noFix {position:absolute;}
    }
}

@media all and (max-width:768px){
    .c-quick {
        .btnTop {bottom:80px;}
    }
}

</style>