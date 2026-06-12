# Payment Reconciliation Engine

A fintech platform designed to automate transaction reconciliation, payment gateway monitoring, and settlement tracking across multiple payment providers (UPI, Stripe, Razorpay, PayPal, and banking APIs).

> **Project status:** Active development. Core scaffolding (authentication, database models, API structure, frontend application, Docker/monitoring setup) is in place. Reconciliation logic, fraud detection, and AI-based matching are currently placeholder implementations and are under active development.

## Overview

Businesses processing payments across multiple gateways and banking channels often face:

- Settlement mismatches between gateway records and internal ledgers
- Duplicate or failed-but-deducted transactions
- Manual, spreadsheet-based reconciliation workflows
- Delayed settlement confirmations and refund tracking issues
- Lack of visibility into gateway latency and API failures

This project aims to provide a unified backend and dashboard for monitoring transactions, detecting mismatches, and reconciling payment data across gateways.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- Recharts
- Axios

**Backend**
- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic / Pydantic Settings
- MySQL (via PyMySQL)
- Celery (task queue scaffolding)
- Redis (caching / broker scaffolding)

**Infrastructure**
- Docker & Docker Compose
- Prometheus & Grafana (monitoring scaffolding)

## Project Structure

```
Payment-Reconciliation-Engine/
├── backend/
│   ├── app/
│   │   ├── api/v1/        # API route modules (auth, transactions, reconciliation, fraud, etc.)
│   │   ├── core/          # Config, security, Celery, Redis setup
│   │   ├── db/            # Database session and base models
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic (reconciliation, fraud detection, etc.)
│   │   ├── tasks/          # Celery task definitions
│   │   └── main.py         # FastAPI application entrypoint
│   ├── admin_panel/        # Django-based admin/audit module
│   ├── webhook_service/    # Gateway webhook handlers (Stripe, Razorpay, PayPal)
│   ├── database/           # Seed scripts
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (landing page, layout, auth, dashboard)
│   │   ├── pages/          # Application pages (dashboard, transactions, reports, etc.)
│   │   ├── services/        # API service layer
│   │   ├── routes/          # Route guards
│   │   ├── context/          # Auth context
│   │   └── hooks/, utils/, styles/
│   └── package.json
├── monitoring/              # Prometheus & Grafana configuration
├── docker-compose.yml
└── package.json
```

## Current Implementation Status

### Implemented
- FastAPI application structure with versioned API routing (`/api/v1`)
- Authentication endpoints (login, token validation)
- Transaction creation and listing endpoints backed by SQLAlchemy/MySQL
- Health check endpoint with database connectivity check
- Database models for transactions, users, gateways, rules, exceptions, audit logs, and reconciliation
- React frontend with landing page, authentication pages (login/signup), and a full dashboard shell (transactions, reconciliation, fraud alerts, monitoring, reports, settings)
- Docker Compose setup for backend, frontend, MySQL, and Redis
- Prometheus/Grafana monitoring configuration scaffold

### In Progress / Planned
- Reconciliation engine logic (currently a placeholder)
- AI-based transaction matching (currently a placeholder)
- Fraud and anomaly detection (currently a placeholder)
- Rule engine evaluation logic
- Gateway integration services and webhook handling (Stripe, Razorpay, PayPal handlers are stubbed)
- Celery task execution for batch reconciliation, imports, and report generation
- Analytics and reporting endpoints
- WebSocket-based real-time updates

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8
- Redis (optional, required for future Celery features)
- Docker & Docker Compose (optional, for containerized setup)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # update database credentials as needed
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # update API base URL as needed
npm run dev
```

### Running with Docker Compose

```bash
docker-compose up --build
```

This starts the backend, frontend, MySQL database, and Redis services.

## Roadmap

- Implement core reconciliation matching logic between gateway, internal, and bank records
- Build out fraud detection rules and anomaly scoring
- Integrate live payment gateway APIs (Stripe, Razorpay, PayPal, UPI)
- Add Celery-based background processing for batch reconciliation and report generation
- Expand analytics dashboard with real-time data
- Add automated testing and CI/CD pipeline

## Author

**Mdehteshamulhaque1**
GitHub: [https://github.com/Mdehteshamulhaque1](https://github.com/Mdehteshamulhaque1)

## License

This project is developed for educational and portfolio purposes.
