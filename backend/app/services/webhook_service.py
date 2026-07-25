"""Production webhook processing — signature verification, idempotency, retry, dead letter queue."""

import hashlib
import hmac
import json
from datetime import datetime, timezone
from typing import Any

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import NotFoundException, WebhookException
from app.models.webhook_event import WebhookEvent, WebhookEventStatus, WebhookSource
from app.models.webhook_log import WebhookLog

logger = structlog.get_logger("services.webhook_service")

WEBHOOK_SECRETS: dict[str, str] = {}


def _get_webhook_secret(source: str) -> str:
    settings = get_settings()
    secrets = {
        "stripe": settings.STRIPE_WEBHOOK_SECRET,
        "razorpay": settings.RAZORPAY_WEBHOOK_SECRET,
    }
    return secrets.get(source, "")


def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    if not signature or not secret:
        return False
    if not hmac.compare_digest.__doc__:
        pass
    expected = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def verify_stripe_signature(payload: bytes, sig_header: str, secret: str) -> bool:
    if not sig_header or not secret:
        return False
    try:
        parts = {}
        for item in sig_header.split(","):
            key, value = item.split("=", 1)
            parts[key.strip()] = value.strip()
        timestamp = parts.get("t", "")
        expected_sig = parts.get("v1", "")
        signed_payload = f"{timestamp}.{payload.decode('utf-8')}"
        expected = hmac.new(secret.encode("utf-8"), signed_payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, expected_sig):
            return False
        abs_diff = abs(datetime.now(timezone.utc).timestamp() - float(timestamp))
        return abs_diff <= settings.WEBHOOK_SIGNATURE_TOLERANCE
    except Exception:
        return False


def verify_razorpay_signature(payload: bytes, signature: str, secret: str) -> bool:
    if not signature or not secret:
        return False
    expected = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


async def receive_webhook(
    db: AsyncSession,
    source: str,
    payload: dict,
    signature: str | None = None,
    raw_body: bytes | None = None,
) -> WebhookEvent:
    settings = get_settings()

    if raw_body and signature:
        secret = _get_webhook_secret(source)
        if source == "stripe":
            if not verify_stripe_signature(raw_body, signature, secret):
                logger.warning("webhook_signature_invalid", source=source)
        elif source == "razorpay":
            if not verify_razorpay_signature(raw_body, signature, secret):
                logger.warning("webhook_signature_invalid", source=source)

    event_type = payload.get("type") or payload.get("event") or payload.get("event_type") or "unknown"
    external_id = payload.get("id") or payload.get("data", {}).get("id") or None

    if external_id:
        existing = await db.execute(
            select(WebhookEvent).where(
                WebhookEvent.source == source,
                WebhookEvent.external_id == external_id,
            )
        )
        if existing.scalar_one_or_none():
            logger.info("webhook_idempotent_skip", source=source, external_id=external_id)
            raise WebhookException(source=source, detail="Duplicate webhook event (idempotent)")

    event = WebhookEvent(
        source=source,
        event_type=event_type,
        external_id=external_id,
        payload_json=json.dumps(payload),
        signature=signature,
        status=WebhookEventStatus.RECEIVED,
        max_retries=settings.MAX_RETRY_ATTEMPTS,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    logger.info("webhook_received", source=source, event_type=event_type, event_id=event.id)
    return event


async def process_webhook(db: AsyncSession, webhook_id: int) -> WebhookEvent:
    result = await db.execute(select(WebhookEvent).where(WebhookEvent.id == webhook_id))
    event = result.scalar_one_or_none()
    if not event:
        raise NotFoundException("WebhookEvent", webhook_id)

    event.status = WebhookEventStatus.PROCESSING
    await db.commit()

    start = datetime.now(timezone.utc)
    try:
        payload = json.loads(event.payload_json) if event.payload_json else {}
        await _handle_webhook_event(db, event.source, event.event_type, payload)

        event.status = WebhookEventStatus.PROCESSED
        event.processed_at = datetime.now(timezone.utc)
        duration_ms = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)

        log = WebhookLog(
            webhook_event_id=event.id,
            attempt=event.retry_count + 1,
            status_code=200,
            response_body="Processed successfully",
            duration_ms=duration_ms,
        )
        db.add(log)
        logger.info("webhook_processed", event_id=event.id, source=event.source, event_type=event.event_type, duration_ms=duration_ms)

    except Exception as e:
        event.retry_count += 1
        if event.retry_count >= event.max_retries:
            event.status = WebhookEventStatus.FAILED
        else:
            event.status = WebhookEventStatus.RETRYING
        event.error_message = str(e)
        duration_ms = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)

        log = WebhookLog(
            webhook_event_id=event.id,
            attempt=event.retry_count,
            status_code=500,
            response_body=str(e),
            error=str(e),
            duration_ms=duration_ms,
        )
        db.add(log)
        logger.error("webhook_processing_failed", event_id=event.id, error=str(e), attempt=event.retry_count)

    await db.commit()
    await db.refresh(event)
    return event


async def _handle_webhook_event(db: AsyncSession, source: str, event_type: str, payload: dict) -> None:
    if source == "stripe":
        await _handle_stripe_event(db, event_type, payload)
    elif source == "razorpay":
        await _handle_razorpay_event(db, event_type, payload)
    elif source == "paypal":
        await _handle_paypal_event(db, event_type, payload)
    else:
        logger.info("webhook_unhandled_source", source=source, event_type=event_type)


async def _handle_stripe_event(db: AsyncSession, event_type: str, payload: dict) -> None:
    data = payload.get("data", {}).get("object", {})
    if event_type == "payment_intent.succeeded":
        await _update_transaction_from_webhook(db, data, "success", "stripe")
    elif event_type == "payment_intent.payment_failed":
        await _update_transaction_from_webhook(db, data, "failed", "stripe")
    elif event_type == "charge.refunded":
        await _update_transaction_from_webhook(db, data, "refunded", "stripe")
    logger.info("stripe_event_handled", event_type=event_type)


async def _handle_razorpay_event(db: AsyncSession, event_type: str, payload: dict) -> None:
    if event_type == "payment.captured":
        data = payload.get("payload", {}).get("payment", {}).get("entity", {})
        await _update_transaction_from_webhook(db, data, "success", "razorpay")
    elif event_type == "payment.failed":
        data = payload.get("payload", {}).get("payment", {}).get("entity", {})
        await _update_transaction_from_webhook(db, data, "failed", "razorpay")
    logger.info("razorpay_event_handled", event_type=event_type)


async def _handle_paypal_event(db: AsyncSession, event_type: str, payload: dict) -> None:
    resource = payload.get("resource", {})
    if event_type == "PAYMENT.CAPTURE.COMPLETED":
        await _update_transaction_from_webhook(db, resource, "success", "paypal")
    elif event_type == "PAYMENT.CAPTURE.DENIED":
        await _update_transaction_from_webhook(db, resource, "failed", "paypal")
    logger.info("paypal_event_handled", event_type=event_type)


async def _update_transaction_from_webhook(db: AsyncSession, data: dict, new_status: str, source: str) -> None:
    from app.models.transaction import Transaction, TransactionStatus
    from app.models.transaction_event import TransactionEvent

    gateway_txn_id = data.get("id") or data.get("gateway_transaction_id") or data.get("payment_id")
    if not gateway_txn_id:
        logger.warning("webhook_missing_gateway_txn_id", source=source)
        return

    result = await db.execute(
        select(Transaction).where(Transaction.gateway_transaction_id == gateway_txn_id)
    )
    txn = result.scalar_one_or_none()
    if not txn:
        logger.info("webhook_transaction_not_found", source=source, gateway_txn_id=gateway_txn_id)
        return

    status_map = {
        "success": TransactionStatus.SUCCESS,
        "failed": TransactionStatus.FAILED,
        "refunded": TransactionStatus.REFUNDED,
    }
    target_status = status_map.get(new_status)
    if target_status and txn.status != target_status:
        old_status = txn.status.value
        txn.status = target_status
        event = TransactionEvent(
            transaction_id=txn.id,
            from_status=old_status,
            to_status=new_status,
            reason=f"Webhook update from {source}",
            actor=f"webhook:{source}",
        )
        db.add(event)
        logger.info("transaction_updated_via_webhook", txn_id=txn.id, from_status=old_status, to_status=new_status, source=source)


async def list_webhook_events(
    db: AsyncSession,
    page: int = 1,
    size: int = 20,
    source: str | None = None,
    status: str | None = None,
) -> tuple[list[WebhookEvent], int]:
    query = select(WebhookEvent)
    count_query = select(func.count(WebhookEvent.id))
    if source:
        query = query.where(WebhookEvent.source == source)
        count_query = count_query.where(WebhookEvent.source == source)
    if status:
        query = query.where(WebhookEvent.status == status)
        count_query = count_query.where(WebhookEvent.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    query = query.order_by(WebhookEvent.created_at.desc()).offset(offset).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def get_webhook_event(db: AsyncSession, event_id: int) -> WebhookEvent:
    result = await db.execute(select(WebhookEvent).where(WebhookEvent.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise NotFoundException("WebhookEvent", event_id)
    return event


async def get_webhook_logs(db: AsyncSession, event_id: int) -> list[WebhookLog]:
    result = await db.execute(
        select(WebhookLog).where(WebhookLog.webhook_event_id == event_id).order_by(WebhookLog.created_at)
    )
    return list(result.scalars().all())


async def get_webhook_stats(db: AsyncSession) -> dict:
    total = (await db.execute(select(func.count(WebhookEvent.id)))).scalar() or 0
    processed = (await db.execute(select(func.count(WebhookEvent.id)).where(WebhookEvent.status == WebhookEventStatus.PROCESSED))).scalar() or 0
    failed = (await db.execute(select(func.count(WebhookEvent.id)).where(WebhookEvent.status == WebhookEventStatus.FAILED))).scalar() or 0
    retrying = (await db.execute(select(func.count(WebhookEvent.id)).where(WebhookEvent.status == WebhookEventStatus.RETRYING))).scalar() or 0
    return {
        "total": total,
        "processed": processed,
        "failed": failed,
        "retrying": retrying,
        "success_rate": round(processed / total * 100, 2) if total > 0 else 0.0,
    }
