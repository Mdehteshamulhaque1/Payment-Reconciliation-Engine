import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Palette, Save } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/effects/Toast'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const user = useAuthStore((s) => s.user)

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Settings'
          description='Manage your account and preferences'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
        />
      </ScrollReveal>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <motion.div variants={fadeUp}>
          <Card variant='hud' className='p-6 h-full'>
            <div className='flex items-center gap-2 mb-4'>
              <User size={18} className='text-[var(--accent-cyan)]' />
              <h3 className='font-semibold'>Profile</h3>
            </div>
            <div className='space-y-4'>
              <Input label='Name' defaultValue={user?.full_name ?? ''} disabled />
              <Input label='Email' defaultValue={user?.email ?? ''} disabled />
              <Input label='Role' defaultValue={user?.role ?? 'Admin'} disabled />
              <p className='text-xs text-muted-foreground font-mono'>Profile editing is managed by your administrator.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card variant='hud' className='p-6 h-full'>
            <div className='flex items-center gap-2 mb-4'>
              <Lock size={18} className='text-[var(--accent-cyan)]' />
              <h3 className='font-semibold'>Security</h3>
            </div>
            <ChangePasswordForm />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className='lg:col-span-2'>
          <Card variant='hud' className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Palette size={18} className='text-[var(--accent-cyan)]' />
              <h3 className='font-semibold'>Appearance</h3>
            </div>
            <div className='flex flex-wrap gap-3'>
              {(['light', 'dim', 'dark'] as const).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => setTheme(t)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex h-20 w-32 flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${
                    theme === t
                      ? 'border-[var(--accent-neon)] bg-[color-mix(in_srgb,var(--accent-neon)_5%,transparent)] shadow-[0_0_20px_var(--accent-neon-glow)]'
                      : 'border-border hover:border-[color-mix(in_srgb,var(--accent-cyan)_30%,var(--border))]'
                  }`}
                >
                  <div className={`h-8 w-12 rounded-lg ${
                    t === 'light' ? 'bg-white border border-gray-200' :
                    t === 'dim' ? 'bg-[#1a1a2e]' :
                    'bg-black'
                  }`} />
                  <span className='text-xs font-medium capitalize font-mono'>{t}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        if (fd.get('new_password') !== fd.get('confirm')) {
          showToast('error', 'Passwords do not match')
          return
        }
        setLoading(true)
        setTimeout(() => {
          showToast('success', 'Password updated')
          setLoading(false)
          ;(e.target as HTMLFormElement).reset()
        }, 1000)
      }}
      className='space-y-4'
    >
      <Input label='Current password' name='current' type='password' required />
      <Input label='New password' name='new_password' type='password' required minLength={6} />
      <Input label='Confirm password' name='confirm' type='password' required />
      <Button type='submit' loading={loading}>
        <Save size={16} className='mr-1.5' /> Update Password
      </Button>
    </form>
  )
}
