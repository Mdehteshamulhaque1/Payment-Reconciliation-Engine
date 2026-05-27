import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, UserPlus, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const formItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const strength = useMemo(() => {
    const score = [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length
    return score
  }, [form.password])

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!form.password.trim()) nextErrors.password = 'Password cannot be empty.'
    else if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      navigate('/login', { replace: true, state: { fromSignup: true } })
    } catch (error) {
      setErrors({ submit: error?.message || 'Unable to create account.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A08' }}>
      <motion.div
        className="hidden lg:flex relative overflow-hidden"
        style={{ flex: '0 0 45%', minHeight: '100vh', background: '#0A0A08', color: '#F0F0E0', padding: 48 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-16 top-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: '#4f46e5', opacity: 0.06 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.div
            className="absolute right-12 bottom-16 h-64 w-64 rounded-full blur-3xl"
            style={{ background: '#e8ff47', opacity: 0.06 }}
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#111110', display: 'grid', placeItems: 'center' }}>
              <span style={{ color: '#E8FF47', fontSize: 20, fontWeight: 700 }}>R</span>
            </div>
            <span style={{ color: '#EDEDD9', fontWeight: 600, letterSpacing: 0.2 }}>Recon Studio</span>
          </div>

          <div className="max-w-xl">
            <motion.h1 variants={formItem} initial="hidden" animate="show" className="font-syne text-[48px] font-bold leading-[1.08] tracking-tight" style={{ color: '#F0F0E0' }}>
              Reconcile payments at the speed of thought
            </motion.h1>
            <motion.p variants={formItem} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mt-4 text-[15px] leading-7" style={{ color: '#888878' }}>
              AI-powered matching engine for modern fintech teams
            </motion.p>

            <motion.div variants={formItem} initial="hidden" animate="show" transition={{ delay: 0.16 }} className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: '#232320', color: '#EDEDD9', background: 'rgba(255,255,255,0.02)' }}><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />AI Smart Matching</span>
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: '#232320', color: '#EDEDD9', background: 'rgba(255,255,255,0.02)' }}><span className="h-2.5 w-2.5 rounded-full bg-sky-400" />Real-Time Webhooks</span>
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: '#232320', color: '#EDEDD9', background: 'rgba(255,255,255,0.02)' }}><span className="h-2.5 w-2.5 rounded-full bg-violet-400" />Fraud Detection</span>
            </motion.div>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: '#888878' }}>Connected gateways</div>
            <div className="flex flex-wrap items-center gap-5 opacity-90">
              <img src="https://logo.clearbit.com/stripe.com" alt="Stripe" className="h-6 w-auto brightness-110 invert-[.05]" />
              <img src="https://logo.clearbit.com/razorpay.com" alt="Razorpay" className="h-6 w-auto brightness-110 invert-[.05]" />
              <img src="https://logo.clearbit.com/paypal.com" alt="PayPal" className="h-6 w-auto brightness-110 invert-[.05]" />
              <img src="https://logo.clearbit.com/mastercard.com" alt="Mastercard" className="h-6 w-auto brightness-110 invert-[.05]" />
              <img src="https://logo.clearbit.com/visa.com" alt="Visa" className="h-6 w-auto brightness-110 invert-[.05]" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: '100vh', background: '#111110', padding: 24 }}
        initial={{ x: 52, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[560px] items-center justify-center">
          <motion.div className="w-full max-w-[400px]" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <motion.div variants={formItem} className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: '#1A1A2E' }}>
              <ShieldCheck size={20} color="#E8FF47" />
            </motion.div>

            <motion.h2 variants={formItem} className="font-syne text-[28px] font-bold leading-tight" style={{ color: '#F0F0E0' }}>
              Welcome back
            </motion.h2>
            <motion.p variants={formItem} className="mt-2 text-sm" style={{ color: '#888878' }}>
              Sign in to your workspace
            </motion.p>

            <motion.div variants={formItem} className="mt-5 rounded-2xl border p-4" style={{ borderColor: '#2A2A20', background: '#0E0E0E' }}>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: '#888878' }}>Demo credentials</div>
                <div className="text-[11px]" style={{ color: '#888878' }}>click to fill</div>
              </div>

              <button type="button" onClick={() => setForm({ name: 'Admin User', email: 'admin@reconengine.com', password: 'Admin@123', confirmPassword: 'Admin@123' })} className="mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition hover:bg-white/[0.03]" style={{ borderColor: '#22221A', background: '#10100F' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#E8FF47' }}>Admin</div>
                  <div className="mt-1 font-mono text-[12px]" style={{ color: '#CFCFB9' }}>admin@reconengine.com / Admin@123</div>
                </div>
                <Copy size={14} color="#888878" />
              </button>

              <button type="button" onClick={() => setForm({ name: 'Analyst User', email: 'analyst@reconengine.com', password: 'Analyst@123', confirmPassword: 'Analyst@123' })} className="flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition hover:bg-white/[0.03]" style={{ borderColor: '#22221A', background: '#10100F' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#E8FF47' }}>Analyst</div>
                  <div className="mt-1 font-mono text-[12px]" style={{ color: '#CFCFB9' }}>analyst@reconengine.com / Analyst@123</div>
                </div>
                <Copy size={14} color="#888878" />
              </button>
            </motion.div>

            <motion.form variants={formItem} onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#CFCFB9' }}>Full name</label>
                <div className="relative">
                  <UserPlus size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" color="#888878" />
                  <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Alex Morgan" autoComplete="name" className="w-full rounded-xl border px-11 py-3.5 outline-none transition" style={{ background: '#1A1A16', borderColor: errors.name ? '#7F1D1D' : '#2A2A20', color: '#F0F0E0' }} />
                </div>
                {errors.name ? <p className="mt-2 text-sm" style={{ color: '#FF6B6B' }}>{errors.name}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#CFCFB9' }}>Email address</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" color="#888878" />
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@company.com" autoComplete="email" className="w-full rounded-xl border px-11 py-3.5 outline-none transition" style={{ background: '#1A1A16', borderColor: errors.email ? '#7F1D1D' : '#2A2A20', color: '#F0F0E0' }} />
                </div>
                {errors.email ? <p className="mt-2 text-sm" style={{ color: '#FF6B6B' }}>{errors.email}</p> : null}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium" style={{ color: '#CFCFB9' }}>Password</label>
                  <span className="text-[11px]" style={{ color: '#888878' }}>{strength ? `${strength}/4 strength` : '8+ chars recommended'}</span>
                </div>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" color="#888878" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Create a password" autoComplete="new-password" className="w-full rounded-xl border px-11 py-3.5 pr-12 outline-none transition" style={{ background: '#1A1A16', borderColor: errors.password ? '#7F1D1D' : '#2A2A20', color: '#F0F0E0' }} />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition hover:bg-white/[0.04]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} color="#888878" /> : <Eye size={16} color="#888878" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-sm" style={{ color: '#FF6B6B' }}>{errors.password}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#CFCFB9' }}>Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" color="#888878" />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter password" autoComplete="new-password" className="w-full rounded-xl border px-11 py-3.5 pr-12 outline-none transition" style={{ background: '#1A1A16', borderColor: errors.confirmPassword ? '#7F1D1D' : '#2A2A20', color: '#F0F0E0' }} />
                  <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition hover:bg-white/[0.04]" aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}>
                    {showConfirmPassword ? <EyeOff size={16} color="#888878" /> : <Eye size={16} color="#888878" />}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="mt-2 text-sm" style={{ color: '#FF6B6B' }}>{errors.confirmPassword}</p> : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm" style={{ color: '#CFCFB9' }}>
                  <input type="checkbox" checked={true} readOnly className="h-4 w-4 rounded border-[#2A2A20] bg-transparent text-[#E8FF47] focus:ring-0" />
                  I agree to the terms
                </label>
                <Link to="/login" className="text-sm transition hover:opacity-80" style={{ color: '#888878' }}>Back to login</Link>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full rounded-xl px-4 py-3.5 transition" style={{ background: '#1A1A2E', color: '#E8FF47', fontWeight: 700, boxShadow: '0 12px 30px rgba(26,26,46,0.25)' }}>
                <span className="inline-flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Create account <ArrowRight size={16} /></>}
                </span>
              </motion.button>

              {errors.submit ? <div className="pt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.submit}</div> : null}

              <p className="pt-2 text-center text-sm" style={{ color: '#888878' }}>
                Already have an account? <Link to="/login" className="font-medium" style={{ color: '#E8FF47' }}>Sign in</Link>
              </p>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}