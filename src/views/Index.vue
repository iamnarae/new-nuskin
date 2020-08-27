<template>
  <div id="c-wrapper" :class="{fixed:fixed}">
        <MainVisual :isMain="isMain" />
        <Gnb :isMain="isMain" :Fixed="fixed" />
      <div id="c-container">
        <section class="popular">
          <PopularList :isMain="isMain" />
          <PopularTag :isMain="isMain" :gubun="tagGubun" />
        </section>
        <section class="latest">
          <h1>LATEST CONTENTS</h1>
          <article class="listArea">
              <PromotionList @totalCount="promoCount" :type="type" :isMain="isMain" v-if="isPromo" />
              <ContentsList :isPromo="isPromo" :pageSize="pageSize" :type="type" :isMain="isMain" />
          </article>
        </section>
    </div><!-- //container -->
  </div><!-- //wrapper -->
</template>
<script>
import axios from 'axios'
import {eventBus} from '@/main'
import Gnb from '@/components/global/Gnb.vue'
import MainVisual from '@/components/contents/MainVisual.vue'
import PopularList from '@/components/contents/PopularList.vue'
import PopularTag from '@/components/contents/PopularTag.vue'
import PromotionList from '@/components/contents/PromotionList.vue'
import ContentsList from '@/components/contents/ContentsList.vue'
import {mixin} from '@/components/mixins/mixins'

export default {
  mixins : [mixin],
  components : {
    Gnb,
    MainVisual,
    PopularList,
    PopularTag,
    PromotionList,
    ContentsList
  },
  data() {
      return {
          type: '',
          cateSeq: '', 
          listType: "",
          pageSize: 18,
          promoTotal: 0,
          isMain: true,
          tagGubun : '001',
          isPromo : true,
      }
  },
  methods: {
    promoCount(count){
      this.promoTotal = count
      if(count > 0) {
          this.isPromo = true
      } else {
          this.isPromo = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#c-container {
  section {
    h1 {margin:100px 0 50px; font-size:22px; font-weight:600;}
  }
}
.listArea {position:relative;}

@media all and (max-width:768px){
  #c-container {
    section {
      h1 {margin:50px 0 20px; font-size:1.3rem;}
    }
  }
}
</style>