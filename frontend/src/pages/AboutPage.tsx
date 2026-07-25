import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Users, Shield, Zap, Globe, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const values = [
  { icon: Target, title: 'Precision First', desc: 'We believe reconciliation should be exact, not approximate. Our AI engine targets 99.7% match accuracy because every transaction counts.' },
  { icon: Users, title: 'Built for Teams', desc: 'Finance, engineering, and ops — we build for every stakeholder in the reconciliation workflow. Collaboration is at our core.' },
  { icon: Shield, title: 'Security by Design', desc: 'Bank-grade security isn\'t an afterthought. SOC2 compliance, encryption at rest and in transit, and full audit trails come standard.' },
  { icon: Zap, title: 'Speed Matters', desc: 'Reconciliation that took hours now takes seconds. We optimize relentlessly so your team can focus on strategic work.' },
  { icon: Globe, title: 'Global Scale', desc: '50+ currencies, 12+ gateways, and growing. We\'re built for businesses that operate across borders.' },
  { icon: Heart, title: 'Customer Obsessed', desc: 'Every feature starts with a customer problem. We listen, iterate, and deliver tools that solve real pain points.' },
]

const milestones = [
  { year: '2022', title: 'Founded', desc: 'Started in San Francisco with a simple idea: reconciliation shouldn\'t be painful.' },
  { year: '2023', title: 'Seed Round', desc: 'Raised $4.2M from top fintech investors to build the reconciliation engine of the future.' },
  { year: '2024', title: 'Series A', desc: 'Raised $18M. Launched AI-powered matching, multi-currency support, and 8+ gateway integrations.' },
  { year: '2025', title: '100+ Customers', desc: 'Reached 100+ fintech teams processing $2B+ in monthly transaction volume.' },
  { year: '2026', title: 'Global Expansion', desc: 'Expanded to 12+ gateways, launched enterprise features, and hit 500+ teams worldwide.' },
]

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-founder', bio: 'Previously VP Engineering at Stripe. 15 years in fintech.' },
  { name: 'Marcus Williams', role: 'CTO & Co-founder', bio: 'Former ML lead at Google. PhD in Computer Science from Stanford.' },
  { name: 'Priya Patel', role: 'Head of Product', bio: 'Ex-Product Director at Square. Passionate about developer tools.' },
  { name: 'James Rodriguez', role: 'Head of Engineering', bio: '10 years building distributed systems. Previously at Netflix.' },
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">About PayFlow</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-black text-[var(--text)] tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Reimagining payment reconciliation
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            We started PayFlow because we believe financial operations teams deserve better tools.
            Manual reconciliation is broken — we're fixing it with AI and automation.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-[color-mix(in_srgb,var(--surface)_30%,transparent)]">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '$2B+', label: 'Monthly Transaction Volume', desc: 'Processed through our platform' },
              { value: '500+', label: 'Fintech Teams', desc: 'Trust PayFlow for reconciliation' },
              { value: '99.7%', label: 'Match Accuracy', desc: 'Industry-leading precision' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-black text-[var(--accent-cyan)]" style={{ fontFamily: 'Outfit' }}>{stat.value}</div>
                <div className="text-sm font-bold text-[var(--text)] mt-1">{stat.label}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-3">Our Values</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
              What drives us
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--primary))] flex items-center justify-center mb-4">
                  <val.icon size={18} className="text-[var(--accent-cyan)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">{val.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-[color-mix(in_srgb,var(--surface)_30%,transparent)]">
        <div className="mx-auto max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-3">Our Journey</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
              From idea to industry leader
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-cyan)]/20 via-[var(--accent-cyan)]/10 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 pl-2"
                >
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--surface))] border border-[color-mix(in_srgb,var(--accent-cyan)_20%,var(--border))] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold font-mono text-[var(--accent-cyan)]">{m.year.slice(2)}</span>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[var(--accent-cyan)]">{m.year}</span>
                      <span className="text-sm font-bold text-[var(--text)]">{m.title}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-3">Leadership</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
              Meet the team
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)] mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold" style={{ fontFamily: 'Outfit' }}>
                  {person.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-sm font-bold text-[var(--text)]">{person.name}</h3>
                <p className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider mt-0.5 mb-2">{person.role}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl p-12 rounded-3xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_8%,var(--surface))] to-[color-mix(in_srgb,var(--accent-cyan)_5%,var(--surface))] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-cyan)_0%,transparent_60%)] opacity-[0.06]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text)] mb-4" style={{ fontFamily: 'Outfit' }}>
              Join our mission
            </h2>
            <p className="text-[var(--muted)] mb-8 max-w-lg mx-auto">
              We're hiring across engineering, product, and go-to-market. Help us build the future of financial operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  Try PayFlow Free <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
