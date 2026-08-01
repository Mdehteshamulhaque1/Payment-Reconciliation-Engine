import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, CheckCircle, ArrowRight, Mail, Phone, MapPin, Clock,
  Github, Linkedin, Twitter, Shield, Lock, Activity,
  Globe, Server,
} from 'lucide-react'

const productLinks = [
  { label: 'Dashboard', to: '/' }, { label: 'Transactions', to: '/transactions' },
  { label: 'AI Matching', to: '/reconciliation' }, { label: 'Reconciliation', to: '/reconciliation' },
  { label: 'Analytics', to: '/reports' }, { label: 'Reports', to: '/reports' },
  { label: 'Integrations', to: '/gateways' }, { label: 'Pricing', to: '/pricing' },
]

const companyLinks = [
  { label: 'About', to: '/about' }, { label: 'Customers', to: '/about' },
  { label: 'Blog', to: '/about' }, { label: 'Careers', to: '/about' },
]

const resourceLinks = [
  { label: 'Documentation', to: '/docs' }, { label: 'API Reference', to: '/api-docs' },
  { label: 'Security', to: '/docs' }, { label: 'Support', to: '/contact' },
]

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

const trustItems = [
  { icon: Shield, label: 'SOC 2 Ready' },
  { icon: Lock, label: 'AES-256' },
  { icon: Server, label: '99.99% Uptime' },
  { icon: Globe, label: 'Global' },
]

function NavColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-micro-cap text-[var(--ink-mute)] uppercase tracking-[0.1px] mb-4">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-caption text-[var(--ink-mute)] hover:text-[var(--primary)] transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
    <footer className="border-t border-[var(--hairline)]" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-16 border-b border-[var(--hairline)]">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--primary)]">
                <span className="text-[10px] font-semibold text-white">P</span>
              </div>
              <span className="text-sm font-light text-[var(--ink)]">PayFlow</span>
            </Link>
            <p className="text-caption text-[var(--ink-mute)] leading-relaxed mb-5 max-w-xs">
              AI-powered payment reconciliation infrastructure built for modern fintech teams.
            </p>
            <div className="flex flex-wrap gap-2">
              {[Zap, CheckCircle, Activity, Shield].map((Icon, i) => (
                <span key={i} className="pill-tag text-[9px]">
                  <Icon size={9} />
                  {['AI', 'Recon', 'Rules', 'Fraud'][i]}
                </span>
              ))}
            </div>
          </div>
          <NavColumn title="Product" links={productLinks} />
          <NavColumn title="Company" links={companyLinks} />
          <NavColumn title="Resources" links={resourceLinks} />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-8 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href}
                className="flex items-center justify-center w-8 h-8 rounded-sm border transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                style={{ borderColor: 'var(--hairline)', color: 'var(--ink-mute)' }}
                title={social.label}>
                <social.icon size={13} />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {trustItems.map((item) => (
              <span key={item.label} className="pill-tag text-[9px]">
                <item.icon size={9} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-caption text-[var(--ink-mute)]">&copy; 2026 PayFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-caption text-[var(--ink-mute)]">Built for fintech teams</p>
            <span className="text-caption text-[var(--ink-mute)]">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
