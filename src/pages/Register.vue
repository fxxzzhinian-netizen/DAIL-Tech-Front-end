<template>
  <section class="register-page">
    <div class="panel left-panel">
      <div class="form-shell">
        <h2 class="title slide-in-right" :class="{ 'animate': isMounted }">CREATE ACCOUNT</h2>
        <p class="subtitle slide-in-right" :class="{ 'animate': isMounted }">Join the AI-native workspace today.</p>

        <form class="form" @submit.prevent="handleRegister">
          
          <div class="form-control scale-fade" :class="{ 'animate': isMounted, filled: !!username }">
            <input
              v-model="username"
              type="text"
              required
              autocomplete="off"
            />
            <label>
              <span style="transition-delay:0ms">U</span>
              <span style="transition-delay:50ms">s</span>
              <span style="transition-delay:100ms">e</span>
              <span style="transition-delay:150ms">r</span>
              <span style="transition-delay:200ms">n</span>
              <span style="transition-delay:250ms">a</span>
              <span style="transition-delay:300ms">m</span>
              <span style="transition-delay:350ms">e</span>
            </label>
          </div>

          <div class="phone-group scale-fade" :class="{ 'animate': isMounted }">
            <div class="form-control" :class="{ filled: !!phone }">
              <input
                v-model="phone"
                type="tel"
                required
                autocomplete="off"
              />
              <label>
                <span style="transition-delay:0ms">P</span>
                <span style="transition-delay:50ms">h</span>
                <span style="transition-delay:100ms">o</span>
                <span style="transition-delay:150ms">n</span>
                <span style="transition-delay:200ms">e</span>
              </label>
            </div>
            <button 
              type="button" 
              class="send-code-btn"
              :class="{ counting: isCounting }"
              :disabled="isCounting"
              @click="sendCode"
            >
              {{ isCounting ? `${count}s` : 'Send Code' }}
            </button>
          </div>

          <div class="form-control scale-fade" :class="{ 'animate': isMounted, filled: !!code }">
            <input
              v-model="code"
              type="text"
              required
              autocomplete="off"
            />
            <label>
              <span style="transition-delay:0ms">C</span>
              <span style="transition-delay:50ms">o</span>
              <span style="transition-delay:100ms">d</span>
              <span style="transition-delay:150ms">e</span>
            </label>
          </div>

          <div class="form-control scale-fade" :class="{ 'animate': isMounted, filled: !!password }">
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

          <div class="form-control scale-fade" :class="{ 'animate': isMounted, filled: !!confirmPassword }">
            <input
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="off"
            />
            <label>
              <span style="transition-delay:0ms">C</span>
              <span style="transition-delay:50ms">o</span>
              <span style="transition-delay:100ms">n</span>
              <span style="transition-delay:150ms">f</span>
              <span style="transition-delay:200ms">i</span>
              <span style="transition-delay:250ms">r</span>
              <span style="transition-delay:300ms">m</span>
            </label>
          </div>

          <button type="submit" class="primary-btn blur-fade" :class="{ 'animate': isMounted }">Sign Up</button>
        </form>

        <div class="footer slide-in-left" :class="{ 'animate': isMounted }">
          Already have an account? <router-link to="/login" class="footer-link">LOGIN HERE</router-link>
        </div>
      </div>
    </div>

    <div class="panel right-panel">
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// 假设视频路径一致
import bgVideo from '@/assets/images/section4.webm'

const username = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const code = ref('')
const isMounted = ref(false)

// 倒计时逻辑
const isCounting = ref(false)
const count = ref(6)
let timer = null

const sendCode = () => {
  if (!phone.value) {
    alert('Please enter phone number first')
    return
  }
  
  // 模拟发送
  console.log('Sending code to', phone.value)
  
  isCounting.value = true
  count.value = 60
  
  timer = setInterval(() => {
    count.value--
    if (count.value <= 0) {
      clearInterval(timer)
      isCounting.value = false
      count.value = 60
    }
  }, 1000)
}

// 创办时间逻辑 (保持不变)
const foundedTimestamp = new Date('2024-01-28T00:00:00').getTime()
const foundedDays = computed(() => {
  const diffTime = Date.now() - foundedTimestamp
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})
const foundedHours = computed(() => {
  const diffTime = Date.now() - foundedTimestamp
  return Math.floor(diffTime / (1000 * 60 * 60)) % 24
})

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }
  console.log('Register', { 
    username: username.value, 
    phone: phone.value, 
    code: code.value,
    password: password.value 
  })
}

onMounted(() => {
  // 延迟触发动画，确保 DOM 渲染完成
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
</script>

<style scoped>
/* ================= 布局翻转核心逻辑 ================= */
.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #ffffff; 
}

.panel {
  position: relative;
}

/* --- 左侧面板 (现在放表单) --- */
.left-panel {
  /* 关键：背景透明，允许下方（从右侧延伸过来）的视频显示 */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(32px, 6vw, 72px);
  position: relative;
  z-index: 1; /* 保证表单浮在视频之上 */
}

/* --- 右侧面板 (现在放视频) --- */
.right-panel {
  display: block;
  position: relative;
  /* 允许视频向左溢出 */
  overflow: visible; 
  z-index: 0;
}

.video-container {
  position: absolute;
  top: 0;
  /* 关键：从右向左延伸 */
  /* Login页面是 left: 0, width: 160% (向右延) */
  /* 这里我们要向左延，所以设置 left 为负值 */
  left: -60%; 
  width: 160%;      
  height: 100%;      
  overflow: hidden; 
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05); 
}

/* 遮罩层：方向改为向右渐变 (融合左侧白底) */
.video-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0) 30%);
}

/* --- 覆盖视频上的文字位置 --- */
/* 因为视频现在在右侧，文字布局可能需要微调，或者保持绝对定位相对原点 */
.tagline {
  position: absolute;
  top: 64px;
  /* 在右侧面板中，可能希望文字靠右一些，或者保持原样 */
  right: 48px; 
  left: auto;
  font-size: 40px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 800;
  z-index: 2;
  color: #111827; 
  text-align: right;
}

.founded-days {
  position: absolute;
  top: 28%;
  /* 调整中心点位置，适应右侧布局 */
  left: 60%; 
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  line-height: 1.2;
  color: #020617;
}

/* 复用 Login 的文字样式 */
.founded-inline { font-weight: 700; }
.founded-inline--brand { font-size: 72px; font-weight: 800; }
.founded-inline--text { font-size: 28px; font-weight: 500; margin-left: 12px; }
.founded-inline--days { font-size: 44px; font-weight: 800; display: block; width: 100%; margin-top: 32px; }
.days-number { font-size: 124px; font-weight: 800; }
.days-label { margin-left: 6px; font-size: 24px; font-weight: 600; }
.hours-number { margin-left: 32px; font-size: 67px; font-weight: 700; }
.hours-label { margin-left: 12px; font-size: 20px; font-weight: 600; }

/* ================= 动画样式（与 Login.vue 区分） ================= */
/* 从右侧滑入 */
.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  will-change: opacity, transform;
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-in-right.animate {
  opacity: 1;
  transform: translateX(0);
}

.title.slide-in-right {
  transition-delay: 0s;
}

.subtitle.slide-in-right {
  transition-delay: 0.2s;
}

.title.slide-in-right.animate {
  transform: translateX(0) translateY(-10px);
}

.subtitle.slide-in-right.animate {
  transform: translateX(0) translateY(-10px);
}

/* 缩放+淡入 */
.scale-fade {
  opacity: 0;
  transform: scale(0.9);
  will-change: opacity, transform;
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.scale-fade.animate {
  opacity: 1;
  transform: scale(1);
}

.form-control.scale-fade:nth-of-type(1) {
  transition-delay: 0.4s;
}

.phone-group.scale-fade {
  transition-delay: 0.5s;
}

.form-control.scale-fade:nth-of-type(3) {
  transition-delay: 0.6s;
}

.form-control.scale-fade:nth-of-type(4) {
  transition-delay: 0.7s;
}

.form-control.scale-fade:nth-of-type(5) {
  transition-delay: 0.8s;
}

/* 模糊到清晰 */
.blur-fade {
  opacity: 0.3;
  filter: blur(8px);
  transform: translateY(0);
  will-change: opacity, filter;
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.blur-fade.animate {
  opacity: 1;
  filter: blur(0);
}

.primary-btn.blur-fade {
  transition-delay: 0.9s;
}

/* 从左侧滑入 */
.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  will-change: opacity, transform;
  transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-in-left.animate {
  opacity: 1;
  transform: translateX(0);
}

.footer.slide-in-left {
  transition-delay: 1.1s;
}

/* ================= 表单样式 ================= */
.form-shell {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 28px;
  line-height: 1.2;
  color: #0f172a;
  transform: translateY(-10px);
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  transform: translateY(-10px);
}

.form {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 复用 input 动画逻辑 */
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
.form-control.filled input { border-bottom-color: #1a73e8; }
.form-control.filled label span { color: #1a73e8; transform: translateY(-24px); }

/* --- 手机号 + 验证码按钮 特殊布局 --- */
.phone-group {
  display: flex;
  align-items: baseline; /* 底部对齐 */
  gap: 12px;
}

.phone-group .form-control {
  flex: 1; /* 输入框占据剩余空间 */
}

.send-code-btn {
  /* 复用 Main.vue 中 Try DAIL 按钮样式 */
  white-space: nowrap;
  border-radius: 0.625em;
  padding: 12px 28px;
  min-width: 140px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* transition 保留点击时的平滑过渡 */
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease,
    transform 0.18s ease, border-color 0.18s ease;
  background: black;
  color: white;
  border: none;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: none;
  height: auto;
  margin-bottom: 0;
}

/* 只有按下(active)或倒计时(counting)时文字变黑 */
.send-code-btn:active:not(:disabled),
.send-code-btn.counting {
  color: black;
  transform: none;
  box-shadow: none;
}

/* 只有按下(active)或倒计时(counting)时，白色背景滑入 */
.send-code-btn:active:not(:disabled):after,
.send-code-btn.counting:after {
  transform: skewX(-45deg) scale(1, 1);
}

/* 背景遮罩层基础样式 */
.send-code-btn:after {
  content: "";
  background: white;
  position: absolute;
  z-index: -1;
  left: -20%;
  right: -20%;
  top: 0;
  bottom: 0;
  transform: skewX(-45deg) scale(0, 1);
  transition: all 0.5s;
}

/* 禁用状态 */
.send-code-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  background: #4b5563;
  opacity: 0.6;
}

/* 倒计时期间禁用状态的特殊样式 */
.send-code-btn.counting:disabled {
  color: black;
  background: black;
  opacity: 1;
  cursor: not-allowed;
}

.send-code-btn:disabled:after {
  display: none;
}

.send-code-btn.counting:disabled:after {
  display: block;
  transform: skewX(-45deg) scale(1, 1);
}

/* 主按钮 */
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

.footer {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
  text-align: left; 
}

.footer-link {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.footer-link:hover {
  color: #9333ea;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

/* ================= 响应式 ================= */
@media (max-width: 1100px) {
  .register-page {
    grid-template-columns: 1fr;
    /* 移动端通常注册表单较长，建议由内容撑开 */
  }

  /* 移动端布局：视频在上，表单在下 */
  .right-panel {
    height: 200px; /* 视频高度 */
    order: -1; /* 让右侧面板排到最前面（上面） */
    overflow: hidden;
  }
  
  .left-panel {
    background: #fff;
    padding: 32px 24px;
  }

  .video-container {
    width: 100%;
    left: 0;
    height: 100%;
  }

  /* 移动端遮罩改回上下渐变 */
  .video-mask {
    background: 
      linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 25%),
      linear-gradient(to top, #ffffff 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 50%);
  }
  
  .tagline { display: none; } /* 移动端空间小，可选隐藏大标题 */
  .founded-days { display: none; }
}
</style>