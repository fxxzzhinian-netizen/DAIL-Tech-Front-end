<template>
  <section class="preview-page">
    <div class="preview-container">
      <div v-if="!canManage" class="no-access" role="status">
        {{ i18n.locale === 'zh' ? '当前账号没有发布新闻权限，或未登录。' : 'No permission to publish news (or not logged in).' }}
      </div>

      <div class="meta-bar reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '80ms' }" aria-label="Meta editor">
        <label class="meta-field">
          <span class="meta-label">{{ t('user.newsFieldSlug') }}</span>
          <input
            class="meta-control meta-control--slug"
            v-model.trim="draft.slug"
            placeholder="News"
            :disabled="isPublishing"
          />
        </label>

        <div class="meta-field" ref="categoryDropdownEl">
          <span class="meta-label">{{ i18n.locale === 'zh' ? '分类' : 'Category' }}</span>
          <button
            class="meta-control meta-select"
            type="button"
            :disabled="isPublishing"
            :aria-expanded="isCategoryOpen ? 'true' : 'false'"
            aria-haspopup="listbox"
            @click="toggleCategory"
          >
            <span class="meta-select__value">{{ categoryLabel }}</span>
            <span class="meta-select__chev" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>

          <div
            v-if="isCategoryOpen"
            class="meta-options"
            role="listbox"
            :aria-label="i18n.locale === 'zh' ? '选择分类' : 'Choose category'"
          >
            <button
              v-for="c in categoryOptions"
              :key="c.value"
              class="meta-option"
              type="button"
              role="option"
              :aria-selected="draft.category === c.value ? 'true' : 'false'"
              @click="selectCategory(c.value)"
            >
              <span class="meta-option__label">{{ c.label }}</span>
              <span v-if="draft.category === c.value" class="meta-option__tick" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <label class="meta-field">
          <span class="meta-label">{{ i18n.locale === 'zh' ? '作者' : 'Author' }}</span>
          <input class="meta-control" v-model.trim="draft.author" placeholder="DAIL Tech" :disabled="isPublishing" />
        </label>
      </div>

      <main class="preview reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '160ms' }" aria-label="Preview">
        <!-- Match published news layout (same as NewsDetail.vue) -->
        <div class="detail">
          <header class="hero" aria-label="Article header">
            <div class="hero-meta" role="group" aria-label="Article meta">
              <time class="hero-meta__item hero-meta__item--date" :datetime="draft.publishedAt">
                {{ formatDateLong(draft.publishedAt, i18n.locale) }}
              </time>
              <span class="hero-meta__dot" aria-hidden="true"></span>
              <span class="hero-meta__item">{{ categoryLabel }}</span>
            </div>

            <!-- Inline editing (no side form) -->
            <textarea
              class="hero-title hero-title-input"
              v-model="draft.title"
              :disabled="isPublishing"
              rows="2"
              :placeholder="i18n.locale === 'zh' ? '请输入标题…' : 'Write the headline…'"
            ></textarea>

            <textarea
              class="hero-dek hero-dek-input"
              v-model="draft.subtitle"
              :disabled="isPublishing"
              rows="2"
              :placeholder="i18n.locale === 'zh' ? '副标题（可选）…' : 'Optional short dek…'"
            ></textarea>
          </header>

          <div class="divider" aria-hidden="true"></div>

          <div class="content">
            <textarea
              class="content-textarea"
              v-model="contentText"
              :disabled="isPublishing"
              rows="12"
              :placeholder="i18n.locale === 'zh' ? '正文：每行一段' : 'Content: one paragraph per line'"
            ></textarea>

            <div class="content-footer">
              <div class="content-hint">
                {{ i18n.locale === 'zh' ? '段落数：' : 'Paragraphs: ' }}{{ paragraphCount }}
              </div>
              <div class="content-preview-hint">
                {{ i18n.locale === 'zh' ? '提示：发布后展示会按段落分行渲染。' : 'Tip: Publishing renders each line as a paragraph.' }}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Bottom action bar (replaces top header) -->
    <div class="bottom-bar" role="region" aria-label="Publisher actions">
      <div class="bottom-inner">
        <div class="bottom-left">
          <div class="bottom-title">{{ i18n.locale === 'zh' ? '新闻预览' : 'News preview' }}</div>
          <div class="bottom-sub">
            {{ i18n.locale === 'zh' ? '编辑标题/内容，并以正式发布格式预览。' : 'Edit fields and preview with the published layout.' }}
          </div>
        </div>
        <div class="bottom-right">
          <button class="btn ghost" type="button" @click="router.back()">
            {{ i18n.locale === 'zh' ? '返回' : 'Back' }}
          </button>
          <button class="btn ghost" type="button" @click="resetDraft" :disabled="isPublishing">
            {{ i18n.locale === 'zh' ? '重置' : 'Reset' }}
          </button>
          <button class="btn primary" type="button" @click="publish" :disabled="isPublishing || !canManage">
            {{ isPublishing ? (i18n.locale === 'zh' ? '发布中…' : 'Publishing…') : (i18n.locale === 'zh' ? '发布' : 'Publish') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useErrorStore } from '@/stores/error'
import { useSuccessStore } from '@/stores/success'
import { useUserStore } from '@/stores/user'
import { createNews, formatDateLong } from '@/services/newsService'

const router = useRouter()
const i18n = useI18nStore()
const errorStore = useErrorStore()
const successStore = useSuccessStore()
const userStore = useUserStore()
const t = (key, vars) => i18n.t(key, vars)

function todayYmd() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function computeCanManageFromToken(token) {
  try {
    const [, payload] = String(token || '').split('.')
    if (!payload) return false
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    const roles = Array.isArray(json?.roles) ? json.roles : []
    const role = json?.role
    if (roles.includes(3) || role === 3) return true
    if (!('roles' in json) && !('role' in json)) return true
    return false
  } catch {
    return !!token
  }
}

const canManage = computed(() => computeCanManageFromToken(userStore.accessToken))

const categoryOptions = computed(() => [
  { value: 'Alliance', label: t('news.categories.Alliance') },
  { value: 'Milestone', label: t('news.categories.Milestone') },
  { value: 'Partnership', label: t('news.categories.Partnership') },
  { value: 'News', label: t('news.categories.News') },
])

const draft = ref({
  slug: '',
  category: 'News',
  publishedAt: todayYmd(),
  title: '',
  subtitle: '',
  author: '',
})

const contentText = ref('')
const isPublishing = ref(false)

const pageEnter = ref(false)

const isCategoryOpen = ref(false)
const categoryDropdownEl = ref(null)

function toggleCategory() {
  if (isPublishing.value) return
  isCategoryOpen.value = !isCategoryOpen.value
}

function selectCategory(value) {
  draft.value.category = String(value || '').trim() || 'News'
  isCategoryOpen.value = false
}

function resetDraft() {
  draft.value = {
    slug: '',
    category: 'News',
    publishedAt: todayYmd(),
    title: '',
    subtitle: '',
    author: '',
  }
  contentText.value = ''
}

onMounted(() => {
  if (!draft.value.publishedAt) draft.value.publishedAt = todayYmd()
})

onMounted(() => {
  requestAnimationFrame(() => {
    pageEnter.value = true
  })
})

function onDocPointerDown(e) {
  const el = categoryDropdownEl.value
  if (!el) return
  if (!isCategoryOpen.value) return
  if (el === e.target || el.contains(e.target)) return
  isCategoryOpen.value = false
}

function onDocKeyDown(e) {
  if (!isCategoryOpen.value) return
  if (e.key === 'Escape') {
    isCategoryOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown, true)
  document.addEventListener('keydown', onDocKeyDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  document.removeEventListener('keydown', onDocKeyDown, true)
})

watch(
  () => userStore.accessToken,
  () => {
    if (!userStore.accessToken) {
      // keep the page visible, but disable publish
    }
  }
)

const contentParagraphs = computed(() =>
  String(contentText.value || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
)

const paragraphCount = computed(() => contentParagraphs.value.length)

const article = computed(() => ({
  slug: String(draft.value.slug || '').trim(),
  category: String(draft.value.category || '').trim() || 'News',
  publishedAt: String(draft.value.publishedAt || '').trim() || todayYmd(),
  title: String(draft.value.title || '').trim(),
  subtitle: String(draft.value.subtitle || '').trim(),
  author: String(draft.value.author || '').trim(),
  content: contentParagraphs.value,
}))

const categoryLabel = computed(() => {
  const v = article.value.category
  const hit = categoryOptions.value.find((x) => x.value === v)
  return hit?.label || v
})

const dekText = computed(() => {
  const a = article.value
  const fromField = a.subtitle || a.summary || a.dek
  if (typeof fromField === 'string' && fromField.trim()) return fromField.trim()
  const first = Array.isArray(a.content) ? a.content[0] : ''
  return typeof first === 'string' ? first.trim() : ''
})

const stripFromBody = computed(() => {
  const a = article.value
  const fromField = a.subtitle || a.summary || a.dek
  return !(typeof fromField === 'string' && fromField.trim())
})

const bodyParagraphs = computed(() => {
  const a = article.value
  if (!Array.isArray(a.content)) return []
  if (stripFromBody.value) return a.content.slice(1)
  return a.content
})

async function publish() {
  if (isPublishing.value) return
  if (!canManage.value) {
    errorStore.showError(t('user.newsNoAccessText') || (i18n.locale === 'zh' ? '没有权限' : 'No access'))
    return
  }

  const payload = {
    slug: article.value.slug,
    category: article.value.category,
    publishedAt: article.value.publishedAt,
    title: article.value.title,
    subtitle: article.value.subtitle,
    author: article.value.author,
    content: article.value.content,
  }

  // Basic validation (backend still validates)
  if (!payload.slug || !payload.title || !payload.category || !payload.publishedAt) {
    errorStore.showError(i18n.locale === 'zh' ? '请填写 slug / 标题 / 分类 / 日期' : 'Please fill slug / title / category / date')
    return
  }
  if (!Array.isArray(payload.content) || payload.content.length === 0) {
    errorStore.showError(i18n.locale === 'zh' ? '请填写正文' : 'Please fill content')
    return
  }

  isPublishing.value = true
  try {
    const data = await createNews(payload)
    successStore.showSuccess(t('user.newsSuccess') || (i18n.locale === 'zh' ? '发布成功' : 'Published'))
    const slug = data?.slug || payload.slug
    if (slug) router.push({ name: 'news-detail', params: { slug } })
  } catch (e) {
    errorStore.showError(e?.message || (i18n.locale === 'zh' ? '发布失败' : 'Failed to publish'))
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
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

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.preview-page {
  background: #fbfbfb;
  padding: 120px 24px 148px; /* leave room for bottom bar */
}

.preview-container {
  max-width: 1400px;
  margin: 0 auto;
}

.btn {
  height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid #000000;
  background: transparent;
  color: #000000;
}

.btn.primary {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.no-access {
  padding: 12px 0 18px;
  color: #000000;
  font-size: 14px;
}

.meta-bar {
  margin: 8px auto 18px;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border: none;
  /* border-radius: 16px; */
  background: rgba(255, 255, 255, 0.82);
  box-shadow: none;
  position: relative;
  z-index: 20; /* ensure dropdown stays clickable */
}

.meta-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative; /* anchor dropdown */
}

.meta-label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000000;
}

.meta-control {
  height: 44px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #000000;
  background: #ffffff; /* avoid "transparent" feel */
  padding: 0 14px;
  font-size: 14px;
  color: #000000;
  outline: none;
}

.meta-control--slug {
  color: rgba(0, 0, 0, 0.55);
}

.meta-control--slug::placeholder {
  color: rgba(0, 0, 0, 0.45);
  opacity: 1;
}

.meta-control:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.10);
}

.meta-control::placeholder {
  color: rgba(0, 0, 0, 0.45);
  opacity: 1;
}

.meta-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  cursor: pointer;
}

