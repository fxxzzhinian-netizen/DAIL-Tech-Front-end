// src/services/resumeService.js
import { apiRequest } from './apiClient'

export async function createOrUpdateResume(payload) {
  return await apiRequest('POST', '/api/resumes', { body: payload })
}

export async function getMyResume() {
  return await apiRequest('GET', '/api/resumes/me')
}

export async function patchMyResume(patch) {
  return await apiRequest('PATCH', '/api/resumes/me', { body: patch })
}

export async function getPublicResume(userId) {
  const id = String(userId ?? '').trim()
  if (!id) throw new Error('Missing user_id')
  return await apiRequest('GET', `/api/resumes/${encodeURIComponent(id)}`)
}

/**
 * 获取所有用户的简历目录（公开接口）
 * GET /api/resumes?limit=50&offset=0
 */
export async function listAllResumes({ limit = 50, offset = 0 } = {}) {
  return await apiRequest('GET', '/api/resumes', {
    params: { limit, offset }
  })
}


