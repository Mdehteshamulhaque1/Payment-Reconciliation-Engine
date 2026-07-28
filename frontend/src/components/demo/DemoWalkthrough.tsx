import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipForward, SkipBack, X,
  Zap, Shield, BarChart3, Globe,
  ArrowRightLeft, GitCompareArrows, Wallet, BookOpen,
  FileBarChart, Bell, Settings, Network, AlertTriangle,
  CheckCircle, Clock, TrendingUp, Activity, Eye,
  CreditCard, Search, Download,
  XCircle, Scale,
  Palette, Lock, User, FileText, DollarSign,
  ShieldAlert, Key, Terminal
} from 'lucide-react'

const BLUE = '#1e40af'
const BLUE_LIGHT = '#3b82f6'

interface DemoStep {
  id: number
  section: string
  title: string
  narration: string
  highlight: string
  icon: React.ElementType
  color: string
  mockType: 'dashboard' | 'transactions' | 'gateways' | 'reconciliation' | 'settlements' | 'fraud' | 'ledger' | 'reports' | 'notifications' | 'settings' | 'hero' | 'security' | 'multicurrency'
}

const steps: DemoStep[] = [
  {
    id: 1, section: 'INTRO', title: 'Welcome to PayFlow',
    narration: 'PayFlow is an AI-powered payment reconciliation engine that connects 12+ payment gateways, auto-matches transactions with 99.7% accuracy, detects fraud in real-time, and automates settlement tracking — all from one unified dashboard.',
    highlight: 'Welcome screen with animated logo and key statistics', icon: Activity, color: BLUE, mockType: 'hero'
  },
  {
    id: 2, section: 'CORE', title: 'Command Center Dashboard',
    narration: 'The Command Center gives you a real-time overview of your entire payment ecosystem. Four KPI cards show Total Transactions, Match Rate, Pending Settlements, and Active Fraud Cases. A live transaction feed scrolls in real-time, and gateway health cards show connectivity status for every integrated gateway.',
    highlight: 'KPI cards, live feed, gateway health, system health, top failures', icon: BarChart3, color: BLUE, mockType: 'dashboard'
  },
  {
    id: 3, section: 'CORE', title: 'Transaction Monitoring',
    narration: 'Monitor every transaction across all gateways in one table. Filter by status — Success, Pending, Failed, or Processing. Search by reference ID. Each row shows the transaction reference, amount, status badge, gateway, and date. Click any row to view full details. Action buttons let you Cancel pending transactions, Retry failed ones, or Refund successful ones. Create new transactions directly from the dashboard.',
    highlight: 'Filter tabs, data table, search, row actions, create modal', icon: ArrowRightLeft, color: '#2563eb', mockType: 'transactions'
  },
  {
    id: 4, section: 'CORE', title: 'Payment Gateway Management',
    narration: 'Connect and monitor 12+ payment gateways — Stripe, PayPal, Razorpay, PayU, CCAvenue, PhonePe, GPay, Worldpay, Adyen, Square, Braintree, and Checkout.com. Each gateway card shows real brand logos, connection status, gateway type, and sandbox/production mode. Use the Simulate button to test gateway connectivity with custom amounts and currencies. Response latency is measured in milliseconds.',
    highlight: '12 gateway cards with brand logos, simulate modal, health status', icon: Network, color: '#1d4ed8', mockType: 'gateways'
  },
  {
    id: 5, section: 'OPERATIONS', title: 'Automated Reconciliation',
    narration: 'PayFlow\'s AI-powered reconciliation engine automatically matches gateway transactions against bank statements. Summary cards show Matched, Mismatches, Missing, and Accuracy percentage. Filter by Daily, Weekly, or Monthly reconciliation runs. The confidence score shows AI certainty for each match. Click "Run Reconciliation" to trigger an automated matching cycle. Auto-Match resolves pending items with a single click.',
    highlight: 'Summary stats, filter tabs, confidence scores, run reconciliation', icon: GitCompareArrows, color: '#0ea5e9', mockType: 'reconciliation'
  },
  {
    id: 6, section: 'OPERATIONS', title: 'Settlement Tracking',
    narration: 'Track every settlement from initiation to completion. Summary cards display Total Settled amount, total Settlement count, Pending settlements, and Disputed ones. The table shows settlement ID, amount, status, gateway, processing fee, settlement date, and creation date. Export settlement data as CSV or PDF for accounting.',
    highlight: 'Settlement summary, data table with fees, export buttons', icon: Wallet, color: '#059669', mockType: 'settlements'
  },
  {
    id: 7, section: 'OPERATIONS', title: 'Double-Entry Ledger',
    narration: 'Maintain a complete double-entry accounting ledger. The Trial Balance section shows Total Debits in red, Total Credits in green, and a Balanced/Unbalanced status indicator. Each ledger entry records the account name, entry type (debit or credit), amount, description, reference number, and timestamp. This ensures every transaction has a complete audit trail.',
    highlight: 'Trial balance cards, debit/credit entries, balance status', icon: BookOpen, color: '#7c3aed', mockType: 'ledger'
  },
  {
    id: 8, section: 'INTEL', title: 'Fraud Detection System',
    narration: 'Real-time fraud detection monitors every transaction for suspicious activity. Five stat cards show Total Cases, Critical, High, Medium, and Resolved counts. Filter cases by status — Open, Investigating, Resolved, or Confirmed. Risk scores are color-coded: red for critical (≥80), yellow for high (≥50). Click any case to see full details including fraud type, severity, risk score, and reason. Resolve cases with one click. Live WebSocket notifications alert you to new threats instantly.',
    highlight: 'Alert banner, risk scores, case details, live notifications', icon: ShieldAlert, color: '#dc2626', mockType: 'fraud'
  },
  {
    id: 9, section: 'INTEL', title: 'Reports & Analytics',
    narration: 'Generate comprehensive reports in five formats: Daily Summary, Transaction Detail, Settlement Report, Reconciliation Report, and Fraud Summary. Each report card shows the type, status (completed/failed/generating), and creation date. Download completed reports as PDF with PayFlow branding. Reports include bar charts, pie charts, and detailed data tables.',
    highlight: 'Report types, status badges, download buttons, generation modal', icon: FileBarChart, color: '#ea580c', mockType: 'reports'
  },
  {
    id: 10, section: 'SYSTEM', title: 'Notification Center',
    narration: 'Stay informed with real-time notifications. Each notification is color-coded by type — blue for info, yellow for warning, red for error, green for success. Unread notifications show a pulsing dot indicator. Mark individual notifications as read or use "Mark All Read" to clear everything. Notifications include subject, body text, and relative timestamps.',
    highlight: 'Color-coded notifications, unread indicators, mark as read', icon: Bell, color: '#0891b2', mockType: 'notifications'
  },
  {
    id: 11, section: 'SYSTEM', title: 'Settings & Appearance',
    narration: 'Manage your profile, security, and appearance. The Profile section shows your name, email, and role. Security lets you change your password with current/new/confirm fields. Appearance offers three themes — Light, Dim, and Dark — with live preview boxes. Click any theme to instantly switch the entire UI color scheme.',
    highlight: 'Profile card, password form, theme selector with previews', icon: Settings, color: '#4b5563', mockType: 'settings'
  },
  {
    id: 12, section: 'SECURITY', title: 'Authentication & Access Control',
    narration: 'PayFlow uses JWT-based authentication with secure token refresh. Role-Based Access Control provides three permission levels — Admin with full access, Manager with limited write access, and Viewer with read-only access. Every action is logged in the Audit Trail with user, timestamp, IP address, and resource accessed. API keys can be rotated for secure programmatic access.',
    highlight: 'Login flow, RBAC matrix, audit log, API key management', icon: Shield, color: '#172554', mockType: 'security'
  },
  {
    id: 13, section: 'CURRENCY', title: 'Multi-Currency Support',
    narration: 'Handle 50+ currencies with real-time FX rates. Transactions are displayed in their native currency — USD, EUR, INR, GBP, JPY — with live exchange rates. Automatic conversion reconciliation ensures amounts match across currencies. FX rate sparklines show rate trends over time.',
    highlight: 'Multi-currency table, FX rates, conversion animation', icon: Globe, color: '#0284c7', mockType: 'multicurrency'
  },
  {
    id: 14, section: 'TECH', title: 'Technology Stack',
    narration: 'Built on a modern, scalable stack. Backend: Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery. Frontend: React, TypeScript, Tailwind CSS, Framer Motion, Zustand. Infrastructure: Docker, Prometheus, Grafana. Real-time: WebSockets for live updates across all dashboard components.',
    highlight: 'Tech stack icons, architecture diagram, WebSocket indicator', icon: Terminal, color: '#334155', mockType: 'hero'
  },
]

/* ═══════════ MOCK UI COMPONENTS ═══════════ */

function MockStatCard({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: React.ElementType }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} style={{ color }} />
        <span className="text-[10px] font-medium" style={{ color: '#4a6fa5' }}>{label}</span>
      </div>
      <div className="text-lg font-bold font-mono" style={{ color }}>{value}</div>
    </div>
  )
}

function MockTableRow({ cells, statusColor }: { cells: string[]; statusColor?: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 text-[11px] border-b" style={{ borderColor: '#e2e8f0' }}>
      {cells.map((cell, i) => (
        <span key={i} className={i === 0 ? 'font-mono font-medium' : ''} style={{
          color: i === 1 && statusColor ? statusColor : '#4a6fa5',
          width: i === 0 ? '30%' : i === cells.length - 1 ? '20%' : 'auto',
          flex: i > 0 && i < cells.length - 1 ? 1 : undefined
        }}>
          {cell}
        </span>
      ))}
    </div>
  )
}

function MockBadge({ text, color }: { text: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: `${color}15`, color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {text}
    </span>
  )
}

/* ═══════════ MOCK PAGES ═══════════ */

function HeroMock() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Activity size={28} className="text-white" />
      </motion.div>
      <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Outfit', color: '#0c1b3a' }}>PayFlow</h2>
      <p className="text-sm mb-6" style={{ color: '#4a6fa5' }}>AI-Powered Payment Reconciliation Engine</p>
      <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
        {[
          { label: 'Match Accuracy', value: '99.7%', icon: TrendingUp },
          { label: 'Avg Reconciliation', value: '2s', icon: Zap },
          { label: 'Payment Gateways', value: '12+', icon: CreditCard },
          { label: 'Fintech Teams', value: '500+', icon: User },
        ].map((s) => (
          <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}12` }}>
            <s.icon size={14} className="mx-auto mb-1" style={{ color: BLUE }} />
            <div className="text-sm font-bold font-mono" style={{ color: BLUE }}>{s.value}</div>
            <div className="text-[9px]" style={{ color: '#4a6fa5' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-mono text-green-600">LIVE</span>
        <span className="text-[10px] font-mono text-cyan-600 ml-2">SYS OK</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <MockStatCard label="Transactions" value="$12.4M" color={BLUE} icon={DollarSign} />
        <MockStatCard label="Match Rate" value="99.7%" color="#059669" icon={CheckCircle} />
        <MockStatCard label="Pending" value="23" color="#d97706" icon={Clock} />
        <MockStatCard label="Fraud Cases" value="7" color="#dc2626" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="text-[10px] font-semibold mb-2" style={{ color: '#0c1b3a' }}>Live Transactions</div>
          {['$1,240.00 — Stripe — Success', '$890.50 — PayPal — Processing', '$3,420.00 — Razorpay — Success', '$156.00 — GPay — Pending'].map((t, i) => (
            <motion.div key={i} className="flex items-center gap-2 py-1 text-[10px] border-b" style={{ borderColor: '#e2e8f0' }}
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? '#059669' : i === 2 ? '#059669' : '#d97706' }} />
              <span className="font-mono" style={{ color: '#4a6fa5' }}>{t}</span>
            </motion.div>
          ))}
        </div>
        <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="text-[10px] font-semibold mb-2" style={{ color: '#0c1b3a' }}>Gateway Health</div>
          {['Stripe ✓ 99.9%', 'PayPal ✓ 99.8%', 'Razorpay ✓ 99.7%'].map((g, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 text-[10px] border-b" style={{ borderColor: '#e2e8f0' }}>
              <span style={{ color: '#4a6fa5' }}>{g.split(' ')[0]}</span>
              <span className="font-mono text-green-600">{g.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransactionsMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {['All', 'Success', 'Pending', 'Failed'].map((f, i) => (
            <span key={f} className="px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer" style={{
              background: i === 0 ? BLUE : 'transparent',
              color: i === 0 ? 'white' : '#4a6fa5',
              border: `1px solid ${i === 0 ? BLUE : '#e2e8f0'}`
            }}>{f}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ border: '1px solid #e2e8f0' }}>
          <Search size={10} /> Search...
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '30%' }}>Reference</span><span style={{ flex: 1 }}>Amount</span><span style={{ flex: 1 }}>Status</span><span style={{ flex: 1 }}>Gateway</span><span style={{ width: '20%' }}>Date</span>
        </div>
        {[
          ['TXN-8F2A', '$1,240.00', 'Success', 'Stripe', '2026-07-28'],
          ['TXN-9B3C', '$890.50', 'Pending', 'PayPal', '2026-07-28'],
          ['TXN-7D4E', '$3,420.00', 'Success', 'Razorpay', '2026-07-27'],
          ['TXN-6E5F', '$156.00', 'Failed', 'GPay', '2026-07-27'],
          ['TXN-5A6B', '$2,100.00', 'Success', 'Stripe', '2026-07-26'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} statusColor={
            row[2] === 'Success' ? '#059669' : row[2] === 'Pending' ? '#d97706' : '#dc2626'
          } />
        ))}
      </div>
    </div>
  )
}

function GatewaysMock() {
  const gateways = [
    { name: 'Stripe', color: '#635BFF', active: true }, { name: 'PayPal', color: '#003087', active: true },
    { name: 'Razorpay', color: '#072654', active: true }, { name: 'PhonePe', color: '#5F259F', active: true },
    { name: 'GPay', color: '#4285F4', active: true }, { name: 'Square', color: '#006AFF', active: false },
  ]
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-3 gap-2">
        {gateways.map((gw) => (
          <div key={gw.name} className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: gw.color }}>
                {gw.name[0]}
              </div>
              <div>
                <div className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>{gw.name}</div>
                <MockBadge text={gw.active ? 'Active' : 'Inactive'} color={gw.active ? '#059669' : '#dc2626'} />
              </div>
            </div>
            <div className="text-[9px] mb-1" style={{ color: '#4a6fa5' }}>Mode: Production</div>
            <button className="w-full py-1 rounded-lg text-[10px] font-medium text-white" style={{ background: gw.color }}>
              Simulate
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReconciliationMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-4 gap-2 mb-3">
        <MockStatCard label="Matched" value="1,187" color="#059669" icon={CheckCircle} />
        <MockStatCard label="Mismatches" value="23" color="#d97706" icon={AlertTriangle} />
        <MockStatCard label="Missing" value="7" color="#dc2626" icon={XCircle} />
        <MockStatCard label="Accuracy" value="99.7%" color={BLUE} icon={TrendingUp} />
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '30%' }}>Reference</span><span style={{ flex: 1 }}>Type</span><span style={{ flex: 1 }}>Status</span><span style={{ flex: 1 }}>Confidence</span>
        </div>
        {[
          ['TXN-8F2A', 'Daily', 'Matched', '98.4%'],
          ['TXN-9B3C', 'Daily', 'Pending', '94.2%'],
          ['TXN-7D4E', 'Weekly', 'Matched', '99.1%'],
          ['TXN-6E5F', 'Monthly', 'Mismatch', '45.3%'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} statusColor={
            row[2] === 'Matched' ? '#059669' : row[2] === 'Pending' ? '#d97706' : '#dc2626'
          } />
        ))}
      </div>
    </div>
  )
}

function SettlementsMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-4 gap-2 mb-3">
        <MockStatCard label="Total Settled" value="$847,293" color="#059669" icon={DollarSign} />
        <MockStatCard label="Settlements" value="1,247" color={BLUE} icon={CheckCircle} />
        <MockStatCard label="Pending" value="12" color="#d97706" icon={Clock} />
        <MockStatCard label="Disputed" value="3" color="#dc2626" icon={AlertTriangle} />
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '10%' }}>ID</span><span style={{ width: '20%' }}>Amount</span><span style={{ width: '15%' }}>Status</span><span style={{ width: '15%' }}>Fee</span><span style={{ width: '20%' }}>Settled</span>
        </div>
        {[
          ['#1024', '$12,400.00', 'Completed', '$124.00', '2026-07-28'],
          ['#1023', '$8,900.50', 'Completed', '$89.00', '2026-07-27'],
          ['#1022', '$34,200.00', 'Pending', '$342.00', 'Pending'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} statusColor={row[2] === 'Completed' ? '#059669' : '#d97706'} />
        ))}
      </div>
    </div>
  )
}

function FraudMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="px-3 py-1.5 rounded-lg text-[10px] font-medium mb-3 flex items-center gap-2" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
        <AlertTriangle size={12} /> 3 new fraud alerts detected
      </div>
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        <MockStatCard label="Total" value="47" color={BLUE} icon={Shield} />
        <MockStatCard label="Critical" value="5" color="#dc2626" icon={AlertTriangle} />
        <MockStatCard label="High" value="12" color="#d97706" icon={AlertTriangle} />
        <MockStatCard label="Medium" value="8" color="#0ea5e9" icon={AlertTriangle} />
        <MockStatCard label="Resolved" value="22" color="#059669" icon={CheckCircle} />
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '10%' }}>ID</span><span style={{ width: '20%' }}>Type</span><span style={{ width: '20%' }}>Risk Score</span><span style={{ width: '20%' }}>Status</span><span style={{ width: '20%' }}>Actions</span>
        </div>
        {[
          ['#89', 'Velocity', '87', 'Open', '🔍'],
          ['#90', 'Amount', '62', 'Investigating', '🔍'],
          ['#91', 'Location', '34', 'Resolved', '✓'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} statusColor={
            parseInt(row[2]) >= 80 ? '#dc2626' : parseInt(row[2]) >= 50 ? '#d97706' : '#059669'
          } />
        ))}
      </div>
    </div>
  )
}

function LedgerMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-3 rounded-xl text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <div className="text-[10px] mb-1" style={{ color: '#4a6fa5' }}>Total Debits</div>
          <div className="text-lg font-bold font-mono text-red-600">$847,293.00</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div className="text-[10px] mb-1" style={{ color: '#4a6fa5' }}>Total Credits</div>
          <div className="text-lg font-bold font-mono text-green-600">$847,293.00</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <div className="text-[10px] mb-1" style={{ color: '#4a6fa5' }}>Trial Balance</div>
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-green-600">
            <Scale size={14} /> Balanced
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '25%' }}>Account</span><span style={{ width: '15%' }}>Type</span><span style={{ width: '20%' }}>Amount</span><span style={{ width: '25%' }}>Description</span><span style={{ width: '15%' }}>Date</span>
        </div>
        {[
          ['Stripe Revenue', 'Credit', '$12,400.00', 'Payment received', '2026-07-28'],
          ['Bank Account', 'Debit', '$12,400.00', 'Settlement', '2026-07-28'],
          ['Processing Fee', 'Debit', '$124.00', 'Gateway fee', '2026-07-28'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} statusColor={row[1] === 'Credit' ? '#059669' : '#dc2626'} />
        ))}
      </div>
    </div>
  )
}

function ReportsMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Daily Summary — Jul 28', type: 'daily_summary', status: 'completed', date: '2026-07-28' },
          { name: 'Transaction Detail — Jul 27', type: 'transaction_detail', status: 'completed', date: '2026-07-27' },
          { name: 'Settlement Report — Jul 26', type: 'settlement', status: 'generating', date: '2026-07-26' },
          { name: 'Fraud Summary — Jul 25', type: 'fraud_summary', status: 'completed', date: '2026-07-25' },
        ].map((r, i) => (
          <div key={i} className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={12} style={{ color: BLUE }} />
              <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>{r.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px]" style={{ color: '#4a6fa5' }}>{r.type.replace(/_/g, ' ')}</span>
              <MockBadge text={r.status} color={r.status === 'completed' ? '#059669' : '#0ea5e9'} />
            </div>
            {r.status === 'completed' && (
              <button className="mt-2 w-full py-1 rounded-lg text-[10px] font-medium text-white flex items-center justify-center gap-1" style={{ background: BLUE }}>
                <Download size={10} /> Download
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsMock() {
  const notifs = [
    { subject: 'New fraud alert detected', body: 'Transaction TXN-8F2A flagged with risk score 87', type: 'error', time: '2m ago', read: false },
    { subject: 'Settlement completed', body: 'Batch #1024 settled — $12,400.00', type: 'success', time: '15m ago', read: false },
    { subject: 'Gateway latency warning', body: 'Stripe response time exceeded 500ms', type: 'warning', time: '1h ago', read: true },
    { subject: 'Reconciliation complete', body: 'Daily run matched 1,187 of 1,217 transactions', type: 'info', time: '3h ago', read: true },
  ]
  const colors = { error: '#dc2626', success: '#059669', warning: '#d97706', info: '#3b82f6' }
  return (
    <div className="p-4 h-full overflow-hidden flex flex-col gap-2">
      {notifs.map((n, i) => (
        <motion.div key={i} className="p-3 rounded-xl flex items-start gap-2"
          style={{ background: `${colors[n.type as keyof typeof colors]}05`, borderLeft: `3px solid ${colors[n.type as keyof typeof colors]}`, opacity: n.read ? 0.6 : 1 }}
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: n.read ? 0.6 : 1 }} transition={{ delay: i * 0.1 }}>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              {!n.read && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors[n.type as keyof typeof colors] }} />}
              <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>{n.subject}</span>
            </div>
            <div className="text-[10px] mt-0.5 line-clamp-1" style={{ color: '#4a6fa5' }}>{n.body}</div>
            <div className="text-[9px] mt-1 font-mono" style={{ color: '#94a3b8' }}>{n.time}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SettingsMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 mb-2">
            <User size={12} className="text-cyan-500" />
            <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>Profile</span>
          </div>
          {['Name: John Doe', 'Email: john@payflow.dev', 'Role: Admin'].map((f) => (
            <div key={f} className="py-1 text-[10px] px-2 rounded-lg mb-1" style={{ background: '#f8fafc', color: '#4a6fa5' }}>{f}</div>
          ))}
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Lock size={12} className="text-cyan-500" />
            <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>Security</span>
          </div>
          {['Current password", "New password', 'Confirm password'].map((f) => (
            <div key={f} className="py-1 text-[10px] px-2 rounded-lg mb-1" style={{ background: '#f8fafc', color: '#94a3b8' }}>••••••••</div>
          ))}
          <button className="w-full mt-1 py-1 rounded-lg text-[10px] font-medium text-white" style={{ background: BLUE }}>Update Password</button>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-2">
          <Palette size={12} className="text-cyan-500" />
          <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>Appearance</span>
        </div>
        <div className="flex gap-2">
          {[{ name: 'Light', bg: '#ffffff' }, { name: 'Dim', bg: '#1a1a2e' }, { name: 'Dark', bg: '#000000' }].map((t, i) => (
            <div key={t.name} className="flex-1 h-12 rounded-lg flex items-center justify-center text-[10px] font-medium cursor-pointer" style={{
              background: t.bg, border: `2px solid ${i === 0 ? BLUE : '#e2e8f0'}`,
              color: i === 0 ? BLUE : i === 1 ? '#e2e8f0' : '#94a3b8',
              boxShadow: i === 0 ? `0 0 12px ${BLUE}40` : 'none'
            }}>{t.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SecurityMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Key size={12} className="text-cyan-500" />
            <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>JWT Authentication</span>
          </div>
          <div className="p-2 rounded-lg text-[9px] font-mono" style={{ background: '#f8fafc', color: '#4a6fa5' }}>
            {'{ "token": "eyJhbGciOiJI...", "expires": "24h" }'}
          </div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={12} className="text-cyan-500" />
            <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>Role-Based Access</span>
          </div>
          {[
            { role: 'Admin', perms: 'Full access', color: '#dc2626' },
            { role: 'Manager', perms: 'Limited write', color: '#d97706' },
            { role: 'Viewer', perms: 'Read only', color: '#059669' },
          ].map((r) => (
            <div key={r.role} className="flex items-center justify-between py-1 text-[10px] border-b" style={{ borderColor: '#f1f5f9' }}>
              <span className="font-medium" style={{ color: r.color }}>{r.role}</span>
              <span style={{ color: '#4a6fa5' }}>{r.perms}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 p-3 rounded-xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-2">
          <Eye size={12} className="text-cyan-500" />
          <span className="text-[11px] font-semibold" style={{ color: '#0c1b3a' }}>Audit Trail</span>
        </div>
        {[
          'john@payflow.dev — Login — 192.168.1.1 — 2m ago',
          'admin@payflow.dev — Export Report — 192.168.1.5 — 15m ago',
          'ops@payflow.dev — Resolve Fraud #89 — 10.0.0.1 — 1h ago',
        ].map((log, i) => (
          <div key={i} className="py-1 text-[9px] font-mono border-b" style={{ borderColor: '#f1f5f9', color: '#4a6fa5' }}>{log}</div>
        ))}
      </div>
    </div>
  )
}

function MultiCurrencyMock() {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-semibold" style={{ background: '#f1f5f9', color: '#4a6fa5' }}>
          <span style={{ width: '20%' }}>Currency</span><span style={{ width: '25%' }}>Amount</span><span style={{ width: '25%' }}>FX Rate</span><span style={{ width: '30%' }}>In USD</span>
        </div>
        {[
          ['USD', '$1,240.00', '1.0000', '$1,240.00'],
          ['EUR', '€1,100.00', '1.0870', '$1,195.70'],
          ['INR', '₹83,450.00', '0.01198', '$999.73'],
          ['GBP', '£920.00', '1.2730', '$1,171.16'],
          ['JPY', '¥185,000', '0.00669', '$1,237.65'],
        ].map((row, i) => (
          <MockTableRow key={i} cells={row} />
        ))}
      </div>
      <motion.div className="mt-3 p-3 rounded-xl text-center" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}
        animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="text-[10px] mb-1" style={{ color: '#4a6fa5' }}>Live Conversion</div>
        <div className="text-sm font-bold font-mono" style={{ color: BLUE }}>$1,000 USD → ₹83,450 INR</div>
        <div className="text-[9px] mt-1" style={{ color: '#94a3b8' }}>Rate updates every 30s</div>
      </motion.div>
    </div>
  )
}

const mockComponents: Record<string, React.FC> = {
  hero: HeroMock, dashboard: DashboardMock, transactions: TransactionsMock,
  gateways: GatewaysMock, reconciliation: ReconciliationMock, settlements: SettlementsMock,
  fraud: FraudMock, ledger: LedgerMock, reports: ReportsMock,
  notifications: NotificationsMock, settings: SettingsMock, security: SecurityMock,
  multicurrency: MultiCurrencyMock,
}

/* ═══════════ MAIN COMPONENT ═══════════ */

interface DemoWalkthroughProps {
  isOpen: boolean
  onClose: () => void
  initialStep?: number
}

export function DemoWalkthrough({ isOpen, onClose, initialStep = 0 }: DemoWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepDuration = 8000

  const step = steps[currentStep]
  const MockPage = mockComponents[step.mockType]

  const goToNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
      setProgress(0)
    } else {
      setIsPlaying(false)
    }
  }, [currentStep])

  const goToPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      setProgress(0)
    }
  }, [currentStep])

  useEffect(() => {
    if (!isOpen) return
    setCurrentStep(initialStep)
    setProgress(0)
    setIsPlaying(true)
  }, [isOpen, initialStep])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying || !isOpen) return

    const startTime = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / stepDuration) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(intervalRef.current!)
        goToNext()
      }
    }, 50)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [currentStep, isPlaying, isOpen, goToNext])

  const jumpToStep = (idx: number) => {
    setCurrentStep(idx)
    setProgress(0)
    setIsPlaying(true)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ background: '#0c1b3a', maxHeight: '90vh' }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}>

          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2" style={{ background: '#111d35' }}>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 cursor-pointer" onClick={onClose} />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${step.color}20`, color: step.color }}>
                {step.section}
              </span>
              <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full" style={{ background: '#1e293b' }}>
            <motion.div className="h-full rounded-r-full" style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})` }}
              animate={{ width: `${((currentStep) / steps.length) * 100 + (progress / steps.length) * 100}%` }}
              transition={{ duration: 0.1 }} />
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: '420px' }}>
            {/* Left: Narration */}
            <div className="w-[340px] p-5 flex flex-col" style={{ background: '#111d35', borderRight: '1px solid #1e293b' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${step.color}15` }}>
                  <step.icon size={18} style={{ color: step.color }} />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: step.color }}>{step.section}</div>
                  <div className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{step.title}</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed flex-1" style={{ color: '#94a3b8' }}>{step.narration}</p>
              <div className="mt-3 p-2 rounded-lg text-[10px]" style={{ background: `${step.color}08`, border: `1px solid ${step.color}15`, color: step.color }}>
                💡 {step.highlight}
              </div>
            </div>

            {/* Right: Mock UI */}
            <div className="flex-1 overflow-hidden" style={{ background: '#f8fafc' }}>
              <AnimatePresence mode="wait">
                <motion.div key={step.id} className="h-full"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  {MockPage && <MockPage />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="px-4 py-3 flex items-center gap-4" style={{ background: '#111d35', borderTop: '1px solid #1e293b' }}>
            {/* Step dots */}
            <div className="flex items-center gap-1 flex-1">
              {steps.map((_, i) => (
                <button key={i} onClick={() => jumpToStep(i)}
                  className="h-1.5 rounded-full transition-all cursor-pointer" style={{
                    width: i === currentStep ? '24px' : '8px',
                    background: i === currentStep ? step.color : i < currentStep ? `${BLUE}60` : '#1e293b'
                  }} />
              ))}
            </div>

            {/* Play/Pause */}
            <div className="flex items-center gap-2">
              <button onClick={goToPrev} disabled={currentStep === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: '#1e293b', color: currentStep === 0 ? '#334155' : '#94a3b8' }}>
                <SkipBack size={14} />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <button onClick={goToNext} disabled={currentStep === steps.length - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: '#1e293b', color: currentStep === steps.length - 1 ? '#334155' : '#94a3b8' }}>
                <SkipForward size={14} />
              </button>
            </div>

            <span className="text-[10px] font-mono" style={{ color: '#64748b' }}>
              {Math.ceil((stepDuration - (progress / 100) * stepDuration) / 1000)}s
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
