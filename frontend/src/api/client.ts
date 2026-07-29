const RENDER_BACKEND = 'https://payflow-backend-n4by.onrender.com'
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? RENDER_BACKEND : '')
const BASE_URL = API_URL + '/api/v1'

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

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
