import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, XCircle, RotateCcw, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import { LocationCard } from '@/components/ui/LocationCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useTransactions, useCreateTransaction, useCancelTransaction, useRefundTransaction, useRetryTransaction } from '@/hooks/useTransactions'
import { useGateways } from '@/hooks/useGateways'
import { formatCurrency, formatDateTime, truncate, copyToClipboard } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'
import type { Transaction } from '@/types'

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
  { key: 'processing', label: 'Processing' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)

  const { data, isLoading } = useTransactions({
    page, size: 15,
    status: status === 'all' ? undefined : status,
    search: search || undefined,
  })
  const { data: gateways } = useGateways()
  const createMutation = useCreateTransaction()
  const cancelMutation = useCancelTransaction()
  const refundMutation = useRefundTransaction()
  const retryMutation = useRetryTransaction()

  const columns = [
    { key: 'transaction_ref', label: 'Reference', sortable: true, render: (t: Transaction) => (
      <button onClick={() => copyToClipboard(t.transaction_ref)} className='font-mono text-xs hover:underline' title='Click to copy'>
        {truncate(t.transaction_ref, 16)}
      </button>
    )},
    { key: 'amount', label: 'Amount', sortable: true, render: (t: Transaction) => (
      <span className='font-medium'>{formatCurrency(t.amount, t.currency)}</span>
    )},
    { key: 'status', label: 'Status', render: (t: Transaction) => <StatusChip status={t.status} pulse={t.status === 'processing'} /> },
    { key: 'gateway_id', label: 'Gateway', render: (t: Transaction) => gateways?.find(g => g.id === t.gateway_id)?.display_name ?? '—' },
    { key: 'created_at', label: 'Date', sortable: true, render: (t: Transaction) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(t.created_at)}</span>
    )},
    { key: 'actions', label: '', render: (t: Transaction) => (
      <div className='flex gap-1'>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); setSelectedTxn(t) }}><Eye size={14} /></Button>
        </motion.div>
        {t.status === 'pending' && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); cancelMutation.mutate(t.id); showToast('success', 'Transaction cancelled') }}>
              <XCircle size={14} className='text-danger' />
            </Button>
          </motion.div>
        )}
        {t.status === 'failed' && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); retryMutation.mutate(t.id); showToast('success', 'Retrying transaction') }}>
              <RefreshCw size={14} className='text-info' />
            </Button>
          </motion.div>
        )}
        {t.status === 'success' && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); refundMutation.mutate(t.id); showToast('success', 'Refund initiated') }}>
              <RotateCcw size={14} className='text-warning' />
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
          title='Transactions'
          description='Monitor and manage all payment transactions'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Transactions' }]}
          actions={
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} className='mr-1.5' /> New Transaction
            </Button>
          }
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs tabs={statusFilters} active={status} onChange={(k) => { setStatus(k); setPage(1) }} />
        <div className='relative w-full sm:w-72'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder='Search transactions...'
            className='w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:shadow-[0_0_12px_var(--primary-glow)]'
          />
        </div>
      </motion.div>

      <ScrollReveal delay={0.1}>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          emptyMessage='No transactions found'
          pagination={data ? { page: data.page, pages: data.pages, total: data.total, onPageChange: setPage } : undefined}
          onRowClick={setSelectedTxn}
        />
      </ScrollReveal>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title='New Transaction'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            createMutation.mutate(
              {
                transaction_ref: (fd.get('transaction_ref') as string) || `TXN-${Date.now()}`,
                amount: Number(fd.get('amount')),
                currency: (fd.get('currency') as string) || 'INR',
                transaction_type: (fd.get('transaction_type') as string) || 'payment',
                description: (fd.get('description') as string) || undefined,
                gateway_id: fd.get('gateway_id') ? Number(fd.get('gateway_id')) : undefined,
              },
              {
                onSuccess: () => { showToast('success', 'Transaction created'); setShowCreate(false) },
                onError: (err) => showToast('error', err.message),
              }
            )
          }}
          className='space-y-4'
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className='mb-1.5 block text-sm font-medium'>Transaction Reference *</label>
            <input name='transaction_ref' required placeholder='TXN-001' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary font-mono' />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <label className='mb-1.5 block text-sm font-medium'>Type</label>
            <select name='transaction_type' defaultValue='payment' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary'>
              <option value='payment'>Payment</option>
              <option value='refund'>Refund</option>
              <option value='payout'>Payout</option>
              <option value='adjustment'>Adjustment</option>
            </select>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className='mb-1.5 block text-sm font-medium'>Amount *</label>
            <input name='amount' type='number' step='0.01' required placeholder='0.00' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary' />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className='mb-1.5 block text-sm font-medium'>Currency</label>
            <input name='currency' defaultValue='INR' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary' />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className='mb-1.5 block text-sm font-medium'>Description</label>
            <input name='description' placeholder='Optional description' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary' />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className='mb-1.5 block text-sm font-medium'>Gateway</label>
            <select name='gateway_id' className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary'>
              <option value=''>Select gateway</option>
              {gateways?.map((g) => (<option key={g.id} value={g.id}>{g.display_name}</option>))}
            </select>
          </motion.div>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type='submit' loading={createMutation.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!selectedTxn} onClose={() => setSelectedTxn(null)} title='Transaction Details'>
        {selectedTxn && (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div><span className='text-muted-foreground'>Reference:</span></div>
              <div className='font-mono text-xs'>{selectedTxn.transaction_ref}</div>
              <div><span className='text-muted-foreground'>Amount:</span></div>
              <div className='font-medium'>{formatCurrency(selectedTxn.amount, selectedTxn.currency)}</div>
              <div><span className='text-muted-foreground'>Status:</span></div>
              <div><StatusChip status={selectedTxn.status} /></div>
              <div><span className='text-muted-foreground'>Created:</span></div>
              <div>{formatDateTime(selectedTxn.created_at)}</div>
              {selectedTxn.failure_reason && (
                <>
                  <div><span className='text-muted-foreground'>Failure:</span></div>
                  <div className='text-danger text-xs'>{selectedTxn.failure_reason}</div>
                </>
              )}
            </div>
            {selectedTxn.location && <LocationCard location={selectedTxn.location} />}
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
