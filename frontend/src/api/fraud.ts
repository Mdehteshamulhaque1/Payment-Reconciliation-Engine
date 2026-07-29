import { api } from './client'
import type { FraudCase, FraudDashboard, FraudScanResponse, FraudAlert, MLDashboard } from '@/types'

export const fraudApi = {
  getCases: (params?: Record<string, string | number | undefined>) =>
    api.get<{ items: FraudCase[]; total: number }>('/fraud/cases', { params }),
  getDashboard: () => api.get<FraudDashboard>('/fraud/dashboard'),
  getMLDashboard: () => api.get<MLDashboard>('/fraud/ml-dashboard'),
  getAlerts: (params?: Record<string, string | number | undefined>) =>
    api.get<{ items: FraudAlert[]; total: number }>('/fraud/alerts', { params }),
  scan: (transactionId: number) => api.post<FraudScanResponse>(`/fraud/scan/${transactionId}`),
  resolve: (id: number, body?: { status?: string; notes?: string; resolution?: string }) =>
    api.put<FraudCase>(`/fraud/${id}/resolve`, body),
  assign: (id: number, assignedTo: number) =>
    api.put<FraudCase>(`/fraud/${id}/assign`, { assigned_to: assignedTo }),
  escalate: (id: number, escalatedTo: number) =>
    api.put<FraudCase>(`/fraud/${id}/escalate`, { escalated_to: escalatedTo }),
  acknowledgeAlert: (alertId: number) =>
    api.put<FraudAlert>(`/fraud/alerts/${alertId}/acknowledge`),
  identifyDevice: (data: Record<string, unknown>) =>
    api.post<{ fingerprint_hash: string; is_new_device: boolean; device_id: number; is_suspicious: boolean; risk_score: number; suspicious_reasons: string[] }>('/fraud/identify-device', data),
  retrainModels: () => api.post<{ message: string }>('/fraud/retrain'),
}
