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

            <!-- 封面图上传 - 放在标题下方，横线上方 -->
            <div class="cover-section reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '200ms' }">
              <div v-if="coverImage" class="cover-preview">
                <img :src="coverImage.url" alt="Cover preview" class="cover-img" />
                <button
                  class="cover-remove"
                  type="button"
                  @click="removeCoverImage"
                  :disabled="isPublishing"
                  :aria-label="i18n.locale === 'zh' ? '移除封面' : 'Remove cover'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <label v-else class="cover-dropzone" :class="{ uploading: isUploadingCover }">
                <input
                  ref="coverInputRef"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  class="sr-only"
                  :disabled="isPublishing || isUploadingCover"
                  @change="handleCoverUpload"
                />
                <div class="dropzone-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="dropzone-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="dropzone-text">
                    {{ isUploadingCover 
                      ? (i18n.locale === 'zh' ? '上传中...' : 'Uploading...') 
                      : (i18n.locale === 'zh' ? '添加封面图' : 'Add cover image') 
                    }}
                  </span>
                </div>
              </label>
            </div>
          </header>

          <div class="divider" aria-hidden="true"></div>

          <!-- 图文混排编辑区域 -->
          <div class="content">
            <div class="section-label">{{ i18n.locale === 'zh' ? '正文内容' : 'Content' }}</div>
            
            <!-- 可视化编辑区：块列表 -->
            <div class="visual-editor">
              <div 
                v-for="(block, idx) in contentBlocks" 
                :key="block.id" 
                class="editor-block"
                :class="{ 'editor-block--image': block.type === 'image' }"
              >
                <!-- 文本块 -->
                <div v-if="block.type === 'text'" class="block-text">
                  <textarea
                    class="block-textarea"
                    v-model="block.content"
                    :disabled="isPublishing"
                    rows="3"
                    :placeholder="i18n.locale === 'zh' ? '输入段落内容...' : 'Write paragraph...'"
                    @input="autoResizeTextarea($event)"
                    @keydown.enter="handleEnterKey($event, idx)"
                  ></textarea>
                  <button
                    v-if="contentBlocks.length > 1"
                    class="block-remove"
                    type="button"
                    @click="removeBlock(idx)"
                    :disabled="isPublishing"
                    :title="i18n.locale === 'zh' ? '删除段落' : 'Remove paragraph'"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>

                <!-- 图片块 -->
                <div v-else-if="block.type === 'image'" class="block-image">
                  <img :src="block.url" alt="Image" class="block-image-preview" />
                  <button
                    class="block-remove block-remove--image"
                    type="button"
                    @click="removeBlock(idx)"
                    :disabled="isPublishing"
                    :title="i18n.locale === 'zh' ? '删除图片' : 'Remove image'"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>

                <!-- 块之间的插入按钮 -->
                <div class="block-insert-bar">
                  <button
                    class="insert-btn"
                    type="button"
                    @click="insertTextBlockAfter(idx)"
                    :disabled="isPublishing"
                    :title="i18n.locale === 'zh' ? '添加段落' : 'Add paragraph'"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>{{ i18n.locale === 'zh' ? '段落' : 'Text' }}</span>
                  </button>
                  <label class="insert-btn" :class="{ uploading: isUploadingContent }">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      class="sr-only"
                      :disabled="isPublishing || isUploadingContent"
                      @change="handleInsertImage($event, idx)"
                    />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ isUploadingContent ? (i18n.locale === 'zh' ? '上传中...' : 'Uploading...') : (i18n.locale === 'zh' ? '图片' : 'Image') }}</span>
                  </label>
                </div>
              </div>

              <!-- 空状态：添加第一个块 -->
              <div v-if="contentBlocks.length === 0" class="editor-empty">
                <button class="empty-add-btn" type="button" @click="addFirstTextBlock" :disabled="isPublishing">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ i18n.locale === 'zh' ? '开始编写内容' : 'Start writing' }}</span>
                </button>
              </div>
            </div>

            <div class="content-footer">
              <div class="content-hint">
                {{ i18n.locale === 'zh' ? '段落：' : 'Paragraphs: ' }}{{ textBlockCount }}
                <span v-if="imageBlockCount > 0"> · {{ i18n.locale === 'zh' ? '图片：' : 'Images: ' }}{{ imageBlockCount }}</span>
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useErrorStore } from '@/stores/error'
import { useSuccessStore } from '@/stores/success'
import { useWarningStore } from '@/stores/warning'
import { useUserStore } from '@/stores/user'
import { createNews, formatDateLong } from '@/services/newsService'
import { uploadImage, linkImageToNews } from '@/services/imageService'

