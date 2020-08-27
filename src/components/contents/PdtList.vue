<template>
    <div>
        <template v-if="(singleLists)">
            <ul class="pdtList">
                <li v-for="list in singleLists" :key="list.pid"><a :href="goUrl(list.pid)" target="_blank">
                    <p class="thumb"><img :src="list.imageUrl" alt=""></p>
                    <p class="tit">{{list.productName}}</p>
                    <p class="price">회원가 <span>{{price(list.price) | localeNum}}원</span></p>
                </a></li>
            </ul>
        </template>
        <template v-if="(bundleLists)">
            <div v-for="(bundle, index) in bundleGroup" :key="bundle.packSeq" class="bundle">   
                <h3>{{bundle.title}}</h3>                
                <ul class="pdtList">
                    <li v-for="list in bundleLists[index]" :key="list.pid"><a :href="goUrl(list.pid)" target="_blank">
                        <p class="thumb"><img :src="list.imageUrl" alt=""></p>
                        <p class="tit">{{list.productName}}</p>
                        <p class="price">회원가 <span>{{price(list.price) | localeNum}}원</span></p>
                    </a></li>
                </ul>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    props : ['relationSingleProduct', 'relationBundleProduct'],
    data() {
        return {
            singleLists: [],
            bundleAllLists: [],
            bundleLists: [],
            bundleGroup: [],
            packNum: 0,
            initNum: 0
        }
    },
    created () {
        this.singleLists = this.relationSingleProduct
        this.bundleAllLists = this.relationBundleProduct
        if(this.bundleAllLists.length > 0){
            this.groupping()
        }
    },
    methods: {
        goUrl(pid){
            return "https://www.nuskinkorea.co.kr/app/sp/ProductDetail?pd_id=" + pid
        },
        groupping(){
            this.packNum = this.bundleAllLists[this.initNum].packSeq
            this.bundleGroup.push({packSeq: this.bundleAllLists[this.initNum].packSeq, title: this.bundleAllLists[this.initNum].title})
            this.getBundleList(this.bundleAllLists[this.initNum].packSeq)
            this.bundleAllLists.forEach((el, index) => {
                if(this.packNum != el.packSeq){
                    this.bundleGroupLength++
                    this.packNum = el.packSeq
                    this.bundleGroup.push({seq:el.packSeq, title:el.title})
                    this.initNum = this.initNum + 1
                    this.getBundleList(el.packSeq)
                } 
            })
        },
        getBundleList(el){
            this.bundleLists[this.initNum] = this.bundleAllLists.filter(list => {
                return list.packSeq == el
            })
        },
        price(val){
            return Math.floor(val)
        }
    },
    filters : {
        localeNum(val){
            return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}
</script>
<style lang="scss" scoped>
h3 {margin:0 0 20px 20px; font-size:22px; font-weight:600;}
.pdtList {overflow:hidden; padding:0 20px;
    li {position:relative; display:inline-block; width:33.3%; min-height:110px; padding-left:124px; vertical-align:top;
        .thumb {position:absolute; left:0; top:50%; width:110px; height:110px; margin-top:-55px;}
        .tit {font-weight:600; font-size:18px; line-height:1.4em; color:#313131;}
        .price {margin-top:15px; color:#414141; line-height:1em;
            span {color:#c66fc0;}
        }
        &:nth-child(3n)~li {margin-top:50px;}
    }
}
.bundle +.bundle {margin-top:50px;}


@media all and (max-width:768px){
    h3 {margin:0 10px 10px; font-size:1.2rem;}
    .pdtList {padding:0;
        li {display:block; width:100%; min-height:120px; padding:25px 0 25px 120px; border-bottom:1px solid #dbdbdb;
            .thumb {width:120px; height:120px; padding:10px; margin-top:-60px;}
            .tit {font-size:1rem;}
            .price {font-size:.9rem;
                span strong {font-size:1.2rem;}
            }
            &:nth-child(3n)~li {margin-top:0;}
        }
    }
}
</style>