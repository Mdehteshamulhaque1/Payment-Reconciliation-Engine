import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Zap, Shield, BarChart3, Layers, Workflow, Globe,
  CheckCircle2, ChevronRight, Star, TrendingUp, Clock, Users, CreditCard,
  GitBranch, Lock, Activity, MapPin, Mail, Phone, Send, Calendar,
  CheckCircle, Github, Linkedin, Twitter, Newspaper,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

const features = [
  { icon: Layers, title: 'Multi-Gateway Support', desc: 'Connect Stripe, PayPal, Razorpay, and 12+ payment gateways in one unified dashboard.' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'ML-powered transaction matching with 99.7% accuracy across bank statements and gateway logs.' },
  { icon: Workflow, title: 'Automated Workflows', desc: 'Rule engine auto-categorizes, flags anomalies, and routes exceptions to the right team.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live reconciliation status, settlement tracking, and custom reporting across all channels.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'SOC2 compliant, end-to-end encryption, role-based access, and full audit trails.' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Handle 50+ currencies with real-time FX rates and automatic conversion reconciliation.' },
]

const stats = [
  { value: '99.7%', label: 'Match Accuracy', icon: TrendingUp },
  { value: '<2s', label: 'Avg Reconciliation', icon: Clock },
  { value: '12+', label: 'Payment Gateways', icon: CreditCard },
  { value: '500+', label: 'Fintech Teams', icon: Users },
]

const logos = [
  'Stripe', 'PayPal', 'Razorpay', 'PayU', 'CCAvenue', 'PhonePe',
  'GPay', 'Worldpay', 'Adyen', 'Square', 'Braintree', 'Checkout.com',
]

const steps = [
  { num: '01', title: 'Connect Gateways', desc: 'Link your payment providers with OAuth or API keys in under 2 minutes.', icon: GitBranch },
  { num: '02', title: 'Import Transactions', desc: 'Auto-sync or upload CSV/JSON bank statements and gateway settlement reports.', icon: Layers },
  { num: '03', title: 'Auto-Reconcile', desc: 'AI engine matches transactions, flags discrepancies, and suggests resolutions.', icon: Zap },
  { num: '04', title: 'Resolve & Settle', desc: 'Review exceptions, approve matches, and generate settlement reports.', icon: CheckCircle2 },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Head of Finance, NeoBank', text: 'Cut our reconciliation time from 6 hours to 12 minutes. The AI matching is incredibly accurate.', rating: 5 },
  { name: 'Alex Chen', role: 'CTO, PayGateway', text: 'Finally a reconciliation tool that handles multi-currency properly. Game changer for our ops team.', rating: 5 },
  { name: 'Maria Santos', role: 'VP Finance, CryptoFlow', text: 'The real-time dashboard gives us instant visibility across 8 payment gateways. Incredible product.', rating: 5 },
]

const contactCards = [
  { icon: MapPin, title: 'Office', lines: ['Noida Sector 16', 'Noida, Uttar Pradesh', 'India'] },
  { icon: Mail, title: 'Email', lines: ['ehteshamulhaque736@gmail.com'] },
  { icon: Phone, title: 'Phone', lines: ['+91-XXXXXXXXXX'] },
  { icon: Clock, title: 'Business Hours', lines: ['Monday \u2013 Friday', '9:00 AM \u2013 6:00 PM IST'] },
]

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:ehteshamulhaque736@gmail.com' },
]

