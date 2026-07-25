<div align="center">

<img src="https://img.shields.io/badge/💳-Payment_Reconciliation_Engine-06B6D4?style=for-the-badge&labelColor=0d1117&color=06B6D4" alt="PayFlow" />

<br />

# 💳 Payment Reconciliation Engine

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=06B6D4&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=100&lines=Automated+Transaction+Reconciliation;Fraud+Detection+%26+Settlement+Tracking;Multi-Gateway+Payment+Platform" alt="Typing SVG" />

<br />

<a href="https://github.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine">
  <img src="https://img.shields.io/badge/Version-2.0-06B6D4?style=for-the-badge&labelColor=0d1117" alt="Version" />
</a>
<a href="#license">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&labelColor=0d1117" alt="License" />
</a>
<a href="#testing">
  <img src="https://img.shields.io/badge/Tests-35%20Passing-brightgreen?style=for-the-badge&labelColor=0d1117" alt="Tests" />
</a>
<a href="#current-status">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-ff6900?style=for-the-badge&labelColor=0d1117" alt="Status" />
</a>

<br />

<div align="center">

![SVG ⚡](https://img.shields.io/badge/⚡-Python_3.11+-3776AB?style=flat-square&logo=python&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![SVG ⚡](https://img.shields.io/badge/⚡-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-MySQL_8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![SVG ⚡](https://img.shields.io/badge/⚡-Celery-37814A?style=flat-square&logo=celery&logoColor=white)

</div>

<br />

<img src="https://raw.githubusercontent.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine/main/frontend/public/hero-dashboard.png" width="100%" alt="Dashboard Preview" />

<br />

---

**Payment Reconciliation Engine** is a production-grade fintech platform that automates transaction reconciliation across multiple payment gateways, detects fraud in real-time, tracks settlements with double-entry ledger accounting, and provides a live operational dashboard.

---

</div>

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Reconciliation Engine](#reconciliation-engine)
- [Fraud Detection](#fraud-detection)
- [Gateway Integrations](#gateway-integrations)
- [Dashboard](#dashboard)
- [Testing](#testing)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

---

## Overview

**Payment Reconciliation Engine** is a full-stack fintech platform that automates the reconciliation of payment transactions across multiple gateways, detects fraud in real-time, tracks settlements with double-entry ledger accounting, and provides a live operational dashboard.

Built for businesses processing payments through **Stripe, Razorpay, PayPal, UPI, and bank transfers**, it eliminates slow, error-prone manual reconciliation and replaces it with automated, rule-driven matching with confidence scoring.

**Target Users:**
- Finance and accounting teams at e-commerce / SaaS companies
- Payment operations engineers monitoring gateway health
- Risk and fraud analysts investigating suspicious transactions
- Business stakeholders needing reconciliation accuracy and cash-flow visibility

---

## The Problem

Businesses processing payments across multiple channels face critical operational challenges:

| Problem | Impact |
|---|---|
| Manual CSV-based reconciliation | 4-6 hours daily, error-prone, not scalable |
| Settlement mismatches | Revenue discrepancies between gateway and bank records |
| Duplicate payments | Customer disputes and refund overhead |
| Failed-but-deducted transactions | Customer trust issues and support load |
| Delayed settlement confirmations | Cash-flow visibility gaps |
| API timeouts / gateway failures | Lost or unverified transactions |
| Undetected fraud patterns | Revenue loss, often discovered days later |

**This engine solves all of them** through automated multi-source reconciliation, real-time fraud detection, and a centralized dashboard.

---

## Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🔄 Automated Reconciliation
> Compares **4 sources** (internal DB, gateway, settlement, bank) for every transaction, classifies discrepancies, and assigns confidence scores.

</td>
<td width="50%" valign="top">

### 🛡️ Fraud Detection
> **7 configurable rules** (velocity, large amounts, duplicates, refund abuse, unusual hours) with cumulative risk scoring.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💰 Settlement Tracking
> Full lifecycle management with automatic fee calculation, bank record matching, and double-entry ledger accounting.

</td>
<td width="50%" valign="top">

### ⚡ Real-Time Dashboard
> Executive KPIs, payment flow visualization, live transaction stream, and gateway health monitoring.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 5 Gateway Integrations
> Stripe, Razorpay, PayPal, UPI, Bank Transfer — with webhook processing, HMAC verification, and health monitoring.

</td>
<td width="50%" valign="top">

### 📊 Prometheus Metrics
> **40+ metrics** covering HTTP requests, transactions, reconciliation, fraud, webhooks, and Celery tasks.

</td>
</tr>
</table>

---

<div align="center">

### 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│   Landing Page  │  Dashboard  │  Transactions  │  Reconciliation   │
│           React Query  +  Zustand  +  Framer Motion                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │  HTTP /api/v1  +  WebSocket
┌───────────────────────────────▼─────────────────────────────────────┐
│                       API GATEWAY (FastAPI)                          │
│   Auth  │  Transactions  │  Gateways  │  Webhooks  │  Settlements  │
│              JWT Auth  │  Rate Limiting  │  Request Logging          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                       SERVICE LAYER                                  │
│  Reconciliation Engine  │  Fraud Detector  │  Settlement Service    │
│  Gateway Service  │  Ledger Service  │  Webhook Service  │  Rules  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                       DATA LAYER                                     │
│   SQLAlchemy 2.0 (Async)  │  MySQL 8  │  Redis 7  │  Celery        │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

---

<div align="center">

### 📈 Project Stats

<img src="https://img.shields.io/badge/Backend-30%20Models-06B6D4?style=for-the-badge&labelColor=0d1117" alt="Models" />
<img src="https://img.shields.io/badge/API-70%2B%20Endpoints-5B5CEB?style=for-the-badge&labelColor=0d1117" alt="Endpoints" />
<img src="https://img.shields.io/badge/Services-13%20Services-22C55E?style=for-the-badge&labelColor=0d1117" alt="Services" />
<img src="https://img.shields.io/badge/Tests-35%20Tests-F59E0B?style=for-the-badge&labelColor=0d1117" alt="Tests" />
<img src="https://img.shields.io/badge/Metrics-40%2B-EC4899?style=for-the-badge&labelColor=0d1117" alt="Metrics" />
<img src="https://img.shields.io/badge/Gateways-5-A855F7?style=for-the-badge&labelColor=0d1117" alt="Gateways" />

</div>

### Core Engine
- **Automated Reconciliation** — Compares 4 sources (internal DB, gateway, settlement, bank) for every transaction, classifies discrepancies, and assigns confidence scores
- **Fraud Detection** — 7 configurable rule-based checks (velocity, large amounts, duplicates, refund abuse, unusual hours) with cumulative risk scoring
- **Settlement Tracking** — Full lifecycle management with automatic fee calculation and bank record matching
- **Double-Entry Ledger** — Complete accounting journal with trial balance, reversals, and per-account tracking
- **Gateway Health Monitoring** — Real-time latency, uptime, and failure rate tracking across all gateways

### Integrations
- **5 Payment Gateways** — Stripe, Razorpay, PayPal, UPI, Bank Transfer (simulator pattern for dev/testing)
- **Webhook Processing** — HMAC signature verification per gateway, idempotency checks, retry logic, dead letter queue
- **Real-Time Updates** — WebSocket channels for transactions, fraud alerts, settlements, gateway status, and dashboard

### Frontend
- **Premium Marketing Pages** — Landing page, pricing, docs, API docs, about, contact
- **Command Center Dashboard** — Executive KPIs, payment flow visualization, live transaction stream, gateway health cards, top failures
- **Full CRUD Operations** — Transactions, gateways, reconciliation, settlements, ledger, fraud, reports, notifications
- **Multi-Theme Support** — Light, dim, and dark themes with animated transitions

### Infrastructure
- **Prometheus Metrics** — 40+ metrics covering HTTP requests, transactions, reconciliation, fraud, webhooks, gateways, Celery tasks
- **Grafana Dashboards** — Pre-configured monitoring dashboards
- **Docker Compose** — One-command deployment for all services
- **Background Processing** — Celery tasks for batch reconciliation, settlement processing, fraud scanning, report generation, cleanup

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  Landing Page │ Dashboard │ Transactions │ Reconciliation │ ... │
│         React Query + Zustand + Framer Motion + Recharts        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP /api/v1 + WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│                     API GATEWAY (FastAPI)                        │
│  Auth │ Transactions │ Gateways │ Webhooks │ Settlements │ ...  │
│              JWT Auth │ Rate Limiting │ Request Logging          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                     SERVICE LAYER                                │
│  Reconciliation Engine │ Fraud Detector │ Settlement Service     │
│  Gateway Service │ Ledger Service │ Webhook Service │ Rules     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                     DATA LAYER                                   │
│  SQLAlchemy 2.0 (Async) │ MySQL 8 │ Redis 7 │ Celery Workers   │
└─────────────────────────────────────────────────────────────────┘
```

**Request Flow:**
```
Frontend Component
  -> React Query Hook (useTransactions, useFraud, etc.)
    -> API Module (api/transactions.ts)
      -> Fetch Client (adds JWT, handles 401 refresh)
        -> /api/v1/{endpoint}
          -> FastAPI Router
            -> Service Layer
              -> SQLAlchemy AsyncSession -> MySQL
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library with hooks and concurrent features |
| TypeScript | 5.7 | Type-safe development, strict mode |
| Vite | 5 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 12 | Page transitions and micro-animations |
| Zustand | 5 | Lightweight state management (auth, theme, dev stores) |
| TanStack React Query | 5 | Server state management, caching, deduplication |
| Recharts | 2 | Data visualization (area, bar, donut, radar charts) |
| Radix UI | latest | Accessible primitives (dialog, tabs, tooltip, dropdown) |
| React Router | 6 | Client-side routing with lazy loading |
| React Hook Form | 7 | Form state management |
| Zod | 4 | Schema validation |
| cmdk | 1 | Command palette (Ctrl+K) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Core language |
| FastAPI | 0.115 | Async REST API framework |
| SQLAlchemy | 2.0 | Async ORM with session management |
| Pydantic | 2 | Data validation and settings |
| MySQL | 8.0 | Primary relational database |
| Redis | 7 | Caching and Celery message broker |
| Celery | 5 | Background task queue |
| python-jose | latest | JWT token creation and verification |
| passlib + bcrypt | latest | Password hashing |
| structlog | latest | Structured logging |
| prometheus_client | latest | Metrics collection |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization and orchestration |
| Prometheus | Metrics scraping and storage |
| Grafana | Monitoring dashboards and visualization |
| Alembic | Database migrations |

---

## Project Structure

```
Payment-Reconciliation-Engine/
├── backend/
│   ├── app/
│   │   ├── api/v1/                  # 18 API route modules
│   │   │   ├── auth.py              # Signup, login, token refresh
│   │   │   ├── transactions.py      # CRUD, cancel, refund, retry
│   │   │   ├── gateways.py          # Gateway list, simulate, health
│   │   │   ├── webhooks.py          # Stripe/Razorpay/PayPal webhooks
│   │   │   ├── settlements.py       # Settlement list, summaries, process
│   │   │   ├── reconciliation.py    # Run batches, results, resolve
│   │   │   ├── fraud.py             # Scan, cases, resolve, dashboard
│   │   │   ├── ledger.py            # Double-entry entries, trial balance
│   │   │   ├── analytics.py         # Dashboard KPIs, comparisons
│   │   │   ├── reports.py           # Generate, list, CSV export
│   │   │   ├── notifications.py     # Notification CRUD
│   │   │   ├── rules.py             # Reconciliation rules CRUD
│   │   │   ├── search.py            # Global search
│   │   │   ├── websocket.py         # Real-time channel pub/sub
│   │   │   ├── admin.py             # Admin operations
│   │   │   ├── audit.py             # Audit log viewing
│   │   │   ├── monitoring.py        # System monitoring
│   │   │   └── exceptions.py        # Exception management
│   │   ├── core/                    # Config, security, Celery, Redis
│   │   ├── db/                      # Session management, seed data
│   │   ├── models/                  # 30 SQLAlchemy models
│   │   ├── schemas/                 # 9 Pydantic schema modules
│   │   ├── services/                # 13 business logic services
│   │   │   ├── reconciliation_engine.py  # Core reconciliation logic
│   │   │   ├── fraud_detector.py         # 7-rule fraud detection
│   │   │   ├── settlement_service.py     # Settlement lifecycle
│   │   │   ├── ledger_service.py         # Double-entry accounting
│   │   │   ├── gateway_service.py        # Gateway operations
│   │   │   ├── webhook_service.py        # Webhook processing
│   │   │   ├── transaction_service.py    # Transaction management
│   │   │   ├── analytics_service.py      # Dashboard analytics
│   │   │   ├── rule_engine.py            # Rule evaluation
│   │   │   ├── reporting_service.py      # Report generation
│   │   │   ├── search_service.py         # Global search
│   │   │   ├── notification_service.py   # Notifications
│   │   │   └── auth_service.py           # Authentication
│   │   ├── repositories/            # Data access layer (4 repos)
│   │   ├── infrastructure/
│   │   │   ├── gateways/            # 5 gateway simulators
│   │   │   ├── webhooks/            # 3 webhook parsers
│   │   │   ├── metrics/             # Prometheus metrics (40+)
│   │   │   └── realtime/            # WebSocket broadcaster
│   │   ├── middleware/              # Rate limiter, request logging
│   │   ├── tasks/                   # Celery background tasks
│   │   └── main.py                  # FastAPI entrypoint
│   ├── tests/                       # 35 tests (pytest)
│   ├── alembic/                     # Database migrations
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # 10 API modules (fetch-based)
│   │   ├── components/
│   │   │   ├── layout/              # DashboardLayout, Sidebar, Topbar, MarketingLayout
│   │   │   ├── ui/                  # 35+ UI components
│   │   │   ├── effects/             # Aurora, particles, sci-fi effects
│   │   │   └── auth/                # Protected routes, schemas
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx       # Marketing landing page
│   │   │   ├── PricingPage.tsx       # Pricing tiers
│   │   │   ├── DocsPage.tsx          # Documentation
│   │   │   ├── ApiDocsPage.tsx       # API reference
│   │   │   ├── AboutPage.tsx         # About page
│   │   │   ├── ContactPage.tsx       # Contact form
│   │   │   ├── auth/                 # Login, Signup
│   │   │   └── app/                  # Dashboard, Transactions, Gateways,
│   │   │                             # Reconciliation, Settlements, Ledger,
│   │   │                             # Fraud, Reports, Notifications, Settings
│   │   ├── hooks/                    # 12 custom hooks
│   │   ├── store/                    # Zustand stores (auth, theme, dev)
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── styles/globals.css        # CSS variables (light/dim/dark)
│   │   └── App.tsx                   # Route definitions
│   ├── tailwind.config.js
│   └── package.json
│
├── monitoring/
│   ├── prometheus.yml               # Prometheus scrape config
│   └── grafana/dashboards/          # Pre-built Grafana dashboards
│
├── docker-compose.yml               # Full stack orchestration
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **MySQL 8.0**
- **Redis 7** (for Celery)
- **Docker & Docker Compose** (optional)

### Option 1: Docker Compose (Recommended)

```bash
git clone https://github.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine.git
cd Payment-Reconciliation-Engine
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3004 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # configure database credentials
alembic upgrade head       # run migrations
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3004
- Backend API: http://localhost:8000

### Dummy Login

For quick testing, use these credentials:
- **Email:** `ethethamulhaque736@gmail.com`
- **Password:** `Qwerty2123`

---

## API Reference

Base path: `/api/v1`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login, returns JWT access + refresh tokens |
| POST | `/auth/refresh` | Refresh expired access token |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/profile` | Update profile |
| PUT | `/auth/password` | Change password |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Create a new transaction |
| GET | `/transactions` | List transactions (paginated, filterable) |
| GET | `/transactions/{id}` | Get transaction details |
| PUT | `/transactions/{id}/cancel` | Cancel a transaction |
| POST | `/transactions/{id}/refund` | Initiate refund |
| POST | `/transactions/{id}/retry` | Retry failed transaction |
| GET | `/transactions/{id}/events` | Transaction event history |

### Gateways
| Method | Endpoint | Description |
|---|---|---|
| GET | `/gateways` | List all gateways with health status |
| GET | `/gateways/{name}` | Get specific gateway details |
| POST | `/gateways/{name}/simulate` | Simulate a payment through gateway |
| GET | `/gateways/{name}/health` | Get gateway health history |

### Webhooks
| Method | Endpoint | Description |
|---|---|---|
| POST | `/webhooks/stripe` | Receive Stripe webhook events |
| POST | `/webhooks/razorpay` | Receive Razorpay webhook events |
| POST | `/webhooks/paypal` | Receive PayPal webhook events |
| GET | `/webhooks` | List received webhook events |
| POST | `/webhooks/{id}/replay` | Replay a webhook event |

### Reconciliation
| Method | Endpoint | Description |
|---|---|---|
| POST | `/reconciliation/run` | Run reconciliation batch |
| GET | `/reconciliation` | List reconciliation results |
| GET | `/reconciliation/{id}` | Get result details |
| POST | `/reconciliation/{id}/resolve` | Resolve a discrepancy |
| GET | `/reconciliation/mismatches` | List all mismatches |
| GET | `/reconciliation/missing` | List missing records |
| GET | `/reconciliation/duplicates` | List duplicate transactions |

### Settlements
| Method | Endpoint | Description |
|---|---|---|
| GET | `/settlements` | List settlements (paginated) |
| GET | `/settlements/summary` | Get settlement summary stats |
| POST | `/settlements/process` | Process pending settlements |
| GET | `/settlements/{id}` | Get settlement details |
| POST | `/settlements/match-bank` | Match bank records to settlements |

### Fraud
| Method | Endpoint | Description |
|---|---|---|
| POST | `/fraud/scan/{transaction_id}` | Run fraud detection on a transaction |
| GET | `/fraud/cases` | List fraud cases (filterable by status) |
| GET | `/fraud/cases/{id}` | Get case details with evidence |
| POST | `/fraud/cases/{id}/resolve` | Resolve a fraud case |
| GET | `/fraud/dashboard` | Fraud analytics and stats |

### Ledger
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ledger/entries` | Create a ledger entry |
| GET | `/ledger/entries` | List ledger entries |
| GET | `/ledger/transaction/{id}` | Entries for a transaction |
| POST | `/ledger/reverse/{id}` | Reverse a ledger entry |
| GET | `/ledger/trial-balance` | Get trial balance report |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/dashboard` | Dashboard KPIs |
| GET | `/analytics/gateway-comparison` | Per-gateway performance comparison |
| GET | `/analytics/top-failures` | Top 10 failure reasons |

### Other Endpoints
| Module | Endpoints | Description |
|---|---|---|
| Reports | CRUD + CSV export | Generate and export reports |
| Notifications | CRUD | Notification management |
| Rules | CRUD + evaluate | Reconciliation rule management |
| Search | Global search | Search across transactions, merchants, gateways |
| Admin | System admin | Administrative operations |
| Audit | Log viewing | Audit trail |
| Monitoring | Health checks | System monitoring |
| Exceptions | CRUD | Exception record management |

### WebSocket
Connect to `ws://localhost:8000/api/v1/ws/realtime` for real-time updates.

**Channels:**
- `transactions` — Live transaction feed
- `fraud_alerts` — Fraud detection alerts
- `settlements` — Settlement status updates
- `gateway_status` — Gateway health changes
- `dashboard` — Dashboard KPI updates

---

## Reconciliation Engine

The reconciliation engine is the core of the system. When triggered, it:

1. **Batches** up to 500 transactions per run
2. **Compares 4 sources** for each transaction:
   - Internal database status
   - Gateway transaction record
   - Settlement record
   - Bank confirmation
3. **Classifies discrepancies** into 8 types:

| Discrepancy Type | Description |
|---|---|
| `MATCH` | All 4 sources agree — transaction is fully reconciled |
| `AMOUNT_MISMATCH` | Amount differs between sources beyond tolerance (0.01) |
| `MISSING_SETTLEMENT` | No settlement record for a successful transaction |
| `MISSING_GATEWAY` | Transaction succeeded but lacks gateway transaction ID |
| `MISSING_BANK` | No bank confirmation or bank record is unmatched |
| `DUPLICATE` | Multiple transactions with same merchant/amount/currency/gateway within time window |
| `PARTIAL_SETTLEMENT` | Settlement is only partially settled |
| `DELAYED` | Settlement pending for more than 3 days |

4. **Assigns confidence scores** (0.0 to 1.0) based on how closely sources match
5. **Classifies match type**: `EXACT`, `FUZZY`, `RULE_BASED`, or `MANUAL`
6. **Stores results** with full evidence JSON for audit trail
7. **Skips** previously resolved results

---

## Fraud Detection

The fraud detection engine runs **7 configurable rule-based checks**, each contributing additive risk scores:

| Rule | Risk Score | Trigger Condition |
|---|---|---|
| Large Transaction | +0.40 | Amount exceeds threshold (default: 100,000) |
| Velocity | +0.30 | 50+ transactions from same merchant in 60 minutes |
| Duplicate Payment | +0.35 | Same amount/gateway within 300 seconds |
| Refund Abuse | +0.25 | Customer with 3+ refunds |
| Repeated Failures | +0.20 | Merchant with 10+ failed transactions |
| Round Amount | +0.05 | Amount > 1,000 and is an integer |
| Unusual Time | +0.05 | Transaction between 02:00–05:00 UTC |

**When cumulative risk score >= 0.5**, a fraud case is automatically created with:
- Fraud type (highest severity detected)
- Full evidence JSON
- Status: `OPEN` for investigation

Investigators can review cases, filter by status (`open`, `investigating`, `confirmed`, `false_positive`, `resolved`), and resolve with notes.

---

## Gateway Integrations

| Gateway | Simulator | Webhook Support | Signature Verification |
|---|---|---|---|
| Stripe | `StripeSimulator` | Yes | Timestamp + HMAC (t=...;v1=...) |
| Razorpay | `RazorpaySimulator` | Yes | HMAC-SHA256 (x-razorpay-signature) |
| PayPal | `PayPalSimulator` | Yes | paypal-transmission-sig header |
| UPI | `UPISimulator` | No | N/A |
| Bank Transfer | `BankTransferSimulator` | No | N/A |

**Simulator Behavior:**
- Random latency: 100-2000ms (configurable)
- Failure rate: ~10% (insufficient funds, card declined, network error, etc.)
- Timeout rate: ~5%
- Generates unique gateway transaction IDs

**Webhook Processing Pipeline:**
1. Signature verification (gateway-specific)
2. Idempotency check (external ID deduplication)
3. Event storage as `WebhookEvent` record
4. Transaction status update
5. Retry logic (3 attempts with dead letter queue)
6. Full audit trail in `webhook_log`

---

## Dashboard

The dashboard ("Command Center") provides real-time operational visibility:

### Widgets
- **Executive Hero** — KPI cards: total transactions, amount, success rate, pending settlements, fraud cases, active gateways
- **Payment Flow Map** — Visual flow: Created → Processing → Settled/Failed with animated transitions
- **Live Transaction Stream** — Real-time feed via WebSocket with merchant, amount, gateway, and status
- **Gateway Health Center** — Live status cards with latency indicators, uptime bars, and failure rates
- **Top Failures** — Ranked list of failure reasons with progress bars
- **System Health** — Reconciliation accuracy, pending settlements, fraud case count

### Themes
Three built-in themes with smooth animated transitions:
- **Light** — Clean white background
- **Dim** — Dark with reduced contrast
- **Dark** — Full dark mode with cyan accents

---

## Testing

```bash
cd backend
pytest -v
```

**35 tests** covering:
- Authentication (login, register, token refresh, profile)
- Transactions (CRUD, cancel, refund, retry, events, validation)
- Reconciliation engine (matching, discrepancy classification, scoring)
- Fraud detection (all 7 rules, case creation, resolution)
- Webhook parsers (Stripe, Razorpay, PayPal signature verification)
- API endpoints (all major routes)

Tests use **in-memory SQLite** via `aiosqlite` for fast, isolated execution.

---

## Deployment

### Docker Compose (Production)

```bash
docker-compose up -d --build
```

**Services:**
| Service | Port | Description |
|---|---|---|
| frontend | 3004 | React application |
| backend | 8000 | FastAPI application |
| db | 3306 | MySQL database |
| redis | 6379 | Redis cache/broker |
| celery-worker | - | Background task worker |
| celery-beat | - | Periodic task scheduler |

### Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/payflow
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=payflow
DATABASE_USER=root
DATABASE_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Gateway Config
STRIPE_API_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
PAYPAL_CLIENT_ID=...

# CORS
CORS_ORIGINS=["http://localhost:3004"]
```

### Monitoring

```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

**Prometheus metrics** available at `http://localhost:8000/metrics` with `pre_` prefix covering:
- HTTP request count and latency histograms
- Transaction counts by status/gateway/currency
- Reconciliation run counts and result breakdowns
- Fraud case detections by type
- Gateway health status gauges
- Celery task duration histograms
- WebSocket active connections
- Application version info

---

## Current Status

| Module | Status |
|---|---|
| Authentication (JWT + refresh) | Complete |
| Transaction Management (CRUD + lifecycle) | Complete |
| Reconciliation Engine (4-source matching) | Complete |
| Fraud Detection (7 rules) | Complete |
| Settlement Tracking + Ledger | Complete |
| Gateway Simulators (5 gateways) | Complete |
| Webhook Processing (3 gateways) | Complete |
| Real-Time WebSocket | Complete |
| Background Tasks (Celery) | Complete |
| Frontend Dashboard + Marketing | Complete |
| Prometheus Metrics (40+) | Complete |
| Test Suite (35 tests) | Complete |
| Docker Deployment | Complete |

---

<div align="center">

### 👨‍💻 Author

<a href="https://github.com/Mdehteshamulhaque1">
  <img src="https://github.com/Mdehteshamulhaque1.png" width="120" style="border-radius:50%; border: 3px solid #06B6D4; box-shadow: 0 0 20px rgba(6,182,212,0.4);" alt="Ehtesham Ul Haque" />
</a>

<br />

**Ehtesham Ul Haque**

<a href="https://github.com/Mdehteshamulhaque1">
  <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="mailto:ehteshamulhaque736@gmail.com">
  <img src="https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
</a>
<a href="https://www.linkedin.com/in/ehtesham-ul-haque">
  <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>

<br />
<br />

---

### 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Mdehteshamulhaque1/Payment-Reconciliation-Engine&type=Date&theme=dark)](https://star-history.com/#Mdehteshamulhaque1/Payment-Reconciliation-Engine&Date)

<br />

---

### 📊 Contribution Graph

![Contribution Graph](https://github-readme-activity-graph.vercel.app/graph?username=Mdehteshamulhaque1&bg_color=0d1117&color=06B6D4&line=06B6D4&point=FFFFFF&area=true&area_color=06B6D4&hide_border=true)

<br />

---

### ⭐ Support the Project

If you find this project useful, please give it a ⭐ on GitHub!

<br />

<img src="https://raw.githubusercontent.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine/main/frontend/public/hero-dashboard.png" width="100%" alt="Dashboard" />

<br />

---

**Made with ❤️ by Ehtesham Ul Haque**

<img src="https://raw.githubusercontent.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine/main/frontend/public/favicon.svg" width="30" alt="PayFlow" /> **PayFlow** — *Automating Payment Reconciliation*

<br />

---

### 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

<div align="center">

![Visitors](https://komarev.com/ghpvc/?username=Mdehteshamulhaque1&color=06B6D4&style=for-the-badge&label=PROFILE+VISITORS)

</div>
