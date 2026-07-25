import { api } from './client'
import type { TrialBalance, LedgerEntryListResponse } from '@/types'

export const ledgerApi = {
  getEntries: (params?: { page?: number; size?: number }) =>
    api.get<LedgerEntryListResponse>('/ledger/entries', { params: params as Record<string, number> }),
  getTrialBalance: () => api.get<TrialBalance>('/ledger/trial-balance'),
}
