<template>
  <ul class="paging">
    <li class="pgPrev"><button :disabled="!needPrevBlockAction" @click="toPage(firstPage - blockSize)"><span>이전 {{blockSize}}개</span></button></li>
    <li v-for="(n, idx) in pages" :key="idx" :class="{on:n===page}"><a @click="toPage(n)">{{n}}</a></li>
    <li class="pgNext"><button :disabled="!needNextBlockAction" @click="toPage(firstPage + blockSize)"><span>다음 {{blockSize}}개</span></button></li>
  </ul>
</template>
<script>
import Paging from "@/utils/Paging";
export default {
  mixins: [Paging],
};
</script>
<style lang="scss" scoped>
.ch-appContents {
.paging {margin:80px 0; text-align:center;
  li {display:inline-block; padding:0 15px;
    button {overflow:hidden; display:block; width:42px; height:42px; padding-left:42px; white-space:nowrap;
      &[disabled] {opacity:.4;}
    }
    a {color:#000;}    
    &.pgPrev button, &.pgNext button {background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_paging.png) no-repeat 0 0;}
    &.pgNext button {background-position-y:100%;}
    &.on a {font-weight:600;}
  }
}

@media all and (max-width:768px){
  .paging {margin:50px 0;
    li {padding:0 10px;
      button {overflow:hidden; display:block; width:36px; height:36px; padding-left:36px; }
      &.pgPrev button, &.pgNext button {background-image:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_paging_m.png); background-size:100%;}
    }
  }
}
}
</style>