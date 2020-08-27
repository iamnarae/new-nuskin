import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import store from '../store/index'

Vue.use(VueRouter)

const onlyAuthUser = (to, from, next) =>{
  if(gVueAroConfig.loginInfo.memberId == '') {
    alert('로그인을 해주세요')
    location.href="/app/mo/Login"
  } else {
    next()
  }
}

const routes = [
  {
    path: '/app/ch/',
    name: 'Index',
    component: Index

  },
  {
    path: '/app/ch/contents',
    name: 'Contents',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contents/List.vue')
  },
  {
    path: '/app/ch/contents/view',
    name: 'ContentsView',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contents/View.vue')
  },
  {
    path: '/app/ev/event',
    name: 'Event',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/List.vue')
  },
  {
    path: '/app/ev/event/view',
    //redirect: '/event',
    name: 'EventView',
    //beforeEnter: eventViewUpdate,
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/View.vue')
  },
  {
    path: '/app/ev/past',
    name: 'Past',
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/Past/List.vue')
  },
  {
    path: '/app/ev/past/view',
    name: 'PastView',
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/Past/View.vue')
  },
  { 
    path: '/app/ev/winner',
    name: 'Winner',
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/Winner/List.vue')
  },
  {
    path: '/app/ev/winner/view',
    name: 'WinnerView',
    component: () => import(/* webpackChunkName: "about" */ '../views/Event/Winner/View.vue')
  },
  { 
    path: '/app/ch/library',
    name: 'Library',
    component: () => import(/* webpackChunkName: "about" */ '../views/Library/List.vue')
  },
  { 
    path: '/app/ch/library/view',
    name: 'LibraryView',
    component: () => import(/* webpackChunkName: "about" */ '../views/Library/View.vue')
  },
  { 
    path: '/app/ch/myScrap',
    name: 'MyScrap',
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "about" */ '../views/My/Scrap.vue')
  },
  { 
    path: '/app/ch/myView',
    name: 'MyView',
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "about" */ '../views/My/View.vue')
  },
  { 
    path: '/app/ch/myPublish',
    name: 'MyPublish',
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "about" */ '../views/My/Publish/List.vue')
  },
  { 
    path: '/app/ch/myPublish/detail',
    name: 'MyPublishDetail',
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "about" */ '../views/My/Publish/DetailList.vue')
  },
  {
    path: '/app/ch/contents/preview',
    name: 'Preview',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contents/Preview.vue')
  },
  {
    path: '/app/ch/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '../views/Search/Search.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: '/',
  routes,
  scrollBehavior (to, from, savedPosition){
    if(savedPosition) {
      return savedPosition
    } else {
      return {x:0, y:0}
    }
  }
})


export default router
