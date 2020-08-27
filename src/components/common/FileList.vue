<template>
    <ul class="fileList" v-if="(files.length > 0)">
        <li v-for="list in files" :key="list.seq"><button @click="download(list)">
            <p class="tit">{{list.fileOriginalName}}</p>
        </button></li>
    </ul>
</template>
<script>
import axios from 'axios'
import {mixin} from '@/components/mixins/mixins'

export default {
    mixins : [mixin],
   props: {
      files: {
        type: Array,
        default: []
      }
    },
    methods: {
        download(file) {        
            this.showLoading('inner', 'fileList') 
            axios({
                url: this.cdnURL + file.file,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {                
                this.hideLoading()
                const blob = new Blob([response.data], {type: response.data.type});
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const contentDisposition = response.headers['content-disposition'];
                let fileName = file.fileOriginalName;
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (fileNameMatch.length === 2)
                        fileName = fileNameMatch[1];
                }
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }); 
        }
    },
}
</script>
<style lang="scss" scoped>
.ch-appContents {
.fileList {position:relative; overflow:hidden; padding:0 20px 80px;
    li {float:left; width:50%; padding-right:10px;
        &:nth-child(2n) {padding-left:10px; padding-right:0;}
        &:nth-child(2)~li {margin-top:20px;}
        button {position:relative; display:block; width:100%; padding:25px 120px 25px 30px; text-align:left; background:#f3f3f3;
            .tit {font-size:20px;}
            &:after {content:""; overflow:hidden; position:absolute; right:30px; top:50%; width:60px; height:60px; margin-top:-30px; background:url(https://resource2018.nuskinkorea.co.kr/ContentsImages/static/images/btn/btn_down.png) no-repeat 0 0;}
            &:hover {
                .tit {color:#c280e4;}
                &:after {background-position-y:100%;}
            }
        }            
    }
}
@media all and (max-width:768px){
    .fileList {padding:0 10px;
        li {float:none; width:100%; padding-right:0; margin-top:10px;
            &:nth-child(2n) {padding-left:0;}
            &:nth-child(2)~li {margin-top:10px;}
            button {padding:15px 70px 15px 15px;
                .tit {font-size:1.2rem;}
                &:after {right:15px; width:36px; height:36px; margin-top:-18px; background-size:100%;}
            }            
        }
    }
}
}
</style>