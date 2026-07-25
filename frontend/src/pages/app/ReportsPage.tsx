import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useReports, useGenerateReport, getReportDownloadUrl } from '@/hooks/useReports'
import { formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'

const REPORT_TYPES = [
  { value: 'daily_summary', label: 'Daily Summary' },
  { value: 'transaction_detail', label: 'Transaction Detail' },
  { value: 'settlement', label: 'Settlement Report' },
  { value: 'reconciliation', label: 'Reconciliation Report' },
  { value: 'fraud_summary', label: 'Fraud Summary' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 14, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function ReportsPage() {
  const [showGenerate, setShowGenerate] = useState(false)
  const { data: reports, isLoading } = useReports()
  const generateMutation = useGenerateReport()

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Reports'
          description='Generate and download reports'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Reports' }]}
          actions={
            <Button onClick={() => setShowGenerate(true)}>
              <Plus size={16} className='mr-1.5' /> Generate Report
            </Button>
          }
        />
      </ScrollReveal>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className='h-32 rounded-2xl' />)}
        </div>
      ) : !reports?.length ? (
        <ScrollReveal><EmptyState icon={FileText} title='No reports' description='No reports generated yet' /></ScrollReveal>
      ) : (
        <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {reports.map((r) => (
            <motion.div key={r.id} variants={fadeUp}>
              <Card variant='hud' className='p-5 flex flex-col h-full'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='min-w-0 flex-1'>
                    <h3 className='font-semibold text-sm truncate'>{r.name}</h3>
                    <p className='text-xs text-muted-foreground mt-0.5 capitalize'>{r.report_type.replace(/_/g, ' ')}</p>
                  </div>
                  <Badge variant={r.status === 'completed' ? 'success' : r.status === 'failed' ? 'danger' : 'info'}>
                    {r.status}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground mb-3'>{formatDateTime(r.created_at)}</p>
                <div className='mt-auto'>
                  {r.status === 'completed' && (
                    <a href={getReportDownloadUrl(r.id)} target='_blank' rel='noopener noreferrer'>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant='outline' size='sm' className='w-full'>
                          <Download size={14} className='mr-1.5' /> Download
                        </Button>
                      </motion.div>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal open={showGenerate} onOpenChange={() => setShowGenerate(false)} title='Generate Report'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            generateMutation.mutate(
              { name: fd.get('title') as string, report_type: fd.get('report_type') as string },
              {
                onSuccess: () => { showToast('success', 'Report generation started'); setShowGenerate(false) },
                onError: (err) => showToast('error', err.message),
              }
            )
          }}
          className='space-y-4'
        >
          <Input label='Title' name='title' required placeholder='Monthly transaction summary' />
          <div>
            <label className='mb-1.5 block text-sm font-medium'>Report Type</label>
            <select name='report_type' required className='w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary'>
              <option value=''>Select type</option>
              {REPORT_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => setShowGenerate(false)}>Cancel</Button>
            <Button type='submit' loading={generateMutation.isPending}>Generate</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
