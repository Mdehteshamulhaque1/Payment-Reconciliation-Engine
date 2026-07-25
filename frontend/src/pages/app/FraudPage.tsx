import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Eye, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { StatCard } from '@/components/ui/StatCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useFraudCases, useFraudDashboard, useResolveFraud } from '@/hooks/useFraud'
import { formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'
import type { FraudCase } from '@/types'

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'investigating', label: 'Investigating' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'confirmed', label: 'Confirmed' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function FraudPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null)

  const { data, isLoading } = useFraudCases({
    page, size: 15,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })
  const { data: dash } = useFraudDashboard()
  const resolveMutation = useResolveFraud()

  const columns = [
    { key: 'id', label: 'ID', render: (c: FraudCase) => <span className='text-sm'>#{c.id}</span> },
    { key: 'fraud_type', label: 'Type', render: (c: FraudCase) => <span className='text-sm capitalize'>{c.fraud_type}</span> },
    { key: 'severity', label: 'Severity', render: (c: FraudCase) => <StatusChip status={c.severity} /> },
    { key: 'risk_score', label: 'Risk Score', sortable: true, render: (c: FraudCase) => (
      <span className={`font-medium font-mono ${c.risk_score >= 80 ? 'text-danger' : c.risk_score >= 50 ? 'text-warning' : 'text-muted-foreground'}`}>
        {c.risk_score}
      </span>
    )},
    { key: 'status', label: 'Status', render: (c: FraudCase) => <StatusChip status={c.status} /> },
    { key: 'created_at', label: 'Created', sortable: true, render: (c: FraudCase) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(c.created_at)}</span>
    )},
    { key: 'actions', label: '', render: (c: FraudCase) => (
      <div className='flex gap-1'>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); setSelectedCase(c) }}><Eye size={14} /></Button>
        </motion.div>
        {c.status !== 'resolved' && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant='ghost' size='sm' onClick={(e) => {
              e.stopPropagation()
              resolveMutation.mutate(c.id, {
                onSuccess: () => showToast('success', 'Case resolved'),
                onError: (err) => showToast('error', err.message),
              })
            }}>
              <CheckCircle size={14} className='text-success' />
            </Button>
          </motion.div>
        )}
      </div>
    )},
  ]

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Fraud Detection'
          description='Monitor and investigate suspicious activity'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Fraud' }]}
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <StatCard icon={Shield} label='Total Cases' value={dash?.total_cases ?? 0} color='primary' delay={0} />
        <StatCard icon={AlertTriangle} label='Critical' value={dash?.critical ?? 0} color='danger' delay={0.05} />
        <StatCard icon={AlertTriangle} label='High' value={dash?.high ?? 0} color='warning' delay={0.1} />
        <StatCard icon={AlertTriangle} label='Medium' value={dash?.medium ?? 0} color='info' delay={0.15} />
        <StatCard icon={CheckCircle} label='Resolved' value={dash?.resolved ?? 0} color='success' delay={0.2} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <FilterTabs tabs={statusFilters} active={statusFilter} onChange={(k) => { setStatusFilter(k); setPage(1) }} />
      </motion.div>

      <ScrollReveal delay={0.15}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          emptyMessage='No fraud cases found'
          pagination={data ? { page, pages: Math.ceil(data.total / 15), total: data.total, onPageChange: setPage } : undefined}
          onRowClick={setSelectedCase}
        />
      </ScrollReveal>

      <Modal open={!!selectedCase} onOpenChange={() => setSelectedCase(null)} title='Fraud Case Details'>
        {selectedCase && (
          <div className='space-y-3 text-sm'>
            <div className='grid grid-cols-2 gap-2'>
              <span className='text-muted-foreground'>Case ID:</span><span>#{selectedCase.id}</span>
              <span className='text-muted-foreground'>Type:</span><span className='capitalize'>{selectedCase.fraud_type}</span>
              <span className='text-muted-foreground'>Severity:</span><span><StatusChip status={selectedCase.severity} /></span>
              <span className='text-muted-foreground'>Risk Score:</span><span className='font-medium font-mono'>{selectedCase.risk_score}</span>
              <span className='text-muted-foreground'>Status:</span><span><StatusChip status={selectedCase.status} /></span>
              <span className='text-muted-foreground'>Reason:</span><span className='col-span-1'>{selectedCase.reason}</span>
              <span className='text-muted-foreground'>Created:</span><span>{formatDateTime(selectedCase.created_at)}</span>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
