import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle2, Loader2, X } from 'lucide-react'

const THEME_KEY = 'recon-theme'

function initialsFromName(name = '') {
  const parts = name.trim().split(/\s+/)
  if (!parts.length) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function applyTheme(next) {
  const el = document.documentElement
  el.classList.remove('dark', 'dim')
  if (next === 'dark') el.classList.add('dark')
  if (next === 'dim') el.classList.add('dim')
  localStorage.setItem(THEME_KEY, next)
}

function RolePill({ role }) {
  const r = (role || 'viewer').toLowerCase()
  const cls =
    r === 'admin'
      ? 'bg-violet-600 text-white'
      : r === 'analyst'
        ? 'bg-sky-600 text-white'
        : 'bg-slate-500 text-white'

  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{role || 'viewer'}</span>
}

export default function SettingsPage() {
  const { user } = useAuth()
  const isAdmin = (user?.role || '').toLowerCase() === 'admin'

  const tabs = useMemo(() => {
    const all = ['Profile', 'Security', 'Notifications', 'Gateways', 'Appearance', 'Team']
    return isAdmin ? all : all.filter((t) => t !== 'Team')
  }, [isAdmin])

  const [tab, setTab] = useState('Profile')

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [company, setCompany] = useState('Recon Labs')
  const role = user?.role || 'viewer'

  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const [notif, setNotif] = useState({
    exceptionAlerts: true,
    dailyReport: true,
    fraudAlerts: true,
    settlementFailures: true,
    apiDowntime: false,
    weeklySummary: false,
  })

  const [gateways] = useState([
    { name: 'Stripe', domain: 'stripe.com', status: 'online', key: 'sk_live_****1234', lastSync: '2m ago' },
    { name: 'Razorpay', domain: 'razorpay.com', status: 'online', key: 'sk_live_****2345', lastSync: '5m ago' },
    { name: 'PayPal', domain: 'paypal.com', status: 'offline', key: 'sk_live_****3456', lastSync: '1h ago' },
  ])

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [fontSize, setFontSize] = useState('medium')
  const [compact, setCompact] = useState(false)

  const [members, setMembers] = useState([
    { name: 'Ehteshamul Haque', email: 'admin@reconengine.com', role: 'admin', status: 'active' },
    { name: 'Analyst User', email: 'analyst@reconengine.com', role: 'analyst', status: 'active' },
  ])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const [loadingGateway, setLoadingGateway] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (fontSize === 'small') document.documentElement.style.fontSize = '14px'
    else if (fontSize === 'large') document.documentElement.style.fontSize = '18px'
    else document.documentElement.style.fontSize = ''
  }, [fontSize])

  useEffect(() => {
    if (compact) document.documentElement.classList.add('compact')
    else document.documentElement.classList.remove('compact')
  }, [compact])

  useEffect(() => {
    if (!isAdmin && tab === 'Team') setTab('Profile')
  }, [isAdmin, tab])

  function showToast(message, ms = 1800) {
    setToast(message)
    setTimeout(() => setToast(''), ms)
  }

  function saveProfile() {
    showToast('Profile updated!')
  }

  function updatePassword() {
    if (!newPwd || newPwd !== confirmPwd) {
      showToast('Passwords do not match')
      return
    }
    showToast('Password updated')
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
  }

  function revokeSession() {
    showToast('Session revoked')
  }

  function testGateway(g) {
    setLoadingGateway(g.name)
    setTimeout(() => {
      const ok = Math.random() > 0.2
      showToast(ok ? `Connection to ${g.name} successful` : `Connection to ${g.name} failed`)
      setLoadingGateway('')
    }, 1200)
  }

  function inviteMember() {
    if (!inviteEmail.trim()) {
      showToast('Please enter an email')
      return
    }

    setMembers((s) => [
      ...s,
      {
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'viewer',
        status: 'invited',
      },
    ])

    setInviteEmail('')
    setInviteOpen(false)
    showToast('Invite sent')
  }

  function passwordStrength(pw) {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const pwdScore = passwordStrength(newPwd)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-2 ${tab === t ? 'border border-[var(--border)] bg-[var(--bg3)]' : 'text-[var(--muted)]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Profile' && (
          <div className="rounded-lg border p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div>
                <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
                  {initialsFromName(name || email)}
                </div>
                <button onClick={() => showToast('Change avatar not implemented')} className="btn-ghost mt-2">
                  Change Avatar
                </button>
              </div>

              <div className="flex-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-[var(--muted)]">Full Name</label>
                    <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Email</label>
                    <input className="input-field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Company</label>
                    <input className="input-field mt-1" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Role</label>
                    <div className="mt-2">
                      <RolePill role={role} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={saveProfile} className="btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Security' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Change Password</h3>
              <div className="mt-3 space-y-3">
                <input type="password" placeholder="Current password" className="input-field" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                <input type="password" placeholder="New password" className="input-field" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                <input type="password" placeholder="Confirm password" className="input-field" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />

                <div>
                  <div className="text-xs text-[var(--muted)]">Password strength</div>
                  <div className="mt-1 h-3 w-full rounded bg-slate-800">
                    <div
                      className={`h-3 rounded ${
                        pwdScore <= 1
                          ? 'w-1/4 bg-rose-400'
                          : pwdScore === 2
                            ? 'w-1/2 bg-amber-400'
                            : pwdScore === 3
                              ? 'w-3/4 bg-emerald-400'
                              : 'w-full bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={updatePassword} className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold">Active Sessions</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between rounded p-3">
                  <div>
                    <div className="font-semibold">Chrome on Windows</div>
                    <div className="text-xs text-[var(--muted)]">New Delhi, India — Active now</div>
                  </div>
                  <button onClick={revokeSession} className="btn-ghost">Revoke</button>
                </div>

                <div className="flex items-center justify-between rounded p-3">
                  <div>
                    <div className="font-semibold">Mobile Safari</div>
                    <div className="text-xs text-[var(--muted)]">Mumbai, India — 2 hours ago</div>
                  </div>
                  <button onClick={revokeSession} className="btn-ghost">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Notifications' && (
          <div className="space-y-4 rounded-lg border p-4">
            {[
              { key: 'exceptionAlerts', label: 'Exception alerts', desc: 'Notify on reconciliation exceptions' },
              { key: 'dailyReport', label: 'Daily reconciliation report', desc: 'Receive daily summary' },
              { key: 'fraudAlerts', label: 'Fraud detection alerts', desc: 'Real-time fraud alerts' },
              { key: 'settlementFailures', label: 'Settlement failures', desc: 'Notify on settlement issues' },
              { key: 'apiDowntime', label: 'API downtime alerts', desc: 'Notify when APIs are down' },
              { key: 'weeklySummary', label: 'Weekly summary email', desc: 'Weekly executive summary' },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{n.label}</div>
                  <div className="text-xs text-[var(--muted)]">{n.desc}</div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notif[n.key]}
                    onChange={(e) => setNotif((s) => ({ ...s, [n.key]: e.target.checked }))}
                  />
                </label>
              </div>
            ))}
          </div>
        )}

        {tab === 'Gateways' && (
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Connected Gateways</h3>
              <button className="btn-primary">Add Gateway</button>
            </div>

            <div className="overflow-auto">
              <table className="w-full table-auto text-sm">
                <thead className="text-xs text-[var(--muted)]">
                  <tr>
                    <th>Gateway</th>
                    <th>Status</th>
                    <th>API Key</th>
                    <th>Last Sync</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {gateways.map((g) => (
                    <tr key={g.name} className="border-t border-[var(--border)]">
                      <td className="flex items-center gap-3 py-3">
                        <img src={`https://logo.clearbit.com/${g.domain}`} alt={g.name} className="h-6 w-6" />
                        {g.name}
                      </td>
                      <td className="py-3">
                        {g.status === 'online' ? (
                          <span className="status-pill status-pill-success">Online</span>
                        ) : (
                          <span className="status-pill status-pill-danger">Offline</span>
                        )}
                      </td>
                      <td className="py-3">{g.key}</td>
                      <td className="py-3">{g.lastSync}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => testGateway(g)} className="btn-ghost mr-2">
                          {loadingGateway === g.name ? <Loader2 className="animate-spin" size={16} /> : 'Test Connection'}
                        </button>
                        <button onClick={() => showToast(`Configure ${g.name}`)} className="btn-primary">Configure</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Appearance' && (
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Theme</h3>
            <div className="mt-3 flex gap-3">
              {[
                { key: 'light', label: 'Light' },
                { key: 'dim', label: 'Dim' },
                { key: 'dark', label: 'Dark' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`w-32 rounded border p-3 text-left ${theme === t.key ? 'border-[var(--primary)]' : 'border-[var(--border)]'}`}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-xs text-[var(--muted)]">Preview</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-sm">Font size</label>
              <div className="mt-2 flex items-center gap-3">
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field max-w-xs">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <label className="inline-flex items-center gap-2">
                  Compact mode
                  <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
                </label>
              </div>
            </div>
          </div>
        )}

        {tab === 'Team' && (
          <div className="rounded-lg border p-4">
            {!isAdmin ? (
              <div className="p-6 text-center text-sm">Access Denied — admin only</div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Team Members</h3>
                  <button onClick={() => setInviteOpen(true)} className="btn-primary">Invite Member</button>
                </div>

                <div className="overflow-auto">
                  <table className="w-full table-auto text-sm">
                    <thead className="text-xs text-[var(--muted)]">
                      <tr>
                        <th>Member</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.email} className="border-t border-[var(--border)]">
                          <td className="flex items-center gap-3 py-3">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white">
                              {initialsFromName(m.name)}
                            </div>
                            {m.name}
                          </td>
                          <td className="py-3">{m.email}</td>
                          <td className="py-3"><RolePill role={m.role} /></td>
                          <td className="py-3">{m.status}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => showToast(`Removed ${m.name}`)} className="btn-ghost">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-[var(--surface-strong)] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invite Member</h3>
              <button onClick={() => setInviteOpen(false)} className="rounded p-1 hover:bg-white/5" aria-label="Close invite modal">
                <X size={16} />
              </button>
            </div>
            <div className="mt-3">
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                className="input-field w-full"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setInviteOpen(false)} className="btn-ghost">Cancel</button>
              <button onClick={inviteMember} className="btn-primary">Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[var(--surface-strong)] p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={18} />
            <div>{toast}</div>
          </div>
        </div>
      )}
    </div>
  )
}
