import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { Card } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/StatusChip'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useLedgerEntries, useTrialBalance } from '@/hooks/useLedger'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { LedgerEntry } from '@/types'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function LedgerPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLedgerEntries({ page, size: 15 })
  const { data: trialBalance } = useTrialBalance()

  const columns = [
    { key: 'account_name', label: 'Account', sortable: true, render: (e: LedgerEntry) => (
      <span className='font-medium text-sm'>{e.account_name || e.account}</span>
    )},
    { key: 'entry_type', label: 'Type', render: (e: LedgerEntry) => (
      <StatusChip status={e.entry_type === 'debit' ? 'danger' : 'success'} />
    )},
    { key: 'amount', label: 'Amount', sortable: true, render: (e: LedgerEntry) => (
      <span className='font-medium font-mono'>{formatCurrency(e.amount, e.currency)}</span>
    )},
    { key: 'description', label: 'Description', render: (e: LedgerEntry) => (
      <span className='text-sm text-muted-foreground truncate max-w-[200px] block'>{e.description ?? '—'}</span>
    )},
    { key: 'reference', label: 'Reference', render: (e: LedgerEntry) => (
      <span className='font-mono text-xs'>{e.reference ?? '—'}</span>
    )},
    { key: 'created_at', label: 'Date', sortable: true, render: (e: LedgerEntry) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(e.created_at)}</span>
    )},
  ]

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Ledger'
          description='Double-entry accounting ledger'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Ledger' }]}
        />
      </ScrollReveal>

      {trialBalance && (
        <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Card variant='hud' className='p-5'>
            <p className='text-sm text-muted-foreground mb-1'>Total Debits</p>
            <p className='text-xl font-bold text-danger font-mono'>{formatCurrency(trialBalance.total_debits || trialBalance.total_debit)}</p>
          </Card>
          <Card variant='hud' className='p-5'>
            <p className='text-sm text-muted-foreground mb-1'>Total Credits</p>
            <p className='text-xl font-bold text-success font-mono'>{formatCurrency(trialBalance.total_credits || trialBalance.total_credit)}</p>
          </Card>
          <Card variant='hud' className='p-5'>
            <div className='flex items-center gap-2 mb-1'>
              <Scale size={16} className='text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>Trial Balance</p>
            </div>
            <p className={`text-xl font-bold ${trialBalance.is_balanced ? 'text-success' : 'text-danger'}`}>
              {trialBalance.is_balanced ? 'Balanced' : 'Unbalanced'}
            </p>
          </Card>
        </motion.div>
      )}

      <ScrollReveal delay={0.12}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          emptyMessage='No ledger entries'
          pagination={data ? { page, pages: Math.max(1, Math.ceil(data.total / 15)), total: data.total, onPageChange: setPage } : undefined}
        />
      </ScrollReveal>
    </motion.div>
  )
}
