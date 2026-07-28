const RENDER_BACKEND = 'https://payflow-backend-n4by.onrender.com'
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? RENDER_BACKEND : '')
const BASE_URL = API_URL + '/api/v1'
const TOKEN_KEY = 'pf_token'

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('pf_user')
  localStorage.removeItem('pf_refresh')
}

export function clearAuthAndRedirect(): void {
  clearAuth()
  const path = window.location.pathname
  if (path !== '/login' && path !== '/signup') {
    window.location.href = '/login'
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: Error) => void }> = []

function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/signup', '/auth/refresh']

function recordMetric(method: string, url: string, status: number, startTime: number) {
  try {
    const devStore = (window as unknown as Record<string, unknown>).__devStore
    if (devStore && typeof devStore === 'object') {
      const state = (devStore as { getState: () => { devMode: boolean; addMetric: (m: Record<string, unknown>) => void } }).getState()
      if (state.devMode) {
        state.addMetric({
          endpoint: url,
          method: method.toUpperCase(),
          status,
          responseTime: Date.now() - startTime,
          cacheStatus: 'MISS',
          lastRefresh: Date.now(),
          timestamp: Date.now(),
        })
      }
    }
  } catch { /* dev store not ready */ }
}

async function request<T>(method: string, url: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options
  const startTime = Date.now()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  if (!PUBLIC_ENDPOINTS.some((ep) => url.startsWith(ep))) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  let fullUrl = `${BASE_URL}${url}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) fullUrl += `?${qs}`
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  recordMetric(method, url, response.status, startTime)

  if (response.status === 401 && !PUBLIC_ENDPOINTS.some((ep) => url.startsWith(ep))) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const refreshToken = localStorage.getItem('pf_refresh')
        if (!refreshToken) throw new Error('No refresh token')

        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        if (!refreshResponse.ok) throw new Error('Refresh failed')

        const data = await refreshResponse.json()
        setToken(data.access_token)
        localStorage.setItem('pf_refresh', data.refresh_token)
        isRefreshing = false
        processQueue(null, data.access_token)
        return request<T>(method, url, options)
      } catch (err) {
        isRefreshing = false
        processQueue(err as Error)
        clearAuthAndRedirect()
        throw new Error('Session expired. Please log in again.')
      }
    }

    return new Promise<T>((resolve, reject) => {
      failedQueue.push({
        resolve: () => resolve(request<T>(method, url, options)),
        reject,
      })
    })
  }

  if (response.status === 401) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || errorData?.error?.message || 'Session expired')
  }

  if (response.status === 204) return null as T

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    if (isJson) {
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.error?.message || errorData.message || errorMessage
      } catch { /* fall through */ }
    }
    throw new Error(errorMessage)
  }

  if (isJson) return response.json() as Promise<T>
  return response.text() as unknown as T
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) => request<T>('GET', url, options),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>('POST', url, { ...options, body }),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', url, { ...options, body }),
  patch: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', url, { ...options, body }),
  delete: <T>(url: string, options?: RequestOptions) => request<T>('DELETE', url, options),
}

export { getToken, setToken, clearAuth }
