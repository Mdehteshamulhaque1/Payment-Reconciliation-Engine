import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@payflow.dev', href: 'mailto:hello@payflow.dev' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', href: '#' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Office', value: 'San Francisco, CA', href: '#' },
  { icon: Clock, label: 'Response Time', value: '< 4 hours', href: '#' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '', type: 'general' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Message sent successfully! We\'ll get back to you within 4 hours.')
    }, 1500)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">Contact</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-black text-[var(--text)] tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Get in touch
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-[var(--muted)] max-w-xl mx-auto">
            Have questions about PayFlow? Want a personalized demo? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-3xl border border-green-500/20 bg-green-500/5 text-center"
              >
                <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Outfit' }}>Message Sent!</h3>
                <p className="text-[var(--muted)] mb-6">We've received your message and will get back to you within 4 hours.</p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', subject: '', message: '', type: 'general' }) }}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                className="p-8 rounded-3xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_40%,transparent)]"
              >
                <motion.h2 variants={fadeUp} custom={0} className="text-xl font-bold text-[var(--text)] mb-6" style={{ fontFamily: 'Outfit' }}>
                  Send us a message
                </motion.h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <motion.div variants={fadeUp} custom={1}>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
                      placeholder="John Doe"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={2}>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
                      placeholder="john@company.com"
                    />
                  </motion.div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <motion.div variants={fadeUp} custom={3}>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
                      placeholder="Acme Corp"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={4}>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Inquiry Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} custom={5} className="mb-4">
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
                    placeholder="How can we help?"
                  />
                </motion.div>

                <motion.div variants={fadeUp} custom={6} className="mb-6">
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30 resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </motion.div>

                <motion.div variants={fadeUp} custom={7}>
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" loading={loading}>
                    <Send size={14} className="mr-2" />
                    Send Message
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--primary))] flex items-center justify-center flex-shrink-0">
                  <info.icon size={16} className="text-[var(--accent-cyan)]" />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-0.5">{info.label}</p>
                  <p className="text-sm font-medium text-[var(--text)]">{info.value}</p>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_6%,var(--surface))] to-[color-mix(in_srgb,var(--accent-cyan)_4%,var(--surface))]"
            >
              <h3 className="text-sm font-bold text-[var(--text)] mb-2">Enterprise inquiries?</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                Need custom deployment, dedicated support, or SLA guarantees? Our enterprise team is ready.
              </p>
              <Button variant="outline" size="sm" className="w-full">Schedule Enterprise Call</Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
