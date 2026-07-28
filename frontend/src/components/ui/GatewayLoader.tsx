import { motion } from 'framer-motion'

const gatewayLogos: { name: string; color: string; svg: JSX.Element }[] = [
  {
    name: 'Stripe',
    color: '#635BFF',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#635BFF" />
        <path d="M18.5 16.5c0-.83.68-1.15 1.76-1.15 1.57 0 3.53.48 5.1 1.44V11.3A13.7 13.7 0 0020.26 10c-3.18 0-5.32 1.66-5.32 4.45 0 4.31 5.93 3.63 5.93 5.48 0 .92-.79 1.24-1.9 1.24-1.66 0-3.8-.68-5.48-1.6v5.42a14.8 14.8 0 005.48 1.03c3.23 0 5.5-1.6 5.5-4.43-.02-4.66-5.99-3.84-5.99-5.56z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'PayPal',
    color: '#003087',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#003087" />
        <path d="M24.5 11h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.1c.4 0 .8-.3.9-.7l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.7-.8-1.9-1.2-3.5-1.2l.1.2z" fill="#0070E0" />
        <path d="M21.3 15h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.8c.4 0 .7-.3.8-.6l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.6-.8-1.8-1.2-3.4-1.2l-.5 2.3z" fill="#009CDE" />
      </svg>
    ),
  },
  {
    name: 'Razorpay',
    color: '#072654',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#072654" />
        <path d="M12 14h5.5l1.5 5.5h.1l2-5.5h5.2l-4.8 12h-4.8L12 14z" fill="#3395FF" />
        <path d="M20.5 20.5h4l2.5 5.5h-4.2l-.4-1h-2.4l.4 1h.1z" fill="#3395FF" />
        <circle cx="30" cy="20" r="2.5" fill="#00D4AA" />
      </svg>
    ),
  },
  {
    name: 'PayU',
    color: '#353535',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#353535" />
        <text x="6" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="16" fill="white">Pay</text>
        <text x="25" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="16" fill="#FF5722">U</text>
      </svg>
    ),
  },
  {
    name: 'PhonePe',
    color: '#5F259F',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#5F259F" />
        <text x="7" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="15" fill="white">Pe</text>
        <circle cx="30" cy="14" r="3" fill="#00D4AA" />
      </svg>
    ),
  },
  {
    name: 'GPay',
    color: '#1A1A2E',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#1A1A2E" />
        <text x="6" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#4285F4">G</text>
        <text x="18" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#EA4335">P</text>
        <text x="28" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#34A853">ay</text>
      </svg>
    ),
  },
  {
    name: 'Worldpay',
    color: '#0D355E',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#0D355E" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#00B2E3" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="#00B2E3" />
      </svg>
    ),
  },
  {
    name: 'Adyen',
    color: '#0ABF53',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#0ABF53" />
        <path d="M12 28V12l8 16V12" stroke="white" strokeWidth="2.5" strokeLinecap="square" />
        <path d="M24 12h4l-4 16h-4" stroke="white" strokeWidth="2.5" strokeLinecap="square" />
      </svg>
    ),
  },
  {
    name: 'Square',
    color: '#006AFF',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#006AFF" />
        <rect x="11" y="11" width="18" height="18" rx="3" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Braintree',
    color: '#0070D0',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#0070D0" />
        <path d="M14 14h12v4h-8v3h7v4h-7v5h-4V14z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Checkout',
    color: '#00C853',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#00C853" />
        <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="3" fill="white" />
      </svg>
    ),
  },
  {
    name: 'CCAvenue',
    color: '#1A1A6C',
    svg: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
        <rect width="40" height="40" rx="10" fill="#1A1A6C" />
        <text x="6" y="26" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="white">CC</text>
        <text x="22" y="26" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="10" fill="#FFD700">Av</text>
      </svg>
    ),
  },
]

export function GatewayLoader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--bg1)]">
      <div className="relative mb-8">
        {/* Center pulse ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent-cyan)]"
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--primary)]"
          animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />

        {/* Logo ring — 12 logos orbiting */}
        <div className="relative h-64 w-64">
          {gatewayLogos.map((gw, i) => {
            const angle = (i / gatewayLogos.length) * 360
            const radius = 110
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius

            return (
              <motion.div
                key={gw.name}
                className="absolute left-1/2 top-1/2"
                style={{ x: x - 20, y: y - 20 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <motion.div
                  className="h-10 w-10 rounded-xl shadow-lg"
                  style={{ boxShadow: `0 0 20px ${gw.color}44` }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {gw.svg}
                </motion.div>
              </motion.div>
            )
          })}

          {/* Center logo */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--accent-cyan)] bg-[var(--surface)] shadow-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent-violet)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[var(--muted)]">
          Loading payment gateways
        </span>
      </motion.div>
    </div>
  )
}
