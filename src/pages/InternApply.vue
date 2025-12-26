<template>
  <section class="apply-page">
    <!-- 返回按钮 - NewsDetail 风格（支持拖拽） -->
    <button
      class="back-btn"
      :class="{ 'is-open': isBackOpen, 'is-pressed': isBackPressed, 'is-dragging': isBackDragging }"
      type="button"
      :aria-label="isZh ? '返回' : 'Back'"
      @click="onBack"
      @pointerenter="openBack"
      @pointerleave="onBackPointerLeave"
      @focusin="openBack"
      @focusout="closeBackNow"
      @pointerdown="onBackPointerDown"
      @pointermove="onBackPointerMove"
      @pointerup="onBackPointerUp"
      @pointercancel="onBackPointerCancel"
      :style="backBtnStyle"
    >
      <span v-show="!isBackOpen" class="back-btn__chev back-btn__chev--right" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M729.6 448H128v85.333333h601.6L597.333333 665.6l59.733334 59.733333 234.666666-234.666666L661.333333 256l-59.733333 59.733333 128 132.266667z" fill="currentColor"/>
        </svg>
      </span>
      <span v-show="isBackOpen" class="back-btn__chev back-btn__chev--left" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M290.133333 448H896v85.333333H290.133333l132.266667 132.266667L362.666667 725.333333 128 490.666667 362.666667 256l59.733333 59.733333-132.266667 132.266667z" fill="currentColor"/>
        </svg>
      </span>
      <span v-show="isBackOpen" class="back-btn__text">{{ isZh ? '返回' : 'BACK' }}</span>
    </button>

    <div class="apply-container">
      <!-- 页面标题 -->
      <header class="apply-header">
        <h1 class="apply-title reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '80ms' }">
          {{ isZh ? '实习生报名' : 'Intern Application' }}
        </h1>
        <p class="apply-subtitle reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '140ms' }">
          {{ isZh ? '填写以下信息，开启你的实习之旅' : 'Fill in the form below to start your internship journey' }}
        </p>
      </header>

      <!-- 提交成功页面 -->
      <div v-if="submitSuccess" class="success-page reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '100ms' }">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-6"/>
          </svg>
        </div>
        <h1 class="success-title">{{ isZh ? '提交成功！' : 'Submitted Successfully!' }}</h1>
        <p class="success-text">{{ isZh ? '你已经成功提交申请，审批结果会显示在主页"信息"中。' : 'Your application has been submitted. The approval result will be shown in the "Messages" section on the homepage.' }}</p>
        <button class="success-btn" @click="router.push('/')">
          {{ isZh ? '返回主页' : 'Back to Home' }}
        </button>
      </div>

      <!-- 已提交提示 -->
      <div v-else-if="alreadySubmitted" class="success-page reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '100ms' }">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-6"/>
          </svg>
        </div>
        <h1 class="success-title">{{ isZh ? '你已提交过申请' : 'Application Already Submitted' }}</h1>
        <p class="success-text">{{ isZh ? '每位用户只能提交一次申请，请耐心等待审核结果。审批结果会显示在主页"信息"中。' : 'Each user can only submit once. Please wait for the review result. The approval result will be shown in the "Messages" section on the homepage.' }}</p>
        <button class="success-btn" @click="router.push('/')">
          {{ isZh ? '返回主页' : 'Back to Home' }}
        </button>
      </div>

      <!-- 表单 -->
      <form v-else class="apply-form reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '200ms' }" @submit.prevent="handleSubmit">
        <div class="content">
          <div class="section-label reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '220ms' }">
            {{ isZh ? '基本信息' : 'Basic Information' }}
          </div>
          
          <div class="info-row">
            <!-- 姓名 -->
            <label class="info-field">
              <span class="info-label">{{ isZh ? '姓名' : 'Name' }} <span class="required">*</span></span>
              <input 
                v-model="form.name" 
                type="text" 
                class="info-control" 
                :placeholder="isZh ? '请输入真实姓名' : 'Enter your real name'"
                required
              />
            </label>

            <!-- 年龄 -->
            <label class="info-field">
              <span class="info-label">{{ isZh ? '年龄' : 'Age' }} <span class="required">*</span></span>
              <input 
                v-model.number="form.age" 
                type="number" 
                class="info-control" 
                :placeholder="isZh ? '请输入年龄' : 'Enter your age'"
                min="16"
                max="60"
                required
              />
            </label>

            <!-- 年级 -->
            <label class="info-field">
              <span class="info-label">{{ isZh ? '年级' : 'Grade' }} <span class="required">*</span></span>
              <input 
                v-model="form.grade" 
                type="text" 
                class="info-control" 
                :placeholder="isZh ? '如：大二、研一' : 'e.g., Sophomore'"
                required
              />
            </label>
          </div>

          <div class="info-row">
            <!-- 专业 -->
            <label class="info-field">
              <span class="info-label">{{ isZh ? '专业' : 'Major' }} <span class="required">*</span></span>
              <input 
                v-model="form.major" 
                type="text" 
                class="info-control" 
                :placeholder="isZh ? '请输入专业名称' : 'Enter your major'"
                required
              />
            </label>

            <!-- 学校 -->
            <label class="info-field">
              <span class="info-label">{{ isZh ? '学校' : 'School' }} <span class="required">*</span></span>
              <input 
                v-model="form.school" 
                type="text" 
                class="info-control" 
                :placeholder="isZh ? '请输入学校全称' : 'Enter your school name'"
                required
              />
            </label>

            <div class="info-field"></div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="content">
          <div class="section-label reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '280ms' }">
            {{ isZh ? '意向与经历' : 'Preference & Experience' }}
          </div>

          <div class="info-row info-row--auto">
            <!-- 意向方向 -->
            <div class="info-field info-field--auto">
              <span class="info-label">{{ isZh ? '意向方向' : 'Preference' }} <span class="required">*</span></span>
              <div class="segment-control">
                <button 
                  type="button" 
                  class="segment-btn" 
                  :class="{ active: form.preference === '科研' }"
                  @click="form.preference = '科研'"
                >
                  {{ isZh ? '科研' : 'Research' }}
                </button>
                <button 
                  type="button" 
                  class="segment-btn" 
                  :class="{ active: form.preference === '开发' }"
                  @click="form.preference = '开发'"
                >
                  {{ isZh ? '开发' : 'Development' }}
                </button>
                <button 
                  type="button" 
                  class="segment-btn" 
                  :class="{ active: form.preference === '均可' }"
                  @click="form.preference = '均可'"
                >
                  {{ isZh ? '均可' : 'Either' }}
                </button>
              </div>
            </div>
          </div>

          <div class="info-row info-row--auto">
            <!-- 是否参与过课程 -->
            <div class="info-field info-field--auto">
              <span class="info-label">{{ isZh ? '你参加过DAIL的课程吗？' : 'Have you taken DAIL courses?' }}</span>
              <div class="segment-control">
                <button 
                  type="button" 
                  class="segment-btn" 
                  :class="{ active: form.participated_before === true }"
                  @click="form.participated_before = true"
                >
                  {{ isZh ? '是' : 'Yes' }}
                </button>
                <button 
                  type="button" 
                  class="segment-btn" 
                  :class="{ active: form.participated_before === false }"
                  @click="form.participated_before = false"
                >
                  {{ isZh ? '否' : 'No' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 项目经验 -->
          <div class="info-row">
            <label class="info-field info-field--full">
              <span class="info-label">{{ isZh ? '项目/实习经验' : 'Project/Internship Experience' }}</span>
              <textarea 
                v-model="form.experience" 
                class="info-control info-control--textarea" 
                :placeholder="isZh ? '简要描述你的项目或实习经历...' : 'Briefly describe your project or internship experience...'"
                rows="4"
              ></textarea>
            </label>
          </div>

          <!-- 想说的话 -->
          <div class="info-row">
            <label class="info-field info-field--full">
              <span class="info-label">{{ isZh ? '想对我们说的话' : 'Message to Us' }}</span>
              <textarea 
                v-model="form.message" 
                class="info-control info-control--textarea" 
                :placeholder="isZh ? '有什么想对我们说的...' : 'Anything you want to tell us...'"
                rows="3"
              ></textarea>
            </label>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="btn-loading"></span>
            <span v-else>{{ isZh ? '提交申请' : 'Submit Application' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'
import { useSuccessStore } from '@/stores/success'
import { useErrorStore } from '@/stores/error'

const router = useRouter()
const i18n = useI18nStore()
const userStore = useUserStore()
const successStore = useSuccessStore()
const errorStore = useErrorStore()

const isZh = computed(() => i18n.locale === 'zh')
const pageEnter = ref(false)
const isSubmitting = ref(false)
const alreadySubmitted = ref(false)
const submitSuccess = ref(false)

// Back button state (with drag support like NewsDetail)
const isBackOpen = ref(false)
const isBackPressed = ref(false)
const isBackDragging = ref(false)
const suppressBackClickOnce = ref(false)
const backDragX = ref(0)
const backDragY = ref(0)
let backCloseTimerId = null
let backPointerId = null
let backStartClientX = 0
let backStartClientY = 0
let backStartDragX = 0
let backStartDragY = 0
let backMoved = false

const backBtnStyle = computed(() => ({
  '--drag-x': `${backDragX.value}px`,
  '--drag-y': `${backDragY.value}px`,
}))

const form = ref({
  name: '',
  grade: '',
  age: null,
  major: '',
  school: '',
  preference: '',
  experience: '',
  message: '',
  participated_before: false
})

// Back button handlers (with drag support)
function openBack() {
  isBackOpen.value = true
  if (backCloseTimerId) {
    clearTimeout(backCloseTimerId)
    backCloseTimerId = null
  }
}

function scheduleCloseBack() {
  if (backCloseTimerId) clearTimeout(backCloseTimerId)
  backCloseTimerId = setTimeout(() => {
    isBackOpen.value = false
    backCloseTimerId = null
  }, 900)
}

function closeBackNow() {
  if (backCloseTimerId) {
    clearTimeout(backCloseTimerId)
    backCloseTimerId = null
  }
  isBackOpen.value = false
}

function onBackPointerLeave() {
  if (isBackDragging.value || isBackPressed.value) return
  closeBackNow()
}

function onBackPointerDown(e) {
  if (e.button != null && e.button !== 0) return

  openBack()
  isBackPressed.value = true
  isBackDragging.value = true
  suppressBackClickOnce.value = false

  backPointerId = e.pointerId
  backStartClientX = e.clientX
  backStartClientY = e.clientY
  backStartDragX = backDragX.value
  backStartDragY = backDragY.value
  backMoved = false

  try {
    e.currentTarget?.setPointerCapture?.(e.pointerId)
  } catch {}
}

function onBackPointerMove(e) {
  if (!isBackDragging.value) return
  if (backPointerId == null || e.pointerId !== backPointerId) return

  const dx = e.clientX - backStartClientX
  const dy = e.clientY - backStartClientY

  if (!backMoved && Math.hypot(dx, dy) >= 6) backMoved = true

  backDragX.value = backStartDragX + dx
  backDragY.value = backStartDragY + dy
}

function endBackDrag(e, { cancelled } = { cancelled: false }) {
  if (backPointerId != null) {
    try {
      e?.currentTarget?.releasePointerCapture?.(backPointerId)
    } catch {}
  }

  backPointerId = null
  isBackDragging.value = false
  isBackPressed.value = false

  if (backMoved) suppressBackClickOnce.value = true

  backDragX.value = 0
  backMoved = false

  if (!cancelled) scheduleCloseBack()
  else closeBackNow()
}

function onBackPointerUp(e) {
  endBackDrag(e, { cancelled: false })
}

function onBackPointerCancel(e) {
  endBackDrag(e, { cancelled: true })
}

function onBack() {
  if (suppressBackClickOnce.value) {
    suppressBackClickOnce.value = false
    return
  }
  if (window.history.length > 1) router.back()
  else router.push('/career')
}

onBeforeUnmount(() => {
  if (backCloseTimerId) clearTimeout(backCloseTimerId)
})

// 检查用户权限
function getUserRole() {
  try {
    const token = userStore.accessToken
    if (!token) return -1
    const [, payload] = String(token).split('.')
    if (!payload) return -1
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof json?.role === 'number' ? json.role : -1
  } catch {
    return -1
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return

  // 验证必填字段
  if (!form.value.name?.trim()) {
    errorStore.showError(isZh.value ? '请输入姓名' : 'Please enter your name')
    return
  }
  if (!form.value.age || form.value.age < 16) {
    errorStore.showError(isZh.value ? '请输入有效年龄' : 'Please enter a valid age')
    return
  }
  if (!form.value.grade?.trim()) {
    errorStore.showError(isZh.value ? '请输入年级' : 'Please enter your grade')
    return
  }
  if (!form.value.major?.trim()) {
    errorStore.showError(isZh.value ? '请输入专业' : 'Please enter your major')
    return
  }
  if (!form.value.school?.trim()) {
    errorStore.showError(isZh.value ? '请输入学校' : 'Please enter your school')
    return
  }
  if (!form.value.preference) {
    errorStore.showError(isZh.value ? '请选择意向方向' : 'Please select your preference')
    return
  }

  isSubmitting.value = true

  try {
    const token = userStore.accessToken
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.value.name.trim(),
        grade: form.value.grade.trim(),
        age: form.value.age,
        major: form.value.major.trim(),
        school: form.value.school.trim(),
        preference: form.value.preference,
        experience: form.value.experience?.trim() || '',
        message: form.value.message?.trim() || '',
        participated_before: form.value.participated_before
      })
    })

    if (res.status === 409) {
      alreadySubmitted.value = true
      return
    }

    if (!res.ok) {
      let data = null
      try { data = await res.json() } catch {}
      throw new Error(data?.detail || data?.message || `Request failed (${res.status})`)
    }

    successStore.showSuccess(isZh.value ? '申请提交成功！' : 'Application submitted successfully!')
    submitSuccess.value = true
  } catch (err) {
    errorStore.showError(err?.message || (isZh.value ? '提交失败' : 'Submit failed'))
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 检查权限
  const role = getUserRole()
  if (role !== 0) {
    router.push('/career')
    return
  }
  
  setTimeout(() => { pageEnter.value = true }, 100)
})
</script>

<style scoped>
.apply-page {
  background: #fbfbfb;
  padding: 120px 24px 80px;
  min-height: 100vh;
}

.apply-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Back Button - NewsDetail Style with Drag */
.back-btn {
  position: fixed;
  top: 96px;
  left: 0;
  z-index: 30;
  height: 38px;
  width: 44px;
  padding: 0 12px;
  border-radius: 0 999px 999px 0;
  border: 2px solid #000000;
  background: #ffffff;
  color: #000000;
  cursor: grab;
  font-weight: 800;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  transition:
    width 240ms cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.18s ease,
    box-shadow 0.15s ease;
  will-change: width;
  transform: translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0) scale(1);
}

.back-btn.is-open {
  width: 142px;
  justify-content: flex-start;
  padding: 0 16px 0 12px;
}

.back-btn:hover {
  background: #000000;
  color: #ffffff;
}

.back-btn.is-pressed,
.back-btn:active {
  background: #000000;
  color: #ffffff;
  transform: translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0) scale(0.98);
}

.back-btn:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.6);
  outline-offset: 3px;
}

.back-btn.is-dragging {
  cursor: grabbing;
  transition:
    width 240ms cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.back-btn__chev {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  transition:
    opacity 160ms ease,
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-btn__chev--right {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.back-btn__chev--left {
  opacity: 0;
  transform: translate3d(-8px, 0, 0);
}

.back-btn.is-open .back-btn__chev--right {
  opacity: 0;
  transform: translate3d(10px, 0, 0);
}

.back-btn.is-open .back-btn__chev--left {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.back-btn__text {
  white-space: nowrap;
  font-size: 12px;
  line-height: 1;
  opacity: 0;
  transform: translate3d(-10px, 0, 0);
  transition:
    opacity 160ms ease,
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-btn.is-open .back-btn__text {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Header */
.apply-header {
  text-align: center;
  margin-bottom: 64px;
}

.apply-title {
  font-size: 56px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 650;
  color: #0b0f19;
  margin: 0 0 16px;
}

.apply-subtitle {
  margin: 0;
  font-size: 18px;
  letter-spacing: 0.01em;
  color: rgba(17, 24, 39, 0.55);
}

/* Animation */
.reveal {
  opacity: 0;
  transform: translate3d(0, 22px, 0);
  filter: blur(10px);
  transition:
    opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--d, 0ms);
  will-change: opacity, transform, filter;
}

.reveal.is-in {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

/* Success Page */
.success-page {
  text-align: center;
  padding: 0 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  color: #10b981;
  margin-bottom: 32px;
  animation: success-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-icon--info {
  color: #f59e0b;
}

@keyframes success-bounce {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.success-title {
  font-size: 42px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.success-text {
  font-size: 18px;
  color: rgba(17, 24, 39, 0.6);
  margin: 0 0 40px;
  max-width: 480px;
  line-height: 1.7;
}

.success-btn {
  padding: 16px 40px;
  background: #0b0f19;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: 0 4px 14px rgba(11, 15, 25, 0.2);
}

.success-btn:hover {
  transform: translateY(-5px) scale(1.04);
  box-shadow: 0 16px 36px rgba(11, 15, 25, 0.35);
}

.success-btn:active {
  transform: translateY(2px) scale(0.92);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(11, 15, 25, 0.12);
}

/* Submitted Notice */
.submitted-notice {
  text-align: center;
  padding: 80px 40px;
}

.notice-icon {
  color: #10b981;
  margin-bottom: 24px;
}

.submitted-notice h2 {
  font-size: 28px;
  font-weight: 600;
  color: #0b0f19;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}

.submitted-notice p {
  font-size: 16px;
  color: rgba(17, 24, 39, 0.6);
  margin: 0 0 32px;
}

.primary-btn {
  padding: 14px 32px;
  background: #0b0f19;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: 0 4px 12px rgba(11, 15, 25, 0.18);
}

.primary-btn:hover {
  transform: translateY(-5px) scale(1.04);
  box-shadow: 0 14px 32px rgba(11, 15, 25, 0.28);
}

.primary-btn:active {
  transform: translateY(2px) scale(0.92);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(11, 15, 25, 0.1);
}

/* Form */
.apply-form {
  padding: 0;
}

.content {
  max-width: 860px;
  margin: 0 auto;
}

.section-label {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 24px;
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
  margin: 48px 0 24px;
}

/* Info row - ResumeSettings style */
.info-row {
  display: flex;
  align-items: flex-end;
  gap: 48px;
  margin-bottom: 28px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.info-field--full {
  flex: 1 1 100%;
}

.info-row--auto {
  justify-content: flex-start;
}

.info-field--auto {
  flex: 0 0 auto;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.required {
  color: #ef4444;
}

.info-control {
  height: 48px;
  width: 100%;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  padding: 0;
  font-size: 18px;
  color: #000000;
  outline: none;
  transition: border-color 0.2s ease;
}

.info-control:hover {
  border-bottom-color: rgba(0, 0, 0, 0.4);
}

.info-control:focus {
  border-bottom-color: #000000;
}

.info-control::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

/* Segment Control - 分段选择器 */
.segment-control {
  display: inline-flex;
  width: fit-content;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 5px;
  gap: 4px;
  margin-top: 4px;
}

.segment-btn {
  padding: 10px 24px;
  border: none;
  background: transparent;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.segment-btn:hover {
  color: rgba(0, 0, 0, 0.85);
  transform: scale(1.06);
  background: rgba(0, 0, 0, 0.04);
}

.segment-btn:active {
  transform: scale(0.88);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.08);
}

.segment-btn.active {
  background: #000000;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.segment-btn.active:active {
  transform: scale(0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Textarea with border card */
.info-control--textarea {
  height: auto;
  min-height: 120px;
  padding: 16px;
  resize: vertical;
  line-height: 1.8;
  font-size: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: #ffffff;
  margin-top: 4px;
}

.info-control--textarea:hover {
  border-color: rgba(0, 0, 0, 0.25);
}

.info-control--textarea:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

/* Submit Button */
.form-actions {
  margin-top: 56px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  min-width: 220px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-5px) scale(1.04);
  box-shadow: 0 16px 36px rgba(16, 185, 129, 0.45);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(2px) scale(0.92);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
