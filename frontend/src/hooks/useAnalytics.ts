import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics'

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  gatewayComparison: () => [...analyticsKeys.all, 'gateway-comparison'] as const,
  topFailures: () => [...analyticsKeys.all, 'top-failures'] as const,
}

export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsApi.getDashboard(),
    staleTime: 30_000,
  })
}

export function useGatewayComparison() {
  return useQuery({
    queryKey: analyticsKeys.gatewayComparison(),
    queryFn: () => analyticsApi.getGatewayComparison(),
    staleTime: 60_000,
  })
}

export function useTopFailures() {
  return useQuery({
    queryKey: analyticsKeys.topFailures(),
    queryFn: () => analyticsApi.getTopFailures(),
    staleTime: 60_000,
  })
}
