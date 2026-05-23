// API Service for payment transactions
const API_BASE = '/api'

export const getTransactions = async () => {
  const response = await fetch(`${API_BASE}/transactions`)
  return response.json()
}

export const getTransactionById = async (id) => {
  const response = await fetch(`${API_BASE}/transactions/${id}`)
  return response.json()
}

export const matchTransactions = async (data) => {
  const response = await fetch(`${API_BASE}/reconcile/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getStats = async () => {
  const response = await fetch(`${API_BASE}/stats`)
  return response.json()
}

export const exportTransactions = async (format = 'csv') => {
  const response = await fetch(`${API_BASE}/transactions/export?format=${format}`)
  return response.blob()
}
