import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fraudApi } from '@/api/fraud'

export const fraudKeys = {
  all: ['fraud'] as const,
  cases: (params?: { page?: number; size?: number; severity?: string }) =>
    [...fraudKeys.all, 'cases', params] as const,
  dashboard: () => [...fraudKeys.all, 'dashboard'] as const,
}

export function useFraudCases(params?: { page?: number; size?: number; status?: string }) {
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

export function useScanFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (transactionId: number) => fraudApi.scan(transactionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fraudKeys.all })
    },
  })
}

export function useResolveFraud() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => fraudApi.resolve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fraudKeys.all })
    },
  })
}
