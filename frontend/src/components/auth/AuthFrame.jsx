import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Activity, Lock } from 'lucide-react'

const featureItems = [
  {
    icon: ShieldCheck,
    title: 'Secure access',
    text: 'Frontend auth flow with token persistence and route guards.',
  },
  {
    icon: Sparkles,
    title: 'Premium UX',
    text: 'Claude-inspired dark layout with glass layers and calm motion.',
  },
  {
    icon: Activity,
    title: 'Fintech ready',
    text: 'Built for reconciliation dashboards, reports, and transaction review.',
  },
]

export default function AuthFrame({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="soft-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-stretch p-4 sm:p-6 lg:p-8">
        <div className="panel-surface grid w-full overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative hidden overflow-hidden border-r border-white/10 p-8 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.03),transparent_40%)]" />
            <div className="relative z-10 max-w-xl space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-md">
                <Lock size={16} className="text-cyan-300" />
                Payment Reconciliation Engine
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{eyebrow}</p>
                <h1 className="max-w-lg text-5xl font-semibold leading-tight text-white xl:text-6xl">{title}</h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>
              </div>

              <div className="grid gap-4">
                {featureItems.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 * index }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-200 ring-1 ring-cyan-400/20">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-white">{item.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div>
                <p className="text-sm text-slate-400">Operational focus</p>
                <p className="text-xl font-semibold text-white">Fast login, guarded dashboard, clean handoff.</p>
              </div>
              <div className="hidden rounded-2xl bg-cyan-500/20 p-4 text-cyan-200 ring-1 ring-cyan-400/20 md:block">
                <Sparkles size={22} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-lg">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}