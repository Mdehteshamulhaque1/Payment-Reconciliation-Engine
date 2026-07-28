from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.gateways import router as gateways_router
from app.api.v1.webhooks import router as webhooks_router
from app.api.v1.settlements import router as settlements_router
from app.api.v1.ledger import router as ledger_router
from app.api.v1.reconciliation import router as reconciliation_router
from app.api.v1.rules import router as rules_router
from app.api.v1.fraud import router as fraud_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.reports import router as reports_router
from app.api.v1.search import router as search_router
from app.api.v1.admin import router as admin_router
from app.api.v1.audit import router as audit_router
from app.api.v1.monitoring import router as monitoring_router
from app.api.v1.exceptions import router as exceptions_router
from app.api.v1.websocket import router as websocket_router
from app.api.v1.checkout import router as checkout_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(checkout_router)
router.include_router(transactions_router)
router.include_router(gateways_router)
router.include_router(webhooks_router)
router.include_router(settlements_router)
router.include_router(ledger_router)
router.include_router(reconciliation_router)
router.include_router(rules_router)
router.include_router(fraud_router)
router.include_router(notifications_router)
router.include_router(analytics_router)
router.include_router(reports_router)
router.include_router(search_router)
router.include_router(admin_router)
router.include_router(audit_router)
router.include_router(monitoring_router)
router.include_router(exceptions_router)
router.include_router(websocket_router)
