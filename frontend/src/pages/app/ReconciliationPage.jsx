import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, AlertTriangle, Layers3, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

const metrics = [
  { label: 'Auto-matched', value: '9,824', icon: CheckCircle2, tone: 'from-emerald-500 to-teal-600' },
  { label: 'Pending review', value: '18', icon: Clock3, tone: 'from-amber-500 to-orange-600' },
  { label: 'Flagged anomalies', value: '4', icon: AlertTriangle, tone: 'from-rose-500 to-pink-600' },
  { label: 'Rule packs', value: '12', icon: Layers3, tone: 'from-cyan-500 to-blue-600' },
]

export default function ReconciliationPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#E8FF47]">Reconciliation</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Matching engine overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Use this page as the future home for reconciliation rules, matching health, and exception handling.</p>
          </div>
          <button className="btn-secondary">
            <Sparkles size={18} />
            Run engine
          </button>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon

          return (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="panel-surface p-5">
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${metric.tone} p-3 text-white`}>
                <Icon size={18} />
              </div>
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
            </motion.div>
          )
        })}
      </section>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Workflow notes</h2>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <ShieldCheck size={14} />
            Compliance ready
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            'Auto-match rules will live here once backend reconciliation endpoints exist.',
            'Exception management can be extended with filters, drill-downs, and audit trails.',
            'This shell is intentionally lightweight so the protected flow remains fast and clear.',
          ].map((note) => (
            <div key={note} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              {note}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
          <div>
            <p className="font-medium text-white">Next step</p>
            <p className="mt-1 text-slate-400">Wire rule-evaluation and AI matcher endpoints once backend services are ready.</p>
          </div>
          <ArrowRight size={18} className="text-[#E8FF47]" />
        </div>
      </motion.div>
    </div>
  )
}