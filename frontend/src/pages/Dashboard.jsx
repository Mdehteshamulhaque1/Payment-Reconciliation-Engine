import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'
import CountUp from 'react-countup'

const series = [
  { name: '00:00', volume: 120, matched: 115, exceptions: 5 },
  { name: '02:00', volume: 240, matched: 232, exceptions: 8 },
  { name: '04:00', volume: 300, matched: 295, exceptions: 5 },
  { name: '06:00', volume: 900, matched: 890, exceptions: 10 },
  { name: '08:00', volume: 1800, matched: 1775, exceptions: 25 },
  { name: '10:00', volume: 2200, matched: 2180, exceptions: 20 },
  { name: '12:00', volume: 2700, matched: 2688, exceptions: 12 },
  { name: '14:00', volume: 2100, matched: 2085, exceptions: 15 },
  { name: '16:00', volume: 1600, matched: 1590, exceptions: 10 },
  { name: '18:00', volume: 1300, matched: 1280, exceptions: 20 }
]

const recent = [
  { id: 'TX-00123', amount: '$1,200.00', status: 'Matched', when: '2m ago' },
  { id: 'TX-00124', amount: '$3,450.00', status: 'Exception', when: '5m ago' },
  { id: 'TX-00125', amount: '$99.99', status: 'Matched', when: '9m ago' },
  { id: 'TX-00126', amount: '$420.00', status: 'Processing', when: '12m ago' },
  { id: 'TX-00127', amount: '$60.00', status: 'Matched', when: '20m ago' }
]

export default function Dashboard() {
  const totals = useMemo(() => {
    const volume = series.reduce((s, r) => s + r.volume, 0)
    const matched = series.reduce((s, r) => s + r.matched, 0)
    const exceptions = series.reduce((s, r) => s + r.exceptions, 0)
    const matchRate = ((matched / Math.max(1, volume)) * 100).toFixed(2)
    return { volume, matched, exceptions, matchRate }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-semibold">Overview</h1>
          <p className="text-sm text-slate-400">Realtime reconciliation summary and recent activity.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Total Volume</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-bold">
                <CountUp end={totals.volume} separator="," />
              </h3>
              <span className="text-xs text-slate-400">transactions</span>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Match Rate</p>
            <h3 className="text-2xl font-bold">{totals.matchRate}%</h3>
            <p className="text-xs text-slate-400">Overall across selected window</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Exceptions</p>
            <h3 className="text-2xl font-bold">{totals.exceptions}</h3>
            <p className="text-xs text-slate-400">Items requiring review</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Avg Processing</p>
            <h3 className="text-2xl font-bold">2.3s</h3>
            <p className="text-xs text-slate-400">Median latency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Transaction Volume</h2>
              <div className="text-sm text-slate-400">Last 24 hours</div>
            </div>

            <div style={{ height: 320 }} className="-mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="volume" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVol)" />
                  <Line type="monotone" dataKey="exceptions" stroke="#f97316" dot={false} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded">
                <p className="text-xs text-slate-400">Matched</p>
                <p className="font-semibold text-lg"><CountUp end={totals.matched} separator="," /></p>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <p className="text-xs text-slate-400">Exceptions</p>
                <p className="font-semibold text-lg">{totals.exceptions}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Reconciliation Status</h2>
            <div className="flex items-center gap-4">
              <div style={{ width: 140, height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Matched', value: totals.matched }, { name: 'Exceptions', value: totals.exceptions }]} innerRadius={36} outerRadius={56} dataKey="value">
                      <Cell fill="#06b6d4" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1">
                <p className="text-xs text-slate-400">Match Rate</p>
                <h3 className="text-2xl font-bold mb-2">{totals.matchRate}%</h3>
                <p className="text-sm text-slate-400">{totals.exceptions} exceptions — needs investigation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium">Recent Transactions</h3>
              <div className="text-xs text-slate-400">Showing latest 5</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="text-slate-400 text-xs">
                  <tr>
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">When</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recent.map((r) => (
                    <tr key={r.id} className="border-t border-slate-800">
                      <td className="py-3">{r.id}</td>
                      <td className="py-3">{r.amount}</td>
                      <td className={`py-3 ${r.status === 'Exception' ? 'text-amber-400' : r.status === 'Matched' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {r.status}
                      </td>
                      <td className="py-3 text-slate-400">{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6">
            <h3 className="text-md font-medium mb-3">Live Feed</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {recent.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                  <div>
                    <div className="text-sm">{r.id} — <span className="text-slate-400">{r.amount}</span></div>
                    <div className="text-xs text-slate-500">{r.status} • {r.when}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button className="w-full bg-emerald-500 text-black py-2 rounded font-medium">Investigate Exceptions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
