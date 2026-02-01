import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/composables/useApi'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  // 登录
  const login = async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('token', response.token)
    return response
  }

  // 注册
  const register = async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('token', response.token)
    return response
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return
    const response = await api.get<User>('/auth/me')
    user.value = response
    return response
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserInfo
  }
})