const router = useRouter()
const i18n = useI18nStore()
const errorStore = useErrorStore()
const successStore = useSuccessStore()
const warningStore = useWarningStore()
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
    const role = json?.role
    // role >= 3 can publish/delete news
    if (typeof role === 'number' && role >= 3) return true
    if (!('role' in json)) return true
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

const isPublishing = ref(false)

// 图片上传相关
const coverImage = ref(null) // { id, url, file }
const isUploadingCover = ref(false)
const isUploadingContent = ref(false)
const coverInputRef = ref(null)
const insertAfterIndex = ref(-1) // 记录图片插入位置

// 块编辑器：每个块是 { id, type: 'text'|'image', content?, url?, imageId?, caption? }
let blockIdCounter = 0
const contentBlocks = ref([
  { id: blockIdCounter++, type: 'text', content: '' }
])

// 允许的图片类型
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

function validateImageFile(file) {
  if (!file) return { valid: false, error: '请选择图片文件' }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG、PNG、GIF、WebP 格式' }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: '图片大小不能超过 10MB' }
  }
  return { valid: true, error: null }
}

async function handleCoverUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const validation = validateImageFile(file)
  if (!validation.valid) {
    warningStore.showWarning(validation.error)
    return
  }

  isUploadingCover.value = true
  try {
    const result = await uploadImage(file, 'cover')
    coverImage.value = {
      id: result.id,
      url: result.url,
      file: file,
    }
    successStore.showSuccess(i18n.locale === 'zh' ? '封面上传成功' : 'Cover uploaded')
  } catch (e) {
    errorStore.showError(e?.message || (i18n.locale === 'zh' ? '封面上传失败' : 'Cover upload failed'))
  } finally {
    isUploadingCover.value = false
    // 清空input以便重复选择同一文件
    if (coverInputRef.value) coverInputRef.value.value = ''
  }
}

function removeCoverImage() {
  coverImage.value = null
}

// 块编辑器操作
function addFirstTextBlock() {
  contentBlocks.value.push({ id: blockIdCounter++, type: 'text', content: '' })
}

function insertTextBlockAfter(index) {
  const newBlock = { id: blockIdCounter++, type: 'text', content: '' }
  contentBlocks.value.splice(index + 1, 0, newBlock)
}

function removeBlock(index) {
  if (contentBlocks.value.length <= 1 && contentBlocks.value[0].type === 'text') {
    // 保留至少一个文本块，只清空内容
    contentBlocks.value[0].content = ''
    return
  }
  contentBlocks.value.splice(index, 1)
}

async function handleInsertImage(event, afterIndex) {
  const file = event.target.files?.[0]
  if (!file) return

  const validation = validateImageFile(file)
  if (!validation.valid) {
    warningStore.showWarning(validation.error)
    return
  }

  isUploadingContent.value = true
  insertAfterIndex.value = afterIndex
  
  try {
    const result = await uploadImage(file, 'content')
    const newBlock = {
      id: blockIdCounter++,
      type: 'image',
      url: result.url,
      imageId: result.id,
      caption: '',
    }
    contentBlocks.value.splice(afterIndex + 1, 0, newBlock)
    successStore.showSuccess(i18n.locale === 'zh' ? '图片已插入' : 'Image inserted')
  } catch (e) {
    errorStore.showError(e?.message || (i18n.locale === 'zh' ? '图片上传失败' : 'Image upload failed'))
  } finally {
    isUploadingContent.value = false
    insertAfterIndex.value = -1
    // 清空 input
    event.target.value = ''
  }
}

