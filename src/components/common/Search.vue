<template>
    <article class="srch">
        <p>
            <input type="text" placeholder="검색어를 입력해주세요." v-model="searchText">
            <button @click="getSearch">검색</button>
        </p>
    </article>
</template>
<script>
export default {
    data() {
        return {
            searchText : ''
        }
    },
    methods: {
        getSearch() {
           this.$emit('search', this.searchText)
           this.searchText = '';
        }
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
.srch p {position:relative; width:500px; height:60px; padding:15px 80px 15px 30px; margin:0 auto; background:#f3f3f3;
    input {width:100%; height:30px; line-height:30px; border:0; background:transparent;}
    button {position:absolute; right:30px; top:50%; overflow:hidden; width:25px; height:25px; padding-left:25px; margin-top:-13px; white-space:nowrap; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_srch.png) no-repeat 0 0;}
}

@media all and (max-width:768px){
    .srch p {width:100%; height:52px; padding:0 50px 0 20px; border:1px solid #dbdbdb;
        input {height:50px; line-height:50px;}
        button {right:15px; width:20px; height:20px; padding-left:20px; margin-top:-10px; background-size:100%;}
    }
}
}
</style>