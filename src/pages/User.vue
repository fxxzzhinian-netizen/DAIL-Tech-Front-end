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
  
          <nav class="nav" :aria-label="t('user.navAria')">
            <button
              class="nav-item float-in"
              :style="{ '--d': '80ms' }"
              :class="{ active: activeTab === 'profile', animate: isMounted }"
              @click="activeTab = 'profile'"
              type="button"
            >
              <span class="nav-text">{{ t('user.navProfile') }}</span>
              <span class="nav-desc">{{ t('user.navProfileDesc') }}</span>
            </button>
  
            <button
              class="nav-item float-in"
              :style="{ '--d': '140ms' }"
              :class="{ active: activeTab === 'dominate', animate: isMounted }"
              @click="activeTab = 'dominate'"
              type="button"
            >
              <span class="nav-text">{{ t('user.navDominate') }}</span>
              <span class="nav-desc">{{ t('user.navDominateDesc') }}</span>
            </button>

            <button
              class="nav-item float-in"
              :style="{ '--d': '200ms' }"
              :class="{ active: activeTab === 'news', animate: isMounted }"
              type="button"
              :disabled="!canPublishNews"
              :title="!canPublishNews ? t('user.newsNoAccessText') : ''"
              @click="activeTab = 'news'"
            >
              <span class="nav-text">{{ t('user.navNews') }}</span>
              <span class="nav-desc">{{ t('user.navNewsDesc') }}</span>
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
                    <div class="stepper-title">{{ t('user.stepAccount') }}</div>
                    <div class="stepper-sub">{{ displayName }}</div>
                  </div>
                </div>

                <!-- 2: Progress -->
                <div class="stepper-step is-active float-in" :style="{ '--d': '300ms' }" :class="{ animate: isMounted }">
                  <div class="stepper-circle" aria-hidden="true">2</div>
                  <div class="stepper-line"></div>
                  <div class="stepper-content">
                    <div class="stepper-title">{{ t('user.stepProgress') }}</div>
                    <div class="stepper-sub">{{ t('user.progressDaysInDail', { days: daysInDAIL }) }}</div>
                  </div>
                </div>

                <!-- 3: Dominate -->
                <div class="stepper-step is-pending float-in" :style="{ '--d': '360ms' }" :class="{ animate: isMounted }">
                  <div class="stepper-circle" aria-hidden="true">3</div>
                  <div class="stepper-content">
                    <div class="stepper-title">{{ t('user.stepDominate') }}</div>
                    <div class="stepper-sub">{{ t('user.reserved') }}</div>
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
              {{ t('user.logout') }}
            </button>
          </div>
        </aside>
  
        <!-- Content -->
        <main class="content">
          <!-- 顶部标题 -->
          <header class="content-header">
            <h2 class="content-title float-in" :style="{ '--d': '80ms' }" :class="{ animate: contentAnimate }">
              {{ headerText }}
            </h2>
            <p class="content-subtitle float-in" :style="{ '--d': '140ms' }" :class="{ animate: contentAnimate }">
              {{ subtitleText }}
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
                  <div class="info-title">{{ t('user.profilePhoto') }}</div>
                  <div class="info-sub">{{ t('user.profilePhotoDesc') }}</div>
                </div>
  
                <div class="avatar" :aria-label="t('user.avatarAria')">{{ avatarLetter }}</div>
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
                  <div class="info-title">{{ t('user.name') }}</div>
                  <div class="info-value">{{ profileName }}</div>
                </div>
                  </div>

              <!-- Created At (read-only) -->
              <div class="info-card float-in" :style="{ '--d': '310ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <!-- clock -->
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 2"></path>
                  </svg>
                </div>

                <div class="info-body">
                  <div class="info-title">{{ t('user.createdAt') }}</div>
                  <div class="info-value">{{ createdAtText }}</div>
                </div>
              </div>

              <!-- Updated At (read-only) -->
              <div class="info-card float-in" :style="{ '--d': '325ms' }" :class="{ animate: contentAnimate }">
                <div class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 1024 1024" width="22" height="22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M794.7 312.7c-15.6-58.1-49.2-110.5-95.9-149.3C646.5 119.9 580.1 96 512 96c-68.1 0-134.5 23.9-186.8 67.4-46.7 38.8-80.2 91.2-95.8 149.3-92 33.5-154.7 121.5-154.7 220.6 0 62.5 24.5 121.4 68.9 165.8C188 743.5 246.9 768 309.4 768H352v-64h-42.6c-94.1 0-170.7-76.6-170.7-170.7 0-76.8 51.9-144.5 126.1-164.7l19.1-5.2 3.8-19.5C308.8 237.3 403.1 160 512 160c108.8 0 203.2 77.4 224.3 183.9l3.9 19.4 19.1 5.2c74.2 20.2 126.1 87.9 126.1 164.7 0 94.1-76.6 170.7-170.7 170.7H549.5l77.2-77.3-45.2-45.2-109.3 109.3L427 736l45.2 45.3 118.7 118.6 45.2-45.3-86.6-86.6h165.2c62.5 0 121.4-24.5 165.8-68.9s68.9-103.3 68.9-165.8c0-99-62.7-187.1-154.7-220.6z" />
                  </svg>
                </div>

                <div class="info-body">
                  <div class="info-title">{{ t('user.updatedAt') }}</div>
                  <div class="info-value">{{ updatedAtText }}</div>
                </div>
              </div>

              <!-- Birthday -->
              <button
                class="info-card info-card--action float-in"
                :style="{ '--d': '340ms' }"
                :class="{ animate: contentAnimate }"
                type="button"
                @click="openEdit('birthday')"
                :aria-label="birthdayRaw ? t('user.editBirthdayAria') : t('user.setBirthdayAria')"
              >
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
                  <div class="info-title">{{ t('user.birthday') }}</div>
                  <div class="info-value">{{ birthdayText }}</div>
                  </div>
                <div class="info-action" aria-hidden="true">
                  <span class="info-action-badge" :title="birthdayRaw ? t('user.edit') : t('user.set')">
                    <!-- edit-2 (Feather) -->
                    <svg v-if="birthdayRaw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 3 21l.5-4.5L17 3z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                    <!-- plus-circle (Feather) -->
                    <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                  </span>
                </div>
              </button>

              <!-- Email -->
              <button
                class="info-card info-card--action float-in"
                :style="{ '--d': '400ms' }"
                :class="{ animate: contentAnimate }"
                type="button"
                @click="openEdit('email')"
                :aria-label="(profileEmail || userStore.email) ? t('user.editEmailAria') : t('user.setEmailAria')"
              >
                <div class="info-icon" aria-hidden="true">
                  <!-- mail -->
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                    <path d="m22 6-10 7L2 6"/>
                  </svg>
              </div>
  
                <div class="info-body">
                  <div class="info-title">{{ t('user.email') }}</div>
                  <div class="info-value">{{ emailText }}</div>
                </div>
                <div class="info-action" aria-hidden="true">
                  <span class="info-action-badge" :title="(profileEmail || userStore.email) ? t('user.edit') : t('user.set')">
                    <!-- edit-2 (Feather) -->
                    <svg v-if="(profileEmail || userStore.email)" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 3 21l.5-4.5L17 3z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                    <!-- plus-circle (Feather) -->
                    <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                  </span>
                </div>
              </button>
            </div>
          </section>
  
          <!-- Dominate -->
          <section v-else-if="activeTab === 'dominate'" class="panel">
            <div class="panel-inner">
              <div class="placeholder">
                <div class="placeholder-title float-in" :style="{ '--d': '200ms' }" :class="{ animate: contentAnimate }">{{ t('user.dominateComingSoonTitle') }}</div>
                <div class="placeholder-text float-in" :style="{ '--d': '260ms' }" :class="{ animate: contentAnimate }">
                  {{ t('user.dominateComingSoonText') }}
                </div>
                <div class="placeholder-hint float-in" :style="{ '--d': '320ms' }" :class="{ animate: contentAnimate }">
                  {{ t('user.dominateComingSoonHint') }}
                </div>
              </div>
            </div>
          </section>

          <!-- News -->
          <section v-else class="panel panel--news">
            <div v-if="!canPublishNews" class="placeholder">
              <div class="placeholder-title">{{ t('user.newsNoAccessTitle') }}</div>
              <div class="placeholder-text">{{ t('user.newsNoAccessText') }}</div>
            </div>

            <div v-else class="news-hub">
              <div class="news-choice">
                <div class="profile-cards">
                  <button
                    class="info-card info-card--action float-in"
                    :class="{ animate: contentAnimate }"
                    :style="{ '--d': '120ms' }"
                    type="button"
                    @click="router.push({ name: 'news-preview' })"
                  >
                    <div class="info-icon" aria-hidden="true">
                      <!-- send -->
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2 11 13"></path>
                        <path d="M22 2 15 22 11 13 2 9 22 2"></path>
                      </svg>
                    </div>

                    <div class="info-body">
                      <div class="info-title">{{ t('user.newsPublishTab') }}</div>
                      <div class="info-value">{{ t('user.newsPublish') }}</div>
                    </div>
                  </button>

                  <button
                    class="info-card info-card--action float-in"
                    :class="{ animate: contentAnimate }"
                    :style="{ '--d': '200ms' }"
                    type="button"
                    @click="router.push({ name: 'news-delete' })"
                  >
                    <div class="info-icon" aria-hidden="true">
                      <!-- trash -->
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4h8v2"></path>
                        <path d="M6 6l1 16h10l1-16"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                      </svg>
                    </div>

                    <div class="info-body">
                      <div class="info-title">{{ t('user.newsDeleteTab') }}</div>
                      <div class="info-value">{{ t('user.newsDelete') }}</div>
                    </div>
                  </button>
                </div>
                </div>
            </div>
          </section>
        </main>
      </div>

      <!-- Edit Modal (Birthday / Email) -->
      <div v-if="isEditOpen" class="modal-layer" role="dialog" aria-modal="true" :aria-label="editModalTitle" @keydown.esc.prevent="closeEdit">
        <div class="modal-backdrop" @click="closeEdit" aria-hidden="true"></div>
        <div class="modal" @click.stop>
          <div class="modal-header">
            <div class="modal-title">{{ editModalTitle }}</div>
            <button type="button" class="modal-close" @click="closeEdit" :aria-label="t('user.closeDialogAria')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <label class="modal-label" :for="editInputId">{{ editFieldLabel }}</label>

            <div v-if="editKey === 'birthday'" class="date-row" :id="editInputId">
              <select class="modal-select" v-model="draftBirthYear" :aria-label="t('user.birthYear')">
                <option value="">{{ t('user.birthYear') }}</option>
                <option v-for="y in birthYearOptions" :key="y" :value="String(y)">{{ y }}</option>
              </select>
              <select class="modal-select" v-model="draftBirthMonth" :aria-label="t('user.birthMonth')">
                <option value="">{{ t('user.birthMonth') }}</option>
                <option v-for="m in 12" :key="m" :value="String(m)">{{ String(m).padStart(2, '0') }}</option>
              </select>
              <select class="modal-select" v-model="draftBirthDay" :aria-label="t('user.birthDay')">
                <option value="">{{ t('user.birthDay') }}</option>
                <option v-for="d in birthDayOptions" :key="d" :value="String(d)">{{ String(d).padStart(2, '0') }}</option>
              </select>
            </div>

            <input
              v-else
              :id="editInputId"
              class="modal-input"
              type="email"
              v-model="draftValue"
              :placeholder="t('user.emailPlaceholder')"
              :aria-invalid="emailError ? 'true' : 'false'"
              autocomplete="email"
              inputmode="email"
            />

            <div v-if="emailError" class="modal-error" role="alert">{{ emailError }}</div>
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-btn ghost" @click="closeEdit" :disabled="isSavingEdit">{{ t('user.cancel') }}</button>
            <button type="button" class="modal-btn primary" @click="saveEdit" :disabled="isSavingEdit">{{ t('user.confirm') }}</button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { useErrorStore } from '@/stores/error'
  import { useSuccessStore } from '@/stores/success'
  import { useI18nStore } from '@/stores/i18n'
  import bgVideo from '@/assets/images/section4.webm'
  
  const router = useRouter()
  const userStore = useUserStore()
  const errorStore = useErrorStore()
  const successStore = useSuccessStore()
  const i18n = useI18nStore()
  const t = (key, vars) => i18n.t(key, vars)
  
  const isMounted = ref(false)
  const contentAnimate = ref(false)
  const activeTab = ref('profile') // 'profile' | 'dominate' | 'news'

  const headerText = computed(() => {
    if (activeTab.value === 'profile') return t('user.headerProfile')
    if (activeTab.value === 'dominate') return t('user.headerDominate')
    return t('user.headerNews')
  })

  const subtitleText = computed(() => {
    if (activeTab.value === 'profile') return t('user.subtitleProfile')
    if (activeTab.value === 'dominate') return t('user.subtitleDominate')
    return t('user.subtitleNews')
  })

  const canPublishNews = ref(false)

  function todayYmd() {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function computeCanPublishNewsFromToken(token) {
    // Minimal JWT payload inspection. If the backend changes role rules,
    // the POST response (401/403) will still enforce the source of truth.
    try {
      const [, payload] = String(token || '').split('.')
      if (!payload) return false
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
      const roles = Array.isArray(json?.roles) ? json.roles : []
      const role = json?.role
      // Common convention: admin/editor role is 3 (as in your example token)
      if (roles.includes(3) || role === 3) return true
      // If token exists but no role claims, allow and let backend decide
      if (!('roles' in json) && !('role' in json)) return true
      return false
    } catch {
      return !!token
    }
  }

  function parseApiDate(s) {
    if (!s) return null
    const hasTz = /Z$|[+-]\d{2}:\d{2}$/.test(s)
    return new Date(hasTz ? s : `${s}Z`)
  }

  function applyProfileFromApi(data) {
    if (!data || typeof data !== 'object') return

    const nextDisplayName = data.display_name ?? data.displayName
    const nextPhone = data.phone
    const nextEmail = data.email
    const nextBirthday = data.birthday ?? data.birthdate ?? data.birth_day
    const nextUsername = data.username
    const nextCreatedAt = data.created_at ?? data.createdAt
    const nextUpdatedAt = data.updated_at ?? data.updatedAt

    const storePatch = {}
    if (nextDisplayName !== undefined) storePatch.displayName = String(nextDisplayName || '')
    if (nextPhone !== undefined) storePatch.phone = String(nextPhone || '')
    if (nextEmail !== undefined) storePatch.email = String(nextEmail || '')
    if (nextBirthday !== undefined) storePatch.birthday = String(nextBirthday || '')
    if (nextUpdatedAt !== undefined) storePatch.updatedAt = String(nextUpdatedAt || '')

    if (Object.keys(storePatch).length) {
      userStore.setProfileFields(storePatch)
      if (storePatch.email !== undefined) profileEmail.value = storePatch.email
    }

    if (nextUsername !== undefined) userStore.username = String(nextUsername || '')
    if (nextCreatedAt !== undefined) userStore.createdAt = String(nextCreatedAt || '')
    if (nextUpdatedAt !== undefined) userStore.updatedAt = String(nextUpdatedAt || '')
  }
  
  const DAY_MS = 1000 * 60 * 60 * 24
  
  const displayName = computed(
    () => userStore.displayName || userStore.username || t('common.guest')
  )
  const username = computed(() => userStore.username || userStore.phone || '—')
  const createdAtRaw = computed(() => userStore.createdAt || userStore.created_at || '')
  const updatedAtRaw = computed(() => userStore.updatedAt || userStore.updated_at || '')
  
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

  const updatedAtText = computed(() => {
    const d = parseApiDate(updatedAtRaw.value)
    if (!d) return '—'
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
  const birthdayText = computed(() => birthdayRaw.value || t('common.notSet'))
  
  /** Profile 表单（先做本地 + store patch，后续你接 API 再替换） */
  const profileName = ref(displayName.value)
  const profilePhone = ref(userStore.phone || '')
  const profileEmail = ref(userStore.email || '')

  const emailText = computed(() => {
    const v = (profileEmail.value || userStore.email || '').trim()
    return v || t('common.notSet')
  })

  const isEditOpen = ref(false)
  const editKey = ref('email') // 'email' | 'birthday'
  const draftValue = ref('')
  const emailError = ref('')
  const draftBirthYear = ref('')
  const draftBirthMonth = ref('')
  const draftBirthDay = ref('')
  const isSavingEdit = ref(false)

  const editInputId = computed(() => `edit-${editKey.value}`)
  const editModalTitle = computed(() =>
    editKey.value === 'birthday' ? t('user.editBirthdayTitle') : t('user.editEmailTitle')
  )
  const editFieldLabel = computed(() =>
    editKey.value === 'birthday' ? t('user.birthday') : t('user.email')
  )

  const currentYear = computed(() => new Date().getFullYear())
  const birthYearOptions = computed(() => {
    // 1900 ~ currentYear, descending for faster picking
    const out = []
    for (let y = currentYear.value; y >= 1900; y--) out.push(y)
    return out
  })

  const birthDayOptions = computed(() => {
    const y = parseInt(draftBirthYear.value || '0', 10)
    const m = parseInt(draftBirthMonth.value || '0', 10)
    if (!y || !m) return []
    const daysInMonth = new Date(y, m, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  })

  function normalizeYmd(s) {
    if (!s) return ''
    const trimmed = String(s).trim()
    // already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
    // try Date parse
    const d = new Date(trimmed)
    if (Number.isNaN(d.getTime())) return ''
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function openEdit(key) {
    editKey.value = key === 'birthday' ? 'birthday' : 'email'
    emailError.value = ''
    if (editKey.value === 'birthday') {
      const ymd = normalizeYmd(birthdayRaw.value)
      if (ymd) {
        const [y, m, d] = ymd.split('-')
        draftBirthYear.value = y
        draftBirthMonth.value = String(parseInt(m, 10))
        draftBirthDay.value = String(parseInt(d, 10))
      } else {
        draftBirthYear.value = ''
        draftBirthMonth.value = ''
        draftBirthDay.value = ''
      }
    } else {
      draftValue.value = (profileEmail.value || userStore.email || '').trim()
    }
    isEditOpen.value = true
  }

  function closeEdit() {
    isEditOpen.value = false
    emailError.value = ''
  }

  function isValidEmail(v) {
    const s = String(v || '').trim()
    if (!s) return true // allow empty (unset)
    // lightweight client validation; backend will be source of truth later
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  }

  function extractApiErrorMessage(data, status) {
    if (Array.isArray(data?.detail)) {
      const msgs = data.detail
        .map((it) => it?.msg)
        .filter((s) => typeof s === 'string' && s.trim().length > 0)
        .map((s) => s.trim())
      if (msgs.length) {
        const uniq = []
        for (const m of msgs) if (!uniq.includes(m)) uniq.push(m)
        return uniq.join(' ; ')
      }
    }
    if (typeof data?.detail === 'string' && data.detail.trim()) return data.detail.trim()
    if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim()
    if (typeof data === 'string' && data.trim()) return data.trim()
    return `Request failed (${status})`
  }

  async function patchMyProfile(patch) {
    const token = userStore.accessToken
    if (!token) {
      throw new Error(t('auth.errLoginFailed'))
    }

    const res = await fetch('/api/me/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    })

    let data = null
    try { data = await res.json() } catch (e) {}

    if (!res.ok) {
      throw new Error(extractApiErrorMessage(data, res.status))
    }
    return data
  }

  async function fetchMyProfile() {
    const token = userStore.accessToken
    if (!token) return

    try {
      const res = await fetch('/api/me/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })

      let data = null
      try { data = await res.json() } catch (e) {}

      if (!res.ok) {
        throw new Error(extractApiErrorMessage(data, res.status))
      }

      applyProfileFromApi(data)
    } catch (err) {
      errorStore.showError(err?.message || t('common.comingSoon'))
    }
  }

  async function saveEdit() {
    if (isSavingEdit.value) return
    emailError.value = ''

    const patch = {}
    if (editKey.value === 'email') {
      const next = String(draftValue.value || '').trim()
      if (!isValidEmail(next)) {
        emailError.value = t('user.invalidEmail')
        return
      }
      patch.email = next
    } else {
      const y = parseInt(draftBirthYear.value || '0', 10)
      const m = parseInt(draftBirthMonth.value || '0', 10)
      const d = parseInt(draftBirthDay.value || '0', 10)
      patch.birthday = y && m && d
        ? `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        : ''
    }

    isSavingEdit.value = true
    try {
      const resp = await patchMyProfile(patch)
      // 以接口返回为准（如果没返回字段，则回落到本次 patch 值）
      const nextEmail = Object.prototype.hasOwnProperty.call(patch, 'email') ? (resp?.email ?? patch.email) : undefined
      const nextBirthday = Object.prototype.hasOwnProperty.call(patch, 'birthday') ? (resp?.birthday ?? patch.birthday) : undefined
      const nextUpdatedAt = resp?.updated_at ?? resp?.updatedAt

      const storePatch = {}
      if (nextEmail !== undefined) storePatch.email = nextEmail
      if (nextBirthday !== undefined) storePatch.birthday = nextBirthday
      if (nextUpdatedAt !== undefined) storePatch.updatedAt = nextUpdatedAt
      userStore.setProfileFields(storePatch)

      if (nextEmail !== undefined) profileEmail.value = String(nextEmail || '')

      closeEdit()
      successStore.showSuccess(t('common.saved'))
    } catch (err) {
      errorStore.showError(err?.message || t('common.comingSoon'))
    } finally {
      isSavingEdit.value = false
    }
  }
  
  function handleResetProfile() {
    profileName.value = displayName.value
    profilePhone.value = userStore.phone || ''
    profileEmail.value = userStore.email || ''
  }
  
  function handleSaveProfile() {
    // Pinia：允许直接 patch（即便后续你 store 扩展字段也不冲突）
    userStore.$patch({
      displayName: profileName.value?.trim() || t('common.guest'),
      phone: profilePhone.value?.trim() || '',
      email: profileEmail.value?.trim() || '',
    })
    successStore.showSuccess(t('common.saved'))
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
    canPublishNews.value = computeCanPublishNewsFromToken(userStore.accessToken)
    fetchMyProfile()
  })

  watch(activeTab, async () => {
    contentAnimate.value = false
    await nextTick()
    requestAnimationFrame(() => {
      contentAnimate.value = true
    })
  })

  watch(
    () => userStore.accessToken,
    () => {
      canPublishNews.value = computeCanPublishNewsFromToken(userStore.accessToken)
      if (!userStore.accessToken) {
        if (activeTab.value === 'news') activeTab.value = 'profile'
      } else {
        fetchMyProfile()
      }
    }
  )
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

  .nav-item:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .nav-item:disabled:hover {
    transform: none;
    box-shadow: none;
  }

  /* News hub (Publish / Delete) */
  .news-hub {
    width: 100%;
  }

  .panel--news .news-hub {
    padding: 6px 2px;
  }

  /* Hover invert (match profile cards) */
  .news-choice__card:hover .news-choice__card-title {
    color: #ffffff;
  }

  .news-choice__card:hover .news-choice__card-sub {
    color: rgba(255, 255, 255, 0.72);
  }

  .news-choice__card:hover .news-choice__icon {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.22);
  }

  .news-choice__card:hover .news-choice__action {
    color: rgba(255, 255, 255, 0.86);
  }

  .news-choice__card:hover .news-choice__action-badge {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.22);
    color: #ffffff;
  }

  .news-switch {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 0 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.10);
    margin-bottom: 16px;
  }

  .news-switch__btn {
    height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255,255,255,0.7);
    cursor: pointer;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.82);
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .news-switch__btn.active {
    background: #000000;
    border-color: #000000;
    color: #ffffff;
  }

  .news-switch__back {
    margin-left: auto;
    height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: transparent;
    cursor: pointer;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.72);
  }

  .news-switch__back:hover {
    background: rgba(15, 23, 42, 0.06);
  }

  /* keep them horizontal when possible; wrap naturally on narrow screens */
  
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
    margin-top: 10px;
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

  /* News publish form now lives in `src/components/NewsPublishForm.vue` */
  
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

  /* Button reset for clickable cards */
  .info-card--action {
    width: 100%;
    text-align: left;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  .info-card--action:focus-visible {
    outline: 3px solid rgba(26, 115, 232, 0.35);
    outline-offset: 3px;
  }

  .info-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    color: rgba(15, 23, 42, 0.62);
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .info-action-badge {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,0.10);
    background: rgba(255,255,255,0.6);
    display: grid;
    place-items: center;
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

  .info-card:hover .info-action {
    color: rgba(255,255,255,0.86);
  }

  .info-card:hover .info-action-badge {
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.22);
    color: #ffffff;
  }

  /* Modal */
  .modal-layer {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 20px;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(6px);
  }

  .modal {
    position: relative;
    width: min(520px, 100%);
    border-radius: 20px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(0,0,0,0.10);
    box-shadow: 0 30px 80px rgba(0,0,0,0.22);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 16px 10px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }

  .modal-title {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: #0f172a;
    text-transform: uppercase;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.10);
    background: rgba(255,255,255,0.7);
    color: #0f172a;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .modal-close:hover {
    background: rgba(0,0,0,0.90);
    border-color: rgba(0,0,0,0.90);
    color: #ffffff;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-label {
    display: block;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.03em;
    color: #0f172a;
    margin-bottom: 10px;
  }

  .modal-input {
    width: 100%;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.85);
    padding: 0 14px;
    font-size: 14px;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .modal-input:focus {
    border-color: rgba(26, 115, 232, 0.55);
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.14);
  }

  .modal-error {
    margin-top: 10px;
    font-size: 12px;
    color: #b91c1c;
    font-weight: 700;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 12px 16px 16px 16px;
    border-top: 1px solid rgba(0,0,0,0.08);
  }

  .modal-btn {
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 900;
    letter-spacing: 0.04em;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.65);
    color: #0f172a;
    transition: all 0.2s ease;
  }

  .modal-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 35px rgba(0,0,0,0.10);
  }

  .modal-btn.primary {
    background: rgba(0,0,0,0.90);
    border-color: rgba(0,0,0,0.90);
    color: #ffffff;
  }

  .modal-btn.primary:hover {
    background: #000000;
  }

  .date-row {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 10px;
  }

  .modal-select {
    width: 100%;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.85);
    padding: 0 12px;
    font-size: 14px;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .modal-select:focus {
    border-color: rgba(26, 115, 232, 0.55);
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.14);
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
  