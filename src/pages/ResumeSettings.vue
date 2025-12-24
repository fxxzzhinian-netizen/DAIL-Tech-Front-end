<template>
  <section class="resume-page">
    <div class="resume-container">
      <!-- Meta bar -->
      <div class="meta-bar reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '80ms' }">
        <label class="meta-field">
          <span class="meta-label">{{ isZh ? '姓名' : 'Name' }}</span>
          <input class="meta-control" v-model.trim="form.real_name" :placeholder="isZh ? '请输入姓名' : 'Enter name'" />
        </label>
        <label class="meta-field">
          <span class="meta-label">{{ isZh ? '职位' : 'Title' }}</span>
          <input class="meta-control" v-model.trim="extras.job_title" :placeholder="isZh ? '产品经理 / AI 工程师' : 'PM / AI Engineer'" />
        </label>
        <label class="meta-field">
          <span class="meta-label">{{ isZh ? '部门' : 'Department' }}</span>
          <input class="meta-control" v-model.trim="extras.department" :placeholder="isZh ? '研发/产品' : 'R&D / Product'" />
        </label>
      </div>

      <!-- Main preview area -->
      <main class="preview reveal" :class="{ 'is-in': pageEnter }" :style="{ '--d': '160ms' }">
        <div class="detail">
          <header class="hero">
            <div class="avatar-section">
              <label class="avatar-uploader" :class="{ uploading: isUploadingAvatar, 'has-avatar': !!avatarUrl }">
                <input ref="avatarInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="sr-only" :disabled="isUploadingAvatar" @change="handleAvatarUpload" />
                <div class="avatar-circle">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
                  <div v-else class="avatar-letter">{{ avatarLetter }}</div>
                  <div class="avatar-overlay">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </label>
            </div>
            <textarea class="hero-title hero-title-input" v-model="form.real_name" rows="1" :placeholder="isZh ? '请输入姓名…' : 'Enter your name…'"></textarea>
            <textarea class="hero-dek hero-dek-input" v-model="extras.job_title" rows="1" :placeholder="isZh ? '职位/标签（可选）…' : 'Title / Tagline (optional)…'"></textarea>
          </header>

          <div class="divider"></div>

          <!-- Basic info -->
          <div class="content">
            <div class="section-label">{{ isZh ? '基本信息' : 'Basic Information' }}</div>
            <div class="info-row">
              <label class="info-field">
                <span class="info-label">{{ isZh ? '年龄' : 'Age' }}</span>
                <input class="info-control" type="number" min="0" v-model.number="form.age" />
              </label>
              <label class="info-field">
                <span class="info-label">{{ isZh ? '学历' : 'Education' }}</span>
                <input class="info-control" v-model.trim="extras.education" :placeholder="isZh ? '本科/硕士' : 'Bachelor/Master'" />
              </label>
              <label class="info-field">
                <span class="info-label">{{ isZh ? '邮箱' : 'Email' }}</span>
                <input class="info-control" v-model.trim="form.email" :placeholder="isZh ? '邮箱' : 'Email'" />
              </label>
            </div>
            <div class="info-row">
              <label class="info-field">
                <span class="info-label">{{ isZh ? '电话' : 'Phone' }}</span>
                <input class="info-control" v-model.trim="form.phone" :placeholder="isZh ? '电话' : 'Phone'" />
              </label>
              <label class="info-field">
                <span class="info-label">{{ isZh ? '所在地' : 'Location' }}</span>
                <input class="info-control" v-model.trim="form.address" :placeholder="isZh ? '上海' : 'Shanghai'" />
              </label>
              <div class="info-field"></div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Resume visual editor -->
          <div class="content">
            <div class="section-label">{{ isZh ? '个人简历' : 'Resume' }}</div>
            
            <div class="visual-editor">
              <div v-for="(block, idx) in contentBlocks" :key="block.id" class="editor-block" :class="{ 'editor-block--image': block.type === 'image' }">
                <!-- Text block -->
                <div v-if="block.type === 'text'" class="block-text">
                  <textarea
                    class="block-textarea"
                    v-model="block.content"
                    rows="3"
                    :placeholder="isZh ? '输入内容...' : 'Write content...'"
                    @input="autoResizeTextarea($event)"
                    @keydown.enter="handleEnterKey($event, idx)"
                  ></textarea>
                  <button v-if="contentBlocks.length > 1" class="block-remove" type="button" @click="removeBlock(idx)" :title="isZh ? '删除' : 'Remove'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <!-- Image block -->
                <div v-else-if="block.type === 'image'" class="block-image">
                  <img :src="block.url" alt="Image" class="block-image-preview" />
                  <button class="block-remove block-remove--image" type="button" @click="removeBlock(idx)" :title="isZh ? '删除图片' : 'Remove image'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <!-- Insert bar between blocks -->
                <div class="block-insert-bar">
                  <button class="insert-btn" type="button" @click="insertTextBlockAfter(idx)" :title="isZh ? '添加段落' : 'Add paragraph'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    <span>{{ isZh ? '段落' : 'Text' }}</span>
                  </button>
                  <label class="insert-btn" :class="{ uploading: isUploadingContent }">
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="sr-only" :disabled="isUploadingContent" @change="handleInsertImage($event, idx)" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ isUploadingContent ? (isZh ? '上传中...' : 'Uploading...') : (isZh ? '图片' : 'Image') }}</span>
                  </label>
                </div>
              </div>
              <!-- Empty state -->
              <div v-if="contentBlocks.length === 0" class="editor-empty">
                <button class="empty-add-btn" type="button" @click="addFirstTextBlock">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>{{ isZh ? '开始编写内容' : 'Start writing' }}</span>
                </button>
              </div>
            </div>

            <div class="content-footer">
              <div class="content-hint">
                {{ isZh ? '段落：' : 'Paragraphs: ' }}{{ textBlockCount }}
                <span v-if="imageBlockCount > 0"> · {{ isZh ? '图片：' : 'Images: ' }}{{ imageBlockCount }}</span>
              </div>
            </div>
          </div>

          <div v-if="isLoadingResume" class="loading-hint">{{ isZh ? '加载中…' : 'Loading…' }}</div>
        </div>
      </main>
    </div>

    <!-- Bottom bar -->
    <div class="bottom-bar">
      <div class="bottom-inner">
        <div class="bottom-left">
          <div class="bottom-title">{{ isZh ? '简历编辑' : 'Resume Editor' }}</div>
          <div class="bottom-sub">{{ isZh ? '编辑个人信息，预览简历效果。' : 'Edit your profile and preview resume.' }}</div>
        </div>
        <div class="bottom-right">
          <div class="toggle-group">
            <span class="toggle-label">{{ form.is_public ? (isZh ? '公开' : 'Public') : (isZh ? '私密' : 'Privacy') }}</span>
            <input type="checkbox" class="theme-checkbox" v-model="form.is_public" />
          </div>
          <button class="btn ghost" type="button" @click="router.push('/user')">{{ isZh ? '返回' : 'Back' }}</button>
          <button class="btn ghost" type="button" :disabled="isLoadingResume" @click="loadAll">{{ isZh ? '刷新' : 'Refresh' }}</button>
          <button class="btn primary" type="button" :disabled="isSavingResume" @click="saveAll">
            {{ isSavingResume ? (isZh ? '保存中…' : 'Saving…') : (isZh ? '保存' : 'Save') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useI18nStore } from '@/stores/i18n'
import { useErrorStore } from '@/stores/error'
import { useSuccessStore } from '@/stores/success'
import { useWarningStore } from '@/stores/warning'

import { createOrUpdateResume, getMyResume } from '@/services/resumeService'
import { uploadUserImage } from '@/services/userImageService'

const router = useRouter()
const userStore = useUserStore()
const i18n = useI18nStore()
const errorStore = useErrorStore()
const successStore = useSuccessStore()
const warningStore = useWarningStore()

const isZh = computed(() => i18n.locale === 'zh')
const pageEnter = ref(false)
const resume = ref(null)

const form = reactive({
  real_name: '',
  gender: '',
  age: null,
  address: '',
  is_public: false,
  email: '',
  phone: '',
})

const extras = reactive({
  job_title: '',
  education: '',
  department: '',
})

const avatarUrl = computed(() => {
  const r = resume.value
  return r?.avatar_url || r?.avatarUrl || r?.avatar || r?.avatarImageUrl || ''
})

const avatarLetter = computed(() => {
  const s = String(form.real_name || '').trim() || String(userStore.displayNameText || userStore.displayName || userStore.username || 'U').trim() || 'U'
  return (s[0] || 'U').toUpperCase()
})

const isLoadingResume = ref(false)
const isSavingResume = ref(false)

// Avatar upload
const avatarInputRef = ref(null)
const isUploadingAvatar = ref(false)

// Content blocks editor
let blockIdCounter = 0
const contentBlocks = ref([{ id: blockIdCounter++, type: 'text', content: '' }])
const isUploadingContent = ref(false)
const insertAfterIndex = ref(-1)

// Track the next available position from database (max position + 1)
const nextBioImagePosition = ref(0)

const textBlockCount = computed(() => contentBlocks.value.filter(b => b.type === 'text' && b.content?.trim()).length)
const imageBlockCount = computed(() => contentBlocks.value.filter(b => b.type === 'image').length)

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function validateImageFile(file) {
  if (!file) return { valid: false, error: isZh.value ? '请选择图片文件' : 'Please choose an image file' }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: isZh.value ? '仅支持 JPG、PNG、GIF、WebP 格式' : 'Only JPG/PNG/GIF/WebP are supported' }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: isZh.value ? '图片大小不能超过 10MB' : 'Image must be <= 10MB' }
  }
  return { valid: true, error: null }
}

