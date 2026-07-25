import { api } from './client'
import type { ReconciliationResult, ReconciliationSummary, ReconciliationListResponse } from '@/types'

export const reconciliationApi = {
  getResults: (params?: { page?: number; size?: number; discrepancy_type?: string }) =>
    api.get<ReconciliationListResponse>('/reconciliation/results', { params: params as Record<string, string | number> }),
  getSummary: () => api.get<ReconciliationSummary>('/reconciliation/summary'),
  run: (type: string) => api.post<{ message: string; batch_id?: string }>('/reconciliation/run', { type }),
  resolve: (id: number) => api.post<ReconciliationResult>(`/reconciliation/${id}/resolve`, { resolved_by: 'admin' }),
}
