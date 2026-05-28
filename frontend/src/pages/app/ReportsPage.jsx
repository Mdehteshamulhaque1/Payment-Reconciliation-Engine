import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

function revenueData() {
  return months.map((m, i) => {
    const volume = Math.round(1200000 + i * 300000 + Math.random() * 100000)
    const reconciled = Math.round(volume * (0.93 + Math.random() * 0.05))
    return { month: m, volume, reconciled }
  })
}

const ratioData = [
  { name: 'Matched', value: 96.4, color: '#10b981' },
  { name: 'Pending', value: 2.8, color: '#f59e0b' },
  { name: 'Failed', value: 0.8, color: '#ef4444' },
]

const gatewayData = [
  { name: 'Stripe', tx: 48200, settle: 1.6, color: '#6366f1' },
  { name: 'Razorpay', tx: 39200, settle: 1.9, color: '#06b6d4' },
  { name: 'UPI', tx: 31000, settle: 2.3, color: '#10b981' },
  { name: 'PayPal', tx: 19800, settle: 2.8, color: '#f59e0b' },
  { name: 'PhonePe', tx: 14200, settle: 3.4, color: '#ef4444' },
]

const reports = [
  { name: 'Daily reconciliation summary', period: 'Today', size: '4.2 MB' },
  { name: 'Monthly variance report', period: 'May 2026', size: '12.8 MB' },
  { name: 'Audit-ready exception log', period: 'May 2026', size: '2.1 MB' },
  { name: 'Executive KPI snapshot', period: 'Q2 2026', size: '8.4 MB' },
]

export default function ReportsPage() {
  const [from, setFrom] = useState('2026-05-01')
  const [to, setTo] = useState('2026-05-31')
  const [toast, setToast] = useState('')
  const data = useMemo(() => revenueData(), [])

  function emitToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-sm text-[var(--muted)]">Generate exportable insights and executive reports</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-[var(--muted)]">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field" />
            <label className="text-sm text-[var(--muted)]">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input-field" />
            <button onClick={() => emitToast('Generating report...')} className="btn-primary">Generate Report</button>
            <button onClick={() => emitToast('Generating PDF export...')} className="btn-ghost">Export PDF</button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Volume" value="₹48.2L" delta="+18.3% MoM" deltaTone="text-emerald-400" />
          <MetricCard title="Success Rate" value="97.4%" delta="+1.2%" deltaTone="text-emerald-400" />
          <MetricCard title="Avg Settlement" value="1.8 days" delta="-0.4 days faster" deltaTone="text-emerald-400" />
          <MetricCard title="Fraud Blocked" value="₹4.2L" delta="99% catch rate" deltaTone="text-emerald-400" />
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-5">
          <div className="rounded-lg border p-4 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Revenue Trend</h3>
              <span className="text-xs text-[var(--muted)]">12 months</span>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="volArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="recArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#0f172a" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  <Legend />
                  <Area type="monotone" dataKey="volume" fill="url(#volArea)" stroke="#6366f1" name="Transaction Volume" />
                  <Line type="monotone" dataKey="volume" stroke="#6366f1" dot={false} />
                  <Area type="monotone" dataKey="reconciled" fill="url(#recArea)" stroke="#10b981" name="Reconciled Amount" />
                  <Line type="monotone" dataKey="reconciled" stroke="#10b981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold">Success vs Failure Ratio</h3>
            <div className="mt-3" style={{ height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={ratioData} dataKey="value" innerRadius={64} outerRadius={92}>
                    {ratioData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mono -mt-8 text-center text-xl font-bold">96.4% Success Rate</div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Gateway Performance</h3>
              <span className="text-xs text-[var(--muted)]">Transactions</span>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart layout="vertical" data={gatewayData} margin={{ left: 24 }}>
                  <CartesianGrid stroke="#0f172a" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="tx" radius={[0, 8, 8, 0]}>
                    {gatewayData.map((g) => <Cell key={g.name} fill={g.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Settlement Time by Gateway</h3>
              <span className="text-xs text-[var(--muted)]">Avg days</span>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={gatewayData}>
                  <CartesianGrid stroke="#0f172a" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="settle" radius={[8, 8, 0, 0]}>
                    {gatewayData.map((g) => <Cell key={g.name} fill={g.settle < 2 ? '#10b981' : g.settle <= 3 ? '#f59e0b' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Available Reports</h3>
          <div className="mt-4 overflow-auto">
            <table className="w-full table-auto text-sm">
              <thead className="text-xs text-[var(--muted)]"><tr><th className="text-left">Report</th><th>Period</th><th>Size</th><th></th></tr></thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.name} className="border-t border-[var(--border)]">
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">{r.period}</td>
                    <td className="py-3">{r.size}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => emitToast(`Generating ${r.name}...`)} className="btn-ghost mr-2">Download CSV</button>
                      <button onClick={() => emitToast(`Generating ${r.name}...`)} className="btn-primary">Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 rounded-lg bg-[var(--surface-strong)] p-3 shadow-lg">{toast}</div>}
    </div>
  )
}

function MetricCard({ title, value, delta, deltaTone }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs font-semibold uppercase text-[var(--muted)]">{title}</div>
      <div className="mono mt-2 text-2xl font-bold">{value}</div>
      <div className={`mt-1 text-sm ${deltaTone}`}>{delta}</div>
    </div>
  )
}
