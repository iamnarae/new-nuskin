import $ from 'jquery'
import axios from 'axios'
import qs from 'qs'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const mixin = {
    data() {
        return {   
            headerHeight : 129,
            initHeight : 0,
            fixed: false,
            cdnURL: '',
            isMobile: false ,
            location: ''
        }
    },
    created() {
        //뉴스킨테스트용
        // this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
        // axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'

        //내부용
        // this.cdnURL = 'http://nuskin-cdn.efusioni.com'
        // axios.defaults.baseURL = 'http://nuskin-api.efusioni.com'

        //외부용    
        if(location.origin.indexOf('stage.nuskinkorea.co.kr') > -1) {
            this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
            axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'
        } else if(location.origin.indexOf('dev.nuskinkorea.co.kr') > -1) {
            this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
            axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'
        } else if(location.origin.indexOf('test.nuskinkorea.co.kr') > -1) {
            this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
            axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'
        } else if(location.origin.indexOf('localhost') > -1) {
             this.cdnURL = 'http://nuskin-cdn.efusioni.com'
             axios.defaults.baseURL = 'http://nuskin-api.efusioni.com'
        } else if(location.origin.indexOf('nuskin.efusioni.com') > -1) {
            this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
            axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'
        } else {
            this.cdnURL = 'https://testcontents-cdn.nuskinkorea.co.kr'
            axios.defaults.baseURL = 'https://testcontents-api.nuskinkorea.co.kr'
        }
        this.checkMobile()
        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.resize)
        
        if(this.isMain){
            this.initHeight = this.headerHeight + this.mainVisualHeight
        } else {
            this.initHeight = this.headerHeight
        }

    },
    methods: {
        checkMobile(){
            if(window.innerWidth > 768){
                this.isMobile = false
                this.headerHeight = 129
                this.mainVisualHeight = 530
            } else {
                this.isMobile = true
                this.headerHeight = 50    
                this.mainVisualHeight = window.innerWidth * 1.22
            }
        },
        resize(){
            this.checkMobile()
        },
        formatDate(date){
            return date.substring(0,10)
        },
        getToday(endDate){
            var today = new Date();
            var todayY = today.getFullYear().toString();
            var todayM = today.getMonth() + 1;
            if(todayM < 10){
                todayM = "0" + todayM
            }
            todayM = todayM.toString();
            var todayD = today.getDate().toString();
            today = todayY + todayM + todayD
            if(endDate < today){
                this.isEnd = true
            }   
        },
        handleScroll() {
            let scrollTop = window.pageYOffset
            if(scrollTop >  this.initHeight) {
                this.fixed = true
            } else {
                this.fixed = false
            }
        },
        goBack(){
            this.$router.back();
        },
        goSearch(gubun, tag) {
            axios.post('/tag/click.do', qs.stringify({gubun, tag}))
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            });
            location.href = "/app/sp/Search?searchProduct=" + tag
        },
        copyUrl(url) {
            var IE = (document.all) ? true : false;
			if (IE) {
                window.clipboardData.setData("Text", url);
                alert('해당 페이지 URL이 복사되었습니다.')
			} else {
				this.copyToClipboard(url);
                alert('해당 페이지 URL이 복사되었습니다.')
			}
		},
		copyToClipboard(val) {
			var t = document.createElement("textarea");
			document.body.appendChild(t);
			t.value = val;
            t.select();
			document.execCommand('copy');
			document.body.removeChild(t);
        }, 
        showLoading(scope, target){
            if(scope == 'inner'){
                $("." + target).append("<div class='loading inner'>로딩중..</div>").fadeIn(200)
            } else {
                $("#ch-appContents").append("<div class='loading'>로딩중..</div>").fadeIn(200)
            }
            
        },
        hideLoading(){
            $(".loading").fadeOut(100).remove()
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.resize)
    }
}