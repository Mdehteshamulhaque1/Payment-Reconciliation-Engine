import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '@/api/reports'

export const reportKeys = {
  all: ['reports'] as const,
  list: () => [...reportKeys.all, 'list'] as const,
}

export function useReports() {
  return useQuery({
    queryKey: reportKeys.list(),
    queryFn: () => reportsApi.list(),
    select: (data) => data.items,
  })
}

export function useGenerateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; report_type: string }) => reportsApi.generate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function getReportDownloadUrl(id: number): string {
  return reportsApi.download(id)
}
