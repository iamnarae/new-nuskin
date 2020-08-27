<template>
    <div class="quickSearch">
        <p class="close"><button @click="hideQuickSearch()">닫기</button></p>
        <fieldset>
            <p>
                <input type="text" v-model="srchText" placeholder="검색어를 입력해주세요">
                <button @click="goSearch(srchText)">검색</button>   
            </p>
        </fieldset>
        <PopularTag />
        <PopularList />
    </div>
</template>
<script>
import PopularList from '@/components/contents/PopularList.vue'
import PopularTag from '@/components/contents/PopularTag.vue'
import {mixin} from '@/components/mixins/mixins'

export default {
  mixins : [mixin],
  components : {
    PopularList,
    PopularTag,
  },
  data() {
      return {
          srchText: ''
      }
  },
  methods: {
    hideQuickSearch(){
        this.$emit('getControlSearch')
    }
  },
}
</script>
<style lang="scss">
.quickSearch {position:fixed; left:0; right:0; bottom:0; z-index:10; padding:60px 20px 25px; border-radius:20px 20px 0 0; background:#fff;
    .close {position:absolute; right:15px; top:15px;
        button {overflow:hidden; display:block; width:24px; height:24px; padding-left:24px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_close3.png) no-repeat 50% 50%; background-size:14px}
    }
    fieldset {
        p {position:relative; height:54px; border:2px solid #000; padding-right:50px;
            input {width:100%; height:50px; padding:0 0 0 15px; border:0; line-height:50px;}
            button {overflow:hidden; position:absolute; right:10px; top:15px; width:21px; height:20px; padding-left:21px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_search.png) no-repeat 50% 50%; background-size:100%;}
        }
    }
    .popularTag li a {font-size:1.3rem;}
    h1 {margin-top:20px;}
}
</style>