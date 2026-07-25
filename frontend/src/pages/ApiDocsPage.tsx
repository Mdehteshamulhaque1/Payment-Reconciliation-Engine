import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Search, ChevronDown, ChevronRight } from 'lucide-react'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface Endpoint {
  method: Method
  path: string
  description: string
  params?: { name: string; type: string; required: boolean; description: string }[]
  requestBody?: string
  responseExample: string
}

interface EndpointGroup {
  title: string
  baseUrl: string
  endpoints: Endpoint[]
}

const groups: EndpointGroup[] = [
  {
    title: 'Transactions',
    baseUrl: '/v1/transactions',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/transactions',
        description: 'List all transactions with optional filtering and pagination.',
        params: [
          { name: 'gateway', type: 'string', required: false, description: 'Filter by gateway ID' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status (captured, refunded, pending)' },
          { name: 'currency', type: 'string', required: false, description: 'Filter by currency code (USD, EUR, INR...)' },
          { name: 'from', type: 'datetime', required: false, description: 'Start of date range (ISO 8601)' },
          { name: 'to', type: 'datetime', required: false, description: 'End of date range (ISO 8601)' },
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page (default: 50, max: 200)' },
        ],
        responseExample: `{
  "data": [
    {
      "id": "txn_abc123",
      "gateway": "stripe",
      "amount": 150.00,
      "currency": "USD",
      "status": "captured",
      "reference": "pi_1234567890",
      "merchant_name": "Acme Corp",
      "timestamp": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1247,
    "page": 1,
    "limit": 50,
    "has_more": true
  }
}`,
      },
      {
        method: 'POST',
        path: '/v1/transactions',
        description: 'Create a new transaction record.',
        requestBody: `{
  "gateway": "stripe",
  "amount": 99.99,
  "currency": "USD",
  "status": "captured",
  "reference": "pi_custom_ref",
  "merchant_name": "Acme Corp",
  "metadata": {
    "order_id": "ORD-001"
  }
}`,
        responseExample: `{
  "id": "txn_new123",
  "gateway": "stripe",
  "amount": 99.99,
  "currency": "USD",
  "status": "captured",
  "created_at": "2026-01-15T12:00:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/v1/transactions/:id',
        description: 'Get a single transaction by its ID.',
        responseExample: `{
  "id": "txn_abc123",
  "gateway": "stripe",
  "amount": 150.00,
  "currency": "USD",
  "status": "captured",
  "reference": "pi_1234567890",
  "merchant_name": "Acme Corp",
  "metadata": {},
  "created_at": "2026-01-15T10:30:01Z"
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/transactions/:id',
        description: 'Delete a transaction. This action is irreversible.',
        responseExample: `{
  "deleted": true,
  "id": "txn_abc123"
}`,
      },
    ],
  },
  {
    title: 'Reconciliation',
    baseUrl: '/v1/reconciliation',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/reconciliation/run',
        description: 'Start a new reconciliation run between a gateway source and a bank statement.',
        requestBody: `{
  "source_gateway": "stripe",
  "target_statement_id": "stmt_jan_2026",
  "options": {
    "auto_approve_threshold": 90,
    "currency": "USD",
    "date_range": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    }
  }
}`,
        responseExample: `{
  "id": "rec_new789",
  "status": "processing",
  "source_gateway": "stripe",
  "target_statement_id": "stmt_jan_2026",
  "started_at": "2026-01-15T11:00:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/v1/reconciliation/:id',
        description: 'Get the status and results of a reconciliation run.',
        responseExample: `{
  "id": "rec_xyz789",
  "status": "completed",
  "matched": 1247,
  "partial_match": 12,
  "unmatched": 3,
  "anomalies": 1,
  "confidence_avg": 94.2,
  "started_at": "2026-01-15T11:00:00Z",
  "completed_at": "2026-01-15T11:00:47Z"
}`,
      },
      {
        method: 'GET',
        path: '/v1/reconciliation/history',
        description: 'List all past reconciliation runs.',
        params: [
          { name: 'page', type: 'integer', required: false, description: 'Page number' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
        ],
        responseExample: `{
  "data": [
    {
      "id": "rec_xyz789",
      "status": "completed",
      "matched": 1247,
      "unmatched": 3,
      "completed_at": "2026-01-15T11:00:47Z"
    }
  ],
  "meta": { "total": 45, "page": 1 }
}`,
      },
    ],
  },
  {
    title: 'Gateways',
    baseUrl: '/v1/gateways',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/gateways',
        description: 'List all connected payment gateways.',
        responseExample: `{
  "data": [
    {
      "id": "gw_stripe_001",
      "type": "stripe",
      "name": "Production Stripe",
      "status": "connected",
      "sync_mode": "real-time",
      "last_synced_at": "2026-01-15T10:59:00Z",
      "transaction_count": 15420
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/v1/gateways',
        description: 'Connect a new payment gateway.',
        requestBody: `{
  "type": "stripe",
  "name": "Production Stripe",
  "credentials": {
    "api_key": "sk_live_..."
  },
  "sync_mode": "real-time"
}`,
        responseExample: `{
  "id": "gw_new001",
  "type": "stripe",
  "name": "Production Stripe",
  "status": "connected",
  "created_at": "2026-01-15T12:00:00Z"
}`,
      },
      {
        method: 'POST',
        path: '/v1/gateways/:id/sync',
        description: 'Trigger an immediate sync for a connected gateway.',
        responseExample: `{
  "status": "syncing",
  "gateway_id": "gw_stripe_001",
  "estimated_completion": "2026-01-15T12:05:00Z"
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/gateways/:id',
        description: 'Disconnect and remove a gateway. Historical data is preserved.',
        responseExample: `{
  "deleted": true,
  "id": "gw_stripe_001"
}`,
      },
    ],
  },
  {
    title: 'Reports',
    baseUrl: '/v1/reports',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/reports/summary',
        description: 'Get an aggregated summary of reconciliation status.',
        params: [
          { name: 'period', type: 'string', required: false, description: 'Time period (today, week, month, quarter, year)' },
        ],
        responseExample: `{
  "total_transactions": 45230,
  "matched": 44891,
  "unmatched": 312,
  "anomalies": 27,
  "match_rate": 99.25,
  "total_amount_matched": 2345678.90,
  "total_discrepancy_amount": 1234.56
}`,
      },
      {
        method: 'POST',
        path: '/v1/reports/export',
        description: 'Export a reconciliation report in CSV, PDF, or JSON format.',
        requestBody: `{
  "format": "csv",
  "reconciliation_run_id": "rec_xyz789",
  "include_matched": true,
  "include_unmatched": true,
  "include_anomalies": true
}`,
        responseExample: `{
  "download_url": "https://cdn.payflow.dev/reports/rec_xyz789.csv",
  "expires_at": "2026-01-16T11:00:00Z",
  "file_size_bytes": 245760
}`,
      },
    ],
  },
  {
    title: 'Webhooks',
    baseUrl: '/v1/webhooks',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/webhooks',
        description: 'List all configured webhooks.',
        responseExample: `{
  "data": [
    {
      "id": "wh_001",
      "url": "https://your-app.com/webhooks/payflow",
      "events": ["reconciliation.completed"],
      "status": "active",
      "created_at": "2026-01-10T09:00:00Z"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/v1/webhooks',
        description: 'Create a new webhook endpoint.',
        requestBody: `{
  "url": "https://your-app.com/webhooks/payflow",
  "events": ["reconciliation.completed", "discrepancy.created"],
  "secret": "whsec_your_signing_secret"
}`,
        responseExample: `{
  "id": "wh_new001",
  "url": "https://your-app.com/webhooks/payflow",
  "events": ["reconciliation.completed", "discrepancy.created"],
  "status": "active",
  "created_at": "2026-01-15T12:00:00Z"
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/webhooks/:id',
        description: 'Delete a webhook endpoint.',
        responseExample: `{
  "deleted": true,
  "id": "wh_001"
}`,
      },
    ],
  },
]

const methodColors: Record<Method, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PATCH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--bg2)_80%,var(--surface))] overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]">
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">{title}</span>
          <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">
            {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-[var(--muted)] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] transition-colors"
      >
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${methodColors[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <span className="text-sm font-mono text-[var(--text)] flex-1 text-left">{endpoint.path}</span>
        <span className="text-xs text-[var(--muted)] hidden sm:block max-w-[300px] truncate">{endpoint.description}</span>
        {expanded ? <ChevronDown size={14} className="text-[var(--muted)]" /> : <ChevronRight size={14} className="text-[var(--muted)]" />}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 border-t border-[color-mix(in_srgb,var(--accent-cyan)_5%,var(--border))]"
        >
          <p className="text-sm text-[var(--muted)] mt-3 mb-4 leading-relaxed">{endpoint.description}</p>

          {endpoint.params && endpoint.params.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-2">Parameters</h5>
              <div className="space-y-1.5">
                {endpoint.params.map((p) => (
                  <div key={p.name} className="flex items-start gap-3 text-xs">
                    <code className="font-mono text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--surface))] px-1.5 py-0.5 rounded">{p.name}</code>
                    <span className="text-[var(--muted)] font-mono">{p.type}</span>
                    {p.required && <span className="text-red-400 text-[10px] font-mono">required</span>}
                    <span className="text-[var(--muted)]">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.requestBody && (
            <div className="mb-4">
              <CodeBlock code={endpoint.requestBody} title="Request Body" />
            </div>
          )}

          <CodeBlock code={endpoint.responseExample} title="Response (200)" />
        </motion.div>
      )}
    </div>
  )
}

export default function ApiDocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(groups[0].title)

  const filtered = groups.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.endpoints.some(
        (e) =>
          e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const current = groups.find((g) => g.title === activeGroup) || groups[0]

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative py-16 px-4 border-b border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-cyan)_0%,transparent_60%)] opacity-[0.04]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-3">API Reference</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-black text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
            PayFlow REST API
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-3 text-sm text-[var(--muted)] max-w-xl mx-auto">
            Base URL: <code className="font-mono text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--surface))] px-2 py-0.5 rounded">https://api.payflow.dev/v1</code>
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-[var(--muted)]">
            <span>Auth: <code className="text-[var(--accent-cyan)]">Bearer token</code></span>
            <span>Format: <code className="text-[var(--accent-cyan)]">JSON</code></span>
            <span>Rate: <code className="text-[var(--accent-cyan)]">100-1000 req/min</code></span>
          </motion.div>
        </div>
      </section>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0 border-r border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="relative mb-4">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
            />
          </div>
          <nav className="space-y-0.5">
            {filtered.map((group) => (
              <button
                key={group.title}
                onClick={() => setActiveGroup(group.title)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeGroup === group.title
                    ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                <span>{group.title}</span>
                <span className="text-[10px] font-mono opacity-50">{group.endpoints.length}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-4xl">
          {/* Mobile group picker */}
          <div className="lg:hidden mb-6 flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.title}
                onClick={() => setActiveGroup(g.title)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeGroup === g.title
                    ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] border border-[color-mix(in_srgb,var(--accent-cyan)_20%,var(--border))]'
                    : 'text-[var(--muted)] border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))]'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>

          <motion.div key={current.title} initial="hidden" animate="visible" variants={fadeUp}>
            <h2 className="text-2xl font-black text-[var(--text)] mb-2" style={{ fontFamily: 'Outfit' }}>{current.title}</h2>
            <p className="text-xs font-mono text-[var(--muted)] mb-6">Base: {current.baseUrl}</p>

            <div className="space-y-3">
              {current.endpoints.map((ep) => (
                <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
