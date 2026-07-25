import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, Activity, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ParticleField } from '@/components/effects/ParticleField'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'
import { loginSchema, type LoginFormData } from '@/components/auth/schemas'
import { useLogin } from '@/hooks/useAuth'
import { showToast } from '@/components/effects/Toast'

const floatingElements = [
  { icon: Shield, x: '10%', y: '20%', delay: 0, duration: 7 },
  { icon: Zap, x: '85%', y: '15%', delay: 1.5, duration: 8 },
  { icon: Activity, x: '75%', y: '75%', delay: 3, duration: 6 },
  { icon: ArrowRight, x: '15%', y: '80%', delay: 2, duration: 9 },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()

  const from = (location.state as { from?: Location })?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginMutation.mutateAsync(data)
    if (result.success) {
      showToast('success', 'Welcome back!')
      navigate(from, { replace: true })
    } else {
      showToast('error', result.error || 'Login failed')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Deep space background with photo */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[var(--bg1)]" />

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15]"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80")`,
            filter: 'saturate(0.5) brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg1)]/70 via-[var(--bg1)]/50 to-[var(--bg1)]/80" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[160px] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.12), transparent 70%)', left: '5%', top: '10%', animationDuration: '25s' }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[140px] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)', right: '10%', bottom: '15%', animationDuration: '30s', animationDelay: '5s' }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[120px] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06), transparent 70%)', left: '40%', top: '60%', animationDuration: '35s', animationDelay: '10s' }}
          />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <ParticleField />

      {/* Floating icons */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="fixed z-[1] opacity-[0.04]"
          style={{ left: el.x, top: el.y }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <el.icon size={40} className="text-[var(--accent-cyan)]" />
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--primary)] to-[var(--accent-violet)] opacity-[0.08] blur-xl animate-gradient-shift" />

        <div className="relative rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_20%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-8 shadow-hud-lg backdrop-blur-2xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-50" />

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 h-5 w-5 border-t border-l border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute top-2 right-2 h-5 w-5 border-t border-r border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute bottom-2 left-2 h-5 w-5 border-b border-l border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute bottom-2 right-2 h-5 w-5 border-b border-r border-[var(--accent-cyan)] opacity-30" />

          {/* Logo area */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mx-auto mb-5">
              <AnimatedLogo size="lg" animate={true} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)] font-mono">
              // sign in to your dashboard
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Email</label>
              <Input
                type="email"
                placeholder="operator@payflow.io"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                className="hud-border bg-[color-mix(in_srgb,var(--bg3)_60%,transparent)]"
                {...register('email')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter access key"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                className="hud-border bg-[color-mix(in_srgb,var(--bg3)_60%,transparent)]"
                {...register('password')}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full group relative overflow-hidden border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
              size="lg"
              loading={loginMutation.isPending}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-mono uppercase text-sm tracking-wider">
                Initialize Session
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Hover sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-violet)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.form>

          {/* Gateway logos bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 pt-5 border-t border-[var(--border)]"
          >
            <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">Supported Gateways</p>
            <div className="flex items-center justify-center gap-4 opacity-50">
              <svg viewBox="0 0 40 40" width={28} height={28} fill="none"><rect width="40" height="40" rx="8" fill="#635BFF"/><path d="M18.5 16.5c0-.83.68-1.15 1.76-1.15 1.57 0 3.53.48 5.1 1.44V11.3A13.7 13.7 0 0020.26 10c-3.18 0-5.32 1.66-5.32 4.45 0 4.31 5.93 3.63 5.93 5.48 0 .92-.79 1.24-1.9 1.24-1.66 0-3.8-.68-5.48-1.6v5.42a14.8 14.8 0 005.48 1.03c3.23 0 5.5-1.6 5.5-4.43-.02-4.66-5.99-3.84-5.99-5.56z" fill="white"/></svg>
              <svg viewBox="0 0 40 40" width={28} height={28} fill="none"><rect width="40" height="40" rx="8" fill="#003087"/><path d="M24.5 11h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.1c.4 0 .8-.3.9-.7l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.7-.8-1.9-1.2-3.5-1.2l.1.2z" fill="#0070E0"/><path d="M21.3 15h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.8c.4 0 .7-.3.8-.6l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.6-.8-1.8-1.2-3.4-1.2l-.5 2.3z" fill="#009CDE"/></svg>
              <svg viewBox="0 0 40 40" width={28} height={28} fill="none"><rect width="40" height="40" rx="8" fill="#072654"/><path d="M12 14h5.5l1.5 5.5h.1l2-5.5h5.2l-4.8 12h-4.8L12 14z" fill="#3395FF"/><path d="M20.5 20.5h4l2.5 5.5h-4.2l-.4-1h-2.4l.4 1h.1z" fill="#3395FF"/><circle cx="30" cy="20" r="2.5" fill="#00D4AA"/></svg>
              <svg viewBox="0 0 40 40" width={28} height={28} fill="none"><rect width="40" height="40" rx="8" fill="#097969"/><text x="5" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="15" fill="white">UPI</text></svg>
              <svg viewBox="0 0 40 40" width={28} height={28} fill="none"><rect width="40" height="40" rx="8" fill="#5F259F"/><text x="7" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="15" fill="white">Pe</text><circle cx="30" cy="14" r="3" fill="#00D4AA"/></svg>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-5 space-y-3"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-3 text-[var(--muted)] font-mono uppercase tracking-widest">or</span>
              </div>
            </div>
            <p className="text-center text-sm text-[var(--muted)]">
              New operator?{' '}
              <Link to="/signup" className="font-medium text-[var(--accent-cyan)] hover:text-[var(--primary)] transition-colors hover:underline underline-offset-4">
                Request access
              </Link>
            </p>
          </motion.div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" />
        </div>
      </motion.div>

      {/* Status bar at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 rounded-full border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-5 py-2 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
          </span>
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">System Online</span>
        </div>
        <div className="h-3 w-px bg-[var(--border)]" />
        <span className="text-[10px] font-mono text-[var(--muted)]">v2.0.0</span>
        <div className="h-3 w-px bg-[var(--border)]" />
        <span className="text-[10px] font-mono text-[var(--muted)]">AES-256</span>
      </motion.div>
    </div>
  )
}