async function handleAvatarUpload(event) {
  const file = event?.target?.files?.[0]
  if (!file) return
  const validation = validateImageFile(file)
  if (!validation.valid) {
    warningStore.showWarning(validation.error)
    if (avatarInputRef.value) avatarInputRef.value.value = ''
    return
  }
  isUploadingAvatar.value = true
  try {
    await uploadUserImage({ file, imageType: 'avatar', caption: '', displayOrder: 0 })
    successStore.showSuccess(isZh.value ? '头像上传成功' : 'Avatar uploaded')
    await loadResume()
  } catch (e) {
    errorStore.showError(isZh.value ? `头像上传失败：${e?.message || e}` : `Avatar upload failed: ${e?.message || e}`)
  } finally {
    isUploadingAvatar.value = false
    if (avatarInputRef.value) avatarInputRef.value.value = ''
  }
}

// Block editor operations
function addFirstTextBlock() {
  contentBlocks.value.push({ id: blockIdCounter++, type: 'text', content: '' })
}

function insertTextBlockAfter(index) {
  const newBlock = { id: blockIdCounter++, type: 'text', content: '' }
  contentBlocks.value.splice(index + 1, 0, newBlock)
}

function removeBlock(index) {
  if (contentBlocks.value.length <= 1 && contentBlocks.value[0].type === 'text') {
    contentBlocks.value[0].content = ''
    return
  }
  contentBlocks.value.splice(index, 1)
}

