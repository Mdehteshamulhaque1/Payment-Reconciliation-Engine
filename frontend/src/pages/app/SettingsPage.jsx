import { motion } from 'framer-motion'
import { Bell, Lock, Palette, UserCircle2, SlidersHorizontal, Monitor, ShieldCheck, CreditCard } from 'lucide-react'

const settingsGroups = [
  { title: 'Profile', icon: UserCircle2, copy: 'Manage account identity and workspace preferences.' },
  { title: 'Security', icon: Lock, copy: 'Local token handling and future auth policies live here.' },
  { title: 'Notifications', icon: Bell, copy: 'Configure alerts for reconciliation exceptions and report readiness.' },
  { title: 'Appearance', icon: Palette, copy: 'Theme and surface styling can be extended from this shell.' },
]

const preferences = [
  ['Theme mode', 'Dark premium'],
  ['Default currency', 'USD'],
  ['Workspace role', 'Admin'],
  ['Retention policy', '90 days'],
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#E8FF47]">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Workspace settings</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">This page is a polished placeholder for profile, security, and UI preferences.</p>
          </div>
          <button className="btn-secondary">
            <SlidersHorizontal size={18} />
            Manage preferences
          </button>
        </div>
      </motion.section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {settingsGroups.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="panel-surface p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[#1A1A2E] p-3 text-[#E8FF47] ring-1 ring-indigo-400/20">
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
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex items-center gap-3 text-white">
            <CreditCard size={20} className="text-cyan-300" />
            <h2 className="text-xl font-semibold">Workspace preferences</h2>
          </div>

          <div className="mt-6 space-y-3">
            {preferences.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-400">Configurable from the admin shell</p>
                </div>
                <span className="text-sm font-semibold text-[#E8FF47]">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-5">
            <div className="flex items-center gap-3 text-white">
              <Monitor size={18} className="text-[#E8FF47]" />
              <p className="font-medium">Display profile</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-400">The current shell is tuned for high-contrast dark interfaces and can later support alternate brand themes.</p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <ShieldCheck size={16} />
            <span>Changes are stored locally until backend persistence is added.</span>
          </div>
        </motion.div>
      </section>
    </div>
  )
}