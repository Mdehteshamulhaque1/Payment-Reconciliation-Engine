import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, UserPlus, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthFrame from '../../components/auth/AuthFrame'
import FormField from '../../components/auth/FormField'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!form.password.trim()) nextErrors.password = 'Password cannot be empty.'
    if (form.password.trim() && form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      navigate('/login', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="Create your account"
      title="Set up your fintech workspace"
      subtitle="Create a secure client-only account flow with a premium dashboard experience. The signup form mirrors the login design and keeps the handoff smooth."
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="panel-surface border-white/10 bg-slate-950/70 p-6 sm:p-8"
      >
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/20">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Sign up</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Create your demo account and move directly into the dashboard shell.</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full name"
            type="text"
            placeholder="Alex Morgan"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={errors.name}
            autoComplete="name"
          />

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
                placeholder="Create a password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                autoComplete="new-password"
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

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Confirm password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                autoComplete="new-password"
                className="input-field pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-300">{errors.confirmPassword}</p> : null}
          </label>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin-loader" size={18} />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-400">Signup is frontend-only for now. Use the login page with the demo backend credentials.</p>

          <Link to="/login" className="btn-secondary w-full">
            Back to login
          </Link>
        </form>
      </motion.div>
    </AuthFrame>
  )
}