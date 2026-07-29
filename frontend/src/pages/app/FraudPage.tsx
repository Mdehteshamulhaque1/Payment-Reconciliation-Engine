import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, Eye, CheckCircle, Brain,
  Activity, Users, Cpu, TrendingUp,
  XCircle, RefreshCw,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { StatCard } from '@/components/ui/StatCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import {
  useFraudCases, useFraudDashboard, useMLDashboard,
  useFraudAlerts, useResolveFraud, useAcknowledgeAlert, useRetrainModels,
} from '@/hooks/useFraud'
import { formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'
import type { FraudCase, FraudAlert } from '@/types'

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'investigating', label: 'Investigating' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'confirmed', label: 'Confirmed' },
]

const alertFilters = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

const tabs = [
  { key: 'cases', label: 'Cases' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'ml-insights', label: 'ML Insights' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-danger/15 text-danger border-danger/30',
    high: 'bg-warning/15 text-warning border-warning/30',
    medium: 'bg-info/15 text-info border-info/30',
    low: 'bg-muted text-muted-foreground border-border/50',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[severity] || colors.low}`}>
      {severity}
    </span>
  )
}

function RiskBar({ score }: { score: number }) {
  const pct = Math.min(score * 100, 100)
  const color = pct >= 80 ? 'bg-danger' : pct >= 60 ? 'bg-warning' : pct >= 40 ? 'bg-info' : 'bg-muted-foreground/50'
  return (
    <div className='flex items-center gap-2'>
      <div className='w-16 h-1.5 rounded-full bg-border overflow-hidden'>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className='font-mono text-xs'>{score.toFixed(2)}</span>
    </div>
  )
}

function ModelScores({ modelScores }: { modelScores: string | null }) {
  if (!modelScores) return null
  try {
    const scores = JSON.parse(modelScores)
    return (
      <div className='flex flex-wrap gap-2'>
        {scores.map((s: { model: string; score: number }) => (
          <span key={s.model} className='text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono'>
            {s.model}: {s.score.toFixed(3)}
          </span>
        ))}
      </div>
    )
  } catch { return null }
}

export default function FraudPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null)
  const [activeTab, setActiveTab] = useState('cases')
  const [alertFilter, setAlertFilter] = useState('all')

  const { data, isLoading } = useFraudCases({
    page, size: 15,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })
  const { data: dash } = useFraudDashboard()
  const { data: mlDash } = useMLDashboard()
  const { data: alertsData } = useFraudAlerts({
    page: 1, size: 10,
    severity: alertFilter === 'all' ? undefined : alertFilter,
  })
  const resolveMutation = useResolveFraud()
  const ackAlertMutation = useAcknowledgeAlert()
  const retrainMutation = useRetrainModels()

  const caseColumns = [
    { key: 'id', label: 'ID', render: (c: FraudCase) => <span className='text-sm'>#{c.id}</span> },
    { key: 'fraud_type', label: 'Type', render: (c: FraudCase) => (
      <span className='text-sm capitalize'>{c.fraud_type.replace(/_/g, ' ')}</span>
    )},
    { key: 'severity', label: 'Severity', render: (c: FraudCase) => <SeverityBadge severity={c.severity} /> },
    { key: 'risk_score', label: 'Score', render: (c: FraudCase) => <RiskBar score={c.risk_score} /> },
    { key: 'ml_risk_score', label: 'ML', render: (c: FraudCase) => (
      c.ml_risk_score != null ? <RiskBar score={c.ml_risk_score} /> : <span className='text-xs text-muted-foreground'>—</span>
    )},
    { key: 'status', label: 'Status', render: (c: FraudCase) => <StatusChip status={c.status} /> },
    { key: 'created_at', label: 'Created', render: (c: FraudCase) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(c.created_at)}</span>
    )},
    { key: 'actions', label: '', render: (c: FraudCase) => (
      <div className='flex gap-1'>
        <Button variant='ghost' size='sm' onClick={(e) => { e.stopPropagation(); setSelectedCase(c) }}><Eye size={14} /></Button>
        {c.status !== 'resolved' && (
          <Button variant='ghost' size='sm' onClick={(e) => {
            e.stopPropagation()
            resolveMutation.mutate({ id: c.id }, {
              onSuccess: () => showToast('success', 'Case resolved'),
              onError: (err) => showToast('error', err.message),
            })
          }}>
            <CheckCircle size={14} className='text-success' />
          </Button>
        )}
      </div>
    )},
  ]

  const alertColumns = [
    { key: 'severity', label: '', render: (a: FraudAlert) => (
      <div className={`w-2 h-2 rounded-full ${a.severity === 'critical' ? 'bg-danger' : a.severity === 'high' ? 'bg-warning' : a.severity === 'medium' ? 'bg-info' : 'bg-muted-foreground/50'}`} />
    )},
    { key: 'title', label: 'Alert', render: (a: FraudAlert) => (
      <div>
        <div className='text-sm font-medium'>{a.title}</div>
        {a.description && <div className='text-xs text-muted-foreground truncate max-w-[300px]'>{a.description}</div>}
      </div>
    )},
    { key: 'severity', label: 'Severity', render: (a: FraudAlert) => <SeverityBadge severity={a.severity} /> },
    { key: 'status', label: 'Status', render: (a: FraudAlert) => <StatusChip status={a.status} /> },
    { key: 'created_at', label: 'Time', render: (a: FraudAlert) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(a.created_at)}</span>
    )},
    { key: 'actions', label: '', render: (a: FraudAlert) => (
      <div className='flex gap-1'>
        <Button variant='ghost' size='sm' onClick={() => setSelectedAlert(a)}><Eye size={14} /></Button>
        {a.status === 'new' && (
          <Button variant='ghost' size='sm' onClick={() => ackAlertMutation.mutate(a.id, {
            onSuccess: () => showToast('success', 'Alert acknowledged'),
          })}>
            <CheckCircle size={14} className='text-success' />
          </Button>
        )}
      </div>
    )},
  ]

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Fraud Detection & ML Risk Engine'
          description='AI-powered fraud detection with real-time scoring, explainable decisions, and case management'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Fraud' }]}
          actions={
            <Button variant='outline' size='sm' onClick={() => retrainMutation.mutate(undefined, {
              onSuccess: () => showToast('success', 'ML models retrained'),
              onError: () => showToast('error', 'Retrain failed'),
            })} loading={retrainMutation.isPending}>
              <RefreshCw size={14} className='mr-1' /> Retrain Models
            </Button>
          }
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7'>
        <StatCard icon={Shield} label='Total Cases' value={dash?.total_cases ?? 0} color='primary' />
        <StatCard icon={AlertTriangle} label='Open' value={dash?.open_cases ?? 0} color='warning' />
        <StatCard icon={Activity} label='Last 24h' value={dash?.cases_last_24h ?? 0} color='danger' />
        <StatCard icon={Brain} label='ML Score' value={mlDash ? (mlDash.avg_ml_risk_score * 100).toFixed(0) : '—'} color='info' suffix='%' />
        <StatCard icon={Cpu} label='ML Cases' value={mlDash?.ml_case_count ?? 0} color='primary' />
        <StatCard icon={Users} label='Rings' value={mlDash?.fraud_rings?.length ?? 0} color='danger' />
        <StatCard icon={CheckCircle} label='Resolved' value={dash?.resolved ?? 0} color='success' />
      </motion.div>

      <motion.div variants={fadeUp}>
        <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </motion.div>

      <AnimatePresence mode='wait'>
        {activeTab === 'cases' && (
          <motion.div key='cases' variants={fadeUp} initial='hidden' animate='show' exit={{ opacity: 0 }} className='space-y-4'>
            <FilterTabs tabs={statusFilters} active={statusFilter} onChange={(k) => { setStatusFilter(k); setPage(1) }} />
            <DataTable
              data={data?.items ?? []}
              columns={caseColumns}
              loading={isLoading}
              emptyMessage='No fraud cases found'
              pagination={data ? { page, pages: Math.ceil(data.total / 15), total: data.total, onPageChange: setPage } : undefined}
              onRowClick={setSelectedCase}
            />
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div key='alerts' variants={fadeUp} initial='hidden' animate='show' exit={{ opacity: 0 }} className='space-y-4'>
            <FilterTabs tabs={alertFilters} active={alertFilter} onChange={(k) => setAlertFilter(k)} />
            <DataTable
              data={alertsData?.items ?? []}
              columns={alertColumns}
              loading={false}
              emptyMessage='No alerts'
            />
          </motion.div>
        )}

        {activeTab === 'ml-insights' && (
          <motion.div key='ml-insights' variants={fadeUp} initial='hidden' animate='show' exit={{ opacity: 0 }} className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <ScrollReveal delay={0.1}>
              <div className='rounded-xl border border-border/50 bg-card p-5 space-y-4'>
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  <Brain className='w-4 h-4 text-primary' /> Model Performance
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  {Object.entries(mlDash?.model_usage ?? {}).map(([model, count]) => (
                    <div key={model} className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                      <span className='text-xs capitalize'>{model.replace(/_/g, ' ')}</span>
                      <span className='font-mono text-xs'>{count}</span>
                    </div>
                  ))}
                </div>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>ML Engine: <span className={mlDash?.ml_enabled ? 'text-success' : 'text-warning'}>{mlDash?.ml_enabled ? 'Active' : 'Standby'}</span></span>
                  <span>Avg ML Score: {(mlDash?.avg_ml_risk_score ?? 0).toFixed(3)}</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className='rounded-xl border border-border/50 bg-card p-5 space-y-4'>
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  <TrendingUp className='w-4 h-4 text-primary' /> Feature Importance
                </div>
                <div className='space-y-2'>
                  {Object.entries(mlDash?.feature_importance ?? {}).sort(([, a], [, b]) => b - a).slice(0, 10).map(([feat, imp]) => (
                    <div key={feat} className='flex items-center gap-2'>
                      <span className='text-xs w-32 truncate'>{feat.replace(/_/g, ' ')}</span>
                      <div className='flex-1 h-1.5 rounded-full bg-border overflow-hidden'>
                        <div className='h-full rounded-full bg-primary' style={{ width: `${imp * 100}%` }} />
                      </div>
                      <span className='font-mono text-[10px] text-muted-foreground'>{(imp * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className='rounded-xl border border-border/50 bg-card p-5 space-y-4 lg:col-span-2'>
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  <Users className='w-4 h-4 text-primary' /> Fraud Rings
                </div>
                {(mlDash?.fraud_rings ?? []).length === 0 ? (
                  <div className='text-xs text-muted-foreground py-4 text-center'>No fraud rings detected</div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {mlDash?.fraud_rings?.map((ring, i) => (
                      <div key={i} className='p-3 rounded-lg bg-muted/50 border border-border/30 space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs font-semibold'>Ring #{i + 1}</span>
                          <RiskBar score={ring.risk} />
                        </div>
                        <div className='text-[10px] text-muted-foreground'>
                          {ring.customer_ids.length} customers, {ring.shared_merchants.length} shared merchants
                        </div>
                        <div className='text-[10px] font-mono text-muted-foreground truncate'>
                          Customers: [{ring.customer_ids.join(', ')}]
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={!!selectedCase} onOpenChange={() => setSelectedCase(null)} title={`Fraud Case #${selectedCase?.id}`}>
        {selectedCase && (
          <div className='space-y-4 text-sm'>
            <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
              <span className='text-muted-foreground'>Type:</span><span className='capitalize font-medium'>{selectedCase.fraud_type.replace(/_/g, ' ')}</span>
              <span className='text-muted-foreground'>Severity:</span><SeverityBadge severity={selectedCase.severity} />
              <span className='text-muted-foreground'>Status:</span><StatusChip status={selectedCase.status} />
              <span className='text-muted-foreground'>Risk Score:</span><RiskBar score={selectedCase.risk_score} />
              {selectedCase.ml_risk_score != null && (
                <><span className='text-muted-foreground'>ML Risk:</span><RiskBar score={selectedCase.ml_risk_score} /></>
              )}
              {selectedCase.rule_risk_score != null && (
                <><span className='text-muted-foreground'>Rule Risk:</span><RiskBar score={selectedCase.rule_risk_score} /></>
              )}
              <span className='text-muted-foreground'>Transaction:</span>
              <span className='font-mono text-xs'>#{selectedCase.transaction_id}</span>
              {selectedCase.assigned_to && <><span className='text-muted-foreground'>Assigned:</span><span>User #{selectedCase.assigned_to}</span></>}
              {selectedCase.escalated && <><span className='text-muted-foreground'>Escalated:</span><span className='text-warning'>Yes</span></>}
              <span className='text-muted-foreground'>Created:</span><span>{formatDateTime(selectedCase.created_at)}</span>
            </div>

            {selectedCase.model_contributions && (
              <div className='space-y-1.5'>
                <div className='text-xs font-semibold text-muted-foreground flex items-center gap-1'><Brain className='w-3 h-3' /> Model Contributions</div>
                <ModelScores modelScores={selectedCase.model_contributions} />
              </div>
            )}

            {selectedCase.shap_explanation && (
              <div className='space-y-1.5'>
                <div className='text-xs font-semibold text-muted-foreground flex items-center gap-1'><Activity className='w-3 h-3' /> AI Explanation</div>
                {(() => {
                  try {
                    const shap = JSON.parse(selectedCase.shap_explanation)
                    return (
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>{shap.summary}</p>
                        {shap.top_factors?.slice(0, 5).map((f: { feature: string; value: number; contribution: number; direction: string }, i: number) => (
                          <div key={i} className='flex items-center gap-2 text-[11px]'>
                            <div className={`w-1.5 h-1.5 rounded-full ${f.direction === 'increases_risk' ? 'bg-danger' : 'bg-success'}`} />
                            <span className='w-28 truncate'>{f.feature.replace(/_/g, ' ')}</span>
                            <span className='font-mono text-muted-foreground'>{f.value}</span>
                            <span className={`font-mono ${f.direction === 'increases_risk' ? 'text-danger' : 'text-success'}`}>
                              {f.contribution > 0 ? '+' : ''}{f.contribution.toFixed(3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  } catch { return null }
                })()}
              </div>
            )}

            {selectedCase.review_notes && (
              <div className='space-y-1.5'>
                <div className='text-xs font-semibold text-muted-foreground'>Review Notes</div>
                <p className='text-xs bg-muted/50 p-2 rounded-lg'>{selectedCase.review_notes}</p>
              </div>
            )}

            {selectedCase.status === 'open' && (
              <div className='flex gap-2 pt-2'>
                <Button size='sm' onClick={() => resolveMutation.mutate({ id: selectedCase.id, body: { status: 'investigating' } }, {
                  onSuccess: () => { showToast('success', 'Marked as investigating'); setSelectedCase(null) },
                })} loading={resolveMutation.isPending}>Start Investigation</Button>
                <Button size='sm' variant='outline' onClick={() => resolveMutation.mutate({ id: selectedCase.id, body: { status: 'false_positive' } }, {
                  onSuccess: () => { showToast('success', 'Marked as false positive'); setSelectedCase(null) },
                })}>
                  <XCircle size={14} className='mr-1' /> False Positive
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)} title={selectedAlert?.title ?? 'Alert'}>
        {selectedAlert && (
          <div className='space-y-3 text-sm'>
            <div className='grid grid-cols-2 gap-2'>
              <span className='text-muted-foreground'>Severity:</span><SeverityBadge severity={selectedAlert.severity} />
              <span className='text-muted-foreground'>Status:</span><StatusChip status={selectedAlert.status} />
              <span className='text-muted-foreground'>Type:</span><span className='capitalize'>{selectedAlert.alert_type.replace(/_/g, ' ')}</span>
              <span className='text-muted-foreground'>Time:</span><span>{formatDateTime(selectedAlert.created_at)}</span>
              {selectedAlert.description && <><span className='text-muted-foreground'>Details:</span><span className='col-span-1'>{selectedAlert.description}</span></>}
            </div>
            {selectedAlert.status === 'new' && (
              <Button size='sm' onClick={() => ackAlertMutation.mutate(selectedAlert.id, {
                onSuccess: () => { showToast('success', 'Alert acknowledged'); setSelectedAlert(null) },
              })} loading={ackAlertMutation.isPending}>
                <CheckCircle size={14} className='mr-1' /> Acknowledge
              </Button>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
