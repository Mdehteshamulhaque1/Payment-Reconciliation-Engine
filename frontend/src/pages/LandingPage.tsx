import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight, ArrowRightLeft, Zap, Shield, BarChart3, Layers, Workflow, Globe,
  CheckCircle2, TrendingUp, Clock, Users, CreditCard,
  GitBranch,
  Sparkles, Target, Play, ArrowDown, Rocket,
  Activity, Wallet, Network,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DemoWalkthrough } from '@/components/demo/DemoWalkthrough'
import { Footer } from '@/components/layout/Footer'
import { useDashboardStats } from '@/hooks/useAnalytics'

/* ═══════════ ANIMATION HELPERS ═══════════ */

function Reveal({ children, delay = 0, y = 30, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
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
  return <span ref={ref}>{val}{suffix}</span>
}

function FloatingOrb({ size, color, top, left, delay = 0 }: { size: number; color: string; top: string; left: string; delay?: number }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: `blur(${size / 3}px)` }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  )
}

function MagneticButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15)
  }
  const reset = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouse} onMouseLeave={reset} className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════ DATA ═══════════ */

const BLUE = '#1e40af'
const BLUE_LIGHT = '#3b82f6'

const features = [
  { icon: Layers, title: 'Multi-Gateway Support', desc: 'Connect Stripe, PayPal, Razorpay, and 12+ payment gateways in one unified dashboard.', color: BLUE, videoId: '567XMng-0GA', duration: '3:24' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'ML-powered transaction matching with 99.7% accuracy across bank statements and gateway logs.', color: '#2563eb', videoId: 'k3c_j1CrSKw', duration: '4:12' },
  { icon: Workflow, title: 'Automated Workflows', desc: 'Rule engine auto-categorizes, flags anomalies, and routes exceptions to the right team.', color: '#1d4ed8', videoId: 'LpkxcOYWQBs', duration: '2:58' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live reconciliation status, settlement tracking, and custom reporting across all channels.', color: '#1e3a8a', videoId: '5xral3GHBVs', duration: '3:45' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'SOC2 compliant, end-to-end encryption, role-based access, and full audit trails.', color: '#172554', videoId: 'DoJED_EUSKs', duration: '3:30' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Handle 50+ currencies with real-time FX rates and automatic conversion reconciliation.', color: '#0ea5e9', videoId: 'pBCc3lOjjcM', duration: '3:15' },
]

const stats = [
  { value: 99.7, suffix: '%', label: 'Match Accuracy', icon: TrendingUp },
  { value: 2, suffix: 's', label: 'Avg Reconciliation', icon: Clock },
  { value: 12, suffix: '+', label: 'Payment Gateways', icon: CreditCard },
  { value: 500, suffix: '+', label: 'Fintech Teams', icon: Users },
]

const StripeLogo = () => (
  <svg viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '70%', height: 'auto', maxHeight: 28 }}>
    <path d="M6.5 9.5c0-1.1.9-1.5 1.8-1.5 1.6 0 3.6.5 5.2 1.3V5.3C11.5 4.7 9.8 4.4 8 4.4 4.3 4.4 1 6.3 1 10c0 4.7 6.5 4 6.5 6.1 0 1.3-1.1 1.7-2.1 1.7-1.8 0-4.1-.7-5.9-1.7v4.3c2 .8 4 1.2 5.9 1.2 3.9 0 7.2-1.9 7.2-5.7C12.6 11.5 6.5 12.5 6.5 9.5zM19.2 2.8l-5.1 1.1v4h5.1V2.8zM14.1 9h5.1v11.2h-5.1V9zM23.1 9l-.3 1.5h-.1V9h-4.5v11.2h5.1V14c1.2-1.6 3.2-1.3 3.8-1.1V9c-.6-.2-2.8-.5-4 .8zM32 4.5l-5 1.1v10c0 1.8 1.4 3.2 3.2 3.2 1 0 1.8-.2 2.2-.4v-3.6c-.4.1-2.3.6-2.3-1V12h2.3V9h-2.3V4.5H32zM41.5 9c-1.6 0-2.6.7-3.2 1.2l-.2-1H33v15.2l5.1-1.1v-3.8c.6.4 1.4.6 2.4.6 2.4 0 4.6-1.9 4.6-6 0-3.6-2.3-5.9-3.6-5.9zm-.8 9.2c-.8 0-1.3-.3-1.6-.6V12c.3-.4.8-.7 1.6-.7 1.2 0 2 1.3 2 3.1 0 1.9-.8 3.3-2 3.3zM51 9l-.3 1.5h-.1V9h-4.5v11.2H51V14c1.2-1.6 3.2-1.3 3.8-1.1V9c-.6-.2-2.8-.5-4 .8zM60 9h-4.8l-.2 1.5h.1c.6-1 1.7-1.8 3.2-1.8v4.2c-.4-.1-1-.2-1.7-.2-1.3 0-2.5.8-2.7 2.5V20.2H57V9h3z" fill="#635BFF"/>
  </svg>
)

const PayPalLogo = () => (
  <svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '75%', height: 'auto', maxHeight: 24 }}>
    <path d="M29.4 3.2l-3.9.9c-.3.1-.5.3-.5.6 0 0 0 .1.1.3.5 1.4 1.4 2.7 2.7 3.6.6.4 1.3.7 2 .8.6.1 1.2.1 1.8-.1.3-.1.5-.2.7-.4l.1-.2.1-.2c0-.1 0-.2 0-.3v-.1l.1-.3c0-.2 0-.3-.1-.5-.2-.9-.8-1.5-1.7-1.7-.7-.2-1.4-.1-2.1.1l-.2.1-.3.1c-.1 0-.2.1-.3.1l-.4.1-.1.1z" fill="#253B80"/>
    <path d="M30.6 1.7l-3.8.9c-.4.1-.7.4-.7.8 0 0 .1.2.2.5.7 1.7 1.9 3.2 3.5 4.3.7.5 1.5.8 2.4.9.7.1 1.4.1 2.1-.2.5-.2.9-.5 1.1-.9l.2-.4c0-.1.1-.2.1-.3v-.2l.1-.4c.1-.5-.1-1-.5-1.3-.5-.4-1.1-.5-1.7-.4l-.3.1-.4.1c-.3.1-.5.1-.8.2l-.6.1-.2.1c-.3.1-.6.1-.8.2z" fill="#172C80"/>
    <path d="M38.4 6.3c-.1 0-.1 0 0 0l.1-.1c.6-.7.8-1.5.7-2.3-.1-.8-.5-1.5-1.1-2-.7-.5-1.5-.7-2.3-.7-.7 0-1.5.2-2.1.6-.6.4-1 .9-1.3 1.5l-.1.2-.3 1.5-.1.3c0 .1-.1.2-.1.3 0 .1-.1.2-.1.3v.1c0 .2-.1.4-.1.5-.1.4-.1.7.1 1.1.1.3.3.5.5.7.5.5 1.2.7 1.9.6.7-.1 1.3-.5 1.7-1 .2-.3.4-.6.5-1 0-.1.1-.2.1-.3 0-.1.1-.2.1-.4l.1-.3c0-.1.1-.2.1-.4v-.2z" fill="#253B80"/>
    <path d="M34.8 6.7c-.1 0-.2 0-.3-.1-.2-.1-.3-.2-.4-.4-.2-.5-.3-1-.3-1.6V3.7c0-.3-.1-.5-.3-.7-.3-.3-.7-.5-1.2-.5-.8 0-1.6.3-2.2.9-.6.6-.9 1.4-.9 2.2 0 .7.2 1.3.6 1.9.3.4.7.7 1.2.8.4.1.8.1 1.2-.1.5-.2.9-.5 1.2-1 .2-.3.3-.5.4-.8 0-.1.1-.2.1-.3 0-.1.1-.2.1-.3l.1-.2c0-.1.1-.1.1-.2z" fill="#1797C0"/>
    <path d="M42.6 3.6c-1.2 0-2.3.4-3.2 1.1-.9.7-1.4 1.6-1.5 2.7v.1c0 .3.1.6.2.9.3.8.9 1.4 1.7 1.7.4.2.9.3 1.3.3.5 0 1-.1 1.5-.3.5-.3.9-.7 1.2-1.2.3-.5.4-1 .4-1.6V7.1c0-.3-.1-.6-.2-.9-.3-.8-.9-1.4-1.7-1.7-.4-.2-.9-.3-1.3-.3v-.6z" fill="#253B80"/>
    <path d="M43.1 3h-1.1c-.4 0-.8.1-1.2.3-.8.3-1.4.9-1.7 1.7-.1.3-.2.6-.2.9v.1c0 .3.1.6.2.9.3.8.9 1.4 1.7 1.7.4.2.9.3 1.3.3.5 0 1-.1 1.5-.3.5-.3.9-.7 1.2-1.2.3-.5.4-1 .4-1.6V7.1c0-.2-.1-.4-.1-.6-.3-.8-.9-1.4-1.7-1.7-.3-.1-.6-.2-1-.2h.2c.1.1.3.3.4.4z" fill="#1797C0"/>
    <text x="50" y="14" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="bold" fill="#253B80">PayPal</text>
  </svg>
)

const RazorpayLogo = () => (
  <svg viewBox="0 0 90 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%', height: 'auto', maxHeight: 24 }}>
    <path d="M8.4 4.2c-2 0-3.7.5-4.8 1.2-.3.2-.4.4-.4.6v.1c0 .3.2.5.5.6 1.7.5 3.1 1.5 3.7 2.8v4.6c0 .3.2.5.5.6 1.3.3 2.7.3 4 0 .3-.1.5-.3.5-.6V10c1.5 1.2 3.5 1.8 5.5 1.5.3 0 .5-.2.5-.5V8.6c0-3-2.8-4.4-6.5-4.4z" fill="#072654"/>
    <text x="23" y="14" fontFamily="Arial,Helvetica,sans-serif" fontSize="10" fontWeight="bold" fill="#072654">Razorpay</text>
  </svg>
)

const PayULogo = () => (
  <svg viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '60%', height: 'auto', maxHeight: 28 }}>
    <text x="2" y="16" fontFamily="Arial,Helvetica,sans-serif" fontSize="16" fontWeight="bold" fill="#FF5722">PayU</text>
  </svg>
)

const CCAvenueLogo = () => (
  <svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '78%', height: 'auto', maxHeight: 24 }}>
    <text x="2" y="15" fontFamily="Arial,Helvetica,sans-serif" fontSize="12" fontWeight="bold" fill="#1A237E">CCAvenue</text>
  </svg>
)

const PhonePeLogo = () => (
  <svg viewBox="0 0 75 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '78%', height: 'auto', maxHeight: 28 }}>
    <rect x="1" y="2" width="16" height="16" rx="4" fill="#5F259F"/>
    <text x="4" y="14.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="bold" fill="white">Pe</text>
    <text x="20" y="15" fontFamily="Arial,Helvetica,sans-serif" fontSize="12" fontWeight="bold" fill="#5F259F">PhonePe</text>
  </svg>
)

const GPayLogo = () => (
  <svg viewBox="0 0 55 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '55%', height: 'auto', maxHeight: 28 }}>
    <text x="2" y="16" fontFamily="Arial,Helvetica,sans-serif" fontSize="16" fontWeight="bold" fill="#4285F4">G</text>
    <text x="17" y="16" fontFamily="Arial,Helvetica,sans-serif" fontSize="15" fontWeight="500" fill="#5F6368">Pay</text>
  </svg>
)

const WorldpayLogo = () => (
  <svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%', height: 'auto', maxHeight: 24 }}>
    <text x="2" y="15" fontFamily="Arial,Helvetica,sans-serif" fontSize="12" fontWeight="bold" fill="#00529B">worldpay</text>
  </svg>
)

const AdyenLogo = () => (
  <svg viewBox="0 0 55 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '58%', height: 'auto', maxHeight: 28 }}>
    <text x="2" y="16" fontFamily="Arial,Helvetica,sans-serif" fontSize="15" fontWeight="bold" fill="#0ABF53">adyen</text>
  </svg>
)

const SquareLogo = () => (
  <svg viewBox="0 0 68 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '72%', height: 'auto', maxHeight: 28 }}>
    <rect x="1" y="2" width="16" height="16" rx="4" fill="#006AFF"/>
    <text x="5" y="14.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="12" fontWeight="bold" fill="white">S</text>
    <text x="20" y="15.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="13" fontWeight="bold" fill="#1A1A1A">Square</text>
  </svg>
)

const BraintreeLogo = () => (
  <svg viewBox="0 0 85 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '82%', height: 'auto', maxHeight: 24 }}>
    <text x="2" y="15" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="bold" fill="#0070BA">braintree</text>
  </svg>
)

const CheckoutLogo = () => (
  <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '85%', height: 'auto', maxHeight: 24 }}>
    <text x="2" y="15" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="bold" fill="#00C853">checkout.com</text>
  </svg>
)

const gatewayLogos = [
  { name: 'Stripe', Logo: StripeLogo, color: '#635BFF' },
  { name: 'PayPal', Logo: PayPalLogo, color: '#003087' },
  { name: 'Razorpay', Logo: RazorpayLogo, color: '#072654' },
  { name: 'PayU', Logo: PayULogo, color: '#FF5722' },
  { name: 'CCAvenue', Logo: CCAvenueLogo, color: '#1A237E' },
  { name: 'PhonePe', Logo: PhonePeLogo, color: '#5F259F' },
  { name: 'GPay', Logo: GPayLogo, color: '#4285F4' },
  { name: 'Worldpay', Logo: WorldpayLogo, color: '#00529B' },
  { name: 'Adyen', Logo: AdyenLogo, color: '#0ABF53' },
  { name: 'Square', Logo: SquareLogo, color: '#006AFF' },
  { name: 'Braintree', Logo: BraintreeLogo, color: '#0070BA' },
  { name: 'Checkout.com', Logo: CheckoutLogo, color: '#00C853' },
]

const steps = [
  { num: '01', title: 'Connect Gateways', desc: 'Link your payment providers with OAuth or API keys in under 2 minutes.', icon: GitBranch },
  { num: '02', title: 'Import Transactions', desc: 'Auto-sync or upload CSV/JSON bank statements and gateway settlement reports.', icon: Layers },
  { num: '03', title: 'Auto-Reconcile', desc: 'AI engine matches transactions, flags discrepancies, and suggests resolutions.', icon: Zap },
  { num: '04', title: 'Resolve & Settle', desc: 'Review exceptions, approve matches, and generate settlement reports.', icon: CheckCircle2 },

]

export function LandingPageContent() {
  const { data: dashboardStats } = useDashboardStats()
  const [videoModal, setVideoModal] = useState<{ title: string; videoId: string; duration: string } | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <div style={{ background: 'var(--bg1)' }}>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg1) 60%, var(--bg2) 100%)' }}>
        <FloatingOrb size={500} color="rgba(30,64,175,0.08)" top="-15%" left="15%" delay={0} />
        <FloatingOrb size={400} color="rgba(59,130,246,0.06)" top="5%" left="75%" delay={2} />
        <FloatingOrb size={300} color="rgba(14,165,233,0.05)" top="55%" left="5%" delay={4} />
        <FloatingOrb size={350} color="rgba(30,64,175,0.04)" top="45%" left="85%" delay={1} />

        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${BLUE}06 1px, transparent 1px), linear-gradient(90deg, ${BLUE}06 1px, transparent 1px)`,
          backgroundSize: '60px 60px', animation: 'gridPulse 4s ease-in-out infinite',
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-24">
          <div className="text-center">
            <Reveal delay={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]" style={{ fontFamily: 'Outfit, system-ui' }}>
                <span style={{ color: 'var(--text)' }}>Reconcile</span>{' '}
                <motion.span className="inline-block"
                  style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT}, ${BLUE})`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  Every Transaction
                </motion.span>{' '}
                <br />
                <span style={{ color: 'var(--text)' }}>Automatically</span>
              </h1>
              <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mt-6"
                style={{ border: `1px solid ${BLUE}20`, background: `${BLUE}08`, color: BLUE }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${BLUE}18` }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={12} />
                </motion.div>
                v2.4 — Now with AI-powered matching
              </motion.div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                Automate payment reconciliation across 12+ gateways with AI-powered matching.
                Detect fraud, track settlements, and close books 10x faster.
              </p>
            </Reveal>


          </div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Scroll to explore</span>
            <ArrowDown size={14} style={{ color: BLUE }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ SOCIAL PROOF ═══════ */}
      <section className="py-12" style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-mono uppercase tracking-widest mb-8" style={{ color: 'var(--muted)' }}>
              Trusted by 500+ fintech teams worldwide
            </p>
          </Reveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {gatewayLogos.map((gw, i) => (
              <Reveal key={gw.name} delay={i * 0.04}>
                <motion.div className="flex items-center justify-center h-14 rounded-xl cursor-default overflow-hidden"
                  style={{ border: '1px solid rgba(30,64,175,0.06)', background: 'var(--bg2)' }}
                  whileHover={{ y: -3, borderColor: `${gw.color}30`, boxShadow: `0 4px 16px ${gw.color}12`, background: 'var(--bg3)' }}
                  transition={{ duration: 0.2 }}>
                  <gw.Logo />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ AT A GLANCE ═══════ */}
      <section className="py-20 sm:py-24 px-4" style={{ background: 'var(--bg3)' }}>
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                At a Glance
              </h2>
              <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
                Key metrics from your payment operations.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Transactions', value: (dashboardStats?.total_transactions ?? 0).toLocaleString(), icon: ArrowRightLeft, color: BLUE },
                { label: 'Volume', value: `$${(dashboardStats?.total_amount ?? 0).toLocaleString()}`, icon: Wallet, color: '#059669' },
                { label: 'Success Rate', value: `${(dashboardStats?.success_rate ?? 0).toFixed(1)}%`, icon: Activity, color: '#6366f1' },
                { label: 'Gateways', value: `${dashboardStats?.active_gateways ?? 0}`, icon: Network, color: '#0891b2' },
              ].map((kpi) => (
                <div key={kpi.label} className="text-center p-6 rounded-xl" style={{ background: 'var(--bg3)', border: `1px solid ${BLUE}08` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${kpi.color}0c` }}>
                    <kpi.icon size={16} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-20 sm:py-24 px-4" style={{ background: 'var(--bg1)' }}>
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <motion.div className="text-center p-8 rounded-2xl"
                style={{ border: '1px solid var(--border)', background: 'var(--bg3)' }}
                whileHover={{ y: -6, boxShadow: `0 12px 40px ${BLUE}12` }} transition={{ duration: 0.3 }}>
                <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${BLUE}0c` }}
                  whileHover={{ rotate: 10, scale: 1.1 }}>
                  <stat.icon size={20} style={{ color: BLUE }} />
                </motion.div>
                <div className="text-4xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{stat.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-20 sm:py-28 px-4" style={{ background: 'var(--bg3)' }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Target size={12} /> Features
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                Everything you need to reconcile
              </h2>
              <p className="mt-5 max-w-2xl mx-auto text-lg" style={{ color: 'var(--muted)' }}>
                Built for finance teams managing complex multi-channel payment flows.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.08}>
                <motion.div className="group p-7 rounded-2xl cursor-pointer h-full relative overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg3)' }}
                  whileHover={{ y: -6, boxShadow: `0 20px 60px ${feat.color}12`, borderColor: `${feat.color}20` }}
                  transition={{ duration: 0.3 }}
                  onClick={() => { const stepMap: Record<string, number> = { 'Multi-Gateway Support': 3, 'AI-Powered Matching': 4, 'Automated Workflows': 4, 'Real-time Analytics': 1, 'Bank-Grade Security': 11, 'Multi-Currency': 12 }; setDemoStep(stepMap[feat.title] ?? 0); setDemoOpen(true); }}>
                  <motion.div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: feat.color }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}>
                    <Play size={14} className="text-white ml-0.5" fill="white" />
                  </motion.div>
                  <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${feat.color}10` }}
                    whileHover={{ rotate: 10, scale: 1.1 }}>
                    <feat.icon size={20} style={{ color: feat.color }} />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{feat.desc}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: feat.color }}>
                      Watch demo <Play size={10} fill={feat.color} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${feat.color}10`, color: feat.color }}>
                      {feat.duration}
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: 'var(--bg2)' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Zap size={12} /> How it Works
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                Four steps to zero friction
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <motion.div className="relative p-6 rounded-2xl text-center h-full"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg3)' }}
                  whileHover={{ y: -6, boxShadow: `0 16px 48px ${BLUE}10` }} transition={{ duration: 0.3 }}>
                  <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-lg font-black"
                    style={{ fontFamily: 'Outfit', background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}
                    whileHover={{ rotate: 5, scale: 1.1 }}>
                    {step.num}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{step.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PAYMENT / SUBSCRIPTION ═══════ */}
      <section id="pricing" className="py-20 sm:py-28 px-4" style={{ background: 'var(--bg3)' }}>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <motion.div className="relative rounded-2xl p-8 sm:p-10 text-center overflow-hidden"
              style={{ border: `1.5px solid ${BLUE}15`, background: `linear-gradient(135deg, ${BLUE}04, ${BLUE}01)` }}
              whileHover={{ boxShadow: `0 12px 48px ${BLUE}10` }}>
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 30% 20%, ${BLUE}06 0%, transparent 60%)` }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-5"
                  style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                  <CreditCard size={12} /> Subscription
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                  Start using PayFlow today
                </h2>
                <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
                  Pay once and get full access to all features — no tiers, no hidden fees.
                </p>
                <div className="flex items-baseline justify-center gap-1 mb-8">
                  <span className="text-5xl font-black" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>$49</span>
                  <span className="text-base" style={{ color: 'var(--muted)' }}>/one-time</span>
                </div>
                <Link to="/">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="primary" size="lg" className="min-w-[240px]" style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})`, boxShadow: `0 4px 20px ${BLUE}30` }}>
                      Pay & Get Access <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <p className="text-xs mt-4 font-mono" style={{ color: 'var(--muted)' }}>
                  Instant access · No recurring charges · Full features
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>





      {/* ═══════ CTA ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: 'var(--bg1)' }}>
        <Reveal>
          <motion.div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden text-center"
            style={{ border: `1px solid ${BLUE}15` }}
            whileHover={{ boxShadow: `0 24px 80px ${BLUE}15` }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BLUE}10, ${BLUE_LIGHT}08, ${BLUE}06)` }} />
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(${BLUE}05 1px, transparent 1px), linear-gradient(90deg, ${BLUE}05 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="relative px-8 py-20 sm:py-24">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="mb-4">
                <Rocket size={36} style={{ color: BLUE, margin: '0 auto' }} />
              </motion.div>
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: BLUE }}>Start Building</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>
                Ready to Simplify<br />Payment Reconciliation?
              </h2>
              <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
                Join 500+ fintech teams automating their reconciliation with AI-powered matching.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Link to="/">
                    <Button variant="primary" size="lg" className="min-w-[220px]">Go to Dashboard <ArrowRight size={16} className="ml-2" /></Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="min-w-[220px]">Book a Demo</Button>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </section>



      {/* ═══════ VIDEO MODAL ═══════ */}
      {videoModal && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setVideoModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#0c1b3a' }}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: '#111d35' }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>payflow-demo.com</span>
              <button onClick={() => setVideoModal(null)} className="text-white/60 hover:text-white transition-colors text-lg leading-none">&times;</button>
            </div>
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoModal.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#111d35' }}>
              <div>
                <h4 className="text-white font-bold text-sm">{videoModal.title}</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Feature walkthrough &middot; {videoModal.duration}</p>
              </div>
              <motion.button
                onClick={() => setVideoModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ background: BLUE }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════ INTERACTIVE DEMO WALKTHROUGH ═══════ */}
      <DemoWalkthrough isOpen={demoOpen} onClose={() => setDemoOpen(false)} initialStep={demoStep} />

      <Footer />
    </div>
  )
}

export default LandingPageContent
