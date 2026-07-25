import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reconciliationApi } from '@/api/reconciliation'

export const reconciliationKeys = {
  all: ['reconciliation'] as const,
  results: (params?: { page?: number; size?: number; discrepancy_type?: string }) =>
    [...reconciliationKeys.all, 'results', params] as const,
  summary: () => [...reconciliationKeys.all, 'summary'] as const,
}

export function useReconciliationResults(params?: { page?: number; size?: number; discrepancy_type?: string }) {
  return useQuery({
    queryKey: reconciliationKeys.results(params),
    queryFn: () => reconciliationApi.getResults(params),
    placeholderData: (prev) => prev,
  })
}

export function useReconciliationSummary() {
  return useQuery({
    queryKey: reconciliationKeys.summary(),
    queryFn: () => reconciliationApi.getSummary(),
    staleTime: 60_000,
  })
}

export function useRunReconciliation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (type: string) => reconciliationApi.run(type),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reconciliationKeys.all })
    },
  })
}

export function useResolveReconciliation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reconciliationApi.resolve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reconciliationKeys.all })
    },
  })
}