function autoResizeTextarea(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function handleEnterKey(event, blockIndex) {
  // Shift+Enter 换行，Enter 创建新段落
  if (!event.shiftKey) {
    event.preventDefault()
    insertTextBlockAfter(blockIndex)
    // 聚焦新块
    nextTick(() => {
      const textareas = document.querySelectorAll('.block-textarea')
      if (textareas[blockIndex + 1]) {
        textareas[blockIndex + 1].focus()
      }
    })
  }
}

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
  coverImage.value = null
  contentBlocks.value = [{ id: blockIdCounter++, type: 'text', content: '' }]
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

// 从块生成内容数组（用于发布）
const contentParagraphs = computed(() => {
  const result = []
  let imageIndex = 0
  for (const block of contentBlocks.value) {
    if (block.type === 'text') {
      const text = String(block.content || '').trim()
      if (text) result.push(text)
    } else if (block.type === 'image') {
      result.push(`[IMAGE:${imageIndex}]`)
      imageIndex++
    }
  }
  return result
})

// 提取所有图片块（用于发布时关联）
const contentImages = computed(() => {
  return contentBlocks.value
    .filter(b => b.type === 'image')
    .map((b, idx) => ({
      id: b.imageId,
      url: b.url,
      position: idx,
      caption: b.caption || '',
    }))
})

const textBlockCount = computed(() => contentBlocks.value.filter(b => b.type === 'text' && b.content?.trim()).length)
const imageBlockCount = computed(() => contentBlocks.value.filter(b => b.type === 'image').length)
const paragraphCount = computed(() => textBlockCount.value)

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
    content: contentParagraphs.value,
    // 添加图片信息
    cover_image: coverImage.value?.url || null,
    images: contentImages.value,
  }

  // Basic validation (backend still validates)
  if (!payload.slug || !payload.title || !payload.category || !payload.publishedAt) {
    warningStore.showWarning(i18n.locale === 'zh' ? '请填写 slug / 标题 / 分类 / 日期' : 'Please fill slug / title / category / date')
    return
  }
  if (!Array.isArray(payload.content) || payload.content.length === 0) {
    warningStore.showWarning(i18n.locale === 'zh' ? '请填写正文' : 'Please fill content')
    return
  }

  isPublishing.value = true
  try {
    const data = await createNews(payload)
    const newsId = data?.id

    // 如果有图片且返回了新闻ID，关联图片到新闻
    if (newsId) {
      const imageIds = []
      if (coverImage.value?.id) imageIds.push(coverImage.value.id)
      contentImages.value.forEach((img) => {
        if (img.id) imageIds.push(img.id)
      })

      // 并行关联所有图片
      await Promise.all(
        imageIds.map((imgId) => linkImageToNews(imgId, newsId).catch(() => null))
      )
    }

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
  margin: 0 auto 24px;
  max-width: 860px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 0;
  background: transparent;
  position: relative;
  z-index: 20;
}

.meta-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
  position: relative;
}

.meta-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.45);
}

.meta-control {
  height: 40px;
  width: 100%;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  background: transparent;
  padding: 0;
  font-size: 15px;
  color: #000000;
  outline: none;
  transition: border-color 0.2s ease;
}

.meta-control--slug {
  color: rgba(0, 0, 0, 0.7);
}

