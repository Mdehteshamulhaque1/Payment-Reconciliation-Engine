import React, { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ALERTS = [
  {
    severity: 'CRITICAL',
    merchant: 'Zomato',
    domain: 'zomato.com',
    type: 'Velocity Spike',
    description: '8 transactions in 5 min — sudden surge',
    amount: '₹4,20,000',
    gateway: ['stripe.com', 'Stripe'],
    confidence: 96,
    time: '8 min ago',
  },
  {
    severity: 'HIGH',
    merchant: 'Uber',
    domain: 'uber.com',
    type: 'Amount Anomaly',
    description: '340x higher than average',
    amount: '₹98,000',
    gateway: ['razorpay.com', 'Razorpay'],
    confidence: 87,
    time: '12 min ago',
  },
  {
    severity: 'HIGH',
    merchant: 'Swiggy',
    domain: 'swiggy.com',
    type: 'Duplicate Transaction',
    description: 'Same amount+merchant in 90 seconds',
    amount: '₹2,400',
    gateway: ['razorpay.com', 'Razorpay'],
    confidence: 82,
    time: '25 min ago',
  },
  {
    severity: 'MEDIUM',
    merchant: 'Amazon',
    domain: 'amazon.com',
    type: 'Odd Hours High Value',
    description: 'Transaction at 3:24 AM',
    amount: '₹1,40,000',
    gateway: ['paypal.com', 'PayPal'],
    confidence: 71,
    time: '42 min ago',
  },
  {
    severity: 'LOW',
    merchant: 'Netflix',
    domain: 'netflix.com',
    type: 'Failed Attempts',
    description: '4 failed attempts before success',
    amount: '₹649',
    gateway: ['stripe.com', 'Stripe'],
    confidence: 58,
    time: '1 hr ago',
  },
]

const TOP_STATS = [
  { label: 'Total Alerts Today', value: 7, tone: 'rose' },
  { label: 'Critical', value: 1, tone: 'rose' },
  { label: 'High', value: 2, tone: 'amber' },
  { label: 'False Positives', value: 3, tone: 'slate' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function heatValue(dayIdx, hour) {
  const weekend = dayIdx === 4 || dayIdx === 5
  const night = hour >= 22 || hour <= 3
  if (weekend && night) return Math.random() < 0.6 ? 3 : Math.random() < 0.4 ? 2 : 1
  if (weekend) return Math.random() < 0.3 ? 2 : 1
  if (night) return Math.random() < 0.12 ? 1 : 0
  return Math.random() < 0.06 ? 1 : 0
}

export default function FraudAlertsPage() {
  const [alerts] = useState(ALERTS)
  const [toast, setToast] = useState('')

  const heatmap = useMemo(() => {
    return DAYS.map((d, di) => Array.from({ length: 24 }).map((_, h) => ({ day: d, hour: h, v: heatValue(di, h) })))
  }, [])

  function handleFalsePositive() {
    setToast('Marked as false positive')
    setTimeout(() => setToast(''), 2000)
  }

  function handleEscalate() {
    setToast('Escalated alert')
    setTimeout(() => setToast(''), 2000)
  }

  function handleRetrain() {
    setToast('Retraining model...')
    setTimeout(() => setToast('Model retrained successfully'), 1800)
    setTimeout(() => setToast(''), 4200)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Fraud & Anomaly Detection</h1>
            <p className="text-sm text-[var(--muted)]">Active alerts and model telemetry</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
              <span className="live-dot" />
              <span className="text-[var(--success)] font-semibold">Live</span>
            </div>
            <button className="btn-primary">Investigate Now</button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_STATS.map((s) => (
            <div key={s.label} className="rounded-lg border p-4">
              <div className="text-xs font-semibold uppercase text-[var(--muted)]">{s.label}</div>
              <div className={`mt-2 text-2xl font-bold ${s.tone === 'rose' ? 'text-rose-400' : s.tone === 'amber' ? 'text-amber-400' : 'text-slate-400'}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Fraud Alerts</h2>
              <div className="inline-flex items-center gap-3 text-sm text-[var(--muted)]">
                <span className="live-dot" /> Live
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className="rounded-lg border p-4" style={{ background: 'var(--surface)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <SeverityBadge severity={a.severity} />
                      <img src={`https://logo.clearbit.com/${a.domain}`} alt={a.merchant} className="h-8 w-8 rounded" />
                      <div>
                        <div className="font-semibold">{a.merchant} — <span className="text-xs text-[var(--muted)]">{a.type}</span></div>
                        <div className="text-sm text-[var(--muted)]">{a.description}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="mono text-lg font-bold">{a.amount}</div>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <img src={`https://logo.clearbit.com/${a.gateway[0]}`} alt={a.gateway[1]} className="h-4 w-4" />
                        <div>{a.gateway[1]}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-3 w-full rounded bg-slate-800">
                        <div className={`h-3 rounded ${a.confidence > 90 ? 'bg-rose-400' : a.confidence > 80 ? 'bg-amber-400' : 'bg-slate-400'}`} style={{ width: `${a.confidence}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-[var(--muted)]">Confidence — {a.confidence}%</div>
                    </div>

                    <div className="text-xs text-[var(--muted)]">{a.time}</div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={handleFalsePositive} className="btn-ghost">Mark False Positive</button>
                    <button onClick={handleEscalate} className="btn-secondary text-rose-400">Escalate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Fraud by Hour × Day</h3>
                <div className="text-xs text-[var(--muted)]">Heatmap</div>
              </div>

              <div className="mt-3 overflow-auto">
                <div className="grid gap-1">
                  <div className="mb-2 grid grid-cols-24 text-xs text-[var(--muted)]">
                    {Array.from({ length: 24 }).map((_, h) => (
                      <div key={h} className="text-center text-[10px]">{h}</div>
                    ))}
                  </div>

                  {heatmap.map((row, ri) => (
                    <div key={ri} className="flex items-center gap-2">
                      <div className="w-10 text-xs text-[var(--muted)]">{DAYS[ri]}</div>
                      <div className="grid flex-1 grid-cols-24 gap-1">
                        {row.map((cell, ci) => {
                          const cls = cell.v === 3 ? 'bg-rose-500' : cell.v === 2 ? 'bg-amber-400' : cell.v === 1 ? 'bg-yellow-300' : 'bg-slate-800'
                          return <div key={ci} title={`${DAYS[ri]} ${cell.hour}:00 — ${cell.v} alerts`} className={`${cls} h-6 w-full rounded-sm`} />
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">AI Model Status</h3>
              <div className="mt-3 text-sm text-[var(--muted)]">Model: <span className="font-mono">IsolationForest</span></div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>Last trained: <div className="font-semibold">2 hours ago</div></div>
                <div>Accuracy: <div className="font-semibold">94.2%</div></div>
                <div>Training samples: <div className="font-semibold">48,291</div></div>
                <div>Status: <div className="font-semibold text-emerald-400">Healthy</div></div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button onClick={handleRetrain} className="btn-primary">Retrain Model</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[var(--surface-strong)] p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" />
            <div>{toast}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function SeverityBadge({ severity }) {
  const map = {
    CRITICAL: 'bg-rose-500 text-white',
    HIGH: 'bg-amber-400 text-black',
    MEDIUM: 'bg-yellow-300 text-black',
    LOW: 'bg-slate-400 text-black',
  }
  return <div className={`rounded px-2 py-1 text-xs font-semibold ${map[severity] || 'bg-slate-400'}`}>{severity}</div>
}
