import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ChevronRight, Shield, Zap, Activity, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ParticleField } from '@/components/effects/ParticleField'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'
import { signupSchema, type SignupFormData } from '@/components/auth/schemas'
import { useSignup } from '@/hooks/useAuth'
import { showToast } from '@/components/effects/Toast'

const floatingElements = [
  { icon: Shield, x: '12%', y: '18%', delay: 0, duration: 7 },
  { icon: Zap, x: '88%', y: '12%', delay: 1.5, duration: 8 },
  { icon: Activity, x: '78%', y: '78%', delay: 3, duration: 6 },
  { icon: ArrowRight, x: '18%', y: '82%', delay: 2, duration: 9 },
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const signupMutation = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', full_name: '' },
  })

  const onSubmit = async (data: SignupFormData) => {
    const result = await signupMutation.mutateAsync(data)
    if (result.success) {
      showToast('success', 'Account created! Please sign in.')
      navigate('/login')
    } else {
      showToast('error', result.error || 'Signup failed')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[var(--bg1)]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] animate-aurora" style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.12), transparent 70%)', left: '5%', top: '10%', animationDuration: '25s' }} />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] animate-aurora" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)', right: '10%', bottom: '15%', animationDuration: '30s', animationDelay: '5s' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] animate-aurora" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06), transparent 70%)', left: '40%', top: '60%', animationDuration: '35s', animationDelay: '10s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <ParticleField />

      {floatingElements.map((el, i) => (
        <motion.div key={i} className="fixed z-[1] opacity-[0.04]" style={{ left: el.x, top: el.y }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <el.icon size={40} className="text-[var(--accent-cyan)]" />
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--primary)] to-[var(--accent-violet)] opacity-[0.08] blur-xl animate-gradient-shift" />

        <div className="relative rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_20%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-8 shadow-hud-lg backdrop-blur-2xl">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-50" />
          <div className="absolute top-2 left-2 h-5 w-5 border-t border-l border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute top-2 right-2 h-5 w-5 border-t border-r border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute bottom-2 left-2 h-5 w-5 border-b border-l border-[var(--accent-cyan)] opacity-30" />
          <div className="absolute bottom-2 right-2 h-5 w-5 border-b border-r border-[var(--accent-cyan)] opacity-30" />

          <motion.div className="mb-8 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="mx-auto mb-5"><AnimatedLogo size="lg" animate={true} /></div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>Create account</h1>
            <p className="mt-1.5 text-sm text-[var(--muted)] font-mono">// register new operator</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Full Name</label>
              <Input placeholder="operator name" icon={<User size={16} />} error={errors.full_name?.message} className="hud-border bg-[color-mix(in_srgb,var(--bg3)_60%,transparent)]" {...register('full_name')} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Email</label>
              <Input type="email" placeholder="operator@payflow.io" icon={<Mail size={16} />} error={errors.email?.message} className="hud-border bg-[color-mix(in_srgb,var(--bg3)_60%,transparent)]" {...register('email')} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Password</label>
              <Input type={showPassword ? 'text' : 'password'} placeholder="Set access key" icon={<Lock size={16} />} error={errors.password?.message} className="hud-border bg-[color-mix(in_srgb,var(--bg3)_60%,transparent)]" {...register('password')}
                endIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              />
            </div>

            <Button type="submit" className="w-full group relative overflow-hidden border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300" size="lg" loading={signupMutation.isPending}>
              <span className="relative z-10 flex items-center justify-center gap-2 font-mono uppercase text-sm tracking-wider">
                Create Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-violet)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-3 text-[var(--muted)] font-mono uppercase tracking-widest">or</span></div>
            </div>
            <p className="text-center text-sm text-[var(--muted)]">
              Already have access? <Link to="/login" className="font-medium text-[var(--accent-cyan)] hover:text-[var(--primary)] transition-colors hover:underline underline-offset-4">Sign in</Link>
            </p>
          </motion.div>

          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 rounded-full border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-5 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" /></span>
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
