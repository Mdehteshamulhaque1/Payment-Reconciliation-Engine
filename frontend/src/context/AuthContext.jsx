import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  REMEMBERED_EMAIL_KEY,
  clearAuth,
  getStoredAuth,
  persistAuth,
} from '../utils/authStorage'
import { login as loginRequest } from '../services/authService'

const AuthContext = createContext(null)

function getInitialAuthState() {
  const { token, user } = getStoredAuth()

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  }
}

function buildUserProfile({ email, name, role, avatar }) {
  return {
    name: name?.trim() || email.split('@')[0],
    email: email.toLowerCase(),
    role: role || 'analyst',
    avatar: avatar || name?.trim()?.[0]?.toUpperCase() || email[0]?.toUpperCase() || 'U',
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState)

  const login = useCallback(async ({ identifier, password, rememberMe = false }) => {
    const normalizedIdentifier = identifier.trim()
    const response = await loginRequest({ identifier: normalizedIdentifier, password })
    const user = buildUserProfile(response.user)

    persistAuth({ token: response.access_token, user })

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedIdentifier.toLowerCase())
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    }

    setAuthState({ token: response.access_token, user, isAuthenticated: true })
    return { token: response.access_token, user }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    setAuthState({ token: null, user: null, isAuthenticated: false })
  }, [])

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}