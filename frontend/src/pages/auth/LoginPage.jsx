import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthFrame from '../../components/auth/AuthFrame'
import FormField from '../../components/auth/FormField'
import { useAuth } from '../../context/AuthContext'
import { REMEMBERED_EMAIL_KEY } from '../../utils/authStorage'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/dashboard'
  const rememberedEmail = useMemo(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || '', [])

  const [form, setForm] = useState({
    email: rememberedEmail,
    password: '',
    rememberMe: Boolean(rememberedEmail),
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password cannot be empty.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      // Simulate a polished auth request so the button has a premium loading state.
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      await login({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrors({ submit: error.message || 'Unable to sign in.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="Secure client access"
      title="Sign in to your reconciliation workspace"
      subtitle="A premium dark login experience for a fintech dashboard. Use the client-only auth flow to enter the protected workspace with a saved fake token."
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="panel-surface border-white/10 bg-slate-950/70 p-6 sm:p-8"
      >
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/20">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Log in to manage payments, match transactions, and review reports.</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email address"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <button type="button" className="text-sm text-cyan-300 transition hover:text-cyan-200" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? 'Hide' : 'Show'} password
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                autoComplete="current-password"
                className="input-field pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password}</p> : null}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="inline-flex items-center gap-3 text-slate-300">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(event) => updateField('rememberMe', event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-400"
              />
              Remember me
            </label>
            <Link to="/signup" className="text-cyan-300 transition hover:text-cyan-200">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin-loader" size={18} />
                Signing in...
              </>
            ) : (
              <>
                Login to dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {errors.submit ? <p className="text-center text-sm text-rose-300">{errors.submit}</p> : null}

          <Link to="/signup" className="btn-secondary w-full">
            Create new account
          </Link>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Demo session behavior</p>
          <p className="mt-1 leading-6">This frontend stores a fake token in localStorage so the dashboard opens immediately after login.</p>
        </div>
      </motion.div>
    </AuthFrame>
  )
}