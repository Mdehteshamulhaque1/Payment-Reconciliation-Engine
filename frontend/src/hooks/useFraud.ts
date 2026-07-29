import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fraudApi } from '@/api/fraud'

export const fraudKeys = {
  all: ['fraud'] as const,
  cases: (params?: Record<string, string | number | undefined>) =>
    [...fraudKeys.all, 'cases', params] as const,
  dashboard: () => [...fraudKeys.all, 'dashboard'] as const,
  mlDashboard: () => [...fraudKeys.all, 'ml-dashboard'] as const,
  alerts: (params?: Record<string, string | number | undefined>) =>
    [...fraudKeys.all, 'alerts', params] as const,
}

export function useFraudCases(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: fraudKeys.cases(params),
    queryFn: () => fraudApi.getCases(params),
    placeholderData: (prev) => prev,
  })
}

export function useFraudDashboard() {
  return useQuery({
    queryKey: fraudKeys.dashboard(),
    queryFn: () => fraudApi.getDashboard(),
    staleTime: 60_000,
  })
}

export function useMLDashboard() {
  return useQuery({
    queryKey: fraudKeys.mlDashboard(),
    queryFn: () => fraudApi.getMLDashboard(),
    staleTime: 60_000,
  })
}

export function useFraudAlerts(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: fraudKeys.alerts(params),
    queryFn: () => fraudApi.getAlerts(params),
    placeholderData: (prev) => prev,
    refetchInterval: 30_000,
  })
}

export function useScanFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (transactionId: number) => fraudApi.scan(transactionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}

export function useResolveFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body?: { status?: string; notes?: string; resolution?: string } }) =>
      fraudApi.resolve(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}

export function useAssignFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: number; assignedTo: number }) => fraudApi.assign(id, assignedTo),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}

export function useEscalateFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, escalatedTo }: { id: number; escalatedTo: number }) => fraudApi.escalate(id, escalatedTo),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (alertId: number) => fraudApi.acknowledgeAlert(alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}

export function useRetrainModels() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => fraudApi.retrainModels(),
    onSuccess: () => qc.invalidateQueries({ queryKey: fraudKeys.all }),
  })
}
