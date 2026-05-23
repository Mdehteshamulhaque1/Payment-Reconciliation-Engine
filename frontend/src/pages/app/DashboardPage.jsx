import { motion } from 'framer-motion'
import { BarChart3, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck, Clock3 } from 'lucide-react'

const stats = [
  { title: 'Total Transactions', value: '12,450', delta: '+12.5%', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
  { title: 'Match Rate', value: '99.85%', delta: '+0.15%', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
  { title: 'Discrepancies', value: '18', delta: '-5 pending', icon: AlertCircle, color: 'from-amber-500 to-orange-600' },
  { title: 'Processing Time', value: '2.3s', delta: '-40% faster', icon: TrendingUp, color: 'from-violet-500 to-fuchsia-600' },
]

const activities = [
  'Transaction batch reconciled successfully.',
  'Bank statement import completed.',
  '3 exceptions flagged for review.',
  'Report snapshot generated for finance team.',
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Reconciliation overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Monitor transaction status, exception counts, and operational throughput from one clean dashboard shell.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <p className="font-medium text-white">Live session</p>
            <p className="mt-1">Protected by a client-only token stored in localStorage.</p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="panel-surface p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className={`rounded-2xl bg-gradient-to-br ${item.color} p-3 text-white`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-emerald-300">{item.delta}</span>
              </div>
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
            </motion.div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Transaction volume</h2>
              <p className="mt-1 text-sm text-slate-400">A premium placeholder chart area for future analytics.</p>
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">Updated just now</div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex items-center gap-3 text-slate-200">
                <ShieldCheck size={18} className="text-cyan-300" />
                <span className="font-medium">Operational health</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">Most batches are matching automatically with a very low exception rate.</p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"><span>Auto-match rate</span><span className="font-semibold text-white">98.9%</span></div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"><span>Open exceptions</span><span className="font-semibold text-white">18</span></div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"><span>Average latency</span><span className="font-semibold text-white">2.3s</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.5),rgba(8,15,28,0.9))] p-5">
              <div className="mb-4 flex items-center gap-2 text-slate-200">
                <Clock3 size={18} className="text-cyan-300" />
                <span className="font-medium">Activity timeline</span>
              </div>
              <div className="space-y-4">
                {activities.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <div>
                      <p className="text-sm font-medium text-white">Event {index + 1}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <h2 className="text-xl font-semibold text-white">Workflow summary</h2>
          <p className="mt-2 text-sm text-slate-400">This sidebar card keeps the dashboard feeling operational and high-trust.</p>

          <div className="mt-6 space-y-4">
            {[
              ['Pending review', '4 cases'],
              ['Resolved today', '128 records'],
              ['Exception aging', '< 24h'],
              ['Audit readiness', '98%'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-300">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}