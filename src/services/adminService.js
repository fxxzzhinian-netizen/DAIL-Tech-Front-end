// src/services/adminService.js
import { apiRequest } from './apiClient'

/**
 * 查询所有用户（分页）
 * GET /api/admin/users?limit=50&offset=0
 * 权限：role == 4
 */
export async function listAllUsers({ limit = 50, offset = 0 } = {}) {
  return await apiRequest('GET', '/api/admin/users', {
    params: { limit, offset }
  })
}

/**
 * 管理员修改任意用户字段
 * PATCH /api/admin/users/{user_id}
 * 权限：role == 4
 * @param {number|string} userId
 * @param {object} updates - { username, phone, email, birthday, photo, is_active, role, password }
 */
export async function updateUserByAdmin(userId, updates) {
  const id = String(userId ?? '').trim()
  if (!id) throw new Error('Missing user_id')
  return await apiRequest('PATCH', `/api/admin/users/${encodeURIComponent(id)}`, {
    body: updates
  })
}
