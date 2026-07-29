import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Message sent! We\'ll get back to you soon.')
    }, 1200)
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>Get in Touch</h1>
          <p className="mt-3 text-sm text-[var(--muted)] max-w-xl mx-auto">
            Have questions about payment reconciliation or enterprise solutions? Our team is here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Office</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Noida Sector 16<br />
                Noida, Uttar Pradesh<br />
                India
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Email</h3>
              <a href="mailto:ehteshamulhaque736@gmail.com" className="text-sm text-[var(--accent-cyan)] hover:underline">
                ehteshamulhaque736@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Phone</h3>
              <p className="text-sm text-[var(--muted)]">+91-XXXXXXXXXX</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Business Hours</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Monday – Friday<br />
                9:00 AM – 6:00 PM IST
              </p>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="text-sm">Schedule a Demo</Button>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="p-10 rounded-2xl border border-green-500/20 bg-green-500/5 text-center">
                <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500" />
                <h3 className="text-lg font-bold text-[var(--text)] mb-1">Message Sent!</h3>
                <p className="text-sm text-[var(--muted)] mb-5">We'll get back to you soon.</p>
                <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' }) }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-[var(--text)] mb-4">Send us a message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Company Name</label>
                    <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Subject *</label>
                  <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30" />
                </div>

                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Message *</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-transparent text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30 resize-none" />
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full text-sm">
                  <Send size={13} className="mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
