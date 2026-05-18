export const AUTH_TOKEN_KEY = 'payment-reconciliation-auth-token'
export const AUTH_USER_KEY = 'payment-reconciliation-auth-user'
export const REMEMBERED_EMAIL_KEY = 'payment-reconciliation-remembered-email'

export function buildFakeToken(email) {
  return `pr-engine_${btoa(email.toLowerCase())}_${Date.now()}`
}

export function getStoredAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const storedUser = localStorage.getItem(AUTH_USER_KEY)

  return {
    token,
    user: storedUser ? JSON.parse(storedUser) : null,
  }
}

export function persistAuth({ token, user }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}