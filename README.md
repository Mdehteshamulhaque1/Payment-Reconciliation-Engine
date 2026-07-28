<div align="center">

<img src="https://img.shields.io/badge/💳-PayFlow_%7C_Payment_Reconciliation_Engine-1e40af?style=for-the-badge&labelColor=0d1117&color=1e40af" alt="PayFlow" />

<br />

# ⚡ PayFlow — Payment Reconciliation Engine

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=1E40AF&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=100&lines=Automated+Transaction+Reconciliation;Fraud+Detection+%26+Settlement+Tracking;Multi-Gateway+Payment+Platform" alt="Typing SVG" />

<br />

<a href="https://github.com/Mdehteshamulhaque1/Payment-Reconciliation-Engine">
  <img src="https://img.shields.io/badge/Version-2.0.0-1e40af?style=for-the-badge&labelColor=0d1117" alt="Version" />
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

![Python 3.14](https://img.shields.io/badge/Python_3.14-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React 18](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-37814A?style=flat-square&logo=celery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

<br />

---

**PayFlow** is a production-grade fintech platform that automates transaction reconciliation across **12+ payment gateways**, detects fraud in real-time with 7 configurable rules, tracks settlements with double-entry ledger accounting, and provides a live operational dashboard with an interactive walkthrough demo.

---

</div>

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Reconciliation Engine](#reconciliation-engine)
- [Fraud Detection](#fraud-detection)
- [Gateway Integrations](#gateway-integrations)
- [Dashboard](#dashboard)
- [Python-Focused Architecture](#python-focused-architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Current Status](#current-status)
- [Author](#author)
- [License](#license)

---

## Overview

**PayFlow** is a full-stack fintech platform that automates payment reconciliation across **12+ payment gateways**, detects fraud in real-time, tracks settlements with double-entry ledger accounting, and provides a live operational dashboard.

Built for businesses processing payments through **Stripe, Razorpay, PayPal, PhonePe, GPay, PayU, CCAvenue, Worldpay, Adyen, Square, Braintree, Checkout.com, UPI, and bank transfers**, it eliminates slow, error-prone manual reconciliation and replaces it with automated, rule-driven matching with confidence scoring.

### Deployed URLs

| Service | URL |
|---|---|
| **Frontend (Vercel)** | `https://payment-reconciliation-engine.vercel.app` |
| **Backend API (Render)** | `https://payflow-backend-n4by.onrender.com` |
| **Swagger Docs** | `https://payflow-backend-n4by.onrender.com/docs` |
| **Prometheus Metrics** | `https://payflow-backend-n4by.onrender.com/metrics` |

### Login Credentials

| Field | Value |
|---|---|
| Email | `qwerty123@gmail.com` |
| Password | `12345@123` |

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
| Fragmented gateway dashboards | No single source of truth across 12+ providers |

**PayFlow solves all of them** through automated multi-source reconciliation, real-time fraud detection, and a centralized command center dashboard.

---

## Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🔄 Automated Reconciliation
> Compares **4 sources** (internal DB, gateway, settlement, bank) for every transaction across 12+ gateways, classifies 8 discrepancy types, and assigns confidence scores (0.0–1.0).

</td>
<td width="50%" valign="top">

### 🛡️ Fraud Detection
> **7 configurable rules** (velocity, large amounts, duplicates, refund abuse, unusual hours, round amounts, repeated failures) with cumulative risk scoring that auto-creates fraud cases above 0.5 threshold.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💰 Settlement Tracking
> Full lifecycle management (pending → processing → settled/failed) with automatic fee calculation, bank record matching, and double-entry ledger accounting.

</td>
<td width="50%" valign="top">

### ⚡ Real-Time Dashboard
> Executive KPIs with animated counters, payment flow visualization, live WebSocket transaction stream, gateway health monitoring with inline SVG brand logos, and a Command Palette (Ctrl+K).

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 12+ Gateway Integrations
> Stripe, Razorpay, PayPal, PhonePe, GPay, PayU, CCAvenue, Worldpay, Adyen, Square, Braintree, Checkout.com, UPI, Bank Transfer — with webhook processing, HMAC verification, and health monitoring.

</td>
<td width="50%" valign="top">

### 🎮 Interactive Demo Walkthrough
> 14-step **auto-playing walkthrough** with video-player controls (play/pause/skip/progress bar) — simulates every page with mock UI. Launches from "Watch Demo" or feature card clicks on the landing page.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🐍 Python-First Architecture
> Pure Python utilities package (`@timer`, `@retry`, `@cached` decorators, `Protocol` for structural subtyping, context managers, formatters, validators) — zero external dependencies. Configured with `ruff`, `mypy`, and `pre-commit`.

</td>
<td width="50%" valign="top">

### 📊 Prometheus Metrics
> **40+ metrics** (`pre_*` prefix) covering HTTP requests, transactions, reconciliation, fraud, webhooks, WebSockets, Celery tasks, and gateway health — served at `/metrics` for Prometheus scraping.

</td>
</tr>
</table>

---

## Live Demo

### Interactive Walkthrough
Click **"Watch Demo"** on the landing page hero to launch a 14-step auto-playing walkthrough that demonstrates every feature of PayFlow — no login required.

### Try the Live App
1. Visit the deployed frontend
2. Login with `qwerty123@gmail.com` / `12345@123`
3. Explore the dashboard, transactions, fraud detection, reconciliation, and more

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite + TS)                        │
│  LandingPage │ Dashboard │ Transactions │ Fraud │ Reconciliation │ ...     │
│  Zustand (state) + TanStack Query (server) + Framer Motion (animation)     │
│  Recharts (charts) + Radix UI (accessibility) + cmdk (command palette)     │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ HTTP /api/v1 + WebSocket (ws)
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         API GATEWAY (FastAPI)                                │
│  Auth │ Transactions │ Gateways │ Webhooks │ Settlements │ Fraud │ ...     │
│  JWT Auth │ Rate Limiting │ Request ID │ Security Headers │ Structured Log │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                             SERVICE LAYER                                    │
│  ReconciliationEngine │ FraudDetectionEngine │ SettlementService            │
│  GatewayService │ LedgerService │ WebhookService │ AuthService │ RuleEngine │
│  AnalyticsService │ ReportingService │ SearchService │ NotificationService  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         REPOSITORY / DATA LAYER                              │
│  BaseRepository[T] │ TransactionRepo │ FraudRepo │ SettlementRepo           │
│  ReconciliationRepo — generic CRUD with domain-specific query methods       │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                                  │
│  Gateways (12+ simulators) │ Webhooks (3 parsers) │ Metrics (prometheus)    │
│  Realtime (WebSocket pub/sub) │ Redis (cache) │ Celery (background tasks)  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                             DATA STORES                                      │
│  PostgreSQL (primary) │ Redis (cache/broker) │ SQLite (test in-memory)      │
│  30 SQLAlchemy 2.0 async models │ Alembic migrations │ 70+ API endpoints    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Request Flow:**
```
Frontend (React)
  -> React Query Hook (useTransactions, useFraud, etc.)
    -> API Module (client.ts — fetch-based with JWT refresh interceptor)
      -> Fetch Client (adds Bearer token, handles 401 → refresh loop)
        -> /api/v1/{endpoint}
          -> FastAPI Router (auth, validation)
            -> Service Layer (business logic)
              -> Repository (data access)
                -> SQLAlchemy AsyncSession → PostgreSQL
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library with hooks and concurrent features |
| TypeScript | 5.7 | Type-safe development, strict mode |
| Vite | 5 | Build tool and dev server (port 3004) |
| Tailwind CSS | 3.4 | Utility-first styling with CSS variables theming |
| Framer Motion | 12 | Page transitions, scroll animations, micro-interactions |
| Zustand | 5 | Lightweight state management (auth, theme, dev stores) |
| TanStack React Query | 5 | Server state management, caching, deduplication |
| Recharts | 2 | Data visualization (area, bar, donut, radar charts) |
| Radix UI | latest | Accessible primitives (dialog, tabs, tooltip, dropdown) |
| React Router | 6 | Client-side routing with lazy loading |
| React Hook Form | 7 | Form state management |
| Zod | 4 | Schema validation |
| cmdk | 1 | Command palette (Ctrl+K) |
| lucide-react | latest | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.14 | Core language (async-native) |
| FastAPI | 0.115 | Async REST API framework with OpenAPI |
| SQLAlchemy | 2.0 | Async ORM with session management |
| Pydantic | 2 | Data validation and settings management |
| PostgreSQL | 16 | Primary relational database (Render managed) |
| Redis | 7 | Caching and Celery message broker |
| Celery | 5 | Background task queue (reconciliation, settlements, reports, cleanup) |
| python-jose | latest | JWT token creation and verification |
| bcrypt + passlib | latest | Password hashing |
| structlog | latest | Structured logging |
| prometheus_client | latest | Metrics collection (40+ metrics, `pre_*` prefix) |
| Ruff | 0.5+ | Python linter and formatter |
| mypy | 1.10+ | Static type checking |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization and orchestration |
| Prometheus | Metrics scraping and storage |
| Grafana | Monitoring dashboards and visualization |
| Alembic | Database migrations |
| Vercel | Frontend hosting (React/Vite) |
| Render | Backend hosting (FastAPI + PostgreSQL) |

---

## Project Structure

```
Payment-Reconciliation-Engine/
├── backend/
│   ├── app/
│   │   ├── api/v1/                  # 18 API route modules (auth, transactions, fraud, etc.)
│   │   ├── core/                    # Config, security, Celery, Redis, exceptions, logging
│   │   ├── db/                      # Base engine, session factory, seed data, migrations
│   │   ├── models/                  # 30 SQLAlchemy async models (User, Transaction, etc.)
│   │   ├── schemas/                 # 9 Pydantic v2 schema modules (request/response validation)
│   │   ├── services/                # 13 business logic services
│   │   │   ├── reconciliation_engine.py  # Core 4-source reconciliation engine
│   │   │   ├── fraud_detector.py         # 7-rule fraud detection engine
│   │   │   ├── settlement_service.py     # Settlement lifecycle management
│   │   │   ├── ledger_service.py         # Double-entry accounting
│   │   │   ├── gateway_service.py        # Gateway operations & health
│   │   │   ├── webhook_service.py        # Webhook processing pipeline
│   │   │   ├── transaction_service.py    # Transaction CRUD & lifecycle
│   │   │   ├── analytics_service.py      # Dashboard KPIs & aggregations
│   │   │   ├── rule_engine.py            # Configurable rule evaluation
│   │   │   ├── reporting_service.py      # Report generation & CSV export
│   │   │   ├── search_service.py         # Global search across entities
│   │   │   ├── notification_service.py   # Multi-channel notifications
│   │   │   └── auth_service.py           # Authentication & authorization
│   │   ├── repositories/            # 5 repository classes (generic CRUD + domain queries)
│   │   ├── middleware/              # Rate limiter, request ID, request logging, security headers
│   │   ├── infrastructure/
│   │   │   ├── gateways/            # 12+ gateway simulators + registry pattern
│   │   │   ├── webhooks/            # 3 webhook parsers (Stripe, Razorpay, PayPal)
│   │   │   ├── metrics/             # Prometheus metrics with MetricsCollector
│   │   │   └── realtime/            # WebSocket ConnectionManager with channel pub/sub
│   │   ├── tasks/                   # 7 Celery background tasks (reconciliation, fraud, etc.)
│   │   ├── utils/                   # Pythonic utilities (decorators, protocols, validators, etc.)
│   │   │   ├── __init__.py          # Public API with __all__ exports
│   │   │   ├── decorators.py        # @timer, @retry, @cached, @rate_limit
│   │   │   ├── context_managers.py  # TimerContext, suppress_exceptions, db_timer
│   │   │   ├── validators.py        # Pure Python validators (currency, amount, email, status)
│   │   │   ├── formatters.py        # Currency, duration, file size, card masking
│   │   │   ├── protocols.py         # Repository, PaymentGateway, Cacheable protocols
│   │   │   └── typing_helpers.py    # TypeAliases (JSON, Headers, Filters) + sentinel
│   │   └── main.py                  # FastAPI entrypoint with lifespan, CORS, middleware
│   ├── tests/                       # 35 pytest tests (6 test modules)
│   ├── alembic/                     # Database migration scripts
│   ├── pyproject.toml               # Modern Python packaging (ruff, mypy, pytest config)
│   ├── .pre-commit-config.yaml      # Pre-commit hooks (ruff, mypy, trailing whitespace)
│   └── requirements.txt             # Production + dev dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # 10 API modules with fetch-based client
│   │   ├── components/
│   │   │   ├── layout/              # DashboardLayout, Sidebar, Topbar, MarketingLayout
│   │   │   ├── ui/                  # 35+ UI components (Card, Button, Badge, HudStat, etc.)
│   │   │   ├── demo/                # DemoWalkthrough.tsx — 14-step interactive walkthrough
│   │   │   ├── effects/             # Aurora, particles, sci-fi ambient effects
│   │   │   └── auth/                # ProtectedRoute, login/signup schemas
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # E-commerce style landing (ScrollReveal, CountUp, etc.)
│   │   │   ├── PricingPage.tsx      # Pricing tiers with toggle
│   │   │   ├── DocsPage.tsx         # Technical documentation
│   │   │   ├── ApiDocsPage.tsx      # API reference
│   │   │   ├── AboutPage.tsx        # About the team
│   │   │   ├── ContactPage.tsx      # Contact form
│   │   │   ├── auth/                # LoginPage (with random dev jokes), SignupPage
│   │   │   └── app/                 # 10 dashboard pages (Dashboard, Transactions, etc.)
│   │   ├── hooks/                   # 12 custom React Query hooks
│   │   ├── store/                   # Zustand stores (auth, theme, dev)
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── styles/globals.css       # CSS variables (light blue → deep blue theme, 3 modes)
│   │   └── App.tsx                  # Route definitions, GatewayLoader splash screen
│   ├── tailwind.config.js
│   └── package.json
│
├── monitoring/
│   ├── prometheus.yml               # Prometheus scrape configuration
│   └── grafana/dashboards/          # Pre-built Grafana dashboard JSON
│
├── docker-compose.yml               # Full stack orchestrations
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python 3.12+** (3.14 recommended)
- **Node.js 18+**
- **PostgreSQL 16** (or SQLite for local dev)
- **Redis 7** (for Celery tasks)
- **Docker & Docker Compose** (optional, for containerized setup)

### Option 1: Docker Compose (Full Stack)

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

| Field | Value |
|---|---|
| Email | `qwerty123@gmail.com` |
| Password | `12345@123` |

---

## API Reference

Base path: `/api/v1`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login, returns JWT access + refresh tokens |
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/refresh` | Refresh expired access token |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/profile` | Update profile |
| PUT | `/auth/password` | Change password |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Create a new transaction |
| GET | `/transactions` | List transactions (paginated, filterable) |
| GET | `/transactions/{id}` | Get transaction details with events |
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

### Fraud Detection
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
| GET | `/ledger/entries` | List ledger entries (paginated) |
| GET | `/ledger/transaction/{id}` | Entries for a specific transaction |
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

```
ws://localhost:8000/api/v1/ws/realtime
```

**Channels:**
- `transactions` — Live transaction feed
- `fraud_alerts` — Fraud detection alerts
- `settlements` — Settlement status updates
- `gateway_status` — Gateway health changes
- `dashboard` — Dashboard KPI updates

### Prometheus Metrics

```
GET /metrics
```

Returns 40+ metrics with `pre_` prefix covering HTTP, transactions, reconciliation, fraud, webhooks, WebSockets, Celery tasks, and gateway health.

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
| Duplicate Payment | +0.35 | Same amount/gateway within 300 seconds |
| Velocity | +0.30 | 50+ transactions from same merchant in 60 minutes |
| Refund Abuse | +0.25 | Customer with 3+ refunds |
| Repeated Failures | +0.20 | Merchant with 10+ failed transactions |
| Round Amount | +0.05 | Amount > 1,000 and is an integer |
| Unusual Time | +0.05 | Transaction between 02:00–05:00 UTC |

**When cumulative risk score >= 0.5**, a fraud case is automatically created with:
- Fraud type (highest severity detected)
- Full evidence JSON with factors, transaction reference, and amount
- Status: `OPEN` for investigation

Investigators can review cases, filter by status (`open`, `investigating`, `confirmed`, `false_positive`, `resolved`), and resolve with notes.

---

## Gateway Integrations

### Simulated Gateways

| Gateway | Simulator | Webhook Support | Signature Verification |
|---|---|---|---|
| Stripe | `StripeSimulator` | Yes | Timestamp + HMAC (t=...;v1=...) |
| Razorpay | `RazorpaySimulator` | Yes | HMAC-SHA256 (x-razorpay-signature) |
| PayPal | `PayPalSimulator` | Yes | paypal-transmission-sig header |
| UPI | `UPISimulator` | No | N/A |
| Bank Transfer | `BankTransferSimulator` | No | N/A |

### Frontend Gateway Logos

12+ gateway brand logos rendered as inline SVGs on the landing page and login page: **Stripe, PayPal, Razorpay, PhonePe, GPay, Square, PayU, CCAvenue, Worldpay, Adyen, Braintree, Checkout.com** — percentage-based sizing to fill their boxes.

### Simulator Behavior

- Random latency: 100-2000ms (configurable)
- Failure rate: ~10% (insufficient funds, card declined, network error, etc.)
- Timeout rate: ~5%
- Generates unique gateway transaction IDs

### Webhook Processing Pipeline

1. Signature verification (gateway-specific)
2. Idempotency check (external ID deduplication)
3. Event storage as `WebhookEvent` record
4. Transaction status update
5. Retry logic (3 attempts with dead letter queue)
6. Full audit trail in `webhook_log`

---

## Dashboard

The dashboard ("Command Center") provides real-time operational visibility:

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPIs, live stream, gateway health, flow map |
| `/transactions` | Transactions | CRUD, search, filter, status management |
| `/gateways` | Gateways | Gateway list, health, simulate |
| `/reconciliation` | Reconciliation | Run batches, view results, resolve |
| `/settlements` | Settlements | List, process, match bank records |
| `/ledger` | Ledger | Double-entry entries, trial balance |
| `/fraud` | Fraud | Dashboard, cases, scan, resolve |
| `/reports` | Reports | Generate, list, CSV export |
| `/notifications` | Notifications | View, mark read |
| `/settings` | Settings | Profile, password, API keys |

### Widgets

- **Executive Hero** — KPI cards: total transactions, amount, success rate, pending settlements, fraud cases, active gateways
- **Payment Flow Map** — Visual flow: Created → Processing → Settled/Failed with animated transitions
- **Live Transaction Stream** — Real-time feed via WebSocket with merchant, amount, gateway, and status
- **Gateway Health Center** — Live status cards with latency indicators, uptime bars, and failure rates
- **Top Failures** — Ranked list of failure reasons with progress bars
- **System Health** — Reconciliation accuracy, pending settlements, fraud case count

### Themes

Three built-in themes with smooth animated transitions:

| Theme | Background | Primary Color |
|---|---|---|
| **Light** | White (#ffffff) | Blue (#1e40af) |
| **Dim** | Dark gray (#1a1d29) | Light blue (#60a5fa) |
| **Dark** | Near black (#0f111a) | Soft blue (#93c5fd) |

All themes use the same light-blue → deep-blue color family for visual consistency.

### Interactive Demo Walkthrough

The 14-step walkthrough covers every page with video-player-style controls:
- Play/Pause
- Skip forward/backward
- Progress bar
- Step indicator dots
- 8s auto-advance per step

---

## Python-Focused Architecture

The backend is designed with Python-first patterns throughout, showcasing modern Python features:

### Decorators (`app/utils/decorators.py`)

```python
from app.utils.decorators import timer, retry, cached, rate_limit

@timer
async def reconcile(): ...  # auto-logs execution time

@retry(max_attempts=3, delay=1.0, exceptions=(ConnectionError,))
async def fetch_gateway(): ...  # exponential backoff

@cached(ttl=300, maxsize=128)
async def get_stats(): ...  # in-memory TTL cache with LRU eviction

@rate_limit(max_calls=10, period=60)
def call_external_api(): ...  # sliding window rate limiter
```

### Protocols (`app/utils/protocols.py`)

```python
from app.utils.protocols import Repository, PaymentGateway, Cacheable

# Structural subtyping — no inheritance required
repo: Repository[Transaction]
gateway: PaymentGateway
cache: Cacheable
```

### Context Managers (`app/utils/context_managers.py`)

```python
from app.utils.context_managers import TimerContext, suppress_exceptions

with TimerContext("batch_reconciliation") as t:
    run_reconciliation()
print(f"Took {t.elapsed_ms}ms")

with suppress_exceptions(ConnectionError, default=[]):
    result = await fetch_data()
```

### Validators (`app/utils/validators.py`)

```python
from app.utils.validators import validate_currency, validate_amount, validate_status_transition

validate_currency("INR")      # (True, '')
validate_amount(99999.99)      # (True, '')
validate_status_transition("created", "pending")  # (True, '')
```

### Formatters (`app/utils/formatters.py`)

```python
from app.utils.formatters import format_currency, format_duration

format_currency(1234567.89, "INR")  # "₹12,34,567.89"
format_duration(3661)               # "1h 1m 1s"
```

### Developer Tooling

```bash
# Lint and format
ruff check app/ --fix
ruff format app/

# Type check
mypy app/

# Run pre-commit hooks
pre-commit run --all-files
```

Configuration in `pyproject.toml` includes:
- Ruff: 20+ select rules (pycodestyle, pyflakes, isort, pyupgrade, bugbear, comprehensions)
- mypy: strict optional, redundant casts, unused ignores
- pytest: asyncio auto-mode, coverage reporting
- Coverage: 70% minimum, source-only for `app/`

---

## Testing

```bash
cd backend
pytest -v
```

**35 tests** across 6 test modules:

| Module | Tests | Coverage |
|---|---|---|
| `test_basic.py` | 3 | Root, health, docs endpoints |
| `test_api_endpoints.py` | 4 | Root, health, metrics, docs, OpenAPI |
| `test_reconciliation_engine.py` | 5 | Exact match, amount mismatch, missing settlement, failed txn, accuracy metrics |
| `test_fraud_detector.py` | 4 | Normal scan, large amount, case creation, dashboard |
| `test_webhook_parsers.py` | 14 | Stripe (5), Razorpay (3), PayPal (3), Registry (3) |
| `api/test_auth.py` | 2 | Signup, login |
| `api/test_transactions.py` | 2 | Create, list |

All tests use **in-memory SQLite** via `aiosqlite` for fast, isolated execution with `pytest-asyncio`.

---

## Deployment

### Production Architecture

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | vercel.app domain |
| Backend | Render | onrender.com domain |
| Database | Render PostgreSQL | Managed PostgreSQL 16 |
| Cache | (optional) | Redis / Upstash |

### Environment Variables

Set these on Render (Backend):

```env
ENVIRONMENT=production
SECRET_KEY=<generate-a-random-secret>
DATABASE_URL=postgresql://user:pass@host:5432/payflow
REDIS_URL=redis://...
CELERY_BROKER_URL=redis://...
CORS_ORIGINS=["http://localhost:3004","http://localhost:3000","https://your-vercel-app.vercel.app"]
```

Set these on Vercel (Frontend):

```env
VITE_API_URL=https://payflow-backend-n4by.onrender.com
```

The frontend automatically falls back to the Render backend URL in production if `VITE_API_URL` is not set.

### Docker Compose (Full Stack)

```bash
docker-compose up -d --build
```

| Service | Port | Description |
|---|---|---|
| frontend | 3004 | React application |
| backend | 8000 | FastAPI application |
| db | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache/broker |
| celery-worker | - | Background task worker |
| celery-beat | - | Periodic task scheduler |

---

## Current Status

| Module | Status |
|---|---|
| Authentication (JWT + refresh + role-based) | Complete |
| Transaction Management (CRUD + lifecycle + events) | Complete |
| Reconciliation Engine (4-source matching, 8 discrepancy types) | Complete |
| Fraud Detection (7 rules, cumulative scoring, case management) | Complete |
| Settlement Tracking + Double-Entry Ledger | Complete |
| Gateway Simulators (5 simulated + 12+ frontend logos) | Complete |
| Webhook Processing (Stripe, Razorpay, PayPal with retry) | Complete |
| Real-Time WebSocket (5 channels pub/sub) | Complete |
| Background Tasks (Celery: reconciliation, settlements, fraud, reports, cleanup) | Complete |
| Frontend Dashboard + 6 Marketing Pages + Interactive Walkthrough | Complete |
| Prometheus Metrics (40+ with `pre_` prefix) | Complete |
| Test Suite (35 tests, in-memory SQLite) | Complete |
| Python Utils Package (decorators, protocols, validators, etc.) | Complete |
| Python Tooling (ruff, mypy, pre-commit, pyproject.toml) | Complete |
| CSS Variable Theming (Light, Dim, Dark — blue family) | Complete |
| Docker Deployment (full stack compose) | Complete |
| Vercel Frontend Deployment | Complete |
| Render Backend + PostgreSQL Deployment | Complete |

---

<div align="center">

### 👨‍💻 Author

<a href="https://github.com/Mdehteshamulhaque1">
  <img src="https://github.com/Mdehteshamulhaque1.png" width="120" style="border-radius:50%; border: 3px solid #1e40af; box-shadow: 0 0 20px rgba(30,64,175,0.4);" alt="Ehtesham Ul Haque" />
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

![Contribution Graph](https://github-readme-activity-graph.vercel.app/graph?username=Mdehteshamulhaque1&bg_color=0d1117&color=1e40af&line=1e40af&point=FFFFFF&area=true&area_color=1e40af&hide_border=true)

<br />

---

### ⭐ Support the Project

If you find this project useful, please give it a ⭐ on GitHub!

<br />

---

**Made with ❤️ by Ehtesham Ul Haque**

<br />

**PayFlow** — *Automating Payment Reconciliation for the Modern Fintech Stack*

<br />

---

### 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

<div align="center">

![Visitors](https://komarev.com/ghpvc/?username=Mdehteshamulhaque1&color=1e40af&style=for-the-badge&label=PROFILE+VISITORS)

</div>

</div>
