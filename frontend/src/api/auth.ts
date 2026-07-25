import { api } from './client'
import type { User, TokenResponse, LoginRequest, SignupRequest } from '@/types'

export const authApi = {
  login: (data: LoginRequest) => api.post<TokenResponse>('/auth/login', data),
  signup: (data: SignupRequest) => api.post<User>('/auth/signup', data),
  getProfile: () => api.get<User>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put<User>('/auth/me', data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post<{ message: string }>('/auth/change-password', data),
  logout: () => api.post<{ message: string }>('/auth/logout'),
  refresh: (refresh_token: string) => api.post<TokenResponse>('/auth/refresh', { refresh_token }),
}
