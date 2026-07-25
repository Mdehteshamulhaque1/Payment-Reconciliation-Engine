import { api } from './client'
import type { Report, ReportListResponse } from '@/types'

export const reportsApi = {
  list: (params?: { page?: number; size?: number }) =>
    api.get<ReportListResponse>('/reports', { params: params as Record<string, number> }),
  generate: (data: { name: string; report_type: string }) => api.post<Report>('/reports', data),
  download: (id: number) => `/api/v1/reports/${id}/download`,
}
