const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function login({ identifier, password }) {
  const normalizedIdentifier = identifier.trim()
  const payload = normalizedIdentifier.includes('@')
    ? { email: normalizedIdentifier, password }
    : { login_id: normalizedIdentifier, password }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail || 'Login failed.')
  }

  return data
}
