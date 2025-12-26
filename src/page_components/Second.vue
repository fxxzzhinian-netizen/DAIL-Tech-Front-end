<!-- src/pages/Second.vue -->
<template>
    <section class="platform" ref="platformRef">
      <!-- 上半：左文案 + 右图片卡片 -->
      <div class="platform-inner">
        <!-- 左侧文字区域 -->
        <div class="platform-left">
          <!-- 分割线替换 PLATFORM pill -->
          <div class="platform-divider fade-in-up" :class="{ 'animate': isVisible }"></div>
  
          <h2 class="platform-title fade-in-up" :class="{ 'animate': isVisible }">
            <div class="title-row">
              <span class="title-line title-line-first">{{ $t('platform.titleLine1') }}</span>
              <div class="floating-learn-more fade-in-up" :class="{ 'animate': isVisible }">
                <button class="learn-more-button" type="button" @click="router.push('/coming-soon')">
                  <span class="circle" aria-hidden="true">
                    <span class="icon arrow"></span>
                  </span>
                  <span class="button-text">{{ $t('platform.cooperate') }}</span>
                </button>
              </div>
            </div>
            <br />
            <span class="title-line">{{ $t('platform.titleLine2') }}</span>
          </h2>
  
          <p class="platform-subtitle fade-in-up" :class="{ 'animate': isVisible }">
            {{ $t('platform.subtitle') }}
          </p>
  
          <button class="btn-primary fade-in-up" :class="{ 'animate': isVisible }" @click="router.push('/coming-soon')">
            {{ $t('platform.explore') }}
          </button>
        </div>
  
        <!-- 右侧空白占位 -->
        <div class="platform-right">
          <!-- 空白占位区域 -->
        </div>
      </div>
  
      <!-- 下半：四个功能卡片（位于下方左半部分） -->
      <div class="platform-grid fade-in-up" :class="{ 'animate': isVisible }">
        <div class="platform-grid-left">
          <div class="grid-card fade-in-up" :class="{ 'animate': isVisible }" @click="router.push('/coming-soon')">
            <img :src="oneIcon" :alt="$t('platform.card1.alt')" class="grid-icon" />
            <div class="grid-title">{{ $t('platform.card1.title') }}</div>
            <div class="grid-desc">
              {{ $t('platform.card1.desc') }}
            </div>
            <div class="grid-learn-more">{{ $t('platform.learnMore') }} <span class="learn-arrow">→</span></div>
          </div>
  
          <div class="grid-card fade-in-up" :class="{ 'animate': isVisible }" @click="router.push('/coming-soon')">
            <img :src="twoIcon" :alt="$t('platform.card2.alt')" class="grid-icon" />
            <div class="grid-title">{{ $t('platform.card2.title') }}</div>
            <div class="grid-desc">
              {{ $t('platform.card2.desc') }}
            </div>
            <div class="grid-learn-more">{{ $t('platform.learnMore') }} <span class="learn-arrow">→</span></div>
          </div>
  
          <div class="grid-card fade-in-up" :class="{ 'animate': isVisible }" @click="router.push('/coming-soon')">
            <img :src="threeIcon" :alt="$t('platform.card3.alt')" class="grid-icon" />
            <div class="grid-title">{{ $t('platform.card3.title') }}</div>
            <div class="grid-desc">
              {{ $t('platform.card3.desc') }}
            </div>
            <div class="grid-learn-more">{{ $t('platform.learnMore') }} <span class="learn-arrow">→</span></div>
          </div>
  
          <div class="grid-card fade-in-up" :class="{ 'animate': isVisible }" @click="router.push('/coming-soon')">
            <img :src="fourIcon" :alt="$t('platform.card4.alt')" class="grid-icon" />
            <div class="grid-title">{{ $t('platform.card4.title') }}</div>
            <div class="grid-desc">
              {{ $t('platform.card4.desc') }}
            </div>
            <div class="grid-learn-more">{{ $t('platform.learnMore') }} <span class="learn-arrow">→</span></div>
          </div>
        </div>
      </div>
  
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import oneIcon from '@/assets/images/one.png'
  import twoIcon from '@/assets/images/two.png'
  import threeIcon from '@/assets/images/three.png'
  import fourIcon from '@/assets/images/four.png'
  import backgroundImg from '@/assets/images/background.png'

  const router = useRouter()
  const platformRef = ref(null)
  const isVisible = ref(false)
  let observer = null

  onMounted(() => {
    // 强制让浏览器"意识到"初始状态
    document.body.offsetHeight

    // 使用 Intersection Observer 检测元素进入视口
    // 针对大屏幕优化：只有当元素顶部进入视口中心区域时才触发
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 元素进入视口后，延迟300ms开始动画
            setTimeout(() => {
              isVisible.value = true
            }, 300)
            // 一旦触发就取消观察，避免重复触发
            if (observer) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.2, // 当20%的元素可见时触发，避免过早触发
        rootMargin: '0px 0px -30% 0px' // 只有当元素顶部进入视口上半部分时才触发
      }
    )

    // 等待 DOM 渲染完成后再观察
    setTimeout(() => {
      if (platformRef.value) {
        observer.observe(platformRef.value)
      }
    }, 100)
  })

  onBeforeUnmount(() => {
    if (observer && platformRef.value) {
      observer.unobserve(platformRef.value)
      observer = null
    }
  })
  </script>
  
  <style scoped>
  /* ---------------- 浮现动画样式 (修改版) ---------------- */

  /* 1. 定义动画关键帧 */
  @keyframes fadeInUpKeyframes {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 2. 基础状态：只控制初始不可见，不再占用 transition */
  .fade-in-up {
    opacity: 0;
    will-change: opacity, transform;
  }

  /* 3. 激活状态：使用 animation 而不是 transition */
  .fade-in-up.animate {
    animation: fadeInUpKeyframes 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  /* 不同组件的延迟时间 - 全部改为 animation-delay */
  .platform-divider.fade-in-up {
    animation-delay: 0s;
  }

  .platform-title.fade-in-up {
    animation-delay: 0.2s;
  }

  .floating-learn-more.fade-in-up {
    animation-delay: 0.4s;
  }

  .platform-subtitle.fade-in-up {
    animation-delay: 0.6s;
  }

  .btn-primary.fade-in-up {
    animation-delay: 0.8s;
  }

  /* 图片卡片最后浮现 */
  .platform-grid.fade-in-up {
    animation-delay: 1.2s;
  }

  .grid-card.fade-in-up:nth-child(1) {
    animation-delay: 1.4s;
  }

  .grid-card.fade-in-up:nth-child(2) {
    animation-delay: 1.6s;
  }

  .grid-card.fade-in-up:nth-child(3) {
    animation-delay: 1.8s;
  }

  .grid-card.fade-in-up:nth-child(4) {
    animation-delay: 2s;
  }

  .platform {
    background: #ffffff;
    padding: 72px 24px 96px;
    position: relative;
    overflow: hidden;
  }

  .platform::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 1600px;
    height: 100%;

    background-image: url('@/assets/images/background.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: right bottom 20%;

    pointer-events: none;
    z-index: 0;
  }
  
  /* 上半部分布局 */
  .platform-inner {
  max-width: 1500px;
  min-width: 1500px;
  margin: 0 auto 64px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
  gap: 11px;
  align-items: center;

  box-sizing: border-box;
  padding-inline: clamp(20px, 5vw, 40px);
  position: relative;
  z-index: 1;
  }

  .platform-grid {
  max-width: 1500px;
  min-width: 1500px;
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr);

  box-sizing: border-box;
  padding-inline: clamp(20px, 5vw, 40px);
  }
  /* 左侧文案 */
  .platform-left {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .platform-divider {
    width: 1000px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #111827 0%, #4b5563 50%, #9ca3af 100%);
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.15);
    position: relative;
  }
  
  .platform-divider::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
    pointer-events: none;
  }
  
  .platform-title {
    font-size: 48px;
    line-height: 1.2;
    letter-spacing: -0.03em;
    font-weight: 600;
    color: #111827;
  }
  
  .title-row {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  
  .title-line {
    white-space: nowrap;
    display: inline-block;
  }
  
  .title-line-first {
    font-size: 1.2em;
    margin-bottom: 10px;
  }
  
  .platform-subtitle {
    max-width: 680px;
    font-size: 15px;
    line-height: 1.8;
    color: #4b5563;
    margin-top: 12px;
  }
  
  .btn-primary {
    width: 170px;
    margin-top: 8px;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 15px;
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease,
      transform 0.18s ease, border-color 0.18s ease;
    background: black;
    color: white;
    border: none;
    border-radius: 0.625em;
    position: relative;
    z-index: 1;
    overflow: hidden;
    box-shadow: none;
  }
  
  .btn-primary:hover {
    color: black;
    transform: none;
    box-shadow: none;
  }
  
  .btn-primary:after {
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
  
  .btn-primary:hover:after {
    transform: skewX(-45deg) scale(1, 1);
  }
  
  .icon-arrow {
    font-size: 15px;
  }
  
  /* 下半部分：四个功能卡片，只放在下方左半部分 */
  .platform-grid {
  max-width: 1400px;
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr);
  position: relative;
  z-index: 1;
  }
  
  /* 左半部分内部再做 2 列卡片栅格 */
  .platform-grid-left {
    grid-column: 1 / 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 27px;
  }
  
  .grid-card {
    box-sizing: border-box;
    background: #ffffff;
    border: 1.4px solid rgba(0, 0, 0, 0.135);
    /* border-right: none; */
    border-radius: 14px;
    padding: 27px 31px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s;
    user-select: none;
    position: relative;
  }
  
  .grid-card:hover {
    background: #000000;
    border: 1.4px solid rgba(0, 0, 0, 0.135);
    /* border-right: none; */
  }
  
  .grid-card:hover .grid-title,
  .grid-card:hover .grid-desc {
    color: #ffffff;
  }
  
  .grid-card:hover .grid-learn-more {
    opacity: 1;
    visibility: visible;
  }
  
  .grid-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    margin-bottom: 3px;
    transition: filter 0.3s;
    border-radius: 8px;
  }
  
  .grid-card:hover .grid-icon {
    filter: brightness(0) invert(1);
  }
  
  .grid-title {
    font-size: 19px;
    font-weight: bolder;
    color: black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s;
    margin-bottom: -2px;
  }
  
  .grid-desc {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.68);
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s;
  }
  
  .grid-learn-more {
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    margin-top: 0px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .learn-arrow {
    font-size: 18px;
    transition: transform 0.3s;
    margin-bottom: -3px;
  }
  
  .grid-card:hover .learn-arrow {
    transform: translateX(8px);
  }
  
  /* ========= 标题右侧的按钮 ========= */
  
  .floating-learn-more {
    position: relative;
    z-index: 3;
    flex-shrink: 0;
  }
  
  /* 避免影响其他按钮，只针对 .learn-more-button */
  .learn-more-button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    margin-top: 14px;
    border: 0;
    background: transparent;
    padding: 0;
    font-size: 13px;
    font-family: inherit;
    width: 15.5rem;
    height: 3rem;
  }
  
  /* 黑色圆形主体 */
  .learn-more-button .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 3rem;
    height: 3rem;
    background: #000000;          /* 纯黑 */
    border-radius: 1.625rem;
  }
  
  /* 箭头 icon 基底 */
  .learn-more-button .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #ffffff;
  }
  
  /* 箭头横杆 */
  .learn-more-button .circle .icon.arrow {
    left: 0.65rem;
    width: 1.1rem;
    height: 0.125rem;
    background: transparent;   /* 初始只显示箭头线框 */
  }
  
  /* 箭头箭头头部 */
  .learn-more-button .circle .icon.arrow::before {
    position: absolute;
    content: "";
    top: -0.29rem;
    right: 0.0625rem;
    width: 0.625rem;
    height: 0.625rem;
    border-top: 0.125rem solid #ffffff;
    border-right: 0.125rem solid #ffffff;
    transform: rotate(45deg);
  }
  
  /* 右侧文字：默认隐藏（透明 + 微偏移） */
  .learn-more-button .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    inset: 0;
    padding: 0.75rem 0;
    margin: 0 0 0 4rem;
    color: #ffffff;
    font-weight: 700;
    line-height: 1.6;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    opacity: 0;
    transform: translateX(-1rem);
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  
  /* hover 时：黑色背景扩展，箭头滑动，文字显现 */
  .learn-more-button:hover .circle {
    width: 100%;
  }
  
  .learn-more-button:hover .circle .icon.arrow {
    background: #ffffff;
    transform: translateX(0.9rem);
  }
  
  .learn-more-button:hover .button-text {
    opacity: 1;
    transform: translateX(0);
  }
  
  </style>
  