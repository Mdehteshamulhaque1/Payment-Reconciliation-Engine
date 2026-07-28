import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight, Zap, Shield, BarChart3, Layers, Workflow, Globe,
  CheckCircle2, Star, TrendingUp, Clock, Users, CreditCard,
  GitBranch, Mail, Phone, Send, Calendar,
  CheckCircle, Github, Linkedin, Twitter, Newspaper, MapPin, ChevronDown,
  Sparkles, Target, Play, ArrowDown, Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DemoWalkthrough } from '@/components/demo/DemoWalkthrough'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

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

const testimonials = [
  { name: 'Priya Sharma', role: 'Head of Finance, NeoBank', text: 'Cut our reconciliation time from 6 hours to 12 minutes. The AI matching is incredibly accurate.', rating: 5, avatar: 'PS' },
  { name: 'Alex Chen', role: 'CTO, PayGateway', text: 'Finally a reconciliation tool that handles multi-currency properly. Game changer for our ops team.', rating: 5, avatar: 'AC' },
  { name: 'Maria Santos', role: 'VP Finance, CryptoFlow', text: 'The real-time dashboard gives us instant visibility across 8 payment gateways. Incredible product.', rating: 5, avatar: 'MS' },
  { name: 'James Wilson', role: 'CEO, TradeHub', text: 'We replaced three separate tools with PayFlow. The ROI was visible within the first month.', rating: 5, avatar: 'JW' },
  { name: 'Sarah Kim', role: 'Finance Director, ShopEase', text: 'The fraud detection module caught suspicious transactions we completely missed before.', rating: 5, avatar: 'SK' },
  { name: 'David Patel', role: 'CTO, WalletPay', text: 'Integration took less than a day. The API documentation is crystal clear and SDKs are well maintained.', rating: 5, avatar: 'DP' },
]

