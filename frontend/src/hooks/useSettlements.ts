import { useQuery } from '@tanstack/react-query'
import { settlementsApi } from '@/api/settlements'

export const settlementKeys = {
  all: ['settlements'] as const,
  lists: () => [...settlementKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number }) => [...settlementKeys.lists(), params] as const,
  summary: () => [...settlementKeys.all, 'summary'] as const,
}

export function useSettlements(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: settlementKeys.list(params),
    queryFn: () => settlementsApi.list(params),
    placeholderData: (prev) => prev,
  })
}

export function useSettlementSummary() {
  return useQuery({
    queryKey: settlementKeys.summary(),
    queryFn: () => settlementsApi.getSummary(),
    staleTime: 60_000,
  })
}