.meta-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-select__chev {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  flex-shrink: 0;
}

.meta-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  min-width: 240px;
  z-index: 80;
  margin-top: 8px;
  border-radius: 14px;
  border: 1px solid #000000;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.10);
  overflow: hidden;
}

.meta-option {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #000000;
}

.meta-option:hover,
.meta-option:focus-visible {
  outline: none;
  background: rgba(0, 0, 0, 0.06);
}

.meta-option__label {
  font-size: 13px;
  font-weight: 600;
}

.meta-option__tick {
  color: #000000;
}

.preview {
  min-width: 0;
  position: relative;
  z-index: 1;
}

/* --- Published layout (copied from NewsDetail.vue) --- */
.detail {
  padding-top: 6px;
}

.hero {
  text-align: center;
  padding: 8px 0 0;
}

.hero-meta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  margin-bottom: 28px;
}

.hero-meta__item--date {
  color: rgba(0, 0, 0, 0.55);
}

.hero-meta__dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
}

.hero-meta__item {
  white-space: nowrap;
}

.hero-title {
  margin: 0 auto;
  max-width: min(1100px, 100%);
  font-size: 64px;
  line-height: 1.12;
  letter-spacing: 0.01em;
  font-weight: 650;
  color: #000000;
}

.hero-dek {
  margin: 28px auto 0;
  max-width: 860px;
  font-size: 20px;
  line-height: 1.7;
  color: #000000;
}

