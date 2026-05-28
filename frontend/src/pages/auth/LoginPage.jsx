import { useMemo, useState, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { login as demoLogin } from '../../services/authService'

const CLEARBIT = {
  stripe: 'https://logo.clearbit.com/stripe.com',
  razorpay: 'https://logo.clearbit.com/razorpay.com',
  paypal: 'https://logo.clearbit.com/paypal.com',
  mastercard: 'https://logo.clearbit.com/mastercard.com',
  visa: 'https://logo.clearbit.com/visa.com',
}

const leftVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function LoginPage() {
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ identifier: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const demoCredentials = useMemo(() => ({
    admin: { email: 'admin@reconengine.com', password: 'Admin@123' },
    analyst: { email: 'analyst@reconengine.com', password: 'Analyst@123' },
  }), [])

  const fillWith = useCallback((who) => {
    const cred = demoCredentials[who]
    if (!cred) return
    setForm({ identifier: cred.email, password: cred.password, rememberMe: true })
  }, [demoCredentials])

  const copyCreds = useCallback(async (who) => {
    const cred = demoCredentials[who]
    if (!cred) return
    try {
      await navigator.clipboard.writeText(`${cred.email} / ${cred.password}`)
    } catch (e) {
      // ignore
    }
  }, [demoCredentials])

  const handleChange = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    if (!form.identifier.trim()) { setError('Please enter email'); return false }
    if (!form.password.trim()) { setError('Please enter password'); return false }
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      // Try context login first, fallback to demo service
      if (authLogin) await authLogin({ identifier: form.identifier, password: form.password, rememberMe: form.rememberMe })
      else await demoLogin({ identifier: form.identifier, password: form.password, rememberMe: form.rememberMe })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to sign in')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A08' }}>
      <motion.div
        className="relative"
        style={{ flex: '0 0 45%', minHeight: '100vh', padding: '48px', background: '#0A0A08', color: '#F0F0E0' }}
        initial="hidden"
        animate="show"
        variants={leftVariants}
      >
        {/* Animated blurred circles */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <motion.div style={{ position: 'absolute', left: 40, top: 120, width: 320, height: 320, borderRadius: '50%', background: '#4f46e5', opacity: 0.06, filter: 'blur(60px)' }}
            animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0 }} />
          <motion.div style={{ position: 'absolute', right: 40, bottom: 120, width: 280, height: 280, borderRadius: '50%', background: '#e8ff47', opacity: 0.06, filter: 'blur(60px)' }}
            animate={{ y: [0, 18, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        </div>

        <motion.div variants={itemUp} className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 44, height: 44, background: '#050504', display: 'grid', placeItems: 'center', borderRadius: 8 }}>
              <span style={{ color: '#E8FF47', fontWeight: 700 }}>R</span>
            </div>
            <div className="text-sm font-medium" style={{ color: '#CFCFBD' }}>Recon Studio</div>
          </div>

          <h1 className="font-syne" style={{ fontSize: 48, lineHeight: '56px', marginBottom: 12, fontWeight: 700 }}>Reconcile payments at the speed of thought</h1>
          <p className="text-sm" style={{ color: '#888878', marginBottom: 24 }}>AI-powered matching engine for modern fintech teams</p>

          <div className="flex gap-3 mb-10">
            <div className="flex items-center gap-2 rounded-full bg-white/3 px-3 py-2 text-sm">
              <span style={{ width:10, height:10, borderRadius:10, background:'#10B981', display:'inline-block' }} />
              <span style={{ color: '#E6E6D9' }}>AI Smart Matching</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/3 px-3 py-2 text-sm">
              <span style={{ width:10, height:10, borderRadius:10, background:'#3B82F6', display:'inline-block' }} />
              <span style={{ color: '#E6E6D9' }}>Real-Time Webhooks</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/3 px-3 py-2 text-sm">
              <span style={{ width:10, height:10, borderRadius:10, background:'#8B5CF6', display:'inline-block' }} />
              <span style={{ color: '#E6E6D9' }}>Fraud Detection</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div className="text-xs uppercase" style={{ color: '#888878', fontWeight: 600, marginBottom: 8 }}>Connected gateways</div>
            <div className="flex items-center gap-4">
              <img src={CLEARBIT.stripe} alt="stripe" className="h-6" />
              <img src={CLEARBIT.razorpay} alt="razorpay" className="h-6" />
              <img src={CLEARBIT.paypal} alt="paypal" className="h-6" />
              <img src={CLEARBIT.mastercard} alt="mastercard" className="h-6" />
              <img src={CLEARBIT.visa} alt="visa" className="h-6" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 flex items-center justify-center"
        style={{ minHeight: '100vh', background: '#111110', padding: 40 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="w-full max-w-md" initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }}>
          <motion.div variants={itemUp} className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: '#1F1F2B' }}>
            <ShieldCheck size={20} color="#4f46e5" />
          </motion.div>

          <motion.h2 variants={itemUp} className="font-syne text-2xl font-bold" style={{ color: '#F0F0E0', fontSize: 28 }}>Welcome back</motion.h2>
          <motion.p variants={itemUp} className="text-sm" style={{ color: '#888878', marginBottom: 18 }}>Sign in to your workspace</motion.p>

          <motion.div variants={itemUp} className="rounded-lg border" style={{ borderColor: '#212120', background: '#0f0f0f', padding: 12, marginBottom: 18, fontFamily: 'DM Mono, monospace' }}>
            <div className="text-xs text-[#CFCFBD] mb-2">Demo credentials — click to fill</div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => fillWith('admin')} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-left hover:bg-white/2">
                <div>
                  <div style={{ color: '#E8FF47', fontWeight: 700 }}>Admin</div>
                  <div style={{ color: '#CFCFBD', fontFamily: 'DM Mono, monospace' }}>admin@reconengine.com / Admin@123</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); copyCreds('admin') }} aria-label="copy admin" className="p-1 rounded hover:bg-white/5"><Copy size={16} /></button>
                </div>
              </button>

              <button type="button" onClick={() => fillWith('analyst')} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-left hover:bg-white/2">
                <div>
                  <div style={{ color: '#E8FF47', fontWeight: 700 }}>Analyst</div>
                  <div style={{ color: '#CFCFBD', fontFamily: 'DM Mono, monospace' }}>analyst@reconengine.com / Analyst@123</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); copyCreds('analyst') }} aria-label="copy analyst" className="p-1 rounded hover:bg-white/5"><Copy size={16} /></button>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.form variants={itemUp} onSubmit={handleSubmit} noValidate style={{ background: '#111110' }}>
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#CFCFBD' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input type="email" value={form.identifier} onChange={handleChange('identifier')} placeholder="you@company.com" autoComplete="username" className="w-full rounded-xl px-12 py-3" style={{ background: '#1A1A16', border: '1px solid #2A2A20', color: '#F0F0E0' }} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#CFCFBD' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="Enter password" autoComplete="current-password" className="w-full rounded-xl px-12 py-3" style={{ background: '#1A1A16', border: '1px solid #2A2A20', color: '#F0F0E0' }} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-2.5 p-2 rounded" aria-label="toggle password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="inline-flex items-center gap-2 text-sm" style={{ color: '#CFCFBD' }}>
                <input type="checkbox" checked={form.rememberMe} onChange={handleChange('rememberMe')} className="h-4 w-4" /> Remember me
              </label>
              <Link to="/signup" className="text-sm" style={{ color: '#888878' }}>Forgot password?</Link>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full rounded-xl py-3 flex items-center justify-center gap-3" style={{ background: '#1A1A2E', color: '#E8FF47', fontWeight: 700 }} aria-pressed="false">
                {loading ? <><Loader2 className="spin-loader" size={18} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </div>

            {error ? <div className="mt-3 text-sm" style={{ color: '#FF6B6B' }}>{error}</div> : null}

            <div className="mt-6 text-center text-sm">
              <span style={{ color: '#888878' }}>Don't have an account? </span>
              <Link to="/signup" style={{ color: '#E8FF47', fontWeight: 600 }}>Sign up</Link>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  )
}