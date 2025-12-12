<template>
  <section class="login-page">
    <div class="panel left-panel">
      <div class="video-container">
        <video
          class="bg-video"
          autoplay
          loop
          muted
          playsinline
          :src="bgVideo"
        ></video>
        
        <div class="video-mask"></div>

        <div class="tagline">
          <!-- Redefining AI Possibilities -->
        </div>

        <!-- <div class="founded-days">
          <span class="founded-inline founded-inline--brand">DAIL Tech</span>
          <span class="founded-inline founded-inline--text">has been founded for</span>
          <span class="founded-inline founded-inline--days">
            <span class="days-number">{{ foundedDays }}</span>
            <span class="days-label">days</span>
            <span class="hours-number">{{ foundedHours }}</span>
            <span class="hours-label">Hours</span>
          </span>
        </div> -->
      </div>
    </div>

    <div class="panel right-panel">
      <div class="form-shell">
        <!-- <div class="brand">DAIL Tech</div> -->
        <h2 class="title fade-in-up" :class="{ 'animate': isMounted }">SIGN IN TO COUNTINUE</h2>
        <p class="subtitle fade-in-up" :class="{ 'animate': isMounted }">Modern. Secure. AI-native workspace.</p>

         <form class="form" @submit.prevent="handleSubmit">
           <div class="form-control fade-in-up" :class="{ 'animate': isMounted, filled: !!email }">
             <input
               v-model="email"
               type="email"
               required
               autocomplete="off"
             />
             <label>
               <span style="transition-delay:0ms">P</span>
               <span style="transition-delay:50ms">h</span>
               <span style="transition-delay:100ms">o</span>
               <span style="transition-delay:150ms">n</span>
               <span style="transition-delay:200ms">e</span>
               <span style="transition-delay:250ms">&nbsp;</span>
               <span style="transition-delay:300ms">N</span>
               <span style="transition-delay:350ms">u</span>
               <span style="transition-delay:400ms">m</span>
               <span style="transition-delay:450ms">b</span>
               <span style="transition-delay:500ms">e</span>
               <span style="transition-delay:550ms">r</span>
             </label>
           </div>

           <div class="form-control fade-in-up" :class="{ 'animate': isMounted, filled: !!password }">
             <input
               v-model="password"
               type="password"
               required
               autocomplete="off"
             />
             <label>
               <span style="transition-delay:0ms">P</span>
               <span style="transition-delay:50ms">a</span>
               <span style="transition-delay:100ms">s</span>
               <span style="transition-delay:150ms">s</span>
               <span style="transition-delay:200ms">w</span>
               <span style="transition-delay:250ms">o</span>
               <span style="transition-delay:300ms">r</span>
               <span style="transition-delay:350ms">d</span>
             </label>
           </div>

          <div class="form-row fade-in-up" :class="{ 'animate': isMounted }">
            <label class="checkbox">
              <input v-model="remember" type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" class="link-btn">Forgot password?</button>
          </div>

          <button type="submit" class="primary-btn fade-in-up" :class="{ 'animate': isMounted }">Sign In</button>
        </form>

        <div class="footer fade-in-up" :class="{ 'animate': isMounted }">
          New to DAIL?
          <router-link to="/register" class="footer-link">REGISTER NOW</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import bgVideo from '@/assets/images/section4.webm'

const email = ref('')
const password = ref('')
const remember = ref(true)
const isMounted = ref(false)

// 计算创办天数：创始日 2024年1月28日
const foundedTimestamp = new Date('2024-01-28T00:00:00').getTime()

const foundedDays = computed(() => {
  const diffTime = Date.now() - foundedTimestamp
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// 距离上次整天后的小时数（0-23）
const foundedHours = computed(() => {
  const diffTime = Date.now() - foundedTimestamp
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60)) % 24
  return diffHours
})

const handleSubmit = () => {
  console.log('Sign in', { email: email.value, password: password.value, remember: remember.value })
}

onMounted(() => {
  // 延迟触发动画，确保 DOM 渲染完成
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
</script>

<style scoped>
/* ================= 布局核心逻辑 ================= */
.login-page {
  display: grid;
  /* 1. 保持 50/50 布局，确保右侧表单位置固定在右半屏中央 */
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #ffffff; 
}

.panel {
  position: relative;
  /* 注意：这里不能加 overflow: hidden，否则左侧视频无法溢出到右侧 */
}

/* --- 左侧面板 --- */
.left-panel {
  background: #ffffff;
  display: block;
  position: relative;
  /* 2. 关键：允许内容溢出，这样视频才能跨越中线 */
  overflow: visible;
  z-index: 0; 
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  /* 3. 关键：宽度 160%。相对于左侧容器(50%)的160% = 全屏的 80% */
  /* 视频将延伸到右侧面板的下方，形成背景 */
  width: 160%;      
  height: 100%;      
  overflow: hidden; 
  border-radius: 0;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05); 
}

/* 遮罩层：处理视频边缘与白底的融合 */
.video-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  background: 
    /* 上：白色渐变 */
    /* linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 25%), */
    /* 下：白色渐变 */
    /* linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.6) 15%, rgba(255,255,255,0) 40%), */
    /* 右：关键过渡，因为视频很宽，需要较宽的渐变来柔和边缘 */
    linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0) 30%);
}

.tagline {
  position: absolute;
  top: 64px;
  left: 48px;
  bottom: auto;
  font-size: 40px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 800;
  z-index: 2;
  color: #111827; 
}

.founded-days {
  position: absolute;
  top: 28%;
  left: 40%;
  transform: translate(-50%, -50%);
  z-index: 2;

  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;

  line-height: 1.2;
  letter-spacing: 0.04em;
  color: #020617;

  background: none;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
}

.founded-inline {
  font-weight: 700;
}

.founded-inline--brand {
  font-size: 72px;
  font-weight: 800;
}

.founded-inline--text {
  font-size: 28px;
  font-weight: 500;
  margin-left: 12px;
}

.founded-inline--days {
  font-size: 44px;
  font-weight: 800;
  display: block;
  width: 100%;
  margin-top: 32px;
  flex-wrap: wrap;
}

.days-number {
  font-size: 124px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.days-label {
  margin-left: 6px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.hours-number {
  margin-left: 32px;
  font-size: 67px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.hours-label {
  margin-left: 12px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.founded-line--c {
  font-size: 44px;
  font-weight: 800;
}


/* --- 右侧面板 --- */
.right-panel {
  /* 4. 关键：背景透明，否则白底会挡住延伸过来的视频 */
  background: transparent; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(32px, 6vw, 72px);
  position: relative;
  z-index: 1; /* 保证表单浮在视频之上 */
}

.form-shell {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  /* 可选：如果视频背景太花，可以开启下面的毛玻璃效果让表单更清晰 */
  /* background: rgba(255,255,255,0.7); */
  /* backdrop-filter: blur(12px); */
  /* padding: 40px; */
  /* border-radius: 24px; */
  /* border: 1px solid rgba(255,255,255,0.5); */
}

/* ================= 动画样式 ================= */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  will-change: opacity, transform;
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-in-up.animate {
  opacity: 1;
  transform: translateY(0);
}

/* 按逻辑顺序设置延迟时间：从上到下，从左到右 */
.title.fade-in-up {
  transition-delay: 0s;
}

.subtitle.fade-in-up {
  transition-delay: 0.2s;
}

.form-control.fade-in-up:nth-of-type(1) {
  transition-delay: 0.4s;
}

.form-control.fade-in-up:nth-of-type(2) {
  transition-delay: 0.6s;
}

.form-row.fade-in-up {
  transition-delay: 0.8s;
}

.primary-btn.fade-in-up {
  transition-delay: 1.0s;
  filter: blur(8px);
  transform: translateY(0);
  opacity: 0.3;
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.primary-btn.fade-in-up.animate {
  filter: blur(0);
  opacity: 1;
}

.footer.fade-in-up {
  transition-delay: 1.2s;
}

/* ================= 表单样式 ================= */
.brand {
  font-weight: 800;
  letter-spacing: 0.08em;
  font-size: 13px;
  text-transform: uppercase;
  color: #111827;
}

.title {
  font-size: 28px;
  line-height: 1.2;
  color: #0f172a;
  transform: translateY(-10px);
}

.title.fade-in-up.animate {
  transform: translateY(-10px);
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  transform: translateY(-10px);
}

.subtitle.fade-in-up.animate {
  transform: translateY(-10px);
}

.form {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 增加一点间距适应浮动标签 */
}

  /* --- 分段动画标签输入框 --- */
  .form-control {
    position: relative;
    margin: 4px 0 16px;
    width: 100%;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px #000 solid;
    display: block;
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    color: #000;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: #1a73e8;
  }

  .form-control label {
    position: absolute;
    top: 12px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 16px;
    min-width: 5px;
    color: #000;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:valid + label span {
    color: #1a73e8;
    transform: translateY(-24px);
  }

  /* 内容非空时保持选中态 */
  .form-control.filled input {
    border-bottom-color: #1a73e8;
  }

  .form-control.filled label span {
    color: #1a73e8;
    transform: translateY(-24px);
  }

/* --- 其他表单元素 --- */
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.checkbox input {
  accent-color: #000;
  width: 16px;
  height: 16px;
}

.link-btn {
  border: none;
  background: none;
  color: #111827;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 8px;
}

.link-btn:hover {
  text-decoration: underline;
}

.primary-btn {
  margin-top: 4px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.15);
  background: #0a0a0a;
}

.primary-btn:active {
  transform: translateY(0);
}

.footer {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
}

.footer-link {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
  margin-left: 12px;
}

.footer-link:hover {
  color: #9333ea;
  text-decoration: underline;
  text-decoration-color: #9333ea;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  transform: translateX(2px);
}

/* ================= 响应式 ================= */
@media (max-width: 1100px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .left-panel {
    height: 300px; 
    min-height: auto;
    padding: 0;
    overflow: hidden; /* 移动端恢复隐藏，防止撑破屏幕 */
  }
  
  .video-container {
    width: 100%; /* 移动端恢复 100% 宽度 */
    height: 100%; 
  }
  
  .right-panel {
    background: #fff; /* 移动端恢复白底，防止字看不清 */
  }

  .video-mask {
     background: 
      linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 25%),
      linear-gradient(to top, #ffffff 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 50%);
  }

  .tagline {
    font-size: 32px;
    top: 40px;
    left: 24px;
  }
}

@media (max-width: 640px) {
  .right-panel {
    padding: 32px 24px;
  }
  .title { font-size: 24px; }
  .subtitle { font-size: 13px; }
}
</style>