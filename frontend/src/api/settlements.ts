import { api } from './client'
import type { SettlementSummary, SettlementListResponse } from '@/types'

export const settlementsApi = {
  list: (params?: { page?: number; size?: number }) =>
    api.get<SettlementListResponse>('/settlements', { params: params as Record<string, number> }),
  getSummary: () => api.get<SettlementSummary>('/settlements/summary'),
}
