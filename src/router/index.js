import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import User from '@/pages/User.vue'
import News from '@/pages/News.vue'
import NewsDetail from '@/pages/NewsDetail.vue'
import PreviewNews from '@/pages/preview_news.vue'
import DeleteNews from '@/pages/delete_news.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/news', name: 'news', component: News },
  { path: '/news/preview', name: 'news-preview', component: PreviewNews },
  { path: '/news/delete', name: 'news-delete', component: DeleteNews },
  { path: '/news/:slug', name: 'news-detail', component: NewsDetail },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/user', name: 'user', component: User },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

