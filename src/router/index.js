import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import User from '@/pages/User.vue'
import UserList from '@/pages/UserList.vue'
import ResumeSettings from '@/pages/ResumeSettings.vue'
import ResumeView from '@/pages/ResumeView.vue'
import News from '@/pages/News.vue'
import NewsDetail from '@/pages/NewsDetail.vue'
import PreviewNews from '@/pages/preview_news.vue'
import DeleteNews from '@/pages/delete_news.vue'
import About from '@/pages/About.vue'
import Team from '@/pages/Team.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/team', name: 'team', component: Team },
  { path: '/news', name: 'news', component: News },
  { path: '/news/preview', name: 'news-preview', component: PreviewNews },
  { path: '/news/delete', name: 'news-delete', component: DeleteNews },
  { path: '/news/:slug', name: 'news-detail', component: NewsDetail },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/user', name: 'user', component: User },
  { path: '/user/resume', name: 'resume-settings', component: ResumeSettings },
  { path: '/user/resume/:userId', name: 'resume-view', component: ResumeView },
  { path: '/user/list', name: 'user-list', component: UserList },
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

