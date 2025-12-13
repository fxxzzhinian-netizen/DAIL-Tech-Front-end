import { defineStore } from 'pinia'
import { ref } from 'vue'

// Lightweight i18n (no extra dependencies)
// - default: English
// - click "Languages" in NavBar to toggle Chinese
const MESSAGES = {
  en: {
    common: {
      days: 'days',
      hours: 'Hours',
      notSet: 'Not set',
      saved: 'Saved',
      guest: 'Guest',
      comingSoon: 'Coming soon',
    },
    error: {
      close: 'Close error',
    },
    nav: {
      solutions: 'SOLUTIONS',
      technology: 'TECHNOLOGY',
      languages: 'LANGUAGES',
      company: 'COMPANY',
      docs: 'DOCS',
      contactUs: 'Contact Us',
      search: 'Search',
      userProfile: 'User Profile',
      login: 'Login',
      logoAlt: 'DAIL Tech',
      solutionsByIndustry: 'By Industry',
      solutionsByScenario: 'By Scenario',
      solutionsCustom: 'Custom Solutions',
      technologyPlatform: 'Platform',
      technologyAgents: 'Agents',
      technologyRag: 'RAG Engine',
      companyAbout: 'About',
      companyTeam: 'Team',
      companyCareers: 'Careers',
      companyNews: 'News',
      languageChinese: 'Chinese',
      languageEnglish: 'English',
    },
    hero: {
      titleLine1: "Redefining what's possible",
      titleLine2: 'on the AI.',
      subtitle:
        'From smart government copilots to legal compliance and medical AI-MDT, DAIL Tech turns complex public-service workflows into reliable AI agents — grounded on real data.',
      tryDail: 'Try DAIL',
      downloadDail: 'Download DAIL',
      deviceAlt: 'Hero device showcase',
      badge1: 'Smart Gov Copilot',
      badge2: 'Legal Compliance Copilot',
      badge3: 'Medical AI-MDT Copilot',
      feature1: 'Smart Gov Copilot · Policy & Services',
      feature2: 'Legal Copilot · Contracts & Compliance',
      feature3: 'Medical Copilot · AI-MDT & Triage',
    },
    platform: {
      titleLine1: 'AI-native power',
      titleLine2: 'Fused Seamlessly  Next-Generation Intelligence',
      cooperate: 'Cooperate with us',
      subtitle:
        'From data governance and custom models to agentic applications and full-stack platforms, DAIL Tech provides the AI enablement layer that lets enterprises build, deploy, and scale real "AI + industry" solutions without complexity.',
      explore: 'Explore the stack',
      learnMore: 'Learn more',
      card1: {
        alt: 'Data Governance',
        title: 'Data Governance',
        desc: 'Clean, compliant, and traceable data pipelines that feed every downstream AI system.',
      },
      card2: {
        alt: 'Model Engineering',
        title: 'Model Engineering',
        desc: 'End-to-end MLOps / LLMOps for model selection, training, optimization, and deployment.',
      },
      card3: {
        alt: 'Agent Development',
        title: 'Agent Development',
        desc: 'Turn core AI capabilities into robust, composable agents and digital co-workers that embed into real workflows.',
      },
      card4: {
        alt: 'Platform Build',
        title: 'Platform Build',
        desc: 'Launch an AI-native platform that orchestrates data, models, and agents across your enterprise.',
      },
    },
    cta: {
      preheadline: 'MAKING AI + INDUSTRY REAL',
      headlineLine1: 'Power real industries, workflows,',
      headlineLine2: 'and teams with DAIL Tech.',
      talk: 'Talk to DAIL Tech',
      explore: 'Explore use cases',
    },
    footer: {
      subscribeTitle: 'Stay up to date with DAIL Tech',
      emailPlaceholder: 'Email*',
      dailLogoAlt: 'DAIL logo',
      socialAlt: 'Social Icon {n}',
      solutionsTitle: 'SOLUTIONS',
      technologyTitle: 'TECHNOLOGY',
      companyTitle: 'COMPANY',
      legalTitle: 'LEGAL',
      solutions1: 'Industrial AI Copilots',
      solutions2: 'RAG Knowledge Engine',
      solutions3: 'Edge–Cloud Coordination',
      solutions4: 'Case studies',
      technology1: 'Multi-Agent Framework',
      technology2: 'R&D',
      technology3: 'Try DAIL Agent →',
      company1: 'About',
      company2: 'News',
      company3: 'Contact',
      company4: 'Careers →',
      legal1: 'LFM License',
      legal2: 'Privacy Policy',
      legal3: 'Privacy Choices',
      legal4: 'Terms & Conditions',
      rights: '© 2025 DAIL Tech. All rights reserved.',
      address: 'Beijing · Shanghai · Shenzhen',
    },
    auth: {
      signInTitle: 'SIGN IN TO CONTINUE',
      signInSubtitle: 'Modern. Secure. AI-native workspace.',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      newToDail: 'New to DAIL?',
      registerNow: 'REGISTER NOW',
      createAccount: 'CREATE ACCOUNT',
      registerSubtitle: 'Join the AI-native workspace today.',
      labelUsername: 'Username',
      labelPhoneNumber: 'Phone Number',
      labelPhone: 'Phone',
      labelCode: 'Code',
      labelPassword: 'Password',
      labelConfirm: 'Confirm',
      sendCode: 'Send Code',
      sending: 'Sending...',
      signUp: 'Sign Up',
      signingUp: 'Signing Up...',
      alreadyHaveAccount: 'Already have an account?',
      loginHere: 'LOGIN HERE',
      errPhoneRequired: 'Please enter your phone number',
      errPasswordRequired: 'Please enter your password',
      errLoginFailed: 'Login failed',
      errIncorrectCredential: 'Incorrect phone number or password',
      errEnterPhoneFirst: 'Please enter phone number first',
      errSendCodeFailed: 'Failed to send code',
      errPasswordMismatch: 'Passwords do not match!',
      errRegisterFailed: 'Register failed',
      foundedText: 'has been founded for',
      welcomeTo: 'Welcome to DAIL Tech',
      welcomeDaysPrefix: "It's your",
      welcomeDaysSuffix: 'in DAIL',
    },
    user: {
      navProfile: 'Profile',
      navProfileDesc: 'Basic info',
      navDominate: 'Dominate',
      navDominateDesc: 'Permissions (reserved)',
      navAria: 'User navigation',
      stepAccount: 'Account',
      stepProgress: 'Progress',
      stepDominate: 'Dominate',
      reserved: 'Reserved',
      logout: 'Logout',
      headerProfile: 'PROFILE',
      headerDominate: 'DOMINATE',
      subtitleProfile: 'Manage your basic account information.',
      subtitleDominate: 'Reserved for roles, permissions, and access policies.',
      profilePhoto: 'Profile photo',
      profilePhotoDesc: 'Add a profile photo to personalize your account.',
      name: 'Name',
      birthday: 'Birthday',
      email: 'Email',
      avatarAria: 'Avatar',
      progressDaysInDail: '{days} days in DAIL',
      dominateComingSoonTitle: 'Coming soon',
      dominateComingSoonText:
        'This section is reserved for permission management: roles, policies, access scopes, audit logs, and admin tools.',
      dominateComingSoonHint:
        'You can keep the tab now and wire it to your RBAC / ABAC later.',
    },
  },
  zh: {
    common: {
      days: '天',
      hours: '小时',
      notSet: '未设置',
      saved: '已保存',
      guest: '访客',
      comingSoon: '敬请期待',
    },
    error: {
      close: '关闭错误提示',
    },
    nav: {
      solutions: '解决方案',
      technology: '技术',
      languages: '语言',
      company: '公司',
      docs: '文档',
      contactUs: '联系我们',
      search: '搜索',
      userProfile: '用户中心',
      login: '登录',
      logoAlt: 'DAIL Tech',
      solutionsByIndustry: '按行业',
      solutionsByScenario: '按场景',
      solutionsCustom: '定制方案',
      technologyPlatform: '平台',
      technologyAgents: '智能体',
      technologyRag: 'RAG 引擎',
      companyAbout: '关于我们',
      companyTeam: '团队',
      companyCareers: '加入我们',
      companyNews: '新闻',
      languageChinese: '中文',
      languageEnglish: '英文',
    },
    hero: {
      titleLine1: '重新定义各个场景的可能性',
      titleLine2: '让 AI 落地',
      subtitle:
        '从智慧政务助手到合规法务与医疗 AI-MDT，DAIL Tech 将复杂的公共服务流程转化为可靠的 AI 智能体——扎根真实数据。',
      tryDail: '立即体验 DAIL',
      downloadDail: '下载 DAIL',
      deviceAlt: '首屏设备展示',
      badge1: '智慧政务助手',
      badge2: '合规法务助手',
      badge3: '医疗 AI-MDT 助手',
      feature1: '智慧政务助手 · 政策与服务',
      feature2: '法务助手 · 合同与合规',
      feature3: '医疗助手 · AI-MDT 与分诊',
    },
    platform: {
      titleLine1: 'AI 原生能力',
      titleLine2: '无缝融合的下一代智能',
      cooperate: '与我们合作',
      subtitle:
        '从数据治理与定制模型，到智能体应用与全栈平台，DAIL Tech 提供企业级 AI 使能层，帮助你在更低复杂度下构建、部署并规模化“AI + 产业”解决方案。',
      explore: '探索技术栈',
      learnMore: '了解更多',
      card1: {
        alt: '数据治理',
        title: '数据治理',
        desc: '构建干净、合规、可追溯的数据管道，为下游 AI 系统持续供给高质量数据。',
      },
      card2: {
        alt: '模型工程',
        title: '模型工程',
        desc: '端到端 MLOps / LLMOps：选型、训练、优化与部署，全面覆盖。',
      },
      card3: {
        alt: '智能体开发',
        title: '智能体开发',
        desc: '将核心 AI 能力封装为稳定、可组合的智能体与数字同事，嵌入真实业务流程。',
      },
      card4: {
        alt: '平台构建',
        title: '平台构建',
        desc: '上线 AI 原生平台，在企业范围内编排数据、模型与智能体。',
      },
    },
    cta: {
      preheadline: '让 AI + 产业真正落地',
      headlineLine1: '用 DAIL Tech 驱动真实产业与流程，',
      headlineLine2: '让团队协作更高效。',
      talk: '联系 DAIL Tech',
      explore: '探索应用场景',
    },
    footer: {
      subscribeTitle: '订阅 DAIL Tech 最新动态',
      emailPlaceholder: '邮箱*',
      dailLogoAlt: 'DAIL 标识',
      socialAlt: '社交图标 {n}',
      solutionsTitle: '解决方案',
      technologyTitle: '技术',
      companyTitle: '公司',
      legalTitle: '法律',
      solutions1: '产业 AI 助手',
      solutions2: 'RAG 知识引擎',
      solutions3: '边云协同',
      solutions4: '案例',
      technology1: '多智能体框架',
      technology2: '研发',
      technology3: '体验 DAIL Agent →',
      company1: '关于我们',
      company2: '新闻',
      company3: '联系',
      company4: '加入我们 →',
      legal1: 'LFM 许可',
      legal2: '隐私政策',
      legal3: '隐私选项',
      legal4: '条款与条件',
      rights: '© 2025 DAIL Tech. 保留所有权利。',
      address: '北京 · 上海 · 深圳',
    },
    auth: {
      signInTitle: '登录以继续',
      signInSubtitle: '现代、安全、AI 原生的工作空间。',
      rememberMe: '记住我',
      forgotPassword: '忘记密码？',
      signIn: '登录',
      newToDail: '第一次使用 DAIL？',
      registerNow: '立即注册',
      createAccount: '创建账号',
      registerSubtitle: '立即加入 AI 原生工作空间。',
      labelUsername: '用户名',
      labelPhoneNumber: '手机号',
      labelPhone: '手机号',
      labelCode: '验证码',
      labelPassword: '密码',
      labelConfirm: '确认',
      sendCode: '发送验证码',
      sending: '发送中…',
      signUp: '注册',
      signingUp: '注册中…',
      alreadyHaveAccount: '已有账号？',
      loginHere: '去登录',
      errPhoneRequired: '请输入手机号',
      errPasswordRequired: '请输入密码',
      errLoginFailed: '登录失败',
      errIncorrectCredential: '手机号或密码错误',
      errEnterPhoneFirst: '请先输入手机号',
      errSendCodeFailed: '验证码发送失败',
      errPasswordMismatch: '两次输入的密码不一致！',
      errRegisterFailed: '注册失败',
      foundedText: '已成立',
      welcomeTo: '欢迎来到 DAIL Tech',
      welcomeDaysPrefix: '你已加入 DAIL',
      welcomeDaysSuffix: '',
    },
    user: {
      navProfile: '个人资料',
      navProfileDesc: '基础信息',
      navDominate: '权限',
      navDominateDesc: '权限管理（预留）',
      navAria: '用户导航',
      stepAccount: '账号',
      stepProgress: '进度',
      stepDominate: '权限',
      reserved: '预留',
      logout: '退出登录',
      headerProfile: '个人资料',
      headerDominate: '权限',
      subtitleProfile: '管理你的基础账号信息。',
      subtitleDominate: '预留用于角色、权限与访问策略。',
      profilePhoto: '头像',
      profilePhotoDesc: '添加头像以个性化你的账号。',
      name: '姓名',
      birthday: '生日',
      email: '邮箱',
      avatarAria: '头像',
      progressDaysInDail: '已加入 DAIL {days} 天',
      dominateComingSoonTitle: '敬请期待',
      dominateComingSoonText:
        '该区域预留用于权限管理：角色、策略、访问范围、审计日志与管理工具等。',
      dominateComingSoonHint: '你可以先保留该入口，后续接入 RBAC / ABAC。',
    },
  },
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined
  const parts = String(path).split('.')
  let cur = obj
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p]
    else return undefined
  }
  return cur
}

function interpolate(template, vars) {
  if (!vars) return template
  return String(template).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
}

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(localStorage.getItem('locale') || 'en')

  const setLocale = (next) => {
    const nextLocale = next === 'zh' ? 'zh' : 'en'
    locale.value = nextLocale
    localStorage.setItem('locale', nextLocale)
  }

  const toggleLocale = () => {
    setLocale(locale.value === 'en' ? 'zh' : 'en')
  }

  const t = (key, vars) => {
    const msg =
      getByPath(MESSAGES[locale.value], key) ??
      getByPath(MESSAGES.en, key) ??
      key
    return typeof msg === 'string' ? interpolate(msg, vars) : String(msg)
  }

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
  }
})

