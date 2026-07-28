import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Smartphone, Globe, CheckCircle2, Loader2, Shield, Lock, Zap, Building2, QrCode, Copy, ExternalLink } from 'lucide-react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/Button'
import { useTrialCheckout } from '@/hooks/useCheckout'
import { showToast } from '@/components/effects/Toast'

const UPI_ID = '6200563841@ptaxis'
const UPI_PAYLOAD = `upi://pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR&tn=Free Trial Activation`

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  plan: string
  planIcon?: typeof Zap
}

type Tab = 'qr' | 'card' | 'upi' | 'international'

const upiApps = [
  { id: 'gpay', name: 'Google Pay', color: '#4285F4', uri: `tez://upi/pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
  { id: 'phonepe', name: 'PhonePe', color: '#5F259F', uri: `phonepe://pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2', uri: `paytmmp://pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
  { id: 'bhim', name: 'BHIM', color: '#097969', uri: `bhim://upi/pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
  { id: 'amazonpay', name: 'Amazon Pay', color: '#FF9900', uri: `amazonpay://upi/pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
  { id: 'cred', name: 'CRED', color: '#000000', uri: `cred://upi/pay?pa=${UPI_ID}&pn=PayFlow&am=1.00&cu=INR` },
]

const internationalGateways = [
  { id: 'stripe', name: 'Stripe', color: '#635BFF', icon: 'St' },
  { id: 'paypal', name: 'PayPal', color: '#003087', icon: 'PP' },
  { id: 'square', name: 'Square', color: '#4A90D9', icon: 'Sq' },
]

function QrCanvas({ data, size = 180 }: { data: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, { width: size, margin: 2, color: { dark: '#0a0a0f', light: '#ffffff' } })
    }
  }, [data, size])
  return (
    <div className="flex items-center justify-center p-4 rounded-2xl bg-white">
      <canvas ref={canvasRef} width={size} height={size} className="rounded-xl" />
    </div>
  )
}

export default function CheckoutModal({ open, onClose, plan, planIcon: PlanIcon }: CheckoutModalProps) {
  const [tab, setTab] = useState<Tab>('qr')
  const [step, setStep] = useState<'form' | 'processing' | 'done'>('form')
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null)
  const [selectedInternational, setSelectedInternational] = useState<string | null>(null)

  const trialMutation = useTrialCheckout()

  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [upiId, setUpiId] = useState('')

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const handlePay = useCallback(async (gatewayOverride?: string) => {
    setStep('processing')

    let gateway = gatewayOverride || 'stripe'
    if (!gatewayOverride) {
      if (tab === 'upi') {
        gateway = selectedUpi || 'upi'
      } else if (tab === 'international') {
        gateway = selectedInternational || 'stripe'
      }
    }

    try {
      const result = await trialMutation.mutateAsync({
        plan,
        gateway,
        amount: 1,
        currency: 'INR',
      })
      if (result.success) {
        setStep('done')
        showToast('success', 'Trial activated! Welcome to PayFlow.')
      } else {
        showToast('error', result.message || 'Payment failed')
        setStep('form')
      }
    } catch {
      showToast('error', 'Payment processing failed. Please try again.')
      setStep('form')
    }
  }, [tab, selectedUpi, selectedInternational, plan, trialMutation])

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID)
    showToast('success', 'UPI ID copied!')
  }

  const reset = () => {
    setStep('form')
    setCard({ name: '', number: '', expiry: '', cvv: '' })
    setUpiId('')
    setSelectedUpi(null)
    setSelectedInternational(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const isValid =
    tab === 'card'
      ? card.number.replace(/\s/g, '').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3 && card.name.length > 0
      : tab === 'upi'
        ? (selectedUpi !== null || upiId.includes('@'))
        : tab === 'international'
          ? selectedInternational !== null
          : true

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-40" />

            <div className="relative">
              {step === 'done' ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle2 size={36} className="text-green-500" />
                    </div>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-[var(--text)] mb-2"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Trial Activated!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-[var(--muted)] mb-6"
                  >
                    Your <strong className="text-[var(--text)]">{plan}</strong> plan is active. ₹1.00 payment verified successfully.
                  </motion.p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Button onClick={handleClose} className="w-full">
                      Start Exploring Dashboard
                    </Button>
                  </motion.div>
                </div>
              ) : step === 'processing' ? (
                <div className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center"
                  >
                    <Loader2 size={36} className="text-[var(--accent-cyan)]" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Outfit' }}>Verifying Payment</h2>
                  <p className="text-sm text-[var(--muted)]">Please wait while we confirm your ₹1.00 payment...</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--primary))]">
                        {PlanIcon ? <PlanIcon size={18} className="text-[var(--accent-cyan)]" /> : <Zap size={18} className="text-[var(--accent-cyan)]" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>Activate {plan}</h2>
                        <p className="text-xs text-[var(--muted)]">Pay ₹1 to start your free trial</p>
                      </div>
                    </div>
                    <button onClick={handleClose} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="px-6">
                    <div className="flex rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--bg3)_40%,transparent)] p-1 gap-1 mb-6">
                      {([
                        { id: 'qr' as Tab, label: 'QR Code', icon: QrCode },
                        { id: 'upi' as Tab, label: 'UPI', icon: Smartphone },
                        { id: 'card' as Tab, label: 'Card', icon: CreditCard },
                        { id: 'international' as Tab, label: 'Global', icon: Globe },
                      ]).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTab(t.id)}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-mono uppercase tracking-wide transition-all ${
                            tab === t.id
                              ? 'bg-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--bg2))] text-[var(--accent-cyan)] shadow-sm'
                              : 'text-[var(--muted)] hover:text-[var(--text)]'
                          }`}
                        >
                          <t.icon size={12} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="px-6 pb-6 max-h-[55vh] overflow-y-auto">
                    {tab === 'qr' && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                      >
                        <div className="text-center">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">Scan with any UPI app</p>
                          <QrCanvas data={UPI_PAYLOAD} size={190} />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-4 text-center">
                          <p className="text-[10px] font-mono text-[var(--muted)] mb-1">Or send ₹1 to this UPI ID</p>
                          <div className="flex items-center justify-center gap-2">
                            <code className="text-sm font-bold font-mono text-[var(--text)]">{UPI_ID}</code>
                            <button onClick={copyUpiId} className="rounded-lg p-1.5 hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-mono text-center text-[var(--muted)]">After sending ₹1, click below to activate</p>
                          <Button
                            onClick={() => handlePay('upi')}
                            className="w-full border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                            size="lg"
                          >
                            <CheckCircle2 size={16} className="mr-2" />
                            I've Paid — Activate Trial
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {tab === 'upi' && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--accent-cyan)_4%,transparent)] p-4 text-center">
                          <p className="text-[10px] font-mono text-[var(--muted)] mb-1">Pay to</p>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <code className="text-base font-bold font-mono text-[var(--accent-cyan)]">{UPI_ID}</code>
                            <button onClick={copyUpiId} className="rounded-lg p-1.5 hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">
                              <Copy size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] font-mono text-[var(--muted)]">₹1.00</p>
                        </div>

                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] text-center">Open in your UPI app</p>
                        <div className="grid grid-cols-3 gap-2">
                          {upiApps.map((app) => (
                            <a
                              key={app.id}
                              href={app.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                                selectedUpi === app.id
                                  ? 'border-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                                  : 'border-border bg-card hover:border-[var(--muted)]'
                              }`}
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: app.color }}>
                                {app.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-[9px] font-mono text-center text-[var(--text)]">{app.name}</span>
                            </a>
                          ))}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                          <div className="relative flex justify-center text-[10px]">
                            <span className="bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] px-2 text-[var(--muted)] font-mono">OR</span>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Enter UPI ID manually</label>
                          <div className="flex gap-2">
                            <input
                              value={upiId}
                              onChange={(e) => { setUpiId(e.target.value); setSelectedUpi(null) }}
                              placeholder="username@upi"
                              className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary font-mono"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => handlePay('upi')}
                          disabled={!selectedUpi && !upiId.includes('@')}
                          className="w-full border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                          size="lg"
                        >
                          <Lock size={14} className="mr-2" />
                          Pay ₹1.00 via UPI
                        </Button>
                      </motion.div>
                    )}

                    {tab === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Cardholder Name</label>
                          <input
                            value={card.name}
                            onChange={(e) => setCard({ ...card, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Card Number</label>
                          <input
                            value={card.number}
                            onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                            placeholder="1234 5678 9012 3456"
                            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary font-mono tracking-wider"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">Expiry</label>
                            <input
                              value={card.expiry}
                              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                              placeholder="MM/YY"
                              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary font-mono"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] font-mono">CVV</label>
                            <input
                              value={card.cvv}
                              onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                              placeholder="123"
                              type="password"
                              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary font-mono"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePay('razorpay')}
                          disabled={!isValid}
                          className="w-full border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                          size="lg"
                        >
                          <Lock size={14} className="mr-2" />
                          Pay ₹1.00 — Card
                        </Button>
                      </motion.div>
                    )}

                    {tab === 'international' && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] text-center">Choose payment method</p>
                        {internationalGateways.map((gw) => (
                          <button
                            key={gw.id}
                            onClick={() => setSelectedInternational(gw.id)}
                            className={`flex items-center gap-4 w-full rounded-xl border p-4 transition-all ${
                              selectedInternational === gw.id
                                ? 'border-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                                : 'border-border bg-card hover:border-[var(--muted)]'
                            }`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full text-white text-xs font-bold" style={{ backgroundColor: gw.color }}>
                              {gw.icon}
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-sm font-medium text-[var(--text)]">{gw.name}</p>
                              <p className="text-[10px] text-[var(--muted)] font-mono">Pay with {gw.name}</p>
                            </div>
                            {selectedInternational === gw.id && <CheckCircle2 size={18} className="text-[var(--accent-cyan)]" />}
                          </button>
                        ))}
                        <Button
                          onClick={() => handlePay()}
                          disabled={!selectedInternational}
                          className="w-full border-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--primary)] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                          size="lg"
                        >
                          <Lock size={14} className="mr-2" />
                          Pay ₹1.00 with {selectedInternational ? internationalGateways.find(g => g.id === selectedInternational)?.name : 'Selected'}
                        </Button>
                      </motion.div>
                    )}

                    {tab !== 'qr' && (
                      <p className="mt-3 text-center text-[10px] text-[var(--muted)] font-mono flex items-center justify-center gap-1">
                        <Shield size={10} />
                        Secured by 256-bit SSL · No hidden charges
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