async function handleInsertImage(event, afterIndex) {
  const file = event?.target?.files?.[0]
  if (!file) return
  const validation = validateImageFile(file)
  if (!validation.valid) {
    warningStore.showWarning(validation.error)
    return
  }
  isUploadingContent.value = true
  insertAfterIndex.value = afterIndex
  try {
    // Use the next available position from database, not current page image count
    const displayOrder = nextBioImagePosition.value
    const result = await uploadUserImage({ file, imageType: 'bio', caption: '', displayOrder })
    const imageUrl = result.url || ''
    if (!imageUrl) {
      console.warn('Upload result:', result)
      throw new Error('No image URL in response')
    }
    // Use the position returned from server, or fallback to displayOrder we sent
    const actualPosition = result.display_order ?? result.position ?? displayOrder
    const newBlock = { id: blockIdCounter++, type: 'image', url: imageUrl, position: actualPosition }
    contentBlocks.value.splice(afterIndex + 1, 0, newBlock)
    // Increment next position for future uploads
    nextBioImagePosition.value = actualPosition + 1
    successStore.showSuccess(isZh.value ? '图片已插入' : 'Image inserted')
  } catch (e) {
    errorStore.showError(isZh.value ? `图片上传失败：${e?.message || e}` : `Image upload failed: ${e?.message || e}`)
  } finally {
    isUploadingContent.value = false
    insertAfterIndex.value = -1
    event.target.value = ''
  }
}

function autoResizeTextarea(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function handleEnterKey(event, blockIndex) {
  // Ctrl+Enter or Cmd+Enter to create new block, regular Enter for newline
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    insertTextBlockAfter(blockIndex)
    nextTick(() => {
      const textareas = document.querySelectorAll('.block-textarea')
      if (textareas[blockIndex + 1]) textareas[blockIndex + 1].focus()
    })
  }
  // Regular Enter allows normal newline in textarea
}

function applyResumeToForm(r) {
  form.real_name = String(r?.real_name ?? r?.realName ?? '')
  form.gender = String(r?.gender ?? '')
  const age = r?.age
  form.age = age === null || age === undefined || age === '' ? null : Number(age)
  form.address = String(r?.address ?? '')
  form.is_public = Boolean(r?.is_public ?? r?.isPublic ?? false)
  form.email = String(r?.email ?? '')
  form.phone = String(r?.phone ?? '')
  extras.job_title = String(r?.job_title ?? r?.title ?? r?.position ?? r?.tagline ?? '')
  extras.education = String(r?.education ?? '')
  extras.department = String(r?.department ?? '')

  // Build bio_images map: position -> url, and find max position
  const bioImages = Array.isArray(r?.bio_images) ? r.bio_images : []
  const imageMap = {}
  let maxPosition = -1
  bioImages.forEach((img) => {
    const pos = img.position ?? img.display_order ?? 0
    imageMap[pos] = img.url || img.image_url || ''
    if (pos > maxPosition) maxPosition = pos
  })
  // Set next available position for new uploads
  nextBioImagePosition.value = maxPosition + 1

  // Load bio into blocks - parse [IMAGE:n] format and replace with actual URLs
  const bioArr = Array.isArray(r?.bio) ? r.bio.map((x) => String(x ?? '')).filter(Boolean) : []
  if (bioArr.length) {
    const imagePattern = /^\[IMAGE:(\d+)\]$/
    contentBlocks.value = bioArr.map((text) => {
      const match = text.match(imagePattern)
      if (match) {
        // It's an image block - get URL from bio_images by position
        const position = parseInt(match[1], 10)
        const imageUrl = imageMap[position] || ''
        return { id: blockIdCounter++, type: 'image', url: imageUrl, position: position }
      }
      // It's a text block
      return { id: blockIdCounter++, type: 'text', content: text }
    })
  } else {
    // No bio content, reset to empty text block
    contentBlocks.value = [{ id: blockIdCounter++, type: 'text', content: '' }]
  }
}

async function loadResume() {
  isLoadingResume.value = true
  try {
    const data = await getMyResume()
    resume.value = data || null
    applyResumeToForm(data)
  } catch (e) {
    if (e?.status === 404) {
      resume.value = null
      applyResumeToForm({})
      return
    }
    errorStore.showError(isZh.value ? `加载履历失败：${e?.message || e}` : `Failed to load resume: ${e?.message || e}`)
  } finally {
    isLoadingResume.value = false
  }
}

async function loadAll() {
  await loadResume()
}

function buildBioArray() {
  const out = []
  for (const block of contentBlocks.value) {
    if (block.type === 'text') {
      const text = String(block.content || '').trim()
      if (text) out.push(text)
    } else if (block.type === 'image') {
      // Use the actual position stored in the block (from database)
      out.push(`[IMAGE:${block.position}]`)
    }
  }
  return out
}

async function saveProfile() {
  isSavingProfile.value = true
  try {
    const patch = { email: String(profile.email || '').trim(), phone: String(profile.phone || '').trim() }
    const data = await patchMyProfile(patch)
    applyProfileFromApi(data)
  } catch (e) {
    if (e?.status === 404) return
    warningStore.showWarning(isZh.value ? '邮箱/电话保存失败（已跳过）' : 'Email/phone save failed (skipped)')
  } finally {
    isSavingProfile.value = false
  }
}

async function saveResume() {
  const basePayload = {
    real_name: String(form.real_name || '').trim(),
    gender: form.gender || null,
    age: form.age === null || form.age === undefined || form.age === '' ? null : Number(form.age),
    address: String(form.address || '').trim(),
    bio: buildBioArray(),
    is_public: Boolean(form.is_public),
    email: String(form.email || '').trim(),
    phone: String(form.phone || '').trim(),
  }
  if (!basePayload.real_name) {
    errorStore.showError(isZh.value ? '真实姓名为必填' : 'Real name is required')
    return
  }
  isSavingResume.value = true
  try {
    const extended = {
      ...basePayload,
      job_title: String(extras.job_title || '').trim() || undefined,
      education: String(extras.education || '').trim() || undefined,
      department: String(extras.department || '').trim() || undefined,
    }
    let data = null
    try {
      data = await createOrUpdateResume(extended)
    } catch (e) {
      if (e?.status === 422) {
        warningStore.showWarning(isZh.value ? '后端暂不支持部分扩展字段，已仅保存核心字段' : 'Backend rejected extra fields; saved core fields only')
        data = await createOrUpdateResume(basePayload)
      } else { throw e }
    }
    resume.value = data || resume.value
    successStore.showSuccess(isZh.value ? '履历已保存' : 'Saved')
  } catch (e) {
    errorStore.showError(isZh.value ? `保存失败：${e?.message || e}` : `Save failed: ${e?.message || e}`)
  } finally {
    isSavingResume.value = false
  }
}

async function saveAll() {
  await saveResume()
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  requestAnimationFrame(() => { pageEnter.value = true })
  await loadAll()
})
</script>


<style scoped>
.reveal {
  opacity: 0;
  transform: translate3d(0, 22px, 0);
  filter: blur(10px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--d, 0ms);
  will-change: opacity, transform, filter;
}
.reveal.is-in { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
@media (prefers-reduced-motion: reduce) { .reveal { transition: none; opacity: 1; transform: none; filter: none; } }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.resume-page { min-height: 100vh; position: relative; overflow: hidden; background: #ffffff; }

.resume-container { position: relative; max-width: 1400px; margin: 0 auto; padding: 120px 24px 148px; }

/* Meta bar */
.meta-bar { margin: 0 auto 32px; max-width: 860px; display: flex; align-items: flex-end; gap: 32px; padding: 0; background: transparent; position: relative; z-index: 20; }
.meta-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; position: relative; }
.meta-label { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(0, 0, 0, 0.5); }
.meta-control { height: 48px; width: 100%; border-radius: 0; border: none; border-bottom: 2px solid rgba(0, 0, 0, 0.15); background: transparent; padding: 0; font-size: 18px; color: #000000; outline: none; transition: border-color 0.2s ease; }
.meta-control:hover { border-bottom-color: rgba(0, 0, 0, 0.4); }
.meta-control:focus { border-bottom-color: #000000; }
.meta-control::placeholder { color: rgba(0, 0, 0, 0.3); }

.preview { min-width: 0; position: relative; z-index: 1; }
.detail { padding-top: 6px; }

/* Hero */
.hero { text-align: center; padding: 16px 0 0; }
.avatar-section { display: flex; justify-content: center; margin-bottom: 32px; }
.avatar-uploader { cursor: pointer; user-select: none; }
.avatar-circle { width: 140px; height: 140px; border-radius: 999px; overflow: hidden; border: 4px solid #fff; background: rgba(255, 255, 255, 0.9); box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2); position: relative; display: grid; place-items: center; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.avatar-uploader:hover .avatar-circle { transform: translateY(-3px); box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25); }
.avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
.avatar-letter { width: 100%; height: 100%; display: grid; place-items: center; font-size: 48px; font-weight: 950; color: rgba(15, 23, 42, 0.82); background: radial-gradient(140px 140px at 30% 20%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.55)); }
.avatar-overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(15, 23, 42, 0.42); color: #fff; opacity: 0; transition: opacity 0.15s ease; }
.avatar-uploader:hover .avatar-overlay { opacity: 1; }
.avatar-uploader.uploading { pointer-events: none; opacity: 0.75; }

.hero-title { margin: 0 auto; max-width: min(1100px, 100%); font-size: 72px; line-height: 1.08; letter-spacing: -0.02em; font-weight: 700; color: #000000; }
.hero-dek { margin: 24px auto 0; max-width: 860px; font-size: 24px; line-height: 1.6; color: rgba(0, 0, 0, 0.7); }
.hero-title-input, .hero-dek-input { display: block; width: 100%; border: 0; outline: none; resize: none; background: transparent; text-align: center; }
.hero-title-input::placeholder, .hero-dek-input::placeholder { color: rgba(0, 0, 0, 0.35); }

.divider { height: 1px; background: rgba(0, 0, 0, 0.12); margin: 60px 0 24px; }

.content { max-width: 860px; margin: 0 auto; }
.section-label { font-size: 20px; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: #000000; margin-bottom: 24px; }

/* Info row */
.info-row { display: flex; align-items: flex-end; gap: 32px; margin-bottom: 24px; }
.info-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; }
.info-label { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(0, 0, 0, 0.5); }
.info-control { height: 48px; width: 100%; border-radius: 0; border: none; border-bottom: 2px solid rgba(0, 0, 0, 0.15); background: transparent; padding: 0; font-size: 18px; color: #000000; outline: none; transition: border-color 0.2s ease; }
.info-control:hover { border-bottom-color: rgba(0, 0, 0, 0.4); }
.info-control:focus { border-bottom-color: #000000; }
.info-control::placeholder { color: rgba(0, 0, 0, 0.3); }

/* Visual editor */
.visual-editor { background: rgba(250, 250, 250, 0.8); border-radius: 20px; border: 1px solid rgba(0, 0, 0, 0.06); padding: 28px; }

.editor-block { position: relative; margin-bottom: 12px; }
.editor-block--image { margin-bottom: 20px; }

.block-text { position: relative; }
.block-textarea { width: 100%; border: none; outline: none; background: transparent; resize: none; font-size: 20px; line-height: 1.9; color: #000000; padding: 16px 48px 16px 0; min-height: 80px; }
.block-textarea::placeholder { color: rgba(0, 0, 0, 0.3); }
.block-remove { position: absolute; top: 16px; right: 0; width: 32px; height: 32px; border-radius: 999px; background: transparent; border: 1px solid rgba(0, 0, 0, 0.1); color: rgba(0, 0, 0, 0.4); cursor: pointer; display: grid; place-items: center; opacity: 0; transition: all 0.15s ease; }
.block-text:hover .block-remove { opacity: 1; }
.block-remove:hover { background: rgba(220, 38, 38, 0.1); border-color: rgba(220, 38, 38, 0.3); color: rgba(220, 38, 38, 0.8); }

.block-image { position: relative; border-radius: 16px; overflow: hidden; }
.block-image-preview { width: 100%; height: auto; display: block; }
.block-remove--image { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; background: rgba(0, 0, 0, 0.6); border: none; opacity: 0; }
.block-image:hover .block-remove--image { opacity: 1; }
.block-remove--image:hover { background: rgba(220, 38, 38, 0.9); }

.block-insert-bar { display: flex; gap: 10px; padding: 12px 0; opacity: 0; transition: opacity 0.15s ease; }
.editor-block:hover .block-insert-bar { opacity: 1; }
.insert-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; border: 1px dashed rgba(0, 0, 0, 0.15); background: transparent; color: rgba(0, 0, 0, 0.5); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
.insert-btn:hover { border-color: rgba(0, 0, 0, 0.3); color: rgba(0, 0, 0, 0.7); background: rgba(0, 0, 0, 0.02); }
.insert-btn.uploading { pointer-events: none; opacity: 0.6; }

.editor-empty { padding: 48px; text-align: center; }
.empty-add-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: 999px; border: 1px dashed rgba(0, 0, 0, 0.2); background: transparent; color: rgba(0, 0, 0, 0.5); font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
.empty-add-btn:hover { border-color: rgba(0, 0, 0, 0.4); color: rgba(0, 0, 0, 0.7); background: rgba(0, 0, 0, 0.02); }

.content-footer { margin-top: 16px; }
.content-hint { font-size: 14px; color: rgba(0, 0, 0, 0.45); }

.loading-hint { font-size: 13px; color: rgba(0, 0, 0, 0.55); padding: 8px 0; text-align: center; margin-top: 24px; }

/* Bottom bar */
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; background: #ffffff; border-top: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 -6px 32px rgba(0, 0, 0, 0.08); }
.bottom-inner { max-width: 1400px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.bottom-left { min-width: 0; }
.bottom-title { font-size: 18px; font-weight: 700; color: #000000; letter-spacing: -0.01em; }
.bottom-sub { font-size: 14px; color: rgba(0, 0, 0, 0.7); margin-top: 4px; }
.bottom-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

/* Toggle group */
.toggle-group { display: flex; align-items: center; gap: 10px; margin-right: 8px; }
.toggle-label { font-size: 14px; font-weight: 600; color: #000000; }

/* Theme checkbox toggle */
.theme-checkbox {
  --toggle-size: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 6.25em;
  height: 3.125em;
  background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
  background-size: 205%;
  background-position: 0;
  transition: 0.4s;
  border-radius: 99em;
  position: relative;
  cursor: pointer;
  font-size: var(--toggle-size);
}
.theme-checkbox::before {
  content: "";
  width: 2.25em;
  height: 2.25em;
  position: absolute;
  top: 0.438em;
  left: 0.438em;
  background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
  background-size: 205%;
  background-position: 100%;
  border-radius: 50%;
  transition: 0.4s;
}
.theme-checkbox:checked::before {
  left: calc(100% - 2.25em - 0.438em);
  background-position: 0;
}
.theme-checkbox:checked {
  background-position: 100%;
}

/* Buttons */
.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid #000000;
  background: transparent;
  color: #000000;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}
.btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.btn:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
  box-shadow: none;
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn.primary {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}
.btn.primary:hover:not(:disabled) {
  background: #1a1a1a;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
.btn.primary:active:not(:disabled) {
  background: #000000;
}
.btn.ghost {
  background: transparent;
  border-color: #000000;
  color: #000000;
}
.btn.ghost:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
  border-color: #000000;
}

/* Responsive */
@media (max-width: 820px) {
  .resume-container { padding: 100px 16px 140px; }
  .meta-bar { flex-direction: column; gap: 20px; }
  .info-row { flex-direction: column; gap: 20px; }
  .hero-title { font-size: 48px; }
  .hero-dek { font-size: 18px; }
  .section-label { font-size: 18px; }
  .bottom-inner { flex-direction: column; gap: 12px; align-items: stretch; }
  .bottom-left { text-align: center; }
  .bottom-right { justify-content: center; flex-wrap: wrap; }
  .toggle-group { order: -1; width: 100%; justify-content: center; margin-right: 0; margin-bottom: 8px; }
  .theme-checkbox { --toggle-size: 9px; }
  .visual-editor { padding: 20px; }
  .block-textarea { font-size: 18px; padding: 12px 40px 12px 0; }
}

@media (max-width: 480px) {
  .resume-container { padding: 90px 12px 130px; }
  .hero-title { font-size: 36px; }
  .hero-dek { font-size: 16px; margin-top: 16px; }
  .avatar-circle { width: 100px; height: 100px; }
  .avatar-letter { font-size: 32px; }
  .section-label { font-size: 16px; }
  .info-label, .meta-label { font-size: 11px; }
  .info-control, .meta-control { font-size: 16px; height: 42px; }
  .block-textarea { font-size: 16px; }
  .btn { height: 32px; padding: 0 12px; font-size: 12px; }
  .theme-checkbox { --toggle-size: 8px; }
}
</style>