import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, ArrowRightLeft, Zap, Shield, BarChart3, Layers, Workflow, Globe,
  CheckCircle2, TrendingUp, Clock, Users, CreditCard,
  GitBranch, Sparkles, Target, Play, ArrowDown, Rocket,
  Activity, Wallet, Network, Crosshair, ScanLine, Coins,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DemoWalkthrough } from '@/components/demo/DemoWalkthrough'
import { Footer } from '@/components/layout/Footer'
import { useDashboardStats } from '@/hooks/useAnalytics'

function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  )
}

function CountUp({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const id = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(id) } else setVal(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(id)
  }, [inView, end, duration])
  return <span ref={ref} className="tabular-nums">{val}{suffix}</span>
}

const painPoints = [
  { icon: Crosshair, title: 'Manual matching takes hours', desc: 'Finance teams waste 20+ hours/week on spreadsheets' },
  { icon: ScanLine, title: 'Discrepancies hide in the noise', desc: '0.1% error rates cost enterprises $2M+ annually' },
  { icon: Coins, title: 'Settlement delays bleed cash', desc: 'Late reconciliations mean missed netting opportunities' },
]

const features = [
  { icon: Layers, title: 'Multi-Gateway Support', desc: 'Connect Stripe, PayPal, Razorpay, and 12+ payment gateways in one unified dashboard.', duration: '3:24' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'ML-powered transaction matching with 99.7% accuracy across bank statements and gateway logs.', duration: '4:12' },
  { icon: Workflow, title: 'Automated Workflows', desc: 'Rule engine auto-categorizes, flags anomalies, and routes exceptions to the right team.', duration: '2:58' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live reconciliation status, settlement tracking, and custom reporting across all channels.', duration: '3:45' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'SOC2 compliant, end-to-end encryption, role-based access, and full audit trails.', duration: '3:30' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Handle 50+ currencies with real-time FX rates and automatic conversion reconciliation.', duration: '3:15' },
]

const stats = [
  { value: 99.7, suffix: '%', label: 'Match Accuracy', icon: TrendingUp },
  { value: 2, suffix: 's', label: 'Avg Reconciliation', icon: Clock },
  { value: 12, suffix: '+', label: 'Payment Gateways', icon: CreditCard },
  { value: 500, suffix: '+', label: 'Fintech Teams', icon: Users },
]

const gatewayLogos = [
  { name: 'Stripe', color: '#635BFF' }, { name: 'PayPal', color: '#003087' }, { name: 'Razorpay', color: '#072654' },
  { name: 'PayU', color: '#FF5722' }, { name: 'CCAvenue', color: '#1A237E' }, { name: 'PhonePe', color: '#5F259F' },
  { name: 'GPay', color: '#4285F4' }, { name: 'Worldpay', color: '#00529B' }, { name: 'Adyen', color: '#0ABF53' },
  { name: 'Square', color: '#006AFF' }, { name: 'Braintree', color: '#0070BA' }, { name: 'Checkout.com', color: '#00C853' },
]

const steps = [
  { num: '01', title: 'Connect Gateways', desc: 'Link your payment providers with OAuth or API keys in under 2 minutes.', icon: GitBranch },
  { num: '02', title: 'Import Transactions', desc: 'Auto-sync or upload CSV/JSON bank statements and gateway settlement reports.', icon: Layers },
  { num: '03', title: 'Auto-Reconcile', desc: 'AI engine matches transactions, flags discrepancies, and suggests resolutions.', icon: Zap },
  { num: '04', title: 'Resolve & Settle', desc: 'Review exceptions, approve matches, and generate settlement reports.', icon: CheckCircle2 },
]

const testimonials = [
  { quote: 'We reduced reconciliation time from 3 days to 11 minutes. PayFlow is a game-changer.', author: 'CFO', company: 'A leading fintech unicorn' },
  { quote: 'The AI matching is spookily accurate. We caught $240K in discrepancies last quarter alone.', author: 'Head of Finance', company: 'Enterprise payment platform' },
  { quote: 'Multi-gateway reconciliation used to be a nightmare. Now it just works.', author: 'VP Engineering', company: 'Global payments company' },
]

export function LandingPageContent() {
  const { data: dashboardStats } = useDashboardStats()
  const [videoModal, setVideoModal] = useState<{ title: string; videoId: string; duration: string } | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="gradient-mesh relative overflow-hidden min-h-[90vh] flex items-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28">
          <div className="text-center">
            <Reveal delay={0}>
              <span className="brutal-tag inline-block mb-8">v2.4 — AI-powered matching</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-display-xxl sm:text-[56px] mb-6 leading-[0.95]" style={{ color: 'var(--ink)' }}>
                <span>Reconcile </span>
                <span className="gradient-text">every transaction</span>
                <br />
                <span>automatically</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-body-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--ink-mute)' }}>
                Automate payment reconciliation across 12+ gateways with AI-powered matching.
                Detect fraud, track settlements, and close books 10x faster.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/">
                  <Button variant="brutal" size="lg" className="min-w-[200px]">
                    Go to Dashboard <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="min-w-[160px]">
                  Book a Demo
                </Button>
              </div>
            </Reveal>
          </div>

          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-micro-cap uppercase tracking-[0.1px]" style={{ color: 'var(--ink-mute)' }}>Scroll</span>
            <ArrowDown size={12} style={{ color: 'var(--ink-mute)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="py-20 sm:py-24 border-b" style={{ borderColor: 'var(--hairline)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="section-label mb-3">The Problem</p>
              <h2 className="text-display-lg mb-3" style={{ color: 'var(--ink)' }}>
                Reconciliation is still broken
              </h2>
              <p className="text-body-lg max-w-lg mx-auto" style={{ color: 'var(--ink-mute)' }}>
                Spreadsheets, manual checks, and fragmented tools are costing you time and money.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <Card variant="brutal" className="!p-6">
                  <p.icon size={20} className="mb-4" style={{ color: 'var(--primary)' }} />
                  <h3 className="text-heading-sm mb-2" style={{ color: 'var(--ink)' }}>{p.title}</h3>
                  <p className="text-body-md" style={{ color: 'var(--ink-mute)' }}>{p.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS TICKER ─── */}
      <section className="py-16" style={{ background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-micro-cap uppercase tracking-[0.1px] mb-8" style={{ color: 'var(--ink-mute)' }}>
              Trusted by 500+ fintech teams — connects with every major gateway
            </p>
          </Reveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {gatewayLogos.map((gw, i) => (
              <Reveal key={gw.name} delay={i * 0.04}>
                <div className="glass rounded-lg h-12 flex items-center justify-center cursor-default">
                  <span className="text-xs font-semibold tracking-tight" style={{ color: gw.color }}>{gw.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AT A GLANCE ─── */}
      <section className="py-20 sm:py-24" style={{ background: 'var(--canvas)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="section-label mb-3">At a Glance</p>
              <h2 className="text-display-lg mb-3" style={{ color: 'var(--ink)' }}>
                Your payment operations, quantified
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Transactions', value: (dashboardStats?.total_transactions ?? 345678).toLocaleString(), icon: ArrowRightLeft },
              { label: 'Volume', value: `$${(dashboardStats?.total_amount ?? 28456789).toLocaleString()}`, icon: Wallet },
              { label: 'Success Rate', value: `${(dashboardStats?.success_rate ?? 98.7).toFixed(1)}%`, icon: Activity },
              { label: 'Gateways', value: `${dashboardStats?.active_gateways ?? 12}`, icon: Network },
            ].map((kpi) => (
              <Card key={kpi.label} variant="skeuo" className="!p-6 text-center" hover={false}>
                <div className="flex items-center justify-center w-10 h-10 rounded-sm mx-auto mb-3 skeuo"
                  style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                  <kpi.icon size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <p className="text-display-md tabular-nums mb-1" style={{ color: 'var(--ink)' }}>{kpi.value}</p>
                <p className="text-caption" style={{ color: 'var(--ink-mute)' }}>{kpi.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 sm:py-24" style={{ background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center px-6 py-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-sm mx-auto mb-4 skeuo"
                    style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                    <stat.icon size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="text-display-xl mb-2" style={{ color: 'var(--ink)' }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-caption" style={{ color: 'var(--ink-mute)' }}>{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 sm:py-28" style={{ background: 'var(--canvas)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">Features</p>
              <h2 className="text-display-xl mb-4" style={{ color: 'var(--ink)' }}>
                Everything you need to reconcile
              </h2>
              <p className="text-body-lg max-w-xl mx-auto" style={{ color: 'var(--ink-mute)' }}>
                Built for finance teams managing complex multi-channel payment flows.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.08}>
                <Card variant="glass" className="cursor-pointer h-full"
                  onClick={() => { const stepMap: Record<string, number> = { 'Multi-Gateway Support': 3, 'AI-Powered Matching': 4, 'Automated Workflows': 4, 'Real-time Analytics': 1, 'Bank-Grade Security': 11, 'Multi-Currency': 12 }; setDemoStep(stepMap[feat.title] ?? 0); setDemoOpen(true); }}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-sm mb-5 skeuo"
                    style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                    <feat.icon size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="text-heading-md mb-2" style={{ color: 'var(--ink)' }}>{feat.title}</h3>
                  <p className="text-body-md" style={{ color: 'var(--ink-mute)' }}>{feat.desc}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-button-sm" style={{ color: 'var(--primary)' }}>
                      Watch demo <Play size={10} className="inline ml-1" style={{ color: 'var(--primary)' }} />
                    </span>
                    <span className="text-micro-cap pill-tag">{feat.duration}</span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">How it Works</p>
              <h2 className="text-display-xl" style={{ color: 'var(--ink)' }}>
                Four steps to zero friction
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <Card variant="glass" className="text-center h-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-sm mx-auto mb-5 skeuo-btn"
                    style={{ background: 'var(--primary)' }}>
                    <span className="text-button-md text-white">{step.num}</span>
                  </div>
                  <h3 className="text-heading-sm mb-2" style={{ color: 'var(--ink)' }}>{step.title}</h3>
                  <p className="text-body-md" style={{ color: 'var(--ink-mute)' }}>{step.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--canvas)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">Trusted by Finance Teams</p>
              <h2 className="text-display-xl" style={{ color: 'var(--ink)' }}>
                What our users say
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Card variant="brutal-accent" className="!p-8 flex flex-col h-full">
                  <p className="text-heading-sm mb-6 flex-1" style={{ color: 'var(--ink)' }}>"{t.quote}"</p>
                  <div className="pt-6 border-t" style={{ borderColor: 'var(--primary)' }}>
                    <p className="text-body-md font-semibold" style={{ color: 'var(--ink)' }}>{t.author}</p>
                    <p className="text-caption" style={{ color: 'var(--ink-mute)' }}>{t.company}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 sm:py-28 relative" style={{ background: 'var(--bg-soft)' }}>
        <div className="absolute inset-0 mesh-blob" style={{ background: 'var(--primary)', left: '30%', top: '20%', width: '300px', height: '300px', opacity: 0.05 }} />
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <Card variant="glass" className="!p-10 text-center">
              <p className="section-label mb-5">Pricing</p>
              <h2 className="text-display-lg mb-3" style={{ color: 'var(--ink)' }}>
                Start using PayFlow today
              </h2>
              <p className="text-body-lg mb-8" style={{ color: 'var(--ink-mute)' }}>
                Pay once and get full access to all features — no tiers, no hidden fees.
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-display-xxl tabular-nums" style={{ color: 'var(--ink)' }}>$49</span>
                <span className="text-body-md" style={{ color: 'var(--ink-mute)' }}>/one-time</span>
              </div>
              <Link to="/">
                <Button variant="skeuo" size="lg" className="min-w-[240px]">
                  Pay & Get Access <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </Link>
              <p className="text-caption mt-4" style={{ color: 'var(--ink-mute)' }}>
                Instant access · No recurring charges · Full features
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'var(--canvas)' }}>
        <div className="absolute inset-0 gradient-mesh" />
        <Reveal>
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="section-label mb-4">Start Building</p>
            <h2 className="text-display-xl mb-6 leading-[0.95]" style={{ color: 'var(--ink)' }}>
              Ready to simplify<br />payment reconciliation?
            </h2>
            <p className="text-body-lg mb-10 max-w-lg mx-auto" style={{ color: 'var(--ink-mute)' }}>
              Join 500+ fintech teams automating their reconciliation with AI-powered matching.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/">
                <Button variant="brutal" size="lg" className="min-w-[200px]">
                  Go to Dashboard <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="min-w-[160px]">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── VIDEO MODAL ─── */}
      {videoModal && (
        <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setVideoModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div className="relative w-full max-w-3xl overflow-hidden brutal-card rounded-none"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'color-mix(in srgb, var(--brand-dark-900) 80%, black)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-caption text-white/50">payflow-demo.com</span>
              <button onClick={() => setVideoModal(null)} className="text-white/40 hover:text-white text-lg leading-none">&times;</button>
            </div>
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoModal.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: 'color-mix(in srgb, var(--brand-dark-900) 80%, black)' }}>
              <div>
                <h4 className="text-heading-sm text-white">{videoModal.title}</h4>
                <p className="text-caption text-white/50 mt-0.5">Feature walkthrough · {videoModal.duration}</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => setVideoModal(null)}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <DemoWalkthrough isOpen={demoOpen} onClose={() => setDemoOpen(false)} initialStep={demoStep} />

      <Footer />
    </div>
  )
}

export default LandingPageContent
