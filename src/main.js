// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 全局基础样式（重置、字体、背景）
import './assets/styles/base.css'

createApp(App).use(router).mount('#app')
