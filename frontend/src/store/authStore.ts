import { create } from 'zustand'

interface AuthState {
  user: { id: number; name: string; email: string; role: string; avatar: string }
  isAuthenticated: boolean
  isLoading: boolean
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>(() => ({
  user: { id: 1, name: 'Admin', email: 'admin@payflow.ai', role: 'admin', avatar: 'A' },
  isAuthenticated: true,
  isLoading: false,
  loadFromStorage: () => {},
}))
