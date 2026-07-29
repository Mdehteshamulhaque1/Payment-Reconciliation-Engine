import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, CheckCircle, ArrowRight, Mail, Phone, MapPin, Clock,
  Github, Linkedin, Twitter, Music, Youtube, Shield, Lock, Activity,
  Globe, Server, Heart, ChevronRight,
} from 'lucide-react'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const linkVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
}

const featureBadges = [
  { label: 'AI Matching', icon: Zap },
  { label: 'Bank Reconciliation', icon: CheckCircle },
  { label: 'Smart Rules', icon: Activity },
  { label: 'Fraud Detection', icon: Shield },
  { label: 'Real-time Analytics', icon: Globe },
]

const productLinks = [
  { label: 'Dashboard', to: '/' }, { label: 'Transactions', to: '/transactions' },
  { label: 'AI Matching', to: '/reconciliation' }, { label: 'Reconciliation', to: '/reconciliation' },
  { label: 'Analytics', to: '/reports' }, { label: 'Reports', to: '/reports' },
  { label: 'Integrations', to: '/gateways' }, { label: 'Pricing', to: '/pricing' },
]

const companyLinks = [
  { label: 'About', to: '/about' }, { label: 'Customers', to: '/about' },
  { label: 'Case Studies', to: '/about' }, { label: 'Blog', to: '/about' },
  { label: 'Careers', to: '/about' }, { label: 'Press', to: '/about' },
  { label: 'Roadmap', to: '#' },
]

const resourceLinks = [
  { label: 'Documentation', to: '/docs' }, { label: 'API Reference', to: '/api-docs' },
  { label: 'Status', to: '#' }, { label: 'Security', to: '/docs' },
  { label: 'Privacy', to: '#' }, { label: 'Terms', to: '#' },
  { label: 'Support', to: '/contact' }, { label: 'FAQ', to: '/docs' },
]

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Music, label: 'Discord', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
]

const trustItems = [
  { icon: Shield, label: 'SOC 2 Ready' },
  { icon: Lock, label: 'AES-256 Encryption' },
  { icon: Activity, label: '99.99% Uptime' },
  { icon: Globe, label: 'Global Infrastructure' },
  { icon: Server, label: 'PCI DSS Inspired' },
  { icon: Activity, label: 'Real-Time Monitoring' },
]

function NavColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <motion.div variants={itemVariants}>
      <h4 className="text-sm font-bold mb-6 uppercase tracking-wider" style={{ color: 'var(--text)', fontFamily: 'Outfit' }}>{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link, i) => (
          <motion.li key={link.label} custom={i} variants={linkVariants} initial="hidden" animate="visible">
            <Link
              to={link.to}
              className="group relative inline-flex items-center gap-1.5 text-sm transition-all"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
            >
              <ChevronRight size={12} className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" style={{ color: 'var(--primary)' }} />
              <span className="relative">
                {link.label}
                <span className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: 'var(--primary)' }} />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterSubmitted(true)
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="relative overflow-hidden"
      style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full" style={{ background: 'color-mix(in srgb, var(--primary) 3%, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: 'color-mix(in srgb, var(--accent-cyan) 3%, transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative mx-auto" style={{ maxWidth: '1400px', padding: '100px 40px 0' }}>
        {/* Main Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20" style={{ borderBottom: '1px solid var(--border)' }}>
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-5">
              <AnimatedLogo size="sm" showText={false} animate={false} />
              <span className="text-xl font-bold" style={{ fontFamily: 'Outfit', color: 'var(--text)' }}>PayFlow</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              AI-powered Payment Reconciliation Infrastructure built for modern fintech teams.
            </p>
            <div className="flex flex-wrap gap-2">
              {featureBadges.map((badge) => (
                <motion.div
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'color-mix(in srgb, var(--primary) 6%, transparent)',
                    color: 'var(--primary)',
                    border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{ y: -2, boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 10%, transparent)' }}
                  transition={{ duration: 0.2 }}
                >
                  <badge.icon size={11} />
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product */}
          <div className="md:col-span-2">
            <NavColumn title="Product" links={productLinks} />
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <NavColumn title="Company" links={companyLinks} />
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <NavColumn title="Resources" links={resourceLinks} />
          </div>

          {/* Contact + Newsletter */}
          <motion.div variants={itemVariants} className="md:col-span-3 space-y-6">
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text)', fontFamily: 'Outfit' }}>Contact</h4>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: 'support@payflow.ai', href: 'mailto:support@payflow.ai' },
                  { icon: Phone, label: '+91 XXXXX XXXXX', href: 'tel:+91XXXXXXXXXX' },
                  { icon: MapPin, label: 'India' },
                  { icon: Clock, label: 'Mon–Fri, 9AM–6PM' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                      <item.icon size={12} style={{ color: 'var(--primary)' }} />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-xs transition-colors hover:underline" style={{ color: 'var(--muted)' }}>{item.label}</a>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl text-center"
              style={{
                background: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
              }}
            >
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'Outfit' }}>Stay Updated</h4>
              <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Get product updates, security releases and AI insights.</p>
              {newsletterSubmitted ? (
                <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>You're subscribed!</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs outline-none transition-all"
                    style={{
                      border: '1.5px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                      background: 'var(--bg3)',
                      color: 'var(--text)',
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-strong))',
                      boxShadow: '0 2px 8px color-mix(in srgb, var(--primary) 20%, transparent)',
                    }}
                  >
                    <ArrowRight size={14} />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Social + Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 py-10"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--muted)',
                }}
                whileHover={{
                  y: -3, color: '#ffffff',
                  borderColor: 'transparent',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-strong))',
                  boxShadow: '0 8px 24px color-mix(in srgb, var(--primary) 20%, transparent)',
                }}
                whileTap={{ scale: 0.9 }}
                title={social.label}
              >
                <social.icon size={15} />
              </motion.a>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {trustItems.map((item) => (
              <motion.div
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                style={{
                  background: 'color-mix(in srgb, var(--primary) 4%, transparent)',
                  color: 'var(--muted)',
                  border: '1px solid color-mix(in srgb, var(--primary) 6%, transparent)',
                }}
                whileHover={{
                  y: -1,
                  background: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                  color: 'var(--primary)',
                }}
              >
                <item.icon size={10} />
                {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          <div className="flex items-center gap-2">
            <span>&copy; 2026 PayFlow</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart size={11} style={{ color: 'var(--accent-neon)' }} />
            <span>Made with love for Modern Fintech Infrastructure</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>v1.0.0</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--muted)' }} />
            <span>Build 2026</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