.hero-title-input,
.hero-dek-input {
  display: block;
  width: 100%;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  text-align: center;
}

.hero-title-input::placeholder,
.hero-dek-input::placeholder {
  color: rgba(0, 0, 0, 0.45);
  opacity: 1;
}

.hero-title-input {
  padding: 0;
}

.hero-dek-input {
  padding: 0;
}

.hero-title-input:disabled,
.hero-dek-input:disabled {
  opacity: 0.75;
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.18);
  margin: 52px 0 18px;
}

.content {
  max-width: 860px;
  margin: 0 auto;
}

.content-textarea {
  width: 100%;
  border: 1px solid #000000;
  outline: none;
  background: transparent;
  resize: vertical;
  font-size: 18px;
  line-height: 1.8;
  color: #000000;
  padding: 14px 16px;
  border-radius: 14px;
  min-height: 260px;
  margin-top: 6px;
}

.content-textarea:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.10);
}

.content-textarea::placeholder {
  color: rgba(0, 0, 0, 0.45);
  opacity: 1;
}

.content-footer {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.content-hint {
  font-size: 12px;
  color: #000000;
}

.content-preview-hint {
  font-size: 12px;
  color: #000000;
}

@media (max-width: 980px) {
  .meta-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .meta-options {
    min-width: 0;
  }
}

@media (max-width: 860px) {
  .hero-meta {
    font-size: 14px;
    margin-bottom: 18px;
  }
  .hero-title {
    font-size: 46px;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }
  .hero-dek {
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.75;
  }
  .divider {
    margin: 34px 0 14px;
  }
  .meta-bar {
    grid-template-columns: 1fr;
  }
  .meta-options {
    min-width: 0;
  }
}

/* Bottom action bar */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: #ffffff;
  backdrop-filter: none;
  border-top: none;
  box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.06);
  padding: 0 30px;
}

.bottom-inner {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 72px;
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.bottom-left {
  min-width: 0;
}

.bottom-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #000000;
}

.bottom-sub {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  max-width: 720px;
}

.bottom-right {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Bigger controls inside wider bottom bar */
.bottom-bar .btn {
  height: 36px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

@media (max-width: 860px) {
  .bottom-bar {
    padding: 0 18px;
  }
  .bottom-inner {
    min-height: 84px;
    padding: 12px 0;
    align-items: flex-start;
  }
  .bottom-sub {
    max-width: 560px;
  }
  .bottom-bar .btn {
    height: 34px;
    padding: 0 12px;
  }
}
</style>

