import { create } from 'zustand'
import type { User } from '@/types'
import { authApi } from '@/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loadFromStorage: () => void
  clearError: () => void
}

function isTokenValid(token: string): boolean {
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) return false
    return true
  } catch {
    return false
  }
}

function getInitialAuth() {
  if (typeof window === 'undefined') return { token: null, user: null, refreshToken: null }
  const token = localStorage.getItem('pf_token')
  const refreshToken = localStorage.getItem('pf_refresh')
  const userStr = localStorage.getItem('pf_user')
  const user = userStr ? JSON.parse(userStr) : null
  if (token && isTokenValid(token)) return { token, refreshToken, user }
  localStorage.removeItem('pf_token')
  localStorage.removeItem('pf_refresh')
  localStorage.removeItem('pf_user')
  return { token: null, user: null, refreshToken: null }
}

const initial = getInitialAuth()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  token: initial.token,
  refreshToken: initial.refreshToken,
  isAuthenticated: Boolean(initial.token),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authApi.login({ email, password })
      localStorage.setItem('pf_token', data.access_token)
      localStorage.setItem('pf_refresh', data.refresh_token)

      let user: User
      try {
        user = await authApi.getProfile()
      } catch {
        user = { id: 0, email, full_name: email.split('@')[0], is_active: true, is_superuser: false, is_verified: true, role: null, created_at: new Date().toISOString() }
      }

      const userObj = {
        id: user.id,
        name: user.full_name || email.split('@')[0],
        email: user.email,
        role: user.role || 'admin',
        avatar: (user.full_name || email)[0]?.toUpperCase() || 'U',
      }
      localStorage.setItem('pf_user', JSON.stringify(userObj))

      set({
        token: data.access_token,
        refreshToken: data.refresh_token,
        user: userObj as unknown as User,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } catch (err) {
      const msg = (err as Error).message || 'Login failed'
      set({ isLoading: false, error: msg })
      return { success: false, error: msg }
    }
  },

  signup: async (email, password, full_name) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.signup({ email, password, full_name })
      set({ isLoading: false })
      return { success: true }
    } catch (err) {
      const msg = (err as Error).message || 'Signup failed'
      set({ isLoading: false, error: msg })
      return { success: false, error: msg }
    }
  },

  logout: () => {
    const token = get().token
    if (token) authApi.logout().catch(() => {})
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_refresh')
    localStorage.removeItem('pf_user')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null })
  },

  loadFromStorage: () => {
    const stored = getInitialAuth()
    if (stored.token) {
      set({ token: stored.token, refreshToken: stored.refreshToken, user: stored.user, isAuthenticated: true })
    } else {
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false })
    }
  },

  clearError: () => set({ error: null }),
}))
