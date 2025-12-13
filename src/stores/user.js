import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const accessToken = ref(localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '')
  const refreshToken = ref(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token') || '')
  const tokenType = ref(localStorage.getItem('token_type') || sessionStorage.getItem('token_type') || 'bearer')
  const username = ref(localStorage.getItem('username') || sessionStorage.getItem('username') || '')
  const createdAt = ref(localStorage.getItem('created_at') || sessionStorage.getItem('created_at') || '')
  const rememberMe = ref(localStorage.getItem('remember_me') === 'true')
  
  // Token 过期时间（时间戳）
  const accessTokenExpiresAt = ref(parseInt(localStorage.getItem('access_token_expires_at') || sessionStorage.getItem('access_token_expires_at') || '0'))
  const refreshTokenExpiresAt = ref(parseInt(localStorage.getItem('refresh_token_expires_at') || sessionStorage.getItem('refresh_token_expires_at') || '0'))

  // 计算属性
  const isLoggedIn = computed(() => !!accessToken.value && !isAccessTokenExpired.value)
  // Keep i18n out of store; let UI decide the localized fallback text
  const displayName = computed(() => username.value || '')
  
  // 检查 token 是否过期
  const isAccessTokenExpired = computed(() => {
    if (!accessTokenExpiresAt.value) return false
    return Date.now() >= accessTokenExpiresAt.value
  })
  
  const isRefreshTokenExpired = computed(() => {
    if (!refreshTokenExpiresAt.value) return false
    return Date.now() >= refreshTokenExpiresAt.value
  })

  // 获取当前使用的存储方式
  const getStorage = () => {
    return rememberMe.value ? localStorage : sessionStorage
  }

  // 登录：保存 token 和用户信息
  function login(tokenData, userData, remember = false) {
    const storage = remember ? localStorage : sessionStorage
    
    // 清除之前的存储（如果切换了 remember 状态）
    if (remember !== rememberMe.value) {
      const oldStorage = remember ? sessionStorage : localStorage
      oldStorage.removeItem('access_token')
      oldStorage.removeItem('refresh_token')
      oldStorage.removeItem('token_type')
      oldStorage.removeItem('access_token_expires_at')
      oldStorage.removeItem('refresh_token_expires_at')
      oldStorage.removeItem('username')
      oldStorage.removeItem('created_at')
    }

    // 保存 token 数据
    if (tokenData?.access_token) {
      accessToken.value = tokenData.access_token
      storage.setItem('access_token', tokenData.access_token)
    }
    if (tokenData?.refresh_token) {
      refreshToken.value = tokenData.refresh_token
      storage.setItem('refresh_token', tokenData.refresh_token)
    }
    if (tokenData?.token_type) {
      tokenType.value = tokenData.token_type
      storage.setItem('token_type', tokenData.token_type)
    }
    
    // 计算并保存 token 过期时间
    const now = Date.now()
    if (tokenData?.access_expires_in) {
      const expiresAt = now + (tokenData.access_expires_in * 1000)
      accessTokenExpiresAt.value = expiresAt
      storage.setItem('access_token_expires_at', expiresAt.toString())
    }
    if (tokenData?.refresh_expires_in) {
      const expiresAt = now + (tokenData.refresh_expires_in * 1000)
      refreshTokenExpiresAt.value = expiresAt
      storage.setItem('refresh_token_expires_at', expiresAt.toString())
    }
    
    // 保存用户数据
    if (userData?.username) {
      username.value = userData.username
      storage.setItem('username', userData.username)
    }
    if (userData?.created_at) {
      createdAt.value = userData.created_at
      storage.setItem('created_at', userData.created_at)
    }

    rememberMe.value = remember
    if (remember) {
      localStorage.setItem('remember_me', 'true')
    } else {
      localStorage.removeItem('remember_me')
    }
  }

  // 登出：清除所有数据
  function logout() {
    accessToken.value = ''
    refreshToken.value = ''
    tokenType.value = 'bearer'
    username.value = ''
    createdAt.value = ''
    accessTokenExpiresAt.value = 0
    refreshTokenExpiresAt.value = 0
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_type')
    localStorage.removeItem('access_token_expires_at')
    localStorage.removeItem('refresh_token_expires_at')
    localStorage.removeItem('username')
    localStorage.removeItem('created_at')
    localStorage.removeItem('remember_me')
    
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')
    sessionStorage.removeItem('token_type')
    sessionStorage.removeItem('access_token_expires_at')
    sessionStorage.removeItem('refresh_token_expires_at')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('created_at')
  }

  // 更新 token（用于刷新 token）
  function updateToken(tokenData) {
    const storage = getStorage()
    const now = Date.now()
    
    if (tokenData?.access_token) {
      accessToken.value = tokenData.access_token
      storage.setItem('access_token', tokenData.access_token)
    }
    if (tokenData?.refresh_token) {
      refreshToken.value = tokenData.refresh_token
      storage.setItem('refresh_token', tokenData.refresh_token)
    }
    if (tokenData?.token_type) {
      tokenType.value = tokenData.token_type
      storage.setItem('token_type', tokenData.token_type)
    }
    
    // 更新过期时间
    if (tokenData?.access_expires_in) {
      const expiresAt = now + (tokenData.access_expires_in * 1000)
      accessTokenExpiresAt.value = expiresAt
      storage.setItem('access_token_expires_at', expiresAt.toString())
    }
    if (tokenData?.refresh_expires_in) {
      const expiresAt = now + (tokenData.refresh_expires_in * 1000)
      refreshTokenExpiresAt.value = expiresAt
      storage.setItem('refresh_token_expires_at', expiresAt.toString())
    }
  }

  // 初始化：从存储中恢复状态
  function init() {
    const storage = getStorage()
    accessToken.value = storage.getItem('access_token') || ''
    refreshToken.value = storage.getItem('refresh_token') || ''
    tokenType.value = storage.getItem('token_type') || 'bearer'
    username.value = storage.getItem('username') || ''
    createdAt.value = storage.getItem('created_at') || ''
    accessTokenExpiresAt.value = parseInt(storage.getItem('access_token_expires_at') || '0')
    refreshTokenExpiresAt.value = parseInt(storage.getItem('refresh_token_expires_at') || '0')
    
    // 如果 token 已过期，清除它
    const now = Date.now()
    if (accessTokenExpiresAt.value && now >= accessTokenExpiresAt.value) {
      accessToken.value = ''
      storage.removeItem('access_token')
      accessTokenExpiresAt.value = 0
      storage.removeItem('access_token_expires_at')
    }
    if (refreshTokenExpiresAt.value && now >= refreshTokenExpiresAt.value) {
      refreshToken.value = ''
      storage.removeItem('refresh_token')
      refreshTokenExpiresAt.value = 0
      storage.removeItem('refresh_token_expires_at')
    }
  }

  return {
    // 状态
    accessToken,
    refreshToken,
    tokenType,
    username,
    createdAt,
    rememberMe,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    // 计算属性
    isLoggedIn,
    displayName,
    isAccessTokenExpired,
    isRefreshTokenExpired,
    // 方法
    login,
    logout,
    updateToken,
    init,
    getStorage
  }
})
