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
        default: 10
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
          this.$router.push({ path: this.updatePageParam(n) });
        }
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