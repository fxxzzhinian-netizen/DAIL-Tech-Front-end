<template>
    <section class="user-page">
      <!-- 背景视频（全屏） -->
      <div class="bg-layer" aria-hidden="true">
        <video class="bg-video" autoplay loop muted playsinline :src="bgVideo"></video>
        <div class="bg-mask"></div>
      </div>
  
      <!-- 主体布局：左侧分选栏 + 右侧内容 -->
      <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar">
  
          <nav class="nav" aria-label="User navigation">
            <button
              class="nav-item float-in"
              :style="{ '--d': '80ms' }"
              :class="{ active: activeTab === 'profile', animate: isMounted }"
              @click="activeTab = 'profile'"
              type="button"
            >
              <span class="nav-text">Profile</span>
              <span class="nav-desc">Basic info</span>
            </button>
  
            <button
              class="nav-item float-in"
              :style="{ '--d': '140ms' }"
              :class="{ active: activeTab === 'dominate', animate: isMounted }"
              @click="activeTab = 'dominate'"
              type="button"
            >
              <span class="nav-text">Dominate</span>
              <span class="nav-desc">Permissions (reserved)</span>
            </button>
          </nav>
  
          <div class="sidebar-footer">
            <!-- Stepper（替换原 meta 卡片） -->
            <div class="stepper-wrapper float-in" :style="{ '--d': '220ms' }" :class="{ animate: isMounted }">
              <div class="stepper">
                <!-- 1: Account -->
                <div class="stepper-step is-done float-in" :style="{ '--d': '240ms' }" :class="{ animate: isMounted }">
                  <div class="stepper-circle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"></path>
                    </svg>
                  </div>
                  <div class="stepper-line"></div>
                  <div class="stepper-content">
                    <div class="stepper-title">Account</div>
                    <div class="stepper-sub">{{ displayName }}</div>
                  </div>
                </div>

                <!-- 2: Progress -->
                <div class="stepper-step is-active float-in" :style="{ '--d': '300ms' }" :class="{ animate: isMounted }">
                  <div class="stepper-circle" aria-hidden="true">2</div>
                  <div class="stepper-line"></div>
                  <div class="stepper-content">
                    <div class="stepper-title">Progress</div>
                    <div class="stepper-sub">{{ daysInDAIL }} days in DAIL</div>
                  </div>
                </div>

                <!-- 3: Dominate -->
                <div class="stepper-step is-pending float-in" :style="{ '--d': '360ms' }" :class="{ animate: isMounted }">
                  <div class="stepper-circle" aria-hidden="true">3</div>
                  <div class="stepper-content">
                    <div class="stepper-title">Dominate</div>
                    <div class="stepper-sub">Reserved</div>
                  </div>
              </div>
              </div>
            </div>
  
            <button
              class="ghost-btn float-in"
              :style="{ '--d': '420ms' }"
              :class="{ animate: isMounted }"
              type="button"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </aside>
  
        <!-- Content -->
        <main class="content">
          <!-- 顶部标题 -->
          <header class="content-header">
            <h2 class="content-title float-in" :style="{ '--d': '80ms' }" :class="{ animate: contentAnimate }">
              {{ activeTab === 'profile' ? 'PROFILE' : 'DOMINATE' }}
            </h2>
            <p class="content-subtitle float-in" :style="{ '--d': '140ms' }" :class="{ animate: contentAnimate }">
              <template v-if="activeTab === 'profile'">
                Manage your basic account information.
              </template>
              <template v-else>
                Reserved for roles, permissions, and access policies.
              </template>
            </p>
          </header>
  
          <!-- Profile -->
          <section v-if="activeTab === 'profile'" class="panel">
            <div class="profile-cards">
              <!-- Profile photo -->
              <div class="info-card float-in" :style="{ '--d': '220ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>

                <div class="info-body">
                  <div class="info-title">Profile photo</div>
                  <div class="info-sub">Add a profile photo to personalize your account.</div>
                </div>
  
                <div class="avatar" aria-label="Avatar">{{ avatarLetter }}</div>
                </div>
  
              <!-- Name -->
              <div class="info-card float-in" :style="{ '--d': '280ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>
                    <path d="M16 3h6v6"/>
                    <path d="M16 9 22 3"/>
                    <circle cx="8" cy="12" r="2"/>
                    <path d="M6 17c.6-1.6 2-2.5 4-2.5s3.4.9 4 2.5"/>
                  </svg>
                </div>
  
                <div class="info-body">
                  <div class="info-title">Name</div>
                  <div class="info-value">{{ profileName }}</div>
                </div>
                  </div>

              <!-- Birthday -->
              <div class="info-card float-in" :style="{ '--d': '340ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21H4v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/>
                    <path d="M4 17c1.2 0 1.2 1 2.4 1s1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1"/>
                    <path d="M12 2c1.2 1 .9 2.2 0 3-1-1-1.2-2.1 0-3z"/>
                    <path d="M8 10v-1"/>
                    <path d="M16 10v-1"/>
                  </svg>
                  </div>

                <div class="info-body">
                  <div class="info-title">Birthday</div>
                  <div class="info-value">{{ birthdayText }}</div>
                  </div>
                </div>

              <!-- Email -->
              <div class="info-card float-in" :style="{ '--d': '400ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <!-- mail -->
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                    <path d="m22 6-10 7L2 6"/>
                  </svg>
              </div>
  
                <div class="info-body">
                  <div class="info-title">Email</div>
                  <div class="info-value">{{ emailText }}</div>
                </div>
              </div>
            </div>
          </section>
  
          <!-- Dominate -->
          <section v-else class="panel">
            <div class="panel-inner">
              <div class="placeholder">
                <div class="placeholder-title float-in" :style="{ '--d': '200ms' }" :class="{ animate: contentAnimate }">Coming soon</div>
                <div class="placeholder-text float-in" :style="{ '--d': '260ms' }" :class="{ animate: contentAnimate }">
                  This section is reserved for permission management:
                  roles, policies, access scopes, audit logs, and admin tools.
                </div>
                <div class="placeholder-hint float-in" :style="{ '--d': '320ms' }" :class="{ animate: contentAnimate }">
                  You can keep the tab now and wire it to your RBAC / ABAC later.
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import bgVideo from '@/assets/images/section4.webm'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  const isMounted = ref(false)
  const contentAnimate = ref(false)
  const activeTab = ref('profile') // 'profile' | 'dominate'
  
  function parseApiDate(s) {
    if (!s) return null
    const hasTz = /Z$|[+-]\d{2}:\d{2}$/.test(s)
    return new Date(hasTz ? s : `${s}Z`)
  }
  
  const DAY_MS = 1000 * 60 * 60 * 24
  
  const displayName = computed(() => userStore.displayName || userStore.username || 'Guest')
  const username = computed(() => userStore.username || userStore.phone || '—')
  const createdAtRaw = computed(() => userStore.createdAt || userStore.created_at || '')
  
  const daysInDAIL = computed(() => {
    const created = parseApiDate(createdAtRaw.value)
    if (!created) return 0
    const diff = Date.now() - created.getTime()
    return Math.max(0, Math.floor(diff / DAY_MS))
  })
  
  const createdAtText = computed(() => {
    const d = parseApiDate(createdAtRaw.value)
    if (!d) return '—'
    // 统一输出为本地可读格式
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
  })

  const avatarLetter = computed(() => {
    const s = (displayName.value || 'U').trim()
    return (s[0] || 'U').toUpperCase()
  })

  const birthdayRaw = computed(() =>
    userStore.birthday || userStore.birthdate || userStore.birth_day || ''
  )
  const birthdayText = computed(() => birthdayRaw.value || 'Not set')
  
  /** Profile 表单（先做本地 + store patch，后续你接 API 再替换） */
  const profileName = ref(displayName.value)
  const profilePhone = ref(userStore.phone || '')
  const profileEmail = ref(userStore.email || '')

  const emailText = computed(() => {
    const v = (profileEmail.value || userStore.email || '').trim()
    return v || 'Not set'
  })
  
  function handleResetProfile() {
    profileName.value = displayName.value
    profilePhone.value = userStore.phone || ''
    profileEmail.value = userStore.email || ''
  }
  
  function handleSaveProfile() {
    // Pinia：允许直接 patch（即便后续你 store 扩展字段也不冲突）
    userStore.$patch({
      displayName: profileName.value?.trim() || 'Guest',
      phone: profilePhone.value?.trim() || '',
      email: profileEmail.value?.trim() || '',
    })
    alert('Saved')
  }
  
  function handleLogout() {
      userStore.logout()
    router.push('/login')
  }
  
  onMounted(() => {
    setTimeout(() => {
      isMounted.value = true
      contentAnimate.value = true
    }, 80)
  })

  watch(activeTab, async () => {
    contentAnimate.value = false
    await nextTick()
    requestAnimationFrame(() => {
      contentAnimate.value = true
    })
  })
  </script>
  
  <style scoped>
  .user-page {
    position: relative;
    min-height: 100vh;
    background: #fff;
    overflow: hidden;
  }
  
  /* 只占左侧部分 */
  .bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 34vw;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
  }
  
  .bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.05);
  }
  
  /* 让右边缘柔和过渡到白底 */
  .bg-mask {
    position: absolute;
    inset: 0;
    background:
    linear-gradient(
      to right,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0) 25%,
      rgba(255,255,255,0.25) 55%,
      rgba(255,255,255,0.65) 80%,
      rgba(255,255,255,1) 100%
    ),
    radial-gradient(
      120% 80% at 100% 50%,
      rgba(255,255,255,0.55) 0%,
      rgba(255,255,255,0) 60%
    );
  }
  
  /* 主布局 */
  .layout {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 320px 1fr;
  }
  
  /* Sidebar */
  .sidebar {
    position: relative;
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    gap: 26px;
    background: rgba(255,255,255,0.35);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(0,0,0,0.08);
  }
  
  .nav {
    margin-top: 52px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .nav-item {
    text-align: left;
    border: 1px solid rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.55);
    border-radius: 16px;
    padding: 14px 14px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease, border-color 0.2s ease;
  }
  
  .nav-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 35px rgba(0,0,0,0.10);
  }
  
  .nav-item.active {
    background: rgba(0,0,0,0.90);
    border-color: rgba(0,0,0,0.90);
    color: #fff;
  }
  
  .nav-text {
    display: block;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.06em;
  }
  
  .nav-desc {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.75;
  }
  
  .sidebar-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .ghost-btn {
    width: 100%;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.55);
    border-radius: 999px;
    padding: 12px 14px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    color: #000000;
    transition: all 0.3s ease;
  }
  
  .ghost-btn:hover,
  .ghost-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 14px 35px rgba(0,0,0,0.10);
    background: #000000;
    color: #ffffff;
    border-color: #000000;
  }
  
  /* Content */
  .content {
    padding: clamp(32px, 5vw, 72px);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .content-header {
    max-width: 920px;
  }
  
  .content-title {
    margin-left: 20px;
    margin-top: 20px;
    font-size: 28px;
    line-height: 1.2;
    color: #0f172a;
    letter-spacing: 0.06em;
    font-weight: 900;
  }
  
  .content-subtitle {
    margin-left: 20px;
    color: #6b7280;
    font-size: 14px;
    letter-spacing: 0.02em;
  }
  
  /* Panel（右侧内容卡片） */
  .panel {
    width: min(980px, 100%);
  }
  
  .panel-inner {
    border-radius: 24px;
    background: rgba(255,255,255,0.70);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08);
    padding: 28px 28px;
    box-shadow: 0 22px 60px rgba(0,0,0,0.08);
  }
  
  /* Dominate 占位 */
  .placeholder {
    padding: 6px 2px;
  }
  
  .placeholder-title {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #0f172a;
  }
  
  .placeholder-text {
    margin-top: 10px;
    font-size: 14px;
    color: #374151;
    line-height: 1.7;
  }
  
  .placeholder-hint {
    margin-top: 12px;
    font-size: 12px;
    color: #6b7280;
    letter-spacing: 0.02em;
  }
  
  .profile-cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 6px 2px;
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 18px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .info-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #111827;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(0,0,0,0.06);
    flex-shrink: 0;
  }

  .info-body {
    flex: 1;
    min-width: 0;
  }

  .info-title {
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.02em;
    color: #0f172a;
  }

  .info-sub {
    margin-top: 6px;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.45;
  }

  .info-value {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 500;
    color: gray;
    letter-spacing: 0.02em;
  }

  .avatar {
    width: 58px;
    height: 58px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 900;
    color: #fff;
    background: #1a73e8;
    flex-shrink: 0;
  }

  .info-card:hover {
    transform: translateY(-1px);
    background: rgba(0,0,0,0.90);
    border-color: rgba(0,0,0,0.90);
    color: #ffffff;
    box-shadow: 0 18px 45px rgba(0,0,0,0.16);
  }

  /* 子元素跟随反转 */
  .info-card:hover .info-title,
  .info-card:hover .info-value {
    color: #ffffff;
  }

  .info-card:hover .info-sub {
    color: rgba(255,255,255,0.72);
  }

  .info-card:hover .info-icon {
    color: #ffffff;
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.22);
  }

  /* 头像也做反转 */
  .info-card:hover .avatar {
    background: #ffffff;
    color: #000000;
  }

  /* Stepper（黑白极简） */
  .stepper-wrapper {
    margin-bottom: 12px;
    margin-left: 12px;
  }

  .stepper {
    padding: 2px 0;
  }

  .stepper-step {
    display: flex;
    gap: 12px;
    position: relative;
    margin-bottom: 16px;
  }

  .stepper-step:last-child {
    margin-bottom: 0;
  }

  .stepper-line {
    position: absolute;
    left: 15px;
    top: 34px;
    bottom: -16px;
    width: 2px;
    background: rgba(15, 23, 42, 0.12);
  }

  .stepper-step:last-child .stepper-line {
    display: none;
  }

  .stepper-circle {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  /* 三态：done / active / pending（仅黑白灰） */
  .stepper-step.is-done .stepper-circle {
    background: #0f172a;
    color: #ffffff;
  }

  .stepper-step.is-active .stepper-circle {
    background: rgba(255, 255, 255, 0.55);
    border: 2px solid #0f172a;
    color: #0f172a;
  }

  .stepper-step.is-pending .stepper-circle {
    background: rgba(255, 255, 255, 0.45);
    border: 2px solid rgba(15, 23, 42, 0.12);
    color: rgba(15, 23, 42, 0.45);
  }

  .stepper-content {
    min-width: 0;
    padding-top: 2px;
  }

  .stepper-title {
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #0f172a;
  }

  .stepper-sub {
    margin-top: 4px;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
    line-height: 1.35;
  }

  /* pending 文案更淡 */
  .stepper-step.is-pending .stepper-title {
    color: rgba(15, 23, 42, 0.55);
  }

  .stepper-step.is-pending .stepper-sub {
    color: rgba(15, 23, 42, 0.40);
  }

  /* 通用浮现：黑白风格（不抢 hover 的质感） */
  .float-in {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    filter: blur(6px);
    transition:
      opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      filter 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-delay: var(--d, 0ms);
    will-change: opacity, transform, filter;
  }

  .float-in.animate {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .float-in {
      transition: none;
    opacity: 1;
      transform: none;
      filter: none;
    }
  }
  </style>
  