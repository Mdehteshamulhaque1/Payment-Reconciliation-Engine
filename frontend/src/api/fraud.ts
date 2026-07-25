import { api } from './client'
import type { FraudCase, FraudDashboard, FraudScanResponse } from '@/types'

export const fraudApi = {
  getCases: (params?: { page?: number; size?: number; status?: string }) =>
    api.get<{ items: FraudCase[]; total: number }>('/fraud/cases', { params: params as Record<string, string | number> }),
  getDashboard: () => api.get<FraudDashboard>('/fraud/dashboard'),
  scan: (transactionId: number) => api.post<FraudScanResponse>(`/fraud/scan/${transactionId}`),
  resolve: (id: number) => api.put<FraudCase>(`/fraud/${id}/resolve`),
}
