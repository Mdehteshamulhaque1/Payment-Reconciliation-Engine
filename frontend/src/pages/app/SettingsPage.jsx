import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, BriefcaseBusiness, Check, CreditCard, Lock, Palette, Plus, ShieldCheck, SlidersHorizontal, Sparkles, UserCircle2, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const THEME_KEY = 'recon-theme'
const TABS = ['Profile', 'Security', 'Notifications', 'Gateways', 'Appearance', 'Team']

const GATEWAYS = [
  { name: 'Stripe', domain: 'stripe.com', status: 'Connected', apiKey: 'sk_live_****1234', lastSync: '4 min ago' },
  { name: 'Razorpay', domain: 'razorpay.com', status: 'Connected', apiKey: 'sk_live_****1234', lastSync: '12 min ago' },
  { name: 'PayPal', domain: 'paypal.com', status: 'Disconnected', apiKey: 'sk_live_****1234', lastSync: '1 hr ago' },
]

const TEAM_MEMBERS = [
  { name: 'Aarav Mehta', email: 'aarav@reconengine.com', role: 'Admin', status: 'Active' },
  { name: 'Nisha Patel', email: 'nisha@reconengine.com', role: 'Analyst', status: 'Active' },
  { name: 'Rohan Iyer', email: 'rohan@reconengine.com', role: 'Operator', status: 'Invited' },
]

function applyTheme(nextTheme) {
  const root = document.documentElement
  root.classList.remove('dark', 'dim')

  if (nextTheme === 'dark' || nextTheme === 'dim') {
    root.classList.add(nextTheme)
  }

  localStorage.setItem(THEME_KEY, nextTheme)
}

function themePreview(theme) {
  if (theme === 'light') return { bg: 'bg-[#F7F6F2]', card: 'bg-white', accent: 'bg-indigo-500' }
  if (theme === 'dim') return { bg: 'bg-[#14161B]', card: 'bg-[#1B1E25]', accent: 'bg-sky-400' }
  return { bg: 'bg-[#0B0D12]', card: 'bg-[#11141B]', accent: 'bg-indigo-500' }
}

function getStrengthScore(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  return score
}

function StrengthBar({ password }) {
  const score = getStrengthScore(password)
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Strong' : 'Very strong'
  const width = `${Math.max(12, score * 25)}%`
  const color = score <= 1 ? 'bg-red-500' : score === 2 ? 'bg-amber-400' : score === 3 ? 'bg-emerald-400' : 'bg-green-500'

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Password strength</span>
        <span>{label}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${color} transition-all`} style={{ width }} />
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full border transition ${checked ? 'border-emerald-500/40 bg-emerald-500/20' : 'border-white/10 bg-white/5'}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`}
      />
    </button>
  )
}

