import { motion } from 'framer-motion'
import { FileText, PieChart, Download, Calendar, BarChart4, ShieldCheck } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#E8FF47]">Reports</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Finance reporting hub</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Place reporting exports, PDF snapshots, and monthly reconciliation summaries here later.</p>
          </div>
          <button className="btn-secondary">
            <Download size={18} />
            Export pack
          </button>
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex items-center gap-3 text-white">
            <FileText size={20} className="text-cyan-300" />
            <h2 className="text-xl font-semibold">Report exports</h2>
          </div>
          <div className="mt-6 space-y-4">
            {['Daily reconciliation summary', 'Monthly variance report', 'Audit-ready exception log', 'Executive KPI snapshot'].map((report) => (
              <div key={report} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-indigo-500/30 hover:bg-white/[0.07]">
                <span className="text-sm text-slate-300">{report}</span>
                <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex items-center gap-3 text-white">
            <PieChart size={20} className="text-cyan-300" />
            <h2 className="text-xl font-semibold">Snapshot preview</h2>
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.4),rgba(8,15,28,0.9))] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Matched</p>
                <p className="mt-2 text-3xl font-semibold text-white">98.9%</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Variance</p>
                <p className="mt-2 text-3xl font-semibold text-white">0.14%</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-cyan-500/10 p-4 text-sm leading-7 text-slate-300 ring-1 ring-cyan-400/20">
              Reports are intentionally lightweight for now. This gives you a polished dashboard route without backend dependencies.
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <Calendar size={16} className="text-[#E8FF47]" />
              <span>Scheduled summary generation every day at 08:00 UTC</span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <BarChart4 size={16} className="text-[#E8FF47]" />
              <span>Variance trend visualizations can be layered in later.</span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <ShieldCheck size={16} />
              <span>Audit-friendly output ready for compliance review.</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}