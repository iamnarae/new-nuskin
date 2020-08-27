<template>
  <ul class="paging">
    <li class="pgPrev"><button :disabled="!needPrevBlockAction" @click="toPage(firstPage - blockSize)"><span>이전 {{blockSize}}개</span></button></li>
    <template v-if="(pages.length>0)">
      <li v-for="(n, idx) in pages" :key="idx" :class="{on:n===page}"><a @click="toPage(n)">{{n}}</a></li>
    </template>
    <li v-else class="on"><a @click="toPage(1)">1</a></li>
    <li class="pgNext"><button :disabled="!needNextBlockAction" @click="toPage(firstPage + blockSize)"><span>다음 {{blockSize}}개</span></button></li>
  </ul>
</template>
<script>
export default {
    props: {
      page: {
        type: Number,
        default: 1
      },
      rows: Number,
      pageSize: {
        type: Number,
        default: 10
      },
      blockSize: {
        type: Number,
        default: 5
      }
    },
    computed: {
      totalPages() {
        return Math.floor((this.rows - 1) / this.pageSize) + 1;
      },
      totalBlocks() {
        return Math.floor((this.totalPages - 1) / this.blockSize) + 1;
      },
      currentBlock() {
        return Math.floor((this.page - 1) / this.blockSize) + 1;
      },
      needHeadPageAction() {
        return this.page > 1;
      },
      needEndPageAction() {
        return this.page < this.totalPages;
      },
      needPrevBlockAction() {
        return this.currentBlock > 1;
      },
      needNextBlockAction() {
        return this.currentBlock < this.totalBlocks;
      },
      needPrevPageAction() {
        return this.page > 1;
      },
      needNextPageAction() {
        return this.page < this.totalPages;
      },
      firstPage() {
        return (this.currentBlock - 1) * this.blockSize + 1;
      },
      pages() {
        let arr = [];
        for (let i = 0; i < this.blockSize; i++) {
          let n = i + this.firstPage;
  
          if (n <= this.totalPages) {
            arr.push(n);
          }
          else break;
        }
        return arr;
      }
    },
    methods: {
      toPage(n) {
        if (this.page !== n) {
          //this.$router.push({ path: this.updatePageParam(n) });
          
        }
        this.$emit('setPage', n)
      },
      updatePageParam(n) {
        let _url = this.$route.fullPath;
        if (_url.indexOf("page=") > -1) {
          const PARAM = "page";
          let reg = new RegExp("(([&|?])*" + PARAM + "=([^&]*))", "g");
          let headChar = _url[_url.search(reg)];
          _url = _url.replace(reg, headChar + PARAM + "=" + n);
        }
        else {
          _url += (_url.indexOf("?") > -1 ? "&" : "?") + "page=" + n;
        }
  
        return _url;
      }
    }
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