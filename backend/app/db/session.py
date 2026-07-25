from sqlalchemy import text

from app.core.config import get_settings
from app.db.base import Base, engine, async_session_factory

ALL_MODELS_IMPORTED = False


def import_all_models() -> None:
    global ALL_MODELS_IMPORTED
    if ALL_MODELS_IMPORTED:
        return

    from app.models import (  # noqa: F401
        user,
        role,
        permission,
        session as session_model,
        refresh_token,
        api_key,
        merchant,
        customer,
        transaction,
        transaction_event,
        idempotency_key,
        currency,
        exchange_rate,
        payment_gateway,
        gateway_health,
        settlement,
        bank_record,
        reconciliation_result,
        reconciliation_rule,
        fraud_case,
        risk_score,
        webhook_event,
        webhook_log,
        ledger_entry,
        notification,
        audit_log,
        activity_log,
        report,
        report_job,
        system_config,
        background_job,
        exception as exception_model,
    )
    ALL_MODELS_IMPORTED = True


async def init_db() -> None:
    import_all_models()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def check_db_health() -> bool:
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
