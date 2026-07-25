import type { JSX } from 'react'
import { cn } from '@/lib/utils'

interface GatewayLogoProps {
  name: string
  className?: string
  size?: number
}

const logos: Record<string, (size: number) => JSX.Element> = {
  stripe: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#635BFF"/>
      <path d="M18.5 16.5c0-.83.68-1.15 1.76-1.15 1.57 0 3.53.48 5.1 1.44V11.3A13.7 13.7 0 0020.26 10c-3.18 0-5.32 1.66-5.32 4.45 0 4.31 5.93 3.63 5.93 5.48 0 .92-.79 1.24-1.9 1.24-1.66 0-3.8-.68-5.48-1.6v5.42a14.8 14.8 0 005.48 1.03c3.23 0 5.5-1.6 5.5-4.43-.02-4.66-5.99-3.84-5.99-5.56z" fill="white"/>
    </svg>
  ),
  paypal: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#003087"/>
      <path d="M24.5 11h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.1c.4 0 .8-.3.9-.7l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.7-.8-1.9-1.2-3.5-1.2l.1.2z" fill="#0070E0"/>
      <path d="M21.3 15h-4.1c-.5 0-1 .3-1.1.8l-1.6 10.2-.4 2.3c0 .2.1.4.3.4h3.8c.4 0 .7-.3.8-.6l.4-2.5c.1-.4.4-.7.8-.7h.6c3.3 0 5.8-1.7 6.5-4.8.3-1.3.1-2.3-.5-3-.6-.8-1.8-1.2-3.4-1.2l-.5 2.3z" fill="#009CDE"/>
    </svg>
  ),
  razorpay: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#072654"/>
      <path d="M12 14h5.5l1.5 5.5h.1l2-5.5h5.2l-4.8 12h-4.8L12 14z" fill="#3395FF"/>
      <path d="M20.5 20.5h4l2.5 5.5h-4.2l-.4-1h-2.4l.4 1h.1z" fill="#3395FF"/>
      <circle cx="30" cy="20" r="2.5" fill="#00D4AA"/>
    </svg>
  ),
  payu: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#353535"/>
      <text x="6" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="16" fill="white">Pay</text>
      <text x="25" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="16" fill="#FF5722">U</text>
    </svg>
  ),
  ccavenue: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#1A1A6C"/>
      <text x="6" y="26" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="white">CC</text>
      <text x="22" y="26" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="10" fill="#FFD700">Av</text>
    </svg>
  ),
  phonepe: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#5F259F"/>
      <text x="7" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="15" fill="white">Pe</text>
      <circle cx="30" cy="14" r="3" fill="#00D4AA"/>
    </svg>
  ),
  gpay: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#1A1A2E"/>
      <text x="6" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#4285F4">G</text>
      <text x="18" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#EA4335">P</text>
      <text x="28" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#34A853">ay</text>
    </svg>
  ),
  upi: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#097969"/>
      <text x="5" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="15" fill="white">UPI</text>
    </svg>
  ),
  worldpay: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#0D355E"/>
      <circle cx="20" cy="20" r="10" fill="none" stroke="#00B2E3" strokeWidth="2"/>
      <circle cx="20" cy="20" r="5" fill="#00B2E3"/>
    </svg>
  ),
  adyen: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#0ABF53"/>
      <path d="M12 28V12l8 16V12" stroke="white" strokeWidth="2.5" strokeLinecap="square"/>
      <path d="M24 12h4l-4 16h-4" stroke="white" strokeWidth="2.5" strokeLinecap="square"/>
    </svg>
  ),
  square: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#006AFF"/>
      <rect x="11" y="11" width="18" height="18" rx="3" fill="white"/>
    </svg>
  ),
  braintree: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#0070D0"/>
      <path d="M14 14h12v4h-8v3h7v4h-7v5h-4V14z" fill="white"/>
    </svg>
  ),
  checkout: (s) => (
    <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
      <rect width="40" height="40" rx="10" fill="#00C853"/>
      <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="20" cy="20" r="3" fill="white"/>
    </svg>
  ),
}

const fallbackLogo = (s: number) => (
  <svg viewBox="0 0 40 40" width={s} height={s} fill="none">
    <rect width="40" height="40" rx="10" fill="var(--surface)"/>
    <path d="M20 10C14.48 10 10 14.48 10 20s4.48 10 10 10 10-4.48 10-10S25.52 10 20 10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="var(--muted)"/>
    <path d="M20 14v6l4 2" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

function findLogo(name: string): ((size: number) => JSX.Element) | null {
  const lower = name.toLowerCase().replace(/[\s-_]/g, '')
  for (const [key, logo] of Object.entries(logos)) {
    if (lower.includes(key) || key.includes(lower)) return logo
  }
  if (lower.includes('razor')) return logos.razorpay
  if (lower.includes('pay')) return logos.paypal
  if (lower.includes('gpay') || lower.includes('google')) return logos.gpay
  if (lower.includes('phone')) return logos.phonepe
  if (lower.includes('cc')) return logos.ccavenue
  if (lower.includes('upi')) return logos.upi
  return null
}

export function GatewayLogo({ name, className, size = 40 }: GatewayLogoProps) {
  const logo = findLogo(name)
  return (
    <div className={cn('shrink-0 rounded-xl overflow-hidden', className)}>
      {logo ? logo(size) : fallbackLogo(size)}
    </div>
  )
}
