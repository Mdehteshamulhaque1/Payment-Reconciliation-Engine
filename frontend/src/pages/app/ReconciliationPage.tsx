import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useReconciliationResults, useReconciliationSummary, useRunReconciliation } from '@/hooks/useReconciliation'
import { formatDateTime, truncate } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'
import type { ReconciliationResult } from '@/types'

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function ReconciliationPage() {
  const [page, setPage] = useState(1)
  const [type, setType] = useState('all')

  const { data, isLoading } = useReconciliationResults({ page, size: 15, discrepancy_type: type === 'all' ? undefined : type })
  const { data: summary } = useReconciliationSummary()
  const runMutation = useRunReconciliation()

  const columns = [
    { key: 'transaction_ref', label: 'Reference', sortable: true, render: (r: ReconciliationResult) => (
      <span className='font-mono text-xs'>{truncate(r.transaction_ref, 16)}</span>
    )},
    { key: 'type', label: 'Type', render: (r: ReconciliationResult) => (
      <span className='capitalize text-sm'>{r.type || r.discrepancy_type}</span>
    )},
    { key: 'status', label: 'Status', render: (r: ReconciliationResult) => <StatusChip status={r.status} /> },
    { key: 'confidence', label: 'Confidence', render: (r: ReconciliationResult) => (
      <span className='text-sm'>{r.confidence !== null ? `${(r.confidence * 100).toFixed(1)}%` : '—'}</span>
    )},
    { key: 'created_at', label: 'Date', sortable: true, render: (r: ReconciliationResult) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(r.created_at)}</span>
    )},
  ]

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Reconciliation'
          description='Automated transaction matching and reconciliation'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Reconciliation' }]}
          actions={
            <Button
              onClick={() => {
                const reconType = type === 'all' ? 'daily' : type
                runMutation.mutate(reconType, {
                  onSuccess: () => showToast('success', 'Reconciliation started'),
                  onError: (err) => showToast('error', err.message),
                })
              }}
              loading={runMutation.isPending}
            >
              <Play size={16} className='mr-1.5' /> Run Reconciliation
            </Button>
          }
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard icon={CheckCircle} label='Matched' value={summary?.matched ?? 0} color='success' delay={0} />
        <StatCard icon={AlertTriangle} label='Mismatches' value={summary?.mismatches ?? 0} color='warning' delay={0.05} />
        <StatCard icon={XCircle} label='Missing' value={summary?.missing ?? 0} color='danger' delay={0.1} />
        <StatCard icon={CheckCircle} label='Accuracy' value={`${(summary?.accuracy ?? 0).toFixed(1)}%`} color='info' delay={0.15} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <FilterTabs tabs={typeFilters} active={type} onChange={(k) => { setType(k); setPage(1) }} />
      </motion.div>

      <ScrollReveal delay={0.15}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          emptyMessage='No reconciliation results'
          pagination={data ? { page, pages: Math.max(1, Math.ceil(data.total / 15)), total: data.total, onPageChange: setPage } : undefined}
        />
      </ScrollReveal>
    </motion.div>
  )
}