function Avatar({ initials }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white ring-1 ring-indigo-300/30">
      {initials}
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const isAdmin = (user?.role || '').toLowerCase() === 'admin'
  const availableTabs = useMemo(() => (isAdmin ? TABS : TABS.filter((tab) => tab !== 'Team')), [isAdmin])

  const [activeTab, setActiveTab] = useState('Profile')
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [company, setCompany] = useState('Recon Studio')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fontSize, setFontSize] = useState(16)
  const [compactMode, setCompactMode] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [notificationSettings, setNotificationSettings] = useState({
    exceptionAlerts: true,
    dailyReport: true,
    fraudAlerts: true,
    settlementFailures: true,
    apiDowntime: false,
    weeklySummary: false,
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!isAdmin && activeTab === 'Team') {
      setActiveTab('Profile')
    }
  }, [activeTab, isAdmin])

  const initials = useMemo(() => {
    const name = fullName || user?.name || 'U'
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [fullName, user?.name])

  const handleSaveProfile = () => {
    toast.success('Profile updated!')
  }

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    toast.success('Password updated!')
  }

  const handleRevokeSession = (label) => {
    toast.success(`Revoked session: ${label}`)
  }

  const handleTestConnection = (gateway) => {
    toast.loading(`Testing ${gateway} connection...`)
    setTimeout(() => {
      toast.dismiss()
      const success = Math.random() > 0.25
      toast[success ? 'success' : 'error'](success ? `${gateway} connection successful` : `${gateway} connection failed`)
    }, 1200)
  }

  const handleConfigureGateway = (gateway) => {
    toast(`Opening ${gateway} configuration...`)
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('Enter an email address')
      return
    }

    toast.success(`Invite sent to ${inviteEmail}`)
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const handleThemeSelect = (nextTheme) => {
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const tabButtonClass = (tab) =>
    `rounded-full px-4 py-2 text-sm transition ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`

  return (
    <div className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#E8FF47]">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Workspace settings</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Profile, security, notifications, gateways, appearance and team controls for the reconciliation workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={tabButtonClass(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {activeTab === 'Profile' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center gap-3 lg:w-64">
              <Avatar initials={initials} />
              <button type="button" className="btn-secondary w-full justify-center">
                <Sparkles size={16} />
                Change Avatar
              </button>
            </div>

            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Full Name</span>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">Company</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} className="input-field" />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">Role</span>
                <div className="inline-flex w-fit items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-200">
                  {user?.role || 'analyst'}
                </div>
              </label>

              <div className="md:col-span-2 flex justify-end">
                <button type="button" onClick={handleSaveProfile} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'Security' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" className="input-field" />
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" className="input-field" />
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm password" className="input-field" />
            </div>
            <div className="mt-4 max-w-md">
              <StrengthBar password={newPassword} />
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={handleUpdatePassword} className="btn-primary">
                Update Password
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Active Sessions</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Chrome on Windows', location: 'New Delhi, India', when: 'Active now' },
                { label: 'Mobile Safari', location: 'Mumbai, India', when: '2 hours ago' },
              ].map((session) => (
                <div key={session.label} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{session.label}</div>
                    <div className="text-sm text-slate-400">{session.location} — {session.when}</div>
                  </div>
                  <button type="button" onClick={() => handleRevokeSession(session.label)} className="btn-secondary w-fit">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'Notifications' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 space-y-4">
          <div className="flex items-center gap-3 text-white">
            <Bell size={18} className="text-indigo-300" />
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
          </div>

          {[
            ['Exception alerts', 'Get immediate alerts when matching fails or exceptions are queued.', 'exceptionAlerts'],
            ['Daily reconciliation report', 'Receive a daily summary of successful and unresolved batches.', 'dailyReport'],
            ['Fraud detection alerts', 'Be notified whenever anomaly detection flags suspicious activity.', 'fraudAlerts'],
            ['Settlement failures', 'Alert the operations team when settlements fail or stall.', 'settlementFailures'],
            ['API downtime alerts', 'Warn the team if gateway or reconciliation APIs become unavailable.', 'apiDowntime'],
            ['Weekly summary email', 'A concise weekly digest of KPIs and resolution trends.', 'weeklySummary'],
          ].map(([label, description, key]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-sm text-slate-400">{description}</div>
              </div>
              <Toggle
                checked={notificationSettings[key]}
                onChange={(next) => setNotificationSettings((current) => ({ ...current, [key]: next }))}
              />
            </div>
          ))}
        </motion.section>
      )}

      {activeTab === 'Gateways' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-white">
              <BriefcaseBusiness size={18} className="text-indigo-300" />
              <h2 className="text-xl font-semibold">Connected Gateways</h2>
            </div>
            <button type="button" className="btn-primary">
              <Plus size={16} />
              Add Gateway
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="py-3">Logo</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">API Key</th>
                  <th className="py-3">Last Sync</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {GATEWAYS.map((gateway) => (
                  <tr key={gateway.name} className="border-t border-white/10">
                    <td className="py-4">
                      <img src={`https://logo.clearbit.com/${gateway.domain}`} alt={gateway.name} className="h-8 w-8 rounded-lg" />
                    </td>
                    <td className="py-4 text-white">{gateway.name}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${gateway.status === 'Connected' ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>
                        <span className={`mr-2 h-2 w-2 rounded-full ${gateway.status === 'Connected' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {gateway.status}
                      </span>
                    </td>
                    <td className="py-4 font-dmMono text-slate-300">{gateway.apiKey}</td>
                    <td className="py-4 text-slate-300">{gateway.lastSync}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleTestConnection(gateway.name)} className="btn-secondary">
                          Test Connection
                        </button>
                        <button type="button" onClick={() => handleConfigureGateway(gateway.name)} className="btn-secondary">
                          Configure
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}

      {activeTab === 'Appearance' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6 space-y-6">
          <div className="flex items-center gap-3 text-white">
            <Palette size={18} className="text-indigo-300" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {['Light', 'Dim', 'Dark'].map((label) => {
              const themeName = label.toLowerCase()
              const preview = themePreview(themeName)
              const selected = theme === themeName

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleThemeSelect(themeName)}
                  className={`rounded-3xl border p-4 text-left transition ${selected ? 'border-indigo-500' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className={`rounded-2xl ${preview.bg} p-3`}>
                    <div className={`h-3 w-24 rounded-full ${preview.card}`} />
                    <div className={`mt-3 h-24 rounded-2xl ${preview.card} p-3`}>
                      <div className={`h-2 w-16 rounded-full ${preview.accent}`} />
                      <div className="mt-3 h-2 w-20 rounded-full bg-white/20" />
                      <div className="mt-2 h-2 w-12 rounded-full bg-white/12" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">{label}</div>
                </button>
              )
            })}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Font size</span>
                <span>{fontSize < 15 ? 'Small' : fontSize < 18 ? 'Medium' : 'Large'}</span>
              </div>
              <input type="range" min="14" max="20" step="1" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="mt-3 w-full" />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-sm font-semibold text-white">Compact mode</div>
                <div className="text-sm text-slate-400">Tighten spacing across panels and tables.</div>
              </div>
              <Toggle checked={compactMode} onChange={setCompactMode} />
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'Team' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel-surface p-6">
          {!isAdmin ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-100">
              <h2 className="text-xl font-semibold">Access Denied</h2>
              <p className="mt-2 text-sm text-rose-100/80">Team management is available to admin users only.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Users size={18} className="text-indigo-300" />
                  <h2 className="text-xl font-semibold">Team Members</h2>
                </div>
                <button type="button" onClick={() => setShowInviteModal(true)} className="btn-primary">
                  <Plus size={16} />
                  Invite Member
                </button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    <tr>
                      <th className="py-3">Avatar</th>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_MEMBERS.map((member) => (
                      <tr key={member.email} className="border-t border-white/10">
                        <td className="py-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                          </div>
                        </td>
                        <td className="py-4 text-white">{member.name}</td>
                        <td className="py-4 text-slate-300">{member.email}</td>
                        <td className="py-4">
                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">{member.role}</span>
                        </td>
                        <td className="py-4 text-slate-300">{member.status}</td>
                        <td className="py-4">
                          <button type="button" className="btn-secondary text-rose-200 hover:text-rose-100">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.section>
      )}

      {showInviteModal && isAdmin ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[var(--bg2)] p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Invite Member</h3>
              <button type="button" onClick={() => setShowInviteModal(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} type="email" placeholder="team@company.com" className="input-field" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleInviteMember} className="btn-primary">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}