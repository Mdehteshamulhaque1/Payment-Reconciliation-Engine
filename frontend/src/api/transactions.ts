import { api } from './client'
import type { Transaction, TransactionStats, PaginatedResponse, TransactionListParams } from '@/types'

export interface CreateTransactionRequest {
  transaction_ref: string
  amount: number
  currency?: string
  transaction_type?: string
  description?: string
  gateway_id?: number
  merchant_id?: number
  customer_id?: number
  idempotency_key?: string
}

export const transactionsApi = {
  list: (params?: TransactionListParams) =>
    api.get<PaginatedResponse<Transaction>>('/transactions', { params: params as Record<string, string | number> }),
  getById: (id: number) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: CreateTransactionRequest) =>
    api.post<Transaction>('/transactions', data),
  cancel: (id: number) => api.post<Transaction>(`/transactions/${id}/cancel`),
  refund: (id: number) => api.post<Transaction>(`/transactions/${id}/refund`),
  retry: (id: number) => api.post<Transaction>(`/transactions/${id}/retry`),
  getStats: () => api.get<TransactionStats>('/transactions/stats'),
}
