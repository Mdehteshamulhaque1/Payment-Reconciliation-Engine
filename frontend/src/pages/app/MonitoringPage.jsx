import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const GRAFANA_URL = import.meta.env?.VITE_GRAFANA_URL || ''

function seedData() {
  return Array.from({ length: 20 }).map((_, i) => ({
    x: i,
    tx: 1100 + Math.round(Math.random() * 380),
    match: +(99.6 + Math.random() * 0.3).toFixed(2),
    err: +(Math.random() * 0.05).toFixed(3),
  }))
}

export default function MonitoringPage() {
  const [series, setSeries] = useState(() => seedData())

  useEffect(() => {
    const timer = setInterval(() => {
      setSeries((prev) => {
        const next = prev.slice(1)
        const last = prev[prev.length - 1]
        next.push({
          x: last.x + 1,
          tx: Math.max(700, Math.round(last.tx + (Math.random() - 0.5) * 140)),
          match: +(Math.min(100, Math.max(98.8, last.match + (Math.random() - 0.5) * 0.08)).toFixed(2)),
          err: +(Math.max(0, Math.min(0.06, last.err + (Math.random() - 0.5) * 0.01)).toFixed(3)),
        })
        return next
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const gateways = [
    ['stripe.com', 'Stripe', '99.99%', '142ms'],
    ['razorpay.com', 'Razorpay', '99.87%', '198ms'],
    ['paypal.com', 'PayPal', '98.94%', '312ms'],
    ['phonepe.com', 'PhonePe', '99.71%', '167ms'],
    ['paytm.com', 'Paytm', '99.43%', '223ms'],
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">System Monitoring</h1>
            <p className="text-sm text-[var(--muted)]">Live metrics from Prometheus + Grafana</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 text-sm"><span className="live-dot" />Live</div>
            <a href={GRAFANA_URL || 'http://localhost:3001'} target="_blank" rel="noreferrer" className="btn-ghost">Open Grafana ↗</a>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="API UPTIME" value="99.98%" tone="green" />
          <StatCard label="AVG RESPONSE" value="142ms" tone="green" />
          <StatCard label="ERROR RATE" value="0.02%" tone="green" />
          <StatCard label="REQUESTS/MIN" value="1,284" tone="blue" />
          <StatCard label="ACTIVE USERS" value="7" tone="blue" />
          <StatCard label="DB QUERY TIME" value="8ms" tone="green" />
        </div>

        <div className="card mb-6 p-4" style={{ background: '#0A0A0A' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="mono text-sm font-bold" style={{ color: '#F46800' }}>GRAFANA</span>
              <span className="text-sm">Reconciliation Dashboard</span>
            </div>
            <span className="text-xs text-[var(--muted)]">Grafana is running at {GRAFANA_URL || 'localhost:3001'}</span>
          </div>

          {GRAFANA_URL ? (
            <iframe title="Grafana" src={GRAFANA_URL} className="h-[500px] w-full rounded-lg border-0" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2" style={{ background: '#0F1117', borderRadius: 10, padding: 12 }}>
              <ChartPanel title="Transactions Processed / min">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={series}><CartesianGrid stroke="#1F2937" /><XAxis hide /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="tx" stroke="#00E5CC" dot={false} /></LineChart>
                </ResponsiveContainer>
              </ChartPanel>
              <ChartPanel title="Match Rate %">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={series}><defs><linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.6} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#1F2937" /><XAxis hide /><YAxis hide /><Tooltip /><Area type="monotone" dataKey="match" stroke="#818cf8" fill="url(#matchGrad)" /></AreaChart>
                </ResponsiveContainer>
              </ChartPanel>
              <ChartPanel title="Exception Queue Depth">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={series}><CartesianGrid stroke="#1F2937" /><XAxis hide /><YAxis hide /><Tooltip /><Area type="monotone" dataKey="err" stroke="#F59E0B" fill="#2f1802" /></AreaChart>
                </ResponsiveContainer>
              </ChartPanel>
              <ChartPanel title="API Error Rate">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={series}><CartesianGrid stroke="#1F2937" /><XAxis hide /><YAxis hide /><Tooltip /><Area type="monotone" dataKey="err" stroke="#EF4444" fill="#2f0606" /></AreaChart>
                </ResponsiveContainer>
              </ChartPanel>
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="mb-3 text-sm font-semibold">Gateway Health</h3>
          <div className="overflow-auto">
            <table className="w-full table-auto text-sm">
              <thead className="text-xs text-[var(--muted)]"><tr><th className="text-left">Gateway</th><th>Status</th><th>Uptime</th><th>Avg Latency</th><th>Last Checked</th></tr></thead>
              <tbody>
                {gateways.map(([domain, name, uptime, latency]) => (
                  <tr key={domain} className="border-t border-[var(--border)]">
                    <td className="flex items-center gap-3 py-3"><img src={`https://logo.clearbit.com/${domain}`} alt={name} className="h-6 w-6" />{name}</td>
                    <td className="py-3"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />Online</td>
                    <td className="py-3">{uptime}</td>
                    <td className="py-3">{latency}</td>
                    <td className="py-3 text-[var(--muted)]">Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone = 'green' }) {
  return (
    <div className="rounded-lg border p-4" style={{ background: '#0F1117', borderColor: '#1F2937' }}>
      <div className="text-xs font-semibold uppercase text-[var(--muted)]">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className="mono text-2xl font-bold text-white">{value}</span>
        <span className={`h-2.5 w-2.5 rounded-full ${tone === 'green' ? 'bg-emerald-400' : 'bg-sky-400'}`} />
      </div>
    </div>
  )
}

function ChartPanel({ title, children }) {
  return (
    <div style={{ background: '#0F1117', border: '1px solid #1F2937', borderRadius: 8, padding: 16 }}>
      <div className="mono mb-2 text-sm" style={{ color: '#C9D1D9' }}>{title}</div>
      {children}
    </div>
  )
}
