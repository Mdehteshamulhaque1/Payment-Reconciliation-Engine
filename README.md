<div align="center">

# 💳 Payment Reconciliation Engine

**A fintech platform for automated transaction reconciliation, payment gateway monitoring, and settlement tracking across multiple payment providers.**

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)

[![License](https://img.shields.io/badge/License-Educational-blue?style=flat-square)](#license)
[![Status](https://img.shields.io/badge/Status-Active%20Development-yellow?style=flat-square)](#current-implementation-status)

</div>

---

> **⚠️ Project Status:** This project is in **active development**. The application scaffolding — backend API, database models, authentication, frontend dashboard, Docker setup, and monitoring stack — is implemented and functional. The core **reconciliation engine, AI matching, fraud detection, and gateway integrations are currently placeholder modules** and represent the primary focus of upcoming development. See [Current Implementation Status](#-current-implementation-status) for a transparent breakdown.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Current Implementation Status](#-current-implementation-status)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🧭 Overview

Businesses today process payments across multiple channels — **UPI, Stripe, Razorpay, PayPal, banking APIs, wallets, and card networks**. Each channel generates its own transaction records, settlement reports, and timing delays, making it difficult to verify that every payment is correctly recorded, settled, and accounted for.

**Payment Reconciliation Engine** aims to provide a centralized backend and dashboard to:

- Track transactions across multiple payment gateways
- Reconcile gateway records against internal ledgers and bank settlement files
- Surface mismatches, duplicates, and failed-but-deducted payments
- Monitor gateway/API health and latency
- Provide an analytics dashboard for reconciliation status and reporting

---

## ❗ The Problem

Manual reconciliation across payment systems commonly leads to:

| Issue | Impact |
|---|---|
| Settlement mismatches | Revenue discrepancies between gateway and bank records |
| Duplicate payments | Customer disputes and refund overhead |
| Failed-but-deducted transactions | Customer trust issues, support load |
| Delayed settlement confirmations | Cash-flow visibility gaps |
| Manual Excel-based reconciliation | Slow, error-prone, not scalable |
| API timeouts / gateway failures | Lost or unverified transactions |
| Refund tracking gaps | Incomplete financial records |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI library |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type-safe JavaScript |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build tool & dev server |
| ![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Styling |
| ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | Animations |
| **Zustand** | State management |
| **Recharts** | Data visualization |
| **Axios** | HTTP client |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | Core language |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | REST API framework |
| **SQLAlchemy** | ORM |
| **Pydantic / Pydantic Settings** | Data validation & config management |
| ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Relational database |
| ![Celery](https://img.shields.io/badge/-Celery-37814A?style=flat-square&logo=celery&logoColor=white) | Background task queue (scaffolded) |
| ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | Caching / Celery broker (scaffolded) |
| **Django (admin_panel)** | Audit/admin module |

### Infrastructure
| Technology | Purpose |
|---|---|
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerization |
| ![Prometheus](https://img.shields.io/badge/-Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white) | Metrics collection (scaffolded) |
| ![Grafana](https://img.shields.io/badge/-Grafana-F46800?style=flat-square&logo=grafana&logoColor=white) | Dashboards & visualization (scaffolded) |

---

## 📂 Project Structure

```
Payment-Reconciliation-Engine/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Versioned API routes
│   │   │   ├── auth.py            ✅ implemented
│   │   │   ├── health.py          ✅ implemented
│   │   │   ├── transactions.py    ✅ implemented
│   │   │   ├── reconciliation.py  🚧 stubbed
│   │   │   ├── fraud.py           🚧 stubbed
│   │   │   ├── gateways.py        🚧 stubbed
│   │   │   ├── rules.py           🚧 stubbed
│   │   │   ├── exceptions.py      🚧 stubbed
│   │   │   ├── audit.py           🚧 stubbed
│   │   │   ├── reports.py         🚧 stubbed
│   │   │   ├── search.py          🚧 stubbed
│   │   │   └── websocket.py       🚧 stubbed
│   │   ├── core/             # Config, security, Celery, Redis setup
│   │   ├── db/                # DB session & base
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/             # Business logic
│   │   │   ├── auth_service.py            ✅ implemented
│   │   │   ├── transaction_service.py     ✅ implemented
│   │   │   ├── health_service.py          ✅ implemented
│   │   │   ├── reconciliation_engine.py   🚧 placeholder
│   │   │   ├── ai_matcher.py               🚧 placeholder
│   │   │   ├── fraud_detector.py           🚧 placeholder
│   │   │   ├── rule_engine.py              🚧 placeholder
│   │   │   ├── gateway_service.py          🚧 placeholder
│   │   │   └── notification_service.py     🚧 placeholder
│   │   ├── tasks/              # Celery tasks (scaffolded)
│   │   └── main.py              # FastAPI entrypoint
│   ├── admin_panel/          # Django audit/admin module
│   ├── webhook_service/      # Stripe / Razorpay / PayPal webhook handlers (stubbed)
│   ├── database/             # Seed scripts
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Landing page, layout, auth UI
│   │   ├── pages/
│   │   │   ├── auth/                  # Login / Signup
│   │   │   └── app/                    # Dashboard, Transactions, Reconciliation,
│   │   │                                # Fraud Alerts, Monitoring, Reports, Settings
│   │   ├── services/           # API service layer (axios)
│   │   ├── routes/              # Protected / public route guards
│   │   ├── context/              # Auth context
│   │   └── hooks/, utils/, styles/
│   └── package.json
│
├── monitoring/                # Prometheus & Grafana configuration
├── docker-compose.yml
└── package.json
```

**Legend:** ✅ Implemented &nbsp; | &nbsp; 🚧 Scaffolded / Placeholder

---

## ✅ Current Implementation Status

### Implemented
- FastAPI application with versioned API routing (`/api/v1`)
- Authentication endpoints — login and bearer token validation
- Transaction creation and listing, backed by SQLAlchemy + MySQL
- Health check endpoint with live database connectivity check
- Full set of SQLAlchemy models — transactions, users, gateways, rules, exceptions, audit logs, reconciliation
- React + TypeScript frontend with:
  - Animated landing page (Hero, Features, Stats, Testimonials, CTA, Footer)
  - Authentication pages (Login / Signup)
  - Full dashboard shell — Transactions, Reconciliation, Fraud Alerts, Monitoring, Reports, Settings
  - Protected/public route guards and auth context
- Docker Compose setup — backend, frontend, MySQL, Redis
- Prometheus & Grafana monitoring configuration

### In Progress / Planned
- Core reconciliation matching logic (gateway ↔ internal ↔ bank record comparison)
- AI-based transaction matching
- Fraud and anomaly detection rules
- Rule engine evaluation
- Live gateway integrations and webhook processing (Stripe, Razorpay, PayPal)
- Celery-based background processing (batch reconciliation, imports, report generation)
- Analytics & reporting endpoints
- Real-time updates via WebSockets

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8
- Redis (optional — required for future Celery features)
- Docker & Docker Compose (optional, for containerized setup)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # configure database credentials
uvicorn app.main:app --reload
```

- API: `http://localhost:8000`
- Interactive docs (Swagger): `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # configure API base URL
npm run dev
```

- App: `http://localhost:5173`

### Run with Docker Compose

```bash
docker-compose up --build
```

Starts the backend, frontend, MySQL database, and Redis services together.

---

## 🔌 API Overview

Base path: `/api/v1`

| Endpoint | Status | Description |
|---|---|---|
| `POST /auth/login` | ✅ | Login with credentials, returns bearer token |
| `GET /auth/me` | ✅ | Validate bearer token |
| `GET /health` | ✅ | Health check with DB connectivity status |
| `POST /transactions` | ✅ | Create a transaction record |
| `GET /transactions` | ✅ | List all transactions |
| `GET /reconciliation` | 🚧 | Reconciliation results (stub) |
| `GET /fraud` | 🚧 | Fraud alerts (stub) |
| `GET /gateways` | 🚧 | Gateway status (stub) |
| `GET /rules` | 🚧 | Reconciliation rules (stub) |
| `GET /exceptions` | 🚧 | Exception records (stub) |
| `GET /audit` | 🚧 | Audit logs (stub) |
| `GET /reports` | 🚧 | Reports (stub) |
| `GET /search` | 🚧 | Transaction search (stub) |
| `WS /ws/realtime` | 🚧 | Real-time updates (stub) |

Full interactive documentation is available via Swagger UI at `/docs` once the backend is running.

---

## 🗺 Roadmap

- [ ] Implement core reconciliation matching engine
- [ ] Build fraud detection rules and anomaly scoring
- [ ] Integrate live payment gateway APIs (Stripe, Razorpay, PayPal, UPI)
- [ ] Add Celery-based background processing for batch reconciliation and reports
- [ ] Expand analytics dashboard with real-time data via WebSockets
- [ ] Add automated testing (unit + integration) and CI/CD pipeline
- [ ] Deploy monitoring stack (Prometheus + Grafana) to production

---

## 👤 Author

**Mdehteshamulhaque1**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mdehteshamulhaque1)

---

## 📄 License

This project is developed for **educational and portfolio purposes**.
