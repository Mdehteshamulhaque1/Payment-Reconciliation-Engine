const TOKEN_KEY = 'pf_token'
const REFRESH_KEY = 'pf_refresh'
const USER_KEY = 'pf_user'

export function getStoredAuth() {
  if (typeof window === 'undefined') return { token: null, user: null, refreshToken: null }
  const token = localStorage.getItem(TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  const userStr = localStorage.getItem(USER_KEY)
  return {
    token,
    refreshToken,
    user: userStr ? safeParse(userStr) : null,
  }
}

export function persistAuth({ token, refreshToken, user }: { token: string; refreshToken?: string; user?: unknown }) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

function safeParse(value: string): unknown {
  try { return JSON.parse(value) } catch { return null }
}
