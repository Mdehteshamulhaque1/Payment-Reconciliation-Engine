import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertTriangle, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { StatCard } from '@/components/ui/StatCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useSettlements, useSettlementSummary } from '@/hooks/useSettlements'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Settlement } from '@/types'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function SettlementsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSettlements({ page, size: 15 })
  const { data: summary } = useSettlementSummary()

  const columns = [
    { key: 'id', label: 'ID', render: (s: Settlement) => <span className='text-sm'>#{s.id}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (s: Settlement) => (
      <span className='font-medium'>{formatCurrency(s.amount, s.currency)}</span>
    )},
    { key: 'status', label: 'Status', render: (s: Settlement) => <StatusChip status={s.status} /> },
    { key: 'gateway_id', label: 'Gateway', render: (s: Settlement) => <span className='text-sm'>#{s.gateway_id ?? '—'}</span> },
    { key: 'fee', label: 'Fee', render: (s: Settlement) => (
      <span className='text-sm text-muted-foreground'>{formatCurrency(s.fee, s.currency)}</span>
    )},
    { key: 'settlement_date', label: 'Settled', sortable: true, render: (s: Settlement) => (
      <span className='text-xs text-muted-foreground'>{s.settlement_date ? formatDateTime(s.settlement_date) : 'Pending'}</span>
    )},
    { key: 'created_at', label: 'Created', sortable: true, render: (s: Settlement) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(s.created_at)}</span>
    )},
  ]

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Settlements'
          description='Track settlement status and history'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Settlements' }]}
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard icon={DollarSign} label='Total Settled' value={summary?.total_settled ?? 0} isCurrency color='success' delay={0} />
        <StatCard icon={CheckCircle} label='Settlements' value={summary?.count ?? 0} color='primary' delay={0.05} />
        <StatCard icon={Clock} label='Pending' value={summary?.pending_count ?? 0} color='warning' delay={0.1} />
        <StatCard icon={AlertTriangle} label='Disputed' value={summary?.disputed_count ?? 0} color='danger' delay={0.15} />
      </motion.div>

      <ScrollReveal delay={0.12}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          emptyMessage='No settlements found'
          pagination={data ? { page, pages: Math.max(1, Math.ceil(data.total / 15)), total: data.total, onPageChange: setPage } : undefined}
        />
      </ScrollReveal>
    </motion.div>
  )
}
