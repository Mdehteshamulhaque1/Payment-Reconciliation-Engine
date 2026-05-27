export const AUTH_TOKEN_KEY = 'payment-reconciliation-auth-token'
export const AUTH_USER_KEY = 'payment-reconciliation-auth-user'
export const REMEMBERED_EMAIL_KEY = 'payment-reconciliation-remembered-email'

export function buildFakeToken(email) {
  const normalizedEmail = email.toLowerCase()
  const base64Email = typeof window !== 'undefined' ? window.btoa(normalizedEmail) : normalizedEmail

  return `pr-engine_${base64Email}_${Date.now()}`
}

export function getStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const storedUser = localStorage.getItem(AUTH_USER_KEY)

  return {
    token,
    user: storedUser ? safeParseJson(storedUser) : null,
  }
}

export function persistAuth({ token, user }) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

function safeParseJson(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}