const pricingPlans = [
  { name: 'Starter', desc: 'For small businesses', monthly: 49, yearly: 39, features: ['2 Payment Gateways', '10,000 Transactions/mo', 'Basic Reconciliation', 'Email Support', 'Standard Reports', 'Single User'], cta: 'Start Free Trial', popular: false },
  { name: 'Professional', desc: 'For growing businesses', monthly: 149, yearly: 119, features: ['5 Payment Gateways', '100,000 Transactions/mo', 'AI-Powered Matching', 'Priority Support', 'Advanced Analytics', '5 Team Members', 'Fraud Detection', 'API Access'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', desc: 'For large-scale operations', monthly: 499, yearly: 399, features: ['Unlimited Gateways', 'Unlimited Transactions', 'Custom AI Models', '24/7 Dedicated Support', 'White-Label Reports', 'Unlimited Users', 'Advanced Fraud Suite', 'Custom Integrations', 'SLA Guarantee', 'On-Premise Option'], cta: 'Contact Sales', popular: false },
]

const faqs = [
  { q: 'How long does it take to set up PayFlow?', a: 'Most customers are up and running within 15 minutes. Simply connect your payment gateways using our OAuth flow, and our system will automatically start importing and matching transactions.' },
  { q: 'What payment gateways do you support?', a: 'We support 12+ major payment gateways including Stripe, PayPal, Razorpay, PayU, CCAvenue, PhonePe, GPay, Worldpay, Adyen, Square, Braintree, and Checkout.com.' },
  { q: 'How accurate is the AI matching engine?', a: 'Our AI matching engine achieves 99.7% accuracy out of the box. It uses machine learning trained on millions of transactions to handle even the most complex matching scenarios.' },
  { q: 'Is my financial data secure?', a: 'Absolutely. We are SOC2 compliant with end-to-end encryption, role-based access control, and complete audit trails. Your data is encrypted at rest and in transit using AES-256 and TLS 1.3.' },
  { q: 'Can I try PayFlow before purchasing?', a: 'Yes! We offer a 14-day free trial with full access to all features in your selected plan. No credit card required to start.' },
  { q: 'Do you offer custom integrations?', a: 'Yes, our Enterprise plan includes custom integrations. We can connect to any payment gateway or banking system using our flexible API and webhook system.' },
]

const contactCards = [
  { icon: MapPin, title: 'Office', lines: ['Noida Sector 16', 'Noida, Uttar Pradesh', 'India'] },
  { icon: Mail, title: 'Email', lines: ['ehteshamulhaque736@gmail.com'] },
  { icon: Phone, title: 'Phone', lines: ['+91-XXXXXXXXXX'] },
  { icon: Clock, title: 'Business Hours', lines: ['Monday – Friday', '9:00 AM – 6:00 PM IST'] },
]

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:ehteshamulhaque736@gmail.com' },
]

const quickLinks = {
  Product: [
    { label: 'Features', to: '/home#features' }, { label: 'Pricing', to: '/pricing' }, { label: 'Dashboard', to: '/' },
    { label: 'Reconciliation', to: '/reconciliation' }, { label: 'Fraud Detection', to: '/fraud' }, { label: 'Reports', to: '/reports' },
  ],
  Resources: [
    { label: 'Documentation', to: '/docs' }, { label: 'API Reference', to: '/api-docs' }, { label: 'GitHub', to: '#' },
    { label: 'Blog', to: '/about' }, { label: 'Changelog', to: '#' },
  ],
  Company: [
    { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }, { label: 'Careers', to: '/about' },
    { label: 'Privacy Policy', to: '#' }, { label: 'Terms & Conditions', to: '#' },
  ],
}

const techStack = ['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'Prometheus', 'Grafana']

/* ═══════════ COMPONENTS ═══════════ */

interface FloatingInputProps {
  label: string; type?: string; required?: boolean; value: string
  onChange: (val: string) => void; isTextarea?: boolean; rows?: number
}

function FloatingInput({ label, type = 'text', required, value, onChange, isTextarea, rows = 4 }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0
  const isActive = focused || hasValue
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '24px 16px 8px', borderRadius: '12px', fontSize: '14px',
    outline: 'none', transition: 'all 0.3s ease', color: '#0c1b3a',
    background: '#ffffff', border: focused ? `2px solid ${BLUE}` : '1.5px solid rgba(30,64,175,0.12)',
    boxShadow: focused ? `0 0 0 3px ${BLUE}18, 0 2px 8px rgba(30,64,175,0.08)` : '0 1px 3px rgba(30,64,175,0.05)',
  }
  return (
    <div style={{ position: 'relative' }}>
      {isTextarea ? (
        <textarea required={required} rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...inputStyle, resize: 'none' }} />
      ) : (
        <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle} />
      )}
      <label style={{
        position: 'absolute', left: '16px', transition: 'all 0.3s', pointerEvents: 'none',
        fontFamily: 'JetBrains Mono, monospace', top: isActive ? '8px' : '50%',
        fontSize: isActive ? '10px' : '14px', textTransform: isActive ? 'uppercase' as const : undefined,
        letterSpacing: isActive ? '0.1em' : undefined, color: isActive ? BLUE : '#94a3b8',
        transform: isActive ? 'none' : 'translateY(-50%)',
      }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: '#ffffff' }}
      whileHover={{ boxShadow: `0 4px 20px ${BLUE}12` }} layout>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left" style={{ color: '#0c1b3a' }}>
        <span className="text-base font-semibold pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} style={{ color: BLUE }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: '#4a6fa5' }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ═══════════ MAIN ═══════════ */

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '', phone: '', subject: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>({})
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [videoModal, setVideoModal] = useState<{ title: string; videoId: string; duration: string } | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

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
    <div style={{ background: '#e8f0fe' }}>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #e8f0fe 60%, #f0f5ff 100%)' }}>
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
                <span style={{ color: '#0c1b3a' }}>Reconcile</span>{' '}
                <motion.span className="inline-block"
                  style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT}, ${BLUE})`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  Every Transaction
                </motion.span>{' '}
                <br />
                <span style={{ color: '#0c1b3a' }}>Automatically</span>
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
              <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#4a6fa5' }}>
                Automate payment reconciliation across 12+ gateways with AI-powered matching.
                Detect fraud, track settlements, and close books 10x faster.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Link to="/signup">
                    <Button variant="primary" size="lg" className="min-w-[200px]" style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})`, boxShadow: `0 4px 20px ${BLUE}40`, fontWeight: 700 }}>Start Free Trial <ArrowRight size={16} className="ml-2" /></Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                    <Button variant="secondary" size="lg" className="min-w-[200px]" style={{ borderColor: BLUE, color: BLUE }}
                      onClick={() => { setDemoStep(0); setDemoOpen(true); }}>
                      <Play size={14} className="mr-2" /> Watch Demo
                    </Button>
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text) => (
                  <motion.div key={text} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: '#4a6fa5' }}
                    whileHover={{ scale: 1.05, color: BLUE }}>
                    <CheckCircle2 size={12} className="text-[#057642]" /> {text}
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {['PS', 'AC', 'MS', 'JW', 'SK'].map((a, i) => (
                    <motion.div key={a}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                      style={{ background: `linear-gradient(135deg, ${BLUE_LIGHT}, ${BLUE})`, zIndex: 5 - i }}
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                      {a}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: '#4a6fa5' }}>500+ teams love PayFlow</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#94a3b8' }}>Scroll to explore</span>
            <ArrowDown size={14} style={{ color: BLUE }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ SOCIAL PROOF ═══════ */}
      <section className="py-12" style={{ background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-mono uppercase tracking-widest mb-8" style={{ color: '#94a3b8' }}>
              Trusted by 500+ fintech teams worldwide
            </p>
          </Reveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {gatewayLogos.map((gw, i) => (
              <Reveal key={gw.name} delay={i * 0.04}>
                <motion.div className="flex items-center justify-center h-14 rounded-xl cursor-default overflow-hidden"
                  style={{ border: '1px solid rgba(30,64,175,0.06)', background: '#f0f5ff' }}
                  whileHover={{ y: -3, borderColor: `${gw.color}30`, boxShadow: `0 4px 16px ${gw.color}12`, background: '#ffffff' }}
                  transition={{ duration: 0.2 }}>
                  <gw.Logo />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-20 sm:py-24 px-4" style={{ background: '#e8f0fe' }}>
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <motion.div className="text-center p-8 rounded-2xl"
                style={{ border: '1px solid var(--border)', background: '#ffffff' }}
                whileHover={{ y: -6, boxShadow: `0 12px 40px ${BLUE}12` }} transition={{ duration: 0.3 }}>
                <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${BLUE}0c` }}
                  whileHover={{ rotate: 10, scale: 1.1 }}>
                  <stat.icon size={20} style={{ color: BLUE }} />
                </motion.div>
                <div className="text-4xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: '#94a3b8' }}>{stat.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-20 sm:py-28 px-4" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Target size={12} /> Features
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                Everything you need to reconcile
              </h2>
              <p className="mt-5 max-w-2xl mx-auto text-lg" style={{ color: '#4a6fa5' }}>
                Built for finance teams managing complex multi-channel payment flows.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.08}>
                <motion.div className="group p-7 rounded-2xl cursor-pointer h-full relative overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: '#ffffff' }}
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
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0c1b3a' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a6fa5' }}>{feat.desc}</p>
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
      <section className="py-20 sm:py-28 px-4" style={{ background: '#f0f5ff' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Zap size={12} /> How it Works
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                Four steps to zero friction
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <motion.div className="relative p-6 rounded-2xl text-center h-full"
                  style={{ border: '1px solid var(--border)', background: '#ffffff' }}
                  whileHover={{ y: -6, boxShadow: `0 16px 48px ${BLUE}10` }} transition={{ duration: 0.3 }}>
                  <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-lg font-black"
                    style={{ fontFamily: 'Outfit', background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}
                    whileHover={{ rotate: 5, scale: 1.1 }}>
                    {step.num}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0c1b3a' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a6fa5' }}>{step.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" className="py-20 sm:py-28 px-4" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <CreditCard size={12} /> Pricing
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                Simple, transparent pricing
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-lg" style={{ color: '#4a6fa5' }}>Start free, scale as you grow.</p>
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className="text-sm font-medium" style={{ color: !annual ? '#0c1b3a' : '#94a3b8' }}>Monthly</span>
                <motion.button onClick={() => setAnnual(!annual)} className="relative w-14 h-7 rounded-full"
                  style={{ background: annual ? BLUE : '#cbd5e1' }} whileTap={{ scale: 0.95 }}>
                  <motion.div className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ left: annual ? '32px' : '4px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                </motion.button>
                <span className="text-sm font-medium" style={{ color: annual ? '#0c1b3a' : '#94a3b8' }}>
                  Annual <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#057642' }}>Save 20%</span>
                </span>
              </div>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <motion.div className="relative p-8 rounded-2xl h-full flex flex-col"
                  style={{
                    border: plan.popular ? `2px solid ${BLUE}` : '1px solid var(--border)',
                    background: plan.popular ? `linear-gradient(135deg, ${BLUE}06, ${BLUE}03)` : '#ffffff',
                  }}
                  whileHover={{ y: -6, boxShadow: plan.popular ? `0 20px 60px ${BLUE}18` : `0 12px 40px ${BLUE}08` }}
                  transition={{ duration: 0.3 }}>
                  {plan.popular && (
                    <motion.div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})`, color: 'white' }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                      Most Popular
                    </motion.div>
                  )}
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>{plan.name}</h3>
                  <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{plan.desc}</p>
                  <div className="mt-6 mb-6">
                    <span className="text-5xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>${annual ? plan.yearly : plan.monthly}</span>
                    <span className="text-sm ml-1" style={{ color: '#4a6fa5' }}>/month</span>
                  </div>
                  <Link to={plan.name === 'Enterprise' ? '/contact' : '/signup'} className="block mb-6 no-underline">
                    <Button variant={plan.popular ? 'primary' : 'outline'} size="lg" className="w-full">
                      {plan.cta} <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                  <div className="flex flex-col gap-3 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle2 size={14} className="shrink-0" style={{ color: '#057642' }} />
                        <span className="text-sm" style={{ color: '#0c1b3a' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: '#e8f0fe' }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Star size={12} /> Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                Loved by finance teams
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <motion.div className="p-7 rounded-2xl h-full flex flex-col"
                  style={{ border: '1px solid var(--border)', background: '#ffffff' }}
                  whileHover={{ y: -6, boxShadow: `0 16px 48px ${BLUE}0c` }} transition={{ duration: 0.3 }}>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <motion.div key={s} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + s * 0.05 }}>
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#0c1b3a' }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <motion.div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${BLUE_LIGHT}, ${BLUE})` }}
                      whileHover={{ scale: 1.1 }}>{t.avatar}</motion.div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0c1b3a' }}>{t.name}</p>
                      <p className="text-xs font-mono" style={{ color: '#94a3b8' }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Zap size={12} /> FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Frequently asked questions</h2>
            </div>
          </Reveal>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.06}>
                <FaqItem q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: '#e8f0fe' }}>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>
                Ready to Simplify<br />Payment Reconciliation?
              </h2>
              <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#4a6fa5' }}>
                Join 500+ fintech teams automating their reconciliation with AI-powered matching.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Link to="/signup">
                    <Button variant="primary" size="lg" className="min-w-[220px]">Get Started Free <ArrowRight size={16} className="ml-2" /></Button>
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

      {/* ═══════ CONTACT + FOOTER ═══════ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ border: `1px solid ${BLUE}18`, background: `${BLUE}08`, color: BLUE }}>
                <Mail size={12} /> Contact
              </div>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Get in Touch</h2>
              <p className="mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: '#4a6fa5' }}>
                Have questions about payment reconciliation or enterprise solutions? Our team is here to help.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4">
                <div className="p-8 rounded-2xl flex flex-col gap-5" style={{ border: '1px solid var(--border)', background: '#f0f5ff' }}>
                  {contactCards.map((card) => (
                    <motion.div key={card.title} className="flex items-start gap-4 p-4 rounded-xl"
                      style={{ border: '1px solid rgba(30,64,175,0.04)', background: '#ffffff' }}
                      whileHover={{ x: 4, boxShadow: `0 4px 16px ${BLUE}08` }} transition={{ duration: 0.2 }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}10` }}>
                        <card.icon size={18} style={{ color: BLUE }} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-wider mb-1.5 font-semibold" style={{ color: '#94a3b8' }}>{card.title}</p>
                        {card.lines.map((line, li) => (
                          <p key={li} className="text-sm leading-relaxed" style={{ color: '#0c1b3a' }}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-3 pl-1">
                  {socialLinks.map((s) => (
                    <motion.a key={s.label} href={s.href} className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ border: '1px solid var(--border)', background: '#ffffff', color: '#4a6fa5', textDecoration: 'none' }}
                      whileHover={{ y: -3, color: BLUE, borderColor: `${BLUE}20`, boxShadow: `0 4px 16px ${BLUE}08` }} title={s.label}>
                      <s.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <AnimatePresence mode="wait">
                {contactSubmitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-14 rounded-2xl text-center" style={{ border: '1px solid rgba(5,118,66,0.2)', background: '#f0f5ff' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                      <CheckCircle size={64} className="mx-auto mb-5" style={{ color: '#057642' }} />
                    </motion.div>
                    <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Message Sent!</h3>
                    <p className="mb-8" style={{ color: '#4a6fa5' }}>We'll get back to you within 4 hours.</p>
                    <Button variant="outline" onClick={() => { setContactSubmitted(false); setContactErrors({}); setContactForm({ name: '', company: '', email: '', phone: '', subject: '', message: '' }) }}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" ref={formRef} onSubmit={handleContactSubmit}
                    className="p-9 rounded-2xl" style={{ border: '1px solid var(--border)', background: '#f0f5ff' }}>
                    <h3 className="text-lg font-bold mb-7" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Send us a message</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <FloatingInput label="Full Name" required value={contactForm.name} onChange={(v) => setContactForm({ ...contactForm, name: v })} />
                        {contactErrors.name && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#dc2626' }}>Name is required</p>}
                      </div>
                      <FloatingInput label="Company Name" value={contactForm.company} onChange={(v) => setContactForm({ ...contactForm, company: v })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <FloatingInput label="Email Address" type="email" required value={contactForm.email} onChange={(v) => setContactForm({ ...contactForm, email: v })} />
                        {contactErrors.email && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#dc2626' }}>Valid email is required</p>}
                      </div>
                      <FloatingInput label="Phone Number" type="tel" value={contactForm.phone} onChange={(v) => setContactForm({ ...contactForm, phone: v })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <FloatingInput label="Subject" required value={contactForm.subject} onChange={(v) => setContactForm({ ...contactForm, subject: v })} />
                      {contactErrors.subject && <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace', color: '#dc2626' }}>Subject is required</p>}
                    </div>
                    <div className="mb-7">
                      <FloatingInput label="Message" required isTextarea rows={4} value={contactForm.message} onChange={(v) => setContactForm({ ...contactForm, message: v })} />
                      {contactErrors.message && <p className="text-[11px] mt-1 font-mono" style={{ color: '#dc2626' }}>Message is required</p>}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Button type="submit" variant="primary" size="lg" loading={contactLoading} className="flex-1 min-w-[160px]">
                        <Send size={14} className="mr-2" /> Send Message
                      </Button>
                      <Link to="/contact" className="flex-1 min-w-[160px] no-underline">
                        <Button variant="outline" size="lg" className="w-full"><Calendar size={14} className="mr-2" /> Schedule a Demo</Button>
                      </Link>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>

          <Reveal>
            <div className="mb-16 p-10 rounded-2xl" style={{ border: '1px solid var(--border)', background: '#f0f5ff' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {(Object.entries(quickLinks) as [string, { label: string; to: string }[]][]).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-bold mb-5 uppercase tracking-wide" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>{category}</h4>
                    <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {items.map((item) => (
                        <li key={item.label}>
                          <Link to={item.to} className="text-sm transition-colors hover:text-[var(--primary)]" style={{ color: '#4a6fa5', textDecoration: 'none' }}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-16 text-center">
              <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>Technology Stack</p>
              <h3 className="text-2xl font-extrabold mb-8" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Powered by Modern Technology</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <motion.span key={tech} className="px-5 py-3 rounded-xl text-xs font-mono font-medium cursor-default"
                    style={{ color: '#4a6fa5', border: '1px solid var(--border)', background: '#ffffff' }}
                    whileHover={{ y: -3, color: BLUE, borderColor: `${BLUE}20`, boxShadow: `0 4px 16px ${BLUE}08` }}>
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-16 py-12 px-10 rounded-2xl text-center" style={{ border: '1px solid var(--border)', background: '#f0f5ff' }}>
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Newspaper size={32} className="mx-auto mb-4" style={{ color: BLUE }} />
              </motion.div>
              <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>Stay Updated</h3>
              <p className="text-sm mb-7 max-w-md mx-auto leading-relaxed" style={{ color: '#4a6fa5' }}>
                Receive product updates, release notes, and engineering blogs directly in your inbox.
              </p>
              <AnimatePresence mode="wait">
                {newsletterSubmitted ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2.5 font-semibold text-sm" style={{ color: '#057642' }}>
                    <CheckCircle size={20} /> You're subscribed!
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleNewsletterSubmit} className="flex items-center justify-center gap-3 max-w-md mx-auto flex-wrap">
                    <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 min-w-[220px] px-5 py-3.5 rounded-xl text-sm outline-none transition-all focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
                      style={{ border: '1.5px solid rgba(30,64,175,0.12)', background: '#ffffff', color: '#0c1b3a' }}
                      placeholder="Enter your email" />
                    <Button type="submit" variant="primary" size="md" loading={newsletterLoading}>Subscribe</Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <footer className="py-10" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center gap-2.5">
                <AnimatedLogo size="sm" showText={false} animate={false} />
                <span className="text-lg font-bold" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>PayFlow</span>
              </div>
              <p className="text-xs font-mono" style={{ color: '#94a3b8' }}>&copy; 2026 PayFlow Recon Engine. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
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
              <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>payflow-demo.com</span>
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
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Feature walkthrough &middot; {videoModal.duration}</p>
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
    </div>
  )
}
