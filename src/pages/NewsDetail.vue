<template>
  <section class="detail-page">
    <div class="detail-container">
      <div v-if="isLoading" class="loading" role="status" aria-live="polite">
        Loading…
      </div>

      <div v-else-if="article" class="detail">
        <header class="hero" aria-label="Article header">
          <div class="hero-meta" role="group" aria-label="Article meta">
            <time class="hero-meta__item" :datetime="article.publishedAt">
              {{ formatDateLong(article.publishedAt, i18n.locale) }}
            </time>
            <span class="hero-meta__dot" aria-hidden="true"></span>
            <span class="hero-meta__item">{{ t(`news.categories.${article.category}`) }}</span>
          </div>

          <h1 class="hero-title">{{ article.title }}</h1>
          <p v-if="dekText" class="hero-dek">
            {{ dekText }}
          </p>
        </header>

        <div class="divider" aria-hidden="true"></div>

        <div class="actions">
          <button class="share-btn" type="button" @click="onShare" :aria-label="shareAria">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10.5 4.4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 11a5 5 0 0 0-7.07 0L5.5 12.4a5 5 0 0 0 7.07 7.07L13.5 18.6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="share-text">{{ shareLabel }}</span>
          </button>
        </div>

        <div class="content">
          <p v-for="(p, idx) in bodyParagraphs" :key="idx" class="para">
            {{ p }}
          </p>
        </div>
      </div>

      <div v-else class="not-found">
        <h1 class="nf-title">Not found</h1>
        <p class="nf-text">This article does not exist or has been removed.</p>
        <button class="nf-back" type="button" @click="router.push('/news')">Back to News</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { formatDateLong, getNewsBySlug } from '@/services/newsService'
import { useErrorStore } from '@/stores/error'

const route = useRoute()
const router = useRouter()
const i18n = useI18nStore()
const t = (key, vars) => i18n.t(key, vars)
const errorStore = useErrorStore()

const article = ref(null)
const isLoading = ref(false)

async function loadArticle() {
  const slug = String(route.params.slug || '')
  if (!slug) {
    article.value = null
    return
  }

  isLoading.value = true
  try {
    article.value = await getNewsBySlug(slug)
    if (!article.value) {
      // Silent not-found; UI will show the not-found block
    }
  } catch (e) {
    errorStore.showError(e?.message || 'Failed to load article')
    article.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadArticle()
})

watch(
  () => route.params.slug,
  () => {
    loadArticle()
  }
)

const dekConfig = computed(() => {
  const a = article.value
  if (!a) return { text: '', stripFromBody: false }

  // Allow future extension: if your backend adds subtitle/summary, it will render here automatically.
  const fromField = a.subtitle || a.summary || a.dek
  if (typeof fromField === 'string' && fromField.trim()) {
    return { text: fromField.trim(), stripFromBody: false }
  }

  // Fallback: use the first content paragraph as the "dek" (and remove it from body to avoid duplication)
  const first = Array.isArray(a.content) ? a.content[0] : ''
  return { text: typeof first === 'string' ? first.trim() : '', stripFromBody: true }
})

const dekText = computed(() => dekConfig.value.text)

const bodyParagraphs = computed(() => {
  const a = article.value
  if (!a || !Array.isArray(a.content)) return []
  if (dekConfig.value.stripFromBody) return a.content.slice(1)
  return a.content
})

const shareLabel = ref('Share')
const shareAria = computed(() =>
  shareLabel.value === 'Copied' ? 'Link copied' : 'Share this article'
)

async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Legacy fallback
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.top = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

async function onShare() {
  const a = article.value
  if (!a) return

  const url = window.location.href

  try {
    if (navigator?.share) {
      await navigator.share({ title: a.title, url })
      return
    }
    await copyToClipboard(url)
    shareLabel.value = 'Copied'
    window.setTimeout(() => {
      shareLabel.value = 'Share'
    }, 1600)
  } catch {
    // no-op: keep UI silent
  }
}
</script>

<style scoped>
.detail-page {
  background: #fbfbfb;
  padding: 120px 24px 80px;
}

.detail-container {
  max-width: 1100px;
  margin: 0 auto;
}

.loading {
  padding: 28px 0;
  color: rgba(17, 24, 39, 0.62);
  font-size: 14px;
}

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
  color: rgba(17, 24, 39, 0.58);
  margin-bottom: 28px;
}

.hero-meta__item {
  white-space: nowrap;
}

.hero-meta__dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.36);
}

.hero-title {
  margin: 0 auto;
  max-width: min(1100px, 100%);
  font-size: 64px;
  line-height: 1.12;
  letter-spacing: 0.01em;
  font-weight: 650;
  color: #0b0f19;
}

.hero-dek {
  margin: 28px auto 0;
  max-width: 860px;
  font-size: 20px;
  line-height: 1.7;
  color: rgba(17, 24, 39, 0.72);
}

.divider {
  height: 1px;
  background: rgba(17, 24, 39, 0.12);
  margin: 52px 0 18px;
}

.actions {
  max-width: 860px;
  margin: 0 auto 46px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  padding: 8px 6px;
  color: rgba(17, 24, 39, 0.78);
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.share-btn:hover,
.share-btn:focus-visible {
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.92);
  outline: none;
}

.share-text {
  font-size: 16px;
  line-height: 1.2;
  font-weight: 600;
}

.content {
  max-width: 860px;
  margin: 0 auto;
}

.para {
  margin: 0 0 18px;
  font-size: 18px;
  line-height: 1.8;
  color: rgba(17, 24, 39, 0.78);
}

.not-found {
  padding: 36px 0;
}

.nf-title {
  margin: 0 0 10px;
  font-size: 40px;
}

.nf-text {
  margin: 0 0 18px;
  color: rgba(17, 24, 39, 0.7);
}

.nf-back {
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  background: #fff;
  cursor: pointer;
}

@media (max-width: 860px) {
  .divider {
    margin: 34px 0 14px;
  }
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
  .actions {
    margin-bottom: 26px;
  }
}
</style>


