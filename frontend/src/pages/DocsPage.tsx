import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Zap, Shield, Settings, Code2, Database, Webhook } from 'lucide-react'

interface DocSection {
  id: string
  title: string
  icon: React.ElementType
  content: string
}

const sections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    content: `# Getting Started with PayFlow

## Quick Start Guide

Welcome to PayFlow — the modern payment reconciliation engine. This guide will walk you through setting up your account and running your first reconciliation.

### Prerequisites
- A PayFlow account (sign up at payflow.dev)
- Access to at least one payment gateway (Stripe, PayPal, Razorpay, etc.)
- Transaction data in CSV, JSON, or via API

### Step 1: Create Your Workspace
After signing up, you'll be prompted to create a workspace. Each workspace is isolated and has its own gateway connections, reconciliation rules, and team members.

### Step 2: Connect a Payment Gateway
Navigate to **Settings → Gateways** and click **Add Gateway**. Select your provider and authenticate via OAuth or enter your API keys.

Supported gateways: Stripe, PayPal, Razorpay, PayU, CCAvenue, PhonePe, GPay, UPI, Worldpay, Adyen, Square, Braintree, Checkout.com

### Step 3: Import Transaction Data
You can import data via:
- **API sync** (recommended): Auto-pulls transactions on a schedule
- **CSV upload**: Drag-and-drop files into the dashboard
- **Webhook**: Real-time transaction ingestion

### Step 4: Run Reconciliation
Navigate to **Reconciliation** and click **Start New Run**. Select your source (gateway) and target (bank statement), then let the AI engine match transactions.

### Step 5: Review & Resolve
The engine will auto-match ~99.7% of transactions. Review flagged items in the **Exceptions** queue and approve or manually match them.

---

## Authentication

All API requests require a Bearer token:

\`\`\`
Authorization: Bearer <your-api-key>
\`\`\`

Generate API keys in **Settings → API Keys**.`,
  },
  {
    id: 'reconciliation',
    title: 'Reconciliation Engine',
    icon: Zap,
    content: `# Reconciliation Engine

## Overview

The reconciliation engine is the core of PayFlow. It automatically matches transactions across multiple sources with AI-powered accuracy.

### How It Works

1. **Ingestion**: Transactions are collected from connected gateways and uploaded bank statements.
2. **Normalization**: All transactions are normalized to a common schema with unified field names, currencies, and timestamps.
3. **Matching**: The AI engine applies multiple matching strategies:
   - **Exact match**: Amount + reference ID
   - **Fuzzy match**: Amount + date proximity + merchant name similarity
   - **Partial match**: Split payments, partial refunds
   - **ML-powered**: Pattern recognition for complex cases
4. **Classification**: Matched pairs are classified as: Matched, Partial Match, Unmatched, or Anomaly.
5. **Resolution**: Auto-resolved or routed to exception queues.

### Matching Confidence Scores

Each match receives a confidence score (0–100):
- **90–100**: Auto-approved (high confidence)
- **70–89**: Flagged for review (medium confidence)
- **Below 70**: Sent to exception queue

### Custom Rules

Create custom matching rules in **Settings → Rules**:
- Override confidence thresholds
- Add field-level matching criteria
- Set up auto-approval for specific merchants or amount ranges
- Define anomaly detection patterns`,
  },
  {
    id: 'gateways',
    title: 'Gateway Integration',
    icon: Settings,
    content: `# Gateway Integration

## Supported Gateways

PayFlow integrates with 12+ payment gateways. Each integration provides:
- Real-time transaction sync
- Settlement report ingestion
- Refund and chargeback tracking
- Multi-currency support

### Gateway Setup

Each gateway requires specific authentication:

| Gateway     | Auth Method    | Docs Link           |
|------------|---------------|---------------------|
| Stripe     | OAuth 2.0     | stripe.com/docs/api |
| PayPal     | Client ID/Secret | developer.paypal.com |
| Razorpay   | API Key       | razorpay.com/docs   |
| PayU       | Merchant ID + Salt | payu.com/docs   |
| Worldpay   | Merchant Code + API Key | worldpay.com |
| Adyen      | API Key + Client | docs.adyen.com     |
| Square     | OAuth 2.0     | developer.squareup.com |
| Braintree  | Merchant ID + Public Key | braintreepayments.com |
| Checkout.com | API Key    | checkout.com/docs   |
| CCAvenue   | Merchant ID + Working Key | ccavenue.com |
| PhonePe    | API Key       | phonepe.com/developer |
| GPay/UPI   | Merchant ID   | pay.google.com     |

### Sync Modes
- **Real-time**: Webhook-based instant sync
- **Scheduled**: Cron-based polling (every 5 min, hourly, daily)
- **Manual**: On-demand sync via dashboard or API`,
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: Shield,
    content: `# Security & Compliance

## Security Overview

PayFlow is built with security-first architecture for handling sensitive financial data.

### Data Protection
- **Encryption at rest**: AES-256 for all stored data
- **Encryption in transit**: TLS 1.3 for all API communication
- **Key management**: AWS KMS with automatic key rotation

### Authentication & Authorization
- **JWT tokens** with configurable expiry
- **Role-Based Access Control (RBAC)**: Owner, Admin, Finance, Auditor, Viewer
- **API key scoping**: Read-only, Read-Write, Admin
- **IP whitelisting** for API access

### Compliance
- **SOC 2 Type II** certified
- **GDPR** compliant with data residency options
- **PCI DSS** Level 1 (via gateway partners)
- **ISO 27001** aligned security controls

### Audit Trail
Every action in PayFlow is logged with:
- User identity
- Timestamp
- IP address
- Action performed
- Before/after state for data changes

### Data Retention
- Starter: 7 days
- Pro: 90 days
- Enterprise: Unlimited (configurable)

### Incident Response
- 24/7 security monitoring
- Automated threat detection
- < 1 hour response SLA for critical incidents
- Regular penetration testing by third parties`,
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code2,
    content: `# API Reference

## Base URL
\`\`\`
https://api.payflow.dev/v1
\`\`\`

## Authentication
\`\`\`
Authorization: Bearer <api_key>
Content-Type: application/json
\`\`\`

## Endpoints

### Transactions
\`\`\`
GET    /transactions              — List all transactions
GET    /transactions/:id          — Get transaction by ID
POST   /transactions              — Create transaction
DELETE /transactions/:id          — Delete transaction
\`\`\`

### Reconciliation
\`\`\`
POST   /reconciliation/run        — Start reconciliation run
GET    /reconciliation/:id        — Get run status/results
GET    /reconciliation/history    — List past runs
\`\`\`

### Gateways
\`\`\`
GET    /gateways                  — List connected gateways
POST   /gateways                  — Connect new gateway
DELETE /gateways/:id              — Disconnect gateway
POST   /gateways/:id/sync         — Trigger sync
\`\`\`

### Reports
\`\`\`
GET    /reports/summary           — Get reconciliation summary
GET    /reports/discrepancies     — List discrepancies
POST   /reports/export            — Export report (CSV/PDF/JSON)
\`\`\`

### Webhooks
\`\`\`
GET    /webhooks                  — List webhooks
POST   /webhooks                  — Create webhook
DELETE /webhooks/:id              — Delete webhook
\`\`\`

## Rate Limits
- **Starter**: 100 requests/minute
- **Pro**: 1,000 requests/minute
- **Enterprise**: Custom limits

## Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request — Invalid parameters |
| 401 | Unauthorized — Invalid or missing API key |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource doesn't exist |
| 429 | Rate Limited — Too many requests |
| 500 | Server Error — Contact support |`,
  },
  {
    id: 'data-model',
    title: 'Data Model',
    icon: Database,
    content: `# Data Model

## Core Entities

### Transaction
The fundamental unit of reconciliation.

\`\`\`json
{
  "id": "txn_abc123",
  "gateway": "stripe",
  "amount": 150.00,
  "currency": "USD",
  "status": "captured",
  "reference": "pi_1234567890",
  "merchant_name": "Acme Corp",
  "timestamp": "2026-01-15T10:30:00Z",
  "metadata": {},
  "created_at": "2026-01-15T10:30:01Z"
}
\`\`\`

### Reconciliation Run
A single reconciliation execution between two sources.

\`\`\`json
{
  "id": "rec_xyz789",
  "source_gateway": "stripe",
  "target_statement": "bank_jan_2026",
  "status": "completed",
  "matched": 1247,
  "unmatched": 3,
  "anomalies": 1,
  "started_at": "2026-01-15T11:00:00Z",
  "completed_at": "2026-01-15T11:00:47Z"
}
\`\`\`

### Gateway Configuration
\`\`\`json
{
  "id": "gw_stripe_001",
  "type": "stripe",
  "name": "Production Stripe",
  "status": "connected",
  "sync_mode": "real-time",
  "last_synced_at": "2026-01-15T10:59:00Z",
  "transaction_count": 15420
}
\`\`\`

### Discrepancy
\`\`\`json
{
  "id": "disc_001",
  "transaction_id": "txn_abc123",
  "type": "amount_mismatch",
  "severity": "high",
  "gateway_amount": 150.00,
  "bank_amount": 148.50,
  "difference": 1.50,
  "status": "pending",
  "assigned_to": "user_002"
}
\`\`\``,
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    icon: Webhook,
    content: `# Webhooks

## Overview

Webhooks allow PayFlow to send real-time notifications to your application when events occur.

### Creating a Webhook
\`\`\`bash
curl -X POST https://api.payflow.dev/v1/webhooks \\
  -H "Authorization: Bearer <api_key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/payflow",
    "events": ["reconciliation.completed", "discrepancy.created"],
    "secret": "whsec_your_signing_secret"
  }'
\`\`\`

### Event Types
| Event | Description |
|-------|-------------|
| \`transaction.created\` | New transaction ingested |
| \`transaction.matched\` | Transaction matched in reconciliation |
| \`reconciliation.started\` | Reconciliation run began |
| \`reconciliation.completed\` | Reconciliation run finished |
| \`discrepancy.created\` | New discrepancy detected |
| \`discrepancy.resolved\` | Discrepancy resolved |
| \`gateway.synced\` | Gateway sync completed |
| \`gateway.error\` | Gateway sync error |

### Webhook Payload
\`\`\`json
{
  "id": "evt_abc123",
  "type": "reconciliation.completed",
  "created_at": "2026-01-15T11:00:47Z",
  "data": {
    "run_id": "rec_xyz789",
    "matched": 1247,
    "unmatched": 3
  }
}
\`\`\`

### Signature Verification
Every webhook includes a \`X-PayFlow-Signature\` header:

\`\`\`python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
\`\`\`

### Retry Policy
Failed webhooks are retried with exponential backoff:
- Attempt 1: Immediate
- Attempt 2: 1 minute
- Attempt 3: 5 minutes
- Attempt 4: 30 minutes
- Attempt 5: 2 hours
- After 5 failures: Webhook is disabled`,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const current = sections.find((s) => s.id === activeSection) || sections[0]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_40%,transparent)] p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="relative mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg2))] text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)]/30"
          />
        </div>
        <nav className="space-y-1">
          {filtered.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_4%,transparent)]'
              }`}
            >
              <section.icon size={14} />
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl">
        {/* Mobile section picker */}
        <div className="lg:hidden mb-6 flex flex-wrap gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] border border-[color-mix(in_srgb,var(--accent-cyan)_20%,var(--border))]'
                  : 'text-[var(--muted)] border border-[color-mix(in_srgb,var(--accent-cyan)_6%,var(--border))]'
              }`}
            >
              <s.icon size={12} />
              {s.title}
            </button>
          ))}
        </div>

        <motion.div key={current.id} initial="hidden" animate="visible" variants={fadeUp} className="prose-custom">
          {current.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-[var(--text)] mb-6 mt-2" style={{ fontFamily: 'Outfit' }}>{line.slice(2)}</h1>
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-[var(--text)] mt-10 mb-4 pb-2 border-b border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))]">{line.slice(3)}</h2>
            if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-[var(--text)] mt-6 mb-3">{line.slice(4)}</h3>
            if (line.startsWith('```')) return null
            if (line.startsWith('| ')) {
              const cells = line.split('|').filter(Boolean).map((c) => c.trim())
              if (cells.every((c) => c.match(/^-+$/))) return null
              return (
                <div key={i} className="grid gap-4 py-1.5 border-b border-[color-mix(in_srgb,var(--accent-cyan)_5%,var(--border))] text-xs font-mono" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
                  {cells.map((cell, ci) => (
                    <span key={ci} className={i === 0 ? 'font-bold text-[var(--accent-cyan)]' : 'text-[var(--muted)]'}>{cell}</span>
                  ))}
                </div>
              )
            }
            if (line.startsWith('- ')) return <li key={i} className="text-sm text-[var(--muted)] ml-4 mb-1 list-disc">{line.slice(2)}</li>
            if (line.trim() === '---') return <hr key={i} className="my-8 border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))]" />
            if (line.trim() === '') return <div key={i} className="h-2" />
            if (line.startsWith('  -')) return <li key={i} className="text-sm text-[var(--muted)] ml-8 mb-1 list-disc">{line.trim().slice(2)}</li>
            return <p key={i} className="text-sm text-[var(--muted)] leading-relaxed mb-2">{line}</p>
          })}
        </motion.div>
      </main>
    </div>
  )
}
