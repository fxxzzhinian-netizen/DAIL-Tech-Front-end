<template>
  <section class="manage-page">
    <!-- Back Button -->
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

    <div class="manage-container">
      <!-- Header -->
      <header class="manage-header">
        <h1 class="manage-title reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '80ms' }">
          {{ isZh ? '实习生申请管理' : 'Intern Applications' }}
        </h1>
        <p class="manage-subtitle reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '140ms' }">
          {{ isZh ? '审核实习生的报名申请' : 'Review intern applications' }}
        </p>
      </header>

      <!-- Filter Tabs -->
      <div class="filter-tabs reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '180ms' }">
        <button 
          class="filter-tab" 
          :class="{ active: statusFilter === null }"
          @click="statusFilter = null; loadApplications()"
        >
          {{ isZh ? '全部' : 'All' }}
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: statusFilter === 0 }"
          @click="statusFilter = 0; loadApplications()"
        >
          {{ isZh ? '待审核' : 'Pending' }}
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: statusFilter === 1 }"
          @click="statusFilter = 1; loadApplications()"
        >
          {{ isZh ? '已通过' : 'Accepted' }}
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: statusFilter === 2 }"
          @click="statusFilter = 2; loadApplications()"
        >
          {{ isZh ? '已拒绝' : 'Rejected' }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '200ms' }">
        <div class="loading-spinner"></div>
        <span>{{ isZh ? '加载中...' : 'Loading...' }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="applications.length === 0" class="empty-state reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '200ms' }">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
          <path d="M9 12h6"/>
          <path d="M9 16h6"/>
        </svg>
        <p>{{ isZh ? '暂无申请记录' : 'No applications found' }}</p>
      </div>

      <!-- Applications List -->
      <div v-else class="applications-list">
        <div 
          v-for="(app, idx) in applications" 
          :key="app.id" 
          class="app-item reveal"
          :class="{ 'is-in': pageEnter, 'is-expanded': expandedId === app.id }"
          :style="{ '--d': `${200 + idx * 40}ms` }"
        >
          <!-- Collapsed Row -->
          <div class="app-row-header" @click="toggleExpand(app.id)">
            <div class="app-row-left">
              <div class="app-row-name">{{ app.name || (isZh ? '未填写' : 'N/A') }}</div>
              <div class="app-row-meta">
                <span>{{ app.school || '-' }}</span>
                <span class="meta-dot">·</span>
                <span>{{ app.major || '-' }}</span>
                <span class="meta-dot">·</span>
                <span>{{ formatPreference(app.preference) }}</span>
              </div>
            </div>
            <div class="app-row-right">
              <div class="app-status" :class="statusClass(app.status)">
                {{ statusText(app.status) }}
              </div>
              <div class="app-expand-icon" :class="{ rotated: expandedId === app.id }">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Expanded Detail -->
          <div v-if="expandedId === app.id" class="app-detail">
            <div class="app-info">
              <div class="app-info-row">
                <span class="app-label">{{ isZh ? '用户名' : 'Username' }}</span>
                <span class="app-value">{{ app.username || '-' }}</span>
              </div>
              <div class="app-info-row">
                <span class="app-label">{{ isZh ? '年龄' : 'Age' }}</span>
                <span class="app-value">{{ app.age || '-' }}</span>
              </div>
              <div class="app-info-row">
                <span class="app-label">{{ isZh ? '年级' : 'Grade' }}</span>
                <span class="app-value">{{ app.grade || '-' }}</span>
              </div>
              <div class="app-info-row">
                <span class="app-label">{{ isZh ? '电话' : 'Phone' }}</span>
                <span class="app-value">{{ app.phone || '-' }}</span>
              </div>
              <div class="app-info-row">
                <span class="app-label">{{ isZh ? '参加过课程' : 'DAIL Course' }}</span>
                <span class="app-value">{{ app.participated_before ? (isZh ? '是' : 'Yes') : (isZh ? '否' : 'No') }}</span>
              </div>
            </div>

            <div v-if="app.experience" class="app-section">
              <div class="app-section-title">{{ isZh ? '项目经验' : 'Experience' }}</div>
              <div class="app-section-content">{{ app.experience }}</div>
            </div>

            <div v-if="app.message" class="app-section">
              <div class="app-section-title">{{ isZh ? '留言' : 'Message' }}</div>
              <div class="app-section-content">{{ app.message }}</div>
            </div>

            <!-- Actions -->
            <div v-if="app.status === 0" class="app-actions">
              <button 
                class="action-btn action-btn--accept" 
                :disabled="processingId === app.id"
                @click.stop="confirmAccept(app)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {{ isZh ? '通过' : 'Accept' }}
              </button>
              <button 
                class="action-btn action-btn--reject" 
                :disabled="processingId === app.id"
                @click.stop="confirmReject(app)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                {{ isZh ? '拒绝' : 'Reject' }}
              </button>
            </div>

            <div v-else class="app-reviewed">
              {{ isZh ? '已审核' : 'Reviewed' }}
              <span v-if="app.reviewed_at"> · {{ formatDate(app.reviewed_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <WarningModal
      v-model="isRejectModalOpen"
      type="warning"
      :title="isZh ? '确认拒绝' : 'Confirm Rejection'"
      :message="isZh ? `确定要拒绝 ${rejectTarget?.name || '该申请者'} 的申请吗？此操作不可撤销。` : `Are you sure you want to reject ${rejectTarget?.name || 'this applicant'}? This action cannot be undone.`"
      :show-cancel="true"
      :confirm-text="isZh ? '确认拒绝' : 'Reject'"
      :cancel-text="isZh ? '取消' : 'Cancel'"
      @confirm="executeReject"
    />

    <!-- Accept Confirmation Modal with Message -->
    <AcceptModal
      v-model="isAcceptModalOpen"
      :title="isZh ? '确认通过申请' : 'Confirm Acceptance'"
      :description="isZh ? `即将通过 ${acceptTarget?.name || '该申请者'} 的申请，系统将发送站内通知。` : `About to accept ${acceptTarget?.name || 'this applicant'}. A notification will be sent.`"
      :input-label="isZh ? '通知消息（可选）' : 'Notification Message (Optional)'"
      :placeholder="isZh ? '你的申请已通过审核，请留意后续通知。' : 'Your application has been approved. Please stay tuned for further updates.'"
      :default-message="isZh ? '你的申请已通过审核，请留意后续通知。' : 'Your application has been approved. Please stay tuned for further updates.'"
      :confirm-text="isZh ? '确认通过' : 'Accept'"
      :cancel-text="isZh ? '取消' : 'Cancel'"
      @confirm="executeAccept"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'
import { useSuccessStore } from '@/stores/success'
import { useErrorStore } from '@/stores/error'
import WarningModal from '@/components/WarningModal.vue'
import AcceptModal from '@/components/AcceptModal.vue'

const router = useRouter()
const i18n = useI18nStore()
const userStore = useUserStore()
const successStore = useSuccessStore()
const errorStore = useErrorStore()

const isZh = computed(() => i18n.locale === 'zh')
const pageEnter = ref(false)

// Back button state
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

// Data
const applications = ref([])
const isLoading = ref(false)
const statusFilter = ref(null) // null = all, 0 = pending, 1 = accepted, 2 = rejected
const processingId = ref(null)
const expandedId = ref(null)

// Reject modal
const isRejectModalOpen = ref(false)
const rejectTarget = ref(null)

// Accept modal
const isAcceptModalOpen = ref(false)
const acceptTarget = ref(null)

// Back button handlers
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
  try { e.currentTarget?.setPointerCapture?.(e.pointerId) } catch {}
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
    try { e?.currentTarget?.releasePointerCapture?.(backPointerId) } catch {}
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

function onBackPointerUp(e) { endBackDrag(e, { cancelled: false }) }
function onBackPointerCancel(e) { endBackDrag(e, { cancelled: true }) }

function onBack() {
  if (suppressBackClickOnce.value) {
    suppressBackClickOnce.value = false
    return
  }
  router.push('/user')
}

onBeforeUnmount(() => {
  if (backCloseTimerId) clearTimeout(backCloseTimerId)
})

// Check admin permission
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

// Load applications
async function loadApplications() {
  isLoading.value = true
  try {
    const token = userStore.accessToken
    let url = '/api/admin/applications?limit=50&offset=0'
    if (statusFilter.value !== null) {
      url += `&status=${statusFilter.value}`
    }
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) {
      throw new Error(`Failed to load (${res.status})`)
    }
    applications.value = await res.json()
  } catch (err) {
    errorStore.showError(err?.message || (isZh.value ? '加载失败' : 'Load failed'))
  } finally {
    isLoading.value = false
  }
}

// Accept confirmation
function confirmAccept(app) {
  acceptTarget.value = app
  isAcceptModalOpen.value = true
}

// Execute accept with message
async function executeAccept(message) {
  if (!acceptTarget.value) return
  const id = acceptTarget.value.id
  processingId.value = id
  try {
    const token = userStore.accessToken
    const res = await fetch(`/api/admin/applications/${id}/accept`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: message ? JSON.stringify({ message }) : undefined
    })
    if (res.status === 409) {
      errorStore.showError(isZh.value ? '该申请已审核过' : 'Application already reviewed')
      return
    }
    if (!res.ok) {
      throw new Error(`Failed (${res.status})`)
    }
    successStore.showSuccess(isZh.value ? '已通过申请并发送通知' : 'Application accepted and notification sent')
    await loadApplications()
  } catch (err) {
    errorStore.showError(err?.message || (isZh.value ? '操作失败' : 'Operation failed'))
  } finally {
    processingId.value = null
    acceptTarget.value = null
  }
}

// Reject confirmation
function confirmReject(app) {
  rejectTarget.value = app
  isRejectModalOpen.value = true
}

// Execute reject
async function executeReject() {
  if (!rejectTarget.value) return
  const id = rejectTarget.value.id
  processingId.value = id
  try {
    const token = userStore.accessToken
    const res = await fetch(`/api/admin/applications/${id}/reject`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.status === 409) {
      errorStore.showError(isZh.value ? '该申请已审核过' : 'Application already reviewed')
      return
    }
    if (!res.ok) {
      throw new Error(`Failed (${res.status})`)
    }
    successStore.showSuccess(isZh.value ? '已拒绝申请' : 'Application rejected')
    await loadApplications()
  } catch (err) {
    errorStore.showError(err?.message || (isZh.value ? '操作失败' : 'Operation failed'))
  } finally {
    processingId.value = null
    rejectTarget.value = null
  }
}

// Helpers
function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function statusClass(status) {
  if (status === 0) return 'status--pending'
  if (status === 1) return 'status--accepted'
  if (status === 2) return 'status--rejected'
  return ''
}

function statusText(status) {
  if (status === 0) return isZh.value ? '待审核' : 'Pending'
  if (status === 1) return isZh.value ? '已通过' : 'Accepted'
  if (status === 2) return isZh.value ? '已拒绝' : 'Rejected'
  return '-'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

// Map preference values to i18n translations
function formatPreference(pref) {
  if (!pref) return '-'
  const map = {
    '科研': i18n.t('intern.preferenceResearch'),
    '开发': i18n.t('intern.preferenceDevelopment'),
    '均可': i18n.t('intern.preferenceEither'),
  }
  return map[pref] || pref
}

onMounted(() => {
  const role = getUserRole()
  if (role < 3) {
    router.push('/user')
    return
  }
  setTimeout(() => { pageEnter.value = true }, 100)
  loadApplications()
})
</script>

<style scoped>
.manage-page {
  background: #fbfbfb;
  padding: 120px 24px 80px;
  min-height: 100vh;
}

.manage-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Back Button */
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
  transition: width 240ms cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease, color 0.15s ease, transform 0.18s ease;
  will-change: width;
  transform: translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0) scale(1);
}

.back-btn.is-open {
  width: 142px;
  justify-content: flex-start;
  padding: 0 16px 0 12px;
}

.back-btn:hover { background: #000000; color: #ffffff; }
.back-btn.is-pressed, .back-btn:active {
  background: #000000;
  color: #ffffff;
  transform: translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0) scale(0.98);
}

.back-btn.is-dragging { cursor: grabbing; }

.back-btn__chev {
  width: 18px; height: 18px;
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 18px;
  transition: opacity 160ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-btn__chev--right { opacity: 1; transform: translate3d(0, 0, 0); }
.back-btn__chev--left { opacity: 0; transform: translate3d(-8px, 0, 0); }
.back-btn.is-open .back-btn__chev--right { opacity: 0; transform: translate3d(10px, 0, 0); }
.back-btn.is-open .back-btn__chev--left { opacity: 1; transform: translate3d(0, 0, 0); }

.back-btn__text {
  white-space: nowrap; font-size: 12px; line-height: 1;
  opacity: 0; transform: translate3d(-10px, 0, 0);
  transition: opacity 160ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.back-btn.is-open .back-btn__text { opacity: 1; transform: translate3d(0, 0, 0); }

/* Header */
.manage-header { text-align: center; margin-bottom: 48px; }
.manage-title {
  font-size: 48px; line-height: 1.1; letter-spacing: -0.02em;
  font-weight: 650; color: #0b0f19; margin: 0 0 12px;
}
.manage-subtitle { margin: 0; font-size: 18px; color: rgba(17, 24, 39, 0.55); }

/* Animation */
.reveal {
  opacity: 0; transform: translate3d(0, 22px, 0); filter: blur(10px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--d, 0ms);
}
.reveal.is-in { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }

/* Filter Tabs */
.filter-tabs {
  display: flex; gap: 8px; margin-bottom: 32px; justify-content: center; flex-wrap: wrap;
}
.filter-tab {
  padding: 10px 24px; border: 1.5px solid rgba(0, 0, 0, 0.12);
  background: transparent; border-radius: 999px;
  font-size: 14px; font-weight: 500; color: rgba(0, 0, 0, 0.6);
  cursor: pointer; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.filter-tab:hover { border-color: rgba(0, 0, 0, 0.3); color: #000; transform: scale(1.03); }
.filter-tab:active { transform: scale(0.95); transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1); }
.filter-tab.active { background: #000; border-color: #000; color: #fff; }
.filter-tab.active:active { transform: scale(0.97); }

/* Loading */
.loading-state {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 60px 0; color: rgba(0, 0, 0, 0.5);
}
.loading-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1); border-top-color: #000;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 80px 0; color: rgba(0, 0, 0, 0.4);
}
.empty-state svg { opacity: 0.5; }

/* Application Item - Collapsible Row */
.applications-list { display: flex; flex-direction: column; gap: 12px; }

.app-item {
  background: #fff; 
  border: 1.5px solid #000;
  border-radius: 16px; 
  overflow: hidden; 
  box-shadow: none;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
              box-shadow 0.25s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.app-item:hover { 
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}
.app-item:active {
  transform: translateY(0) scale(0.995);
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}
.app-item.is-expanded { 
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.app-row-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 20px; cursor: pointer; 
  transition: background 0.2s ease;
}
.app-row-header:hover { background: rgba(0, 0, 0, 0.015); }

.app-row-left { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.app-row-name { 
  font-size: 18px; 
  font-weight: 700; 
  color: #0b0f19; 
  letter-spacing: -0.01em;
}
.app-row-meta {
  display: flex; align-items: center; gap: 0; flex-wrap: wrap;
  font-size: 14px; color: rgba(0, 0, 0, 0.45);
}
.app-row-meta span {
  display: inline-flex;
  align-items: center;
}
.meta-dot { 
  margin: 0 10px;
  color: rgba(0, 0, 0, 0.25);
  font-size: 16px;
  font-weight: 700;
}

.app-row-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.app-expand-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.3); 
  transition: all 0.25s ease;
}
.app-item:hover .app-expand-icon {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.5);
}
.app-expand-icon.rotated { 
  transform: rotate(180deg); 
  background: #0b0f19;
  color: #fff;
}

.app-status {
  padding: 6px 14px; 
  border-radius: 999px; 
  font-size: 11px; 
  font-weight: 700;
  text-transform: uppercase; 
  letter-spacing: 0.06em;
}
.status--pending { 
  background: #fef3c7; 
  color: #92400e; 
}
.status--accepted { 
  background: #d1fae5; 
  color: #065f46; 
}
.status--rejected { 
  background: #fee2e2; 
  color: #991b1b; 
}

/* Expanded Detail */
.app-detail {
  padding: 0 20px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.app-info {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 8px;
  padding: 16px 0; 
  margin-bottom: 12px;
}
.app-info-row { 
  display: flex; 
  flex-direction: column; 
  gap: 0px;
  padding: 4px 0px;
  background: rgba(0, 0, 0, 0.02);
}
.app-label { 
  font-size: 11px; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.08em; 
  color: rgba(0, 0, 0, 0.35); 
}
.app-value { 
  font-size: 17px; 
  font-weight: 600;
  color: #0b0f19; 
  padding-top: 2px;
}

.app-section { 
  margin-bottom: 12px; 
}
.app-section-title {
  font-size: 11px; 
  font-weight: 600; 
  text-transform: uppercase;
  letter-spacing: 0.08em; 
  color: rgba(0, 0, 0, 0.35); 
  margin-bottom: 0px;
}
.app-section-content {
  font-size: 16px; 
  line-height: 1.7; 
  color: #000;
  background: rgba(0, 0, 0, 0.02); 
  padding: 2px 0px; 
  border-radius: 10px;
}

/* Actions */
.app-actions {
  display: flex; 
  gap: 8px; 
  margin-top: 16px; 
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.action-btn {
  display: inline-flex; 
  align-items: center; 
  gap: 6px;
  padding: 10px 20px; 
  border-radius: 8px; 
  font-size: 13px; 
  font-weight: 600;
  cursor: pointer; 
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); 
  border: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn--accept { 
  background: #10b981; 
  color: #fff; 
}
.action-btn--accept:hover:not(:disabled) { 
  background: #059669;
  transform: translateY(-2px); 
}
.action-btn--accept:active:not(:disabled) { 
  transform: translateY(0) scale(0.97); 
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1); 
}
.action-btn--reject { 
  background: transparent; 
  border: 1.5px solid #ef4444; 
  color: #ef4444; 
}
.action-btn--reject:hover:not(:disabled) { 
  background: #fef2f2;
  transform: translateY(-2px); 
}
.action-btn--reject:active:not(:disabled) { 
  transform: translateY(0) scale(0.97); 
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1); 
}

.app-reviewed {
  margin-top: 12px; 
  font-size: 12px; 
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
}
</style>
