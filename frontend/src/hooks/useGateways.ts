import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gatewaysApi } from '@/api/gateways'

export const gatewayKeys = {
  all: ['gateways'] as const,
  list: () => [...gatewayKeys.all, 'list'] as const,
  health: (id: number) => [...gatewayKeys.all, 'health', id] as const,
}

export function useGateways() {
  return useQuery({
    queryKey: gatewayKeys.list(),
    queryFn: () => gatewaysApi.list(),
    staleTime: 60_000,
    select: (data) => data.gateways,
  })
}

export function useGatewayHealth(id: number) {
  return useQuery({
    queryKey: gatewayKeys.health(id),
    queryFn: () => gatewaysApi.getHealth(id),
    enabled: id > 0,
    refetchInterval: 30_000,
  })
}

export function useSimulateGateway() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: { amount: number; currency?: string } }) =>
      gatewaysApi.simulate(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: gatewayKeys.all })
    },
  })
}
