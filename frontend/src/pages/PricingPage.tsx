import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, X, ArrowRight, Sparkles, Zap, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    desc: 'Perfect for small teams getting started with reconciliation.',
    icon: Zap,
    highlight: false,
    features: [
      { text: 'Up to 5,000 transactions/month', included: true },
      { text: '3 payment gateways', included: true },
      { text: 'Basic AI matching', included: true },
      { text: 'Email support', included: true },
      { text: '7-day data retention', included: true },
      { text: 'Custom rules engine', included: false },
      { text: 'API access', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    desc: 'For growing teams that need power and flexibility.',
    icon: Sparkles,
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: 'Up to 50,000 transactions/month', included: true },
      { text: '8 payment gateways', included: true },
      { text: 'Advanced AI matching (99.7%)', included: true },
      { text: 'Priority email + chat support', included: true },
      { text: '90-day data retention', included: true },
      { text: 'Custom rules engine', included: true },
      { text: 'Full API access', included: true },
      { text: 'Multi-currency (20 currencies)', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations with complex reconciliation needs.',
    icon: Building2,
    highlight: false,
    features: [
      { text: 'Unlimited transactions', included: true },
      { text: 'All 12+ gateways', included: true },
      { text: 'Custom ML model training', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Unlimited data retention', included: true },
      { text: 'Custom rules engine', included: true },
      { text: 'Full API + webhooks', included: true },
      { text: 'On-premise deployment option', included: true },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function PricingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">Pricing</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-[var(--text)] tracking-tight"
            style={{ fontFamily: 'Outfit' }}
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-[var(--muted)] max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 px-4">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlight
                  ? 'border-[color-mix(in_srgb,var(--accent-cyan)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent-cyan)_4%,var(--surface))] shadow-[0_0_40px_-12px_var(--accent-cyan)] scale-[1.02]'
                  : 'border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_40%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white text-[10px] font-bold uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--primary))] flex items-center justify-center">
                  <plan.icon size={18} className="text-[var(--accent-cyan)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>{plan.price}</span>
                {plan.period && <span className="text-sm text-[var(--muted)] font-mono">{plan.period}</span>}
              </div>

              <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">{plan.desc}</p>

              <Link to="/signup">
                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full mb-6"
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'} <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((feat) => (
                  <div key={feat.text} className="flex items-start gap-2.5">
                    {feat.included ? (
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X size={16} className="text-[var(--muted)] opacity-40 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feat.included ? 'text-[var(--text)]' : 'text-[var(--muted)] opacity-50'}`}>
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[color-mix(in_srgb,var(--surface)_30%,transparent)]">
        <div className="mx-auto max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Can I try before I buy?', a: 'Yes! Every plan comes with a 14-day free trial. No credit card required.' },
              { q: 'What happens if I exceed my transaction limit?', a: 'We\'ll notify you at 80% usage. You can upgrade anytime — we won\'t cut off your service.' },
              { q: 'Do you support my payment gateway?', a: 'We support 12+ major gateways including Stripe, PayPal, Razorpay, PayU, and more. Contact us for custom integrations.' },
              { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.' },
              { q: 'Is my data secure?', a: 'Yes. We\'re SOC2 compliant with end-to-end encryption, role-based access, and full audit trails.' },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]"
              >
                <h4 className="text-sm font-bold text-[var(--text)] mb-2">{faq.q}</h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