const quickLinks = {
  Product: [
    { label: 'Features', to: '/home#features' },
    { label: 'Dashboard', to: '/' },
    { label: 'Gateway Monitoring', to: '/gateways' },
    { label: 'Reconciliation', to: '/reconciliation' },
    { label: 'Fraud Detection', to: '/fraud' },
    { label: 'Reports', to: '/reports' },
  ],
  Resources: [
    { label: 'Documentation', to: '/docs' },
    { label: 'API Reference', to: '/api-docs' },
    { label: 'GitHub', to: '#' },
    { label: 'Blog', to: '/about' },
    { label: 'Changelog', to: '#' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '/about' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms & Conditions', to: '#' },
  ],
}

const techStack = ['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL', 'Redis', 'Celery', 'Docker', 'Prometheus', 'Grafana']

interface FloatingInputProps {
  label: string
  type?: string
  required?: boolean
  value: string
  onChange: (val: string) => void
  isTextarea?: boolean
  rows?: number
}

function FloatingInput({ label, type = 'text', required, value, onChange, isTextarea, rows = 4 }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0
  const isActive = focused || hasValue

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '24px 16px 8px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.06)',
    border: focused ? '1px solid #22d3ee' : '1px solid rgba(6,182,212,0.15)',
    boxShadow: focused ? '0 0 0 2px rgba(6,182,212,0.15), 0 0 20px rgba(6,182,212,0.08)' : 'none',
    backdropFilter: 'blur(8px)',
  }

  return (
    <div style={{ position: 'relative' }}>
      {isTextarea ? (
        <textarea required={required} rows={rows} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inputStyle, resize: 'none' }}
        />
      ) : (
        <input type={type} required={required} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
      <label style={{
        position: 'absolute', left: '16px', transition: 'all 0.3s', pointerEvents: 'none',
        fontFamily: 'JetBrains Mono, monospace',
        top: isActive ? '8px' : '50%',
        fontSize: isActive ? '10px' : '14px',
        textTransform: isActive ? 'uppercase' as const : undefined,
        letterSpacing: isActive ? '0.1em' : undefined,
        color: isActive ? '#22d3ee' : '#64748b',
        transform: isActive ? 'none' : 'translateY(-50%)',
      }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
    </div>
  )
}

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '', phone: '', subject: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>({})
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const validateContact = () => {
    const errors: Record<string, boolean> = {}
    if (!contactForm.name.trim()) errors.name = true
    if (!contactForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errors.email = true
    if (!contactForm.subject.trim()) errors.subject = true
    if (!contactForm.message.trim()) errors.message = true
    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateContact()) return
    setContactLoading(true)
    setTimeout(() => { setContactLoading(false); setContactSubmitted(true) }, 1500)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterLoading(true)
    setTimeout(() => { setNewsletterLoading(false); setNewsletterSubmitted(true) }, 1200)
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative py-20 sm:py-28 lg:py-36 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#06B6D4_0%,transparent_60%)] opacity-[0.07]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle,#5B5CEB_0%,transparent_70%)] opacity-[0.04] blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-8"
            style={{ border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)', color: '#06B6D4' }}
          >
            <Activity size={12} className="animate-pulse" />
            v2.4 \u2014 Now with AI-powered matching
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]"
            style={{ fontFamily: 'Outfit, system-ui' }}
          >
            <span style={{ color: 'var(--text)' }}>Payment</span>{' '}
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent-cyan)] to-[var(--primary)] bg-clip-text text-transparent">Reconciliation</span>{' '}
            <span style={{ color: 'var(--text)' }}>Engine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Automate transaction matching across 12+ payment gateways with AI-powered reconciliation.
            From onboarding to settlement \u2014 one dashboard for your entire payment stack.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup"><Button variant="primary" size="lg" className="min-w-[200px]">Start Free Trial <ArrowRight size={16} className="ml-2" /></Button></Link>
            <Link to="/docs"><Button variant="outline" size="lg" className="min-w-[200px]">View Documentation <ChevronRight size={16} className="ml-2" /></Button></Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-8"
            style={{ color: 'var(--muted)' }}
          >
            <div className="flex items-center gap-1.5 text-xs font-mono"><CheckCircle2 size={12} className="text-green-500" /> SOC2 Compliant</div>
            <div className="flex items-center gap-1.5 text-xs font-mono"><Lock size={12} className="text-green-500" /> End-to-End Encrypted</div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono"><Shield size={12} className="text-green-500" /> GDPR Ready</div>
          </motion.div>
        </div>
      </section>

      {/* LOGO CLOUD */}
      <section className="py-14 border-y" style={{ borderColor: 'rgba(6,182,212,0.06)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-mono uppercase tracking-widest mb-8" style={{ color: 'var(--muted)' }}>
            Integrated with 12+ Payment Gateways
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {logos.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center h-12 rounded-lg text-xs font-mono transition-all duration-300"
                style={{ border: '1px solid rgba(6,182,212,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--muted)' }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 sm:py-24 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl"
              style={{ border: '1px solid rgba(6,182,212,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <stat.icon size={20} className="mx-auto mb-3" style={{ color: '#06B6D4' }} />
              <div className="text-3xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>{stat.value}</div>
              <div className="text-xs font-mono mt-1 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 sm:py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#06B6D4' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
              Everything you need to reconcile
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              Built for finance teams managing complex multi-channel payment flows. Automate the tedious, focus on the strategic.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group p-6 rounded-2xl transition-all duration-300"
                style={{ border: '1px solid rgba(6,182,212,0.08)', background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300"
                  style={{ background: 'rgba(6,182,212,0.1)' }}
                >
                  <feat.icon size={18} style={{ color: '#06B6D4' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24 px-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#06B6D4' }}>How it Works</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
              Four steps to zero friction
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex gap-4 p-6 rounded-2xl"
                style={{ border: '1px solid rgba(6,182,212,0.06)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black"
                  style={{ fontFamily: 'Outfit', background: 'linear-gradient(to bottom right, var(--primary), var(--accent-cyan))' }}
                >
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#06B6D4' }}>Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
              Loved by finance teams
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl"
                style={{ border: '1px solid rgba(6,182,212,0.08)', background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text)' }}>"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t.name}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
           CTA — PREMIUM
         ═══════════════════════════════════════ */}
      <section style={{ padding: '80px 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: '1024px', margin: '0 auto', padding: '64px 48px', borderRadius: '32px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(6,182,212,0.15)',
            background: 'linear-gradient(135deg, rgba(91,92,235,0.08), rgba(6,182,212,0.06), rgba(91,92,235,0.04))',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06B6D4', marginBottom: '16px' }}>Start Building</p>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)', marginBottom: '16px' }}>
              Ready to Simplify Payment Reconciliation?
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '32px', maxWidth: '576px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              Monitor transactions, automate reconciliation, detect fraud, and manage settlements from a single intelligent platform.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              <Link to="/signup"><Button variant="primary" size="lg" className="min-w-[200px]">Get Started <ArrowRight size={16} className="ml-2" /></Button></Link>
              <Link to="/contact"><Button variant="outline" size="lg" className="min-w-[200px]">Book a Demo</Button></Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════════
           CONTACT SECTION & FOOTER
         ═════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-4" style={{ background: 'rgba(255,255,255,0.02)' }}>

        <div className="mx-auto max-w-6xl">

          {/* ─── Contact Header ─── */}
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent-cyan)' }}>Contact</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
              Get in Touch
            </h2>
            <p className="mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              Have questions about payment reconciliation, gateway integrations, enterprise solutions, or partnership opportunities? Our team is here to help.
            </p>
          </div>

          {/* ─── Contact Grid: Info + Form ─── */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">

            {/* Left Panel — Info Cards + Social */}
            <div className="flex flex-col gap-4">
              {/* Info panel */}
              <div
                className="p-8 rounded-2xl flex flex-col gap-5"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                {contactCards.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                    style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(6,182,212,0.1)' }}
                    >
                      <card.icon size={18} style={{ color: 'var(--accent-cyan)' }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--muted)' }}>{card.title}</p>
                      {card.lines.map((line, li) => (
                        <p key={li} className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="flex gap-3 pl-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)', textDecoration: 'none' }}
                    title={s.label}
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Panel — Contact Form */}
            <div>
              <AnimatePresence mode="wait">
                {contactSubmitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-14 rounded-2xl text-center"
                    style={{ border: '1px solid rgba(34,197,94,0.25)', background: 'var(--surface)' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                      <CheckCircle size={64} className="mx-auto mb-5" style={{ color: 'var(--success)' }} />
                    </motion.div>
                    <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>Message Sent!</h3>
                    <p className="mb-8" style={{ color: 'var(--muted)' }}>We'll get back to you within 4 hours.</p>
                    <Button variant="outline" onClick={() => { setContactSubmitted(false); setContactErrors({}); setContactForm({ name: '', company: '', email: '', phone: '', subject: '', message: '' }) }}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" ref={formRef} onSubmit={handleContactSubmit}
                    className="p-9 rounded-2xl"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <h3 className="text-lg font-bold mb-7" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>Send us a message</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <FloatingInput label="Full Name" required value={contactForm.name} onChange={(v) => setContactForm({ ...contactForm, name: v })} />
                        {contactErrors.name && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#EF4444' }}>Name is required</p>}
                      </div>
                      <FloatingInput label="Company Name" value={contactForm.company} onChange={(v) => setContactForm({ ...contactForm, company: v })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <FloatingInput label="Email Address" type="email" required value={contactForm.email} onChange={(v) => setContactForm({ ...contactForm, email: v })} />
                        {contactErrors.email && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#EF4444' }}>Valid email is required</p>}
                      </div>
                      <FloatingInput label="Phone Number" type="tel" value={contactForm.phone} onChange={(v) => setContactForm({ ...contactForm, phone: v })} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <FloatingInput label="Subject" required value={contactForm.subject} onChange={(v) => setContactForm({ ...contactForm, subject: v })} />
                      {contactErrors.subject && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#EF4444' }}>Subject is required</p>}
                    </div>

                    <div className="mb-7">
                      <FloatingInput label="Message" required isTextarea rows={4} value={contactForm.message} onChange={(v) => setContactForm({ ...contactForm, message: v })} />
                      {contactErrors.message && <p className="text-[11px] mt-1 font-mono" style={{ color: 'var(--danger)' }}>Message is required</p>}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <Button type="submit" variant="primary" size="lg" loading={contactLoading} className="flex-1 min-w-[160px]">
                        <Send size={14} className="mr-2" /> Send Message
                      </Button>
                      <Link to="/contact" className="flex-1 min-w-[160px] no-underline">
                        <Button variant="outline" size="lg" className="w-full">
                          <Calendar size={14} className="mr-2" /> Schedule a Demo
                        </Button>
                      </Link>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── Quick Links ─── */}
          <div
            className="mb-16 p-10 rounded-2xl"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {(Object.entries(quickLinks) as [string, { label: string; to: string }[]][]).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-bold mb-5 uppercase tracking-wide" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>{category}</h4>
                  <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((item) => (
                      <li key={item.label}>
                        <Link to={item.to} className="text-sm transition-colors hover:text-[var(--accent-cyan)]" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Tech Stack Showcase ─── */}
          <div className="mb-16 text-center">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Technology Stack</p>
            <h3 className="text-2xl font-extrabold mb-8" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>Powered by Modern Technology</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-3 rounded-xl text-xs font-mono font-medium transition-all hover:-translate-y-1 cursor-default"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Newsletter ─── */}
          <div
            className="mb-16 py-12 px-10 rounded-2xl text-center"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <Newspaper size={32} className="mx-auto mb-4" style={{ color: 'var(--accent-cyan)' }} />
            <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>Stay Updated</h3>
            <p className="text-sm mb-7 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              Receive product updates, release notes, fintech insights, and engineering blogs directly in your inbox.
            </p>

            <AnimatePresence mode="wait">
              {newsletterSubmitted ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2.5 font-semibold text-sm" style={{ color: 'var(--success)' }}>
                  <CheckCircle size={20} /> You're subscribed!
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleNewsletterSubmit}
                  className="flex items-center justify-center gap-3 max-w-md mx-auto flex-wrap">
                  <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 min-w-[220px] px-5 py-3.5 rounded-xl text-sm outline-none transition-colors focus:border-[var(--accent-cyan)]"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-strong)', color: 'var(--text)' }}
                    placeholder="Enter your email"
                  />
                  <Button type="submit" variant="primary" size="md" loading={newsletterLoading}>
                    Subscribe
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ FOOTER ═══ */}
          <footer className="py-10" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="flex items-center gap-2.5">
                <AnimatedLogo size="sm" showText={false} animate={false} />
                <span className="text-lg font-bold" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>PayFlow</span>
              </div>
              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>&copy; 2026 PayFlow Recon Engine. All Rights Reserved.</p>
            </div>

            <div className="text-center pb-2">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3.5 font-semibold" style={{ color: 'var(--muted)' }}>Built with</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {techStack.map((tech) => (
                  <span key={tech}
                    className="px-3 py-1 rounded-lg text-[10px] font-mono"
                    style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
