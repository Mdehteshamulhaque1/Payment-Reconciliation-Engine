import { useQuery } from '@tanstack/react-query'
import { ledgerApi } from '@/api/ledger'

export const ledgerKeys = {
  all: ['ledger'] as const,
  entries: (params?: { page?: number; size?: number }) => [...ledgerKeys.all, 'entries', params] as const,
  trialBalance: () => [...ledgerKeys.all, 'trial-balance'] as const,
}

export function useLedgerEntries(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ledgerKeys.entries(params),
    queryFn: () => ledgerApi.getEntries(params),
    placeholderData: (prev) => prev,
  })
}

export function useTrialBalance() {
  return useQuery({
    queryKey: ledgerKeys.trialBalance(),
    queryFn: () => ledgerApi.getTrialBalance(),
    staleTime: 60_000,
  })
}
