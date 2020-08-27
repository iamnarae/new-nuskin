<template>
    <div id="c-container"> 
        <div class="c-search" id="searchContents" v-if="(type == 'contents')">
            <SearchContents />
        </div>
        <div class="c-search" id="searchEvent" v-if="(type == 'event')">
            <SearchEvent />
        </div>
        <div class="c-search" id="searchLibrary" v-if="(type == 'library')">
            <SearchLibrary />
        </div>
    </div><!-- //container -->
</template>
<script>
import SearchContents from '@/views/Search/Contents.vue'
import SearchEvent from '@/views/Search/Event.vue'
import SearchLibrary from '@/views/Search/Library.vue'
export default {
    components: {
        SearchContents,
        SearchEvent,
        SearchLibrary
    },
    data() {
        return {
            type: 'contents'
        }
    },
    created () {
        this.type = this.$route.query.type;
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents #c-container {padding:0;}
</style>