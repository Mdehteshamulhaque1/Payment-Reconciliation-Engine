import { motion } from 'framer-motion'
import { Bell, Lock, Palette, UserCircle2 } from 'lucide-react'

const settingsGroups = [
  { title: 'Profile', icon: UserCircle2, copy: 'Manage account identity and workspace preferences.' },
  { title: 'Security', icon: Lock, copy: 'Local token handling and future auth policies live here.' },
  { title: 'Notifications', icon: Bell, copy: 'Configure alerts for reconciliation exceptions and report readiness.' },
  { title: 'Appearance', icon: Palette, copy: 'Theme and surface styling can be extended from this shell.' },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Settings</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Workspace settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">This page is a polished placeholder for profile, security, and UI preferences.</p>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-2">
        {settingsGroups.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="panel-surface p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-200 ring-1 ring-cyan-400/20">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.copy}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Add your future settings controls here after the backend is ready.
              </div>
            </motion.div>
          )
        })}
      </section>
    </div>
  )
}