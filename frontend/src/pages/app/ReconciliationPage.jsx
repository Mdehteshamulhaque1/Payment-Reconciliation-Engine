import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CheckCircle2, Loader2, X } from 'lucide-react'

function buildBatches() {
  return [
    { id: 'Batch #2026-047', status: 'completed', date: 'May 22, 2026 — 14:32', matchRate: '99.85', matched: 4820, ai: 142, exceptions: 18, failed: 2 },
    { id: 'Batch #2026-048', status: 'running', date: 'May 23, 2026 — 10:14', matchRate: '99.72', matched: 4715, ai: 128, exceptions: 23, failed: 4 },
    { id: 'Batch #2026-049', status: 'failed', date: 'May 24, 2026 — 08:03', matchRate: '98.91', matched: 4508, ai: 111, exceptions: 41, failed: 9 },
    { id: 'Batch #2026-050', status: 'completed', date: 'May 25, 2026 — 17:08', matchRate: '99.93', matched: 4897, ai: 122, exceptions: 10, failed: 1 },
    { id: 'Batch #2026-051', status: 'completed', date: 'May 26, 2026 — 19:41', matchRate: '99.88', matched: 4869, ai: 137, exceptions: 14, failed: 2 },
    { id: 'Batch #2026-052', status: 'running', date: 'May 27, 2026 — 07:27', matchRate: '99.61', matched: 4624, ai: 148, exceptions: 27, failed: 5 },
  ]
}

function statusPill(status) {
  if (status === 'completed') return <span className="status-pill status-pill-success">Completed</span>
  if (status === 'running') return <span className="status-pill status-pill-info">Running</span>
  return <span className="status-pill status-pill-danger">Failed</span>
}

export default function ReconciliationPage() {
  const [batches, setBatches] = useState(() => buildBatches())
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [runOpen, setRunOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState('')
  const timerRef = useRef(null)

  const selected = batches[selectedIdx]

  const donut = useMemo(
    () => [
      { name: 'Matched', value: 96.4, color: '#10b981' },
      { name: 'AI Matched', value: 2.8, color: '#4f46e5' },
      { name: 'Exceptions', value: 0.7, color: '#f59e0b' },
      { name: 'Failed', value: 0.1, color: '#ef4444' },
    ],
    [],
  )

  const rows = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `TXN-${12000 + i}`,
        type: i % 4 === 0 ? 'ai' : i % 3 === 0 ? 'fuzzy' : 'exact',
        confidence: Math.round(65 + Math.random() * 35),
        status: i % 6 === 0 ? 'Exception' : 'Matched',
      })),
    [],
  )

  function openRunModal() {
    setRunOpen(true)
    setProgress(0)
  }

  function startReconciliation() {
    const started = Date.now()
    timerRef.current = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - started) / 3000) * 100))
      setProgress(p)
      if (p >= 100) {
        clearInterval(timerRef.current)
        setRunOpen(false)
        setToast('Batch completed successfully')
        setTimeout(() => setToast(''), 1800)
      }
    }, 90)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const stageText =
    progress < 25
      ? 'Fetching transactions...'
      : progress < 60
        ? 'Running exact match...'
        : progress < 85
          ? 'Running AI match...'
          : 'Finalizing...'

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Reconciliation Batches</h1>
            <p className="text-sm text-[var(--muted)]">Run and inspect reconciliation pipeline results</p>
          </div>
          <button onClick={openRunModal} className="btn-primary">Run New Batch</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="card p-3">
              <div className="space-y-3">
                {batches.map((batch, idx) => (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full rounded-md border p-3 text-left transition ${selectedIdx === idx ? 'border-l-[3px] border-l-[#4f46e5] bg-white/5' : 'hover:bg-white/5'}`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold">{batch.id}</span>
                      {statusPill(batch.status)}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{batch.date}</div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="mono">{batch.matchRate}%</span>
                      <span className="text-xs text-[var(--muted)]">{batch.matched} matched / {batch.exceptions} exceptions</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="card p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{selected.id}</h2>
                  {statusPill(selected.status)}
                </div>
                <button className="btn-ghost">Export Results</button>
              </div>

              <div className="mb-6 flex items-center gap-3 text-sm">
                <Stage title="Fetch Data" state="done" />
                <span>→</span>
                <Stage title="Exact Match" state="done" />
                <span>→</span>
                <Stage title="AI Match" state={selected.status === 'running' ? 'current' : 'done'} />
                <span>→</span>
                <Stage title="Complete" state={selected.status === 'completed' ? 'done' : 'pending'} />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat title="Matched" value={selected.matched} tone="text-emerald-400" />
                <Stat title="AI Matched" value={selected.ai} tone="text-indigo-400" />
                <Stat title="Exceptions" value={selected.exceptions} tone="text-amber-400" />
                <Stat title="Failed" value={selected.failed} tone="text-rose-400" />
              </div>

              <div className="mb-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-[var(--muted)]">Match Rate Distribution</div>
                  <div style={{ height: 220 }} className="mt-2">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={donut} innerRadius={56} outerRadius={84} dataKey="value">
                          {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mono -mt-4 text-center text-2xl font-bold">{selected.matchRate}%</div>
                </div>

                <div className="rounded-lg border p-4 lg:col-span-2">
                  <div className="mb-3 text-sm text-[var(--muted)]">Results</div>
                  <div className="overflow-auto">
                    <table className="w-full table-auto text-sm">
                      <thead className="text-xs text-[var(--muted)]"><tr><th>ID</th><th>Match Type</th><th>Confidence</th><th>Status</th></tr></thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--border)]">
                            <td className="py-3">{row.id}</td>
                            <td className="py-3">{row.type}</td>
                            <td className="py-3">
                              <div className="h-2.5 w-full rounded bg-slate-800">
                                <div className={`h-2.5 rounded ${row.confidence > 90 ? 'bg-emerald-400' : row.confidence >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${row.confidence}%` }} />
                              </div>
                              <div className="mt-1 text-xs text-[var(--muted)]">{row.confidence}%</div>
                            </td>
                            <td className="py-3">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {runOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
          <div className="w-full max-w-lg rounded-lg bg-[var(--surface-strong)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Run New Batch</h3>
              <button onClick={() => setRunOpen(false)} className="rounded p-1 hover:bg-white/5"><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <select className="input-field"><option>Stripe</option><option>Razorpay</option><option>PayPal</option></select>
              <input className="input-field" placeholder="May 20, 2026 — May 22, 2026" />
              <select className="input-field"><option>Exact</option><option>Fuzzy</option><option>AI</option></select>

              <div>
                <div className="mb-1 text-xs text-[var(--muted)]">{stageText}</div>
                <div className="h-3 w-full rounded bg-slate-800">
                  <div className="h-3 rounded bg-[var(--primary)] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-1 text-xs text-[var(--muted)]">{progress}%</div>
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn-ghost" onClick={() => setRunOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={startReconciliation}>Start Reconciliation</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[var(--surface-strong)] p-3 shadow-lg">
          <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={18} />{toast}</div>
        </div>
      )}
    </div>
  )
}

function Stage({ title, state }) {
  const cls = state === 'done' ? 'bg-[var(--primary)]' : state === 'current' ? 'animate-pulse bg-sky-500' : 'bg-slate-600'
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${cls}`}>{state === 'done' ? '✓' : state === 'current' ? <Loader2 size={12} className="animate-spin" /> : '•'}</span>
      <span>{title}</span>
    </div>
  )
}

function Stat({ title, value, tone }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs text-[var(--muted)]">{title}</div>
      <div className={`mono mt-1 text-2xl font-bold ${tone}`}>{value}</div>
    </div>
  )
}
