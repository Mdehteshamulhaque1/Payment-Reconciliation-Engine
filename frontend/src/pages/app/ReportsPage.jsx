import { motion } from 'framer-motion'
import { FileText, PieChart, Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Reports</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Finance reporting hub</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Place reporting exports, PDF snapshots, and monthly reconciliation summaries here later.</p>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex items-center gap-3 text-white">
            <FileText size={20} className="text-cyan-300" />
            <h2 className="text-xl font-semibold">Report exports</h2>
          </div>
          <div className="mt-6 space-y-4">
            {['Daily reconciliation summary', 'Monthly variance report', 'Audit-ready exception log', 'Executive KPI snapshot'].map((report) => (
              <div key={report} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
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
          <div className="mt-6 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.4),rgba(8,15,28,0.9))] p-6">
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
          </div>
        </motion.div>
      </section>
    </div>
  )
}