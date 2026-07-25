import { api } from './client'
import type { GatewayListResponse, GatewaySimulateResponse, GatewayHealth } from '@/types'

export const gatewaysApi = {
  list: () => api.get<GatewayListResponse>('/gateways'),
  getById: (id: number) => api.get<GatewayHealth>(`/gateways/${id}`),
  getHealth: (gatewayId: number) => api.get<GatewayHealth | null>(`/gateways/${gatewayId}/health`),
  simulate: (gatewayName: string, data: { amount: number; currency?: string }) =>
    api.post<GatewaySimulateResponse>(`/gateways/${gatewayName}/simulate`, data),
}
