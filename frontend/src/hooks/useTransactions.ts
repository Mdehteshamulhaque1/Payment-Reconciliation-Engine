import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionsApi, type CreateTransactionRequest } from '@/api/transactions'
import type { TransactionListParams } from '@/types'

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (params: TransactionListParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...transactionKeys.details(), id] as const,
  stats: () => [...transactionKeys.all, 'stats'] as const,
}

export function useTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: transactionKeys.list(params ?? {}),
    queryFn: () => transactionsApi.list(params),
    placeholderData: (prev) => prev,
  })
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: id > 0,
  })
}

export function useTransactionStats() {
  return useQuery({
    queryKey: transactionKeys.stats(),
    queryFn: () => transactionsApi.getStats(),
    staleTime: 30_000,
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useCancelTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useRefundTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionsApi.refund(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useRetryTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionsApi.retry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}
