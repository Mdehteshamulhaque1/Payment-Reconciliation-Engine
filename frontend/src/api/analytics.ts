import { api } from './client'
import type { DashboardStats, GatewayComparison, TopFailure } from '@/types'

export const analyticsApi = {
  getDashboard: () => api.get<DashboardStats>('/analytics/dashboard'),
  getGatewayComparison: () => api.get<GatewayComparison[]>('/analytics/gateway-comparison'),
  getTopFailures: () => api.get<TopFailure[]>('/analytics/top-failures'),
}