.meta-control--slug::placeholder {
  color: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.meta-control:hover {
  border-bottom-color: rgba(0, 0, 0, 0.4);
}

.meta-control:focus {
  border-bottom-color: #000000;
  box-shadow: none;
}

.meta-control::placeholder {
  color: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.meta-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.meta-select:hover .meta-select__chev {
  color: #000000;
}

.meta-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  min-width: 180px;
  z-index: 80;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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

/* Bottom action bar */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -6px 32px rgba(0, 0, 0, 0.08);
  padding: 0 30px;
}

.bottom-inner {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 72px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.bottom-left {
  min-width: 0;
}

.bottom-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #000000;
}

.bottom-sub {
  margin-top: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  max-width: 720px;
}

.bottom-right {
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Bigger controls inside wider bottom bar */
.bottom-bar .btn {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* 图片上传样式 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.section-label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 12px;
}

/* 封面图上传 */
.cover-section {
  max-width: 860px;
  margin: 32px auto 0;
}

.cover-dropzone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cover-dropzone:hover {
  border-color: #000000;
  background: rgba(0, 0, 0, 0.03);
}

.cover-dropzone.uploading {
  opacity: 0.6;
  cursor: wait;
}

.dropzone-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(0, 0, 0, 0.5);
}

.dropzone-icon {
  color: rgba(0, 0, 0, 0.4);
}

.dropzone-text {
  font-size: 13px;
  font-weight: 500;
}

.cover-preview {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-img {
  width: 100%;
  height: auto;
  max-height: 360px;
  object-fit: cover;
  display: block;
}

.cover-remove {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.cover-preview:hover .cover-remove {
  opacity: 1;
}

.cover-remove:hover {
  background: #000000;
  transform: scale(1.1);
}

/* 内容图片上传 */
.images-section {
  max-width: 860px;
  margin: 24px auto 0;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
}

.image-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-action-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.image-action-btn:hover {
  background: #000000;
  transform: scale(1.1);
}

.image-action-btn--danger:hover {
  background: #dc2626;
}

.image-index {
  position: absolute;
  bottom: 6px;
  left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
}

.image-add {
  aspect-ratio: 1;
  border: 2px dashed rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.image-add:hover {
  border-color: #000000;
  background: rgba(255, 255, 255, 0.9);
}

.image-add.uploading {
  opacity: 0.7;
  cursor: wait;
}

.image-add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.55);
}

.image-add-content span {
  font-size: 11px;
  font-weight: 600;
}

/* 可视化块编辑器 */
.visual-editor {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 300px;
}

.editor-block {
  position: relative;
}

/* 文本块 */
.block-text {
  position: relative;
}

.block-textarea {
  width: 100%;
  border: 1px solid transparent;
  outline: none;
  background: transparent;
  resize: none;
  font-size: 18px;
  line-height: 1.8;
  color: #000000;
  padding: 12px 40px 12px 16px;
  border-radius: 10px;
  min-height: 60px;
  transition: all 0.2s ease;
}

.block-textarea:hover {
  background: rgba(0, 0, 0, 0.02);
}

.block-textarea:focus {
  background: #ffffff;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.block-textarea::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.block-remove {
  position: absolute;
  top: 12px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.block-text:hover .block-remove,
.editor-block--image:hover .block-remove {
  opacity: 1;
}

.block-remove:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* 图片块 */
.block-image {
  position: relative;
  margin: 8px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.block-image-preview {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
}



.block-remove--image {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  opacity: 0;
}

.block-image:hover .block-remove--image {
  opacity: 1;
}

.block-remove--image:hover {
  background: #dc2626;
  color: #ffffff;
}

/* 块之间的插入栏 */
.block-insert-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editor-block:hover .block-insert-bar,
.block-insert-bar:focus-within {
  opacity: 1;
}

.insert-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #ffffff;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.insert-btn:hover {
  border-color: #000000;
  color: #000000;
  background: #ffffff;
}

.insert-btn.uploading {
  opacity: 0.5;
  cursor: wait;
}

/* 空状态 */
.editor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
}

.empty-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-add-btn:hover {
  background: #000000;
  color: #ffffff;
}
</style>

