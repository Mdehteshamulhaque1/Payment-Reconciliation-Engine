import json

from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.webhook import WebhookEventOut, WebhookListResponse, WebhookLogOut, WebhookStatsResponse
from app.services import webhook_service

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/stripe", summary="Receive Stripe webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(default=None), db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    event = await webhook_service.receive_webhook(db, "stripe", payload, stripe_signature)
    return {"id": event.id, "status": event.status.value}


@router.post("/razorpay", summary="Receive Razorpay webhook")
async def razorpay_webhook(request: Request, x_razorpay_signature: str = Header(default=None), db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    event = await webhook_service.receive_webhook(db, "razorpay", payload, x_razorpay_signature)
    return {"id": event.id, "status": event.status.value}


@router.post("/paypal", summary="Receive PayPal webhook")
async def paypal_webhook(request: Request, paypal_transmission_sig: str = Header(default=None), db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    event = await webhook_service.receive_webhook(db, "paypal", payload, paypal_transmission_sig)
    return {"id": event.id, "status": event.status.value}


@router.get("", response_model=WebhookListResponse, summary="List webhook events")
async def list_events(
    page: int = 1,
    size: int = 20,
    source: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_active_user),
) -> WebhookListResponse:
    items, total = await webhook_service.list_webhook_events(db, page, size, source, status)
    return WebhookListResponse(items=[WebhookEventOut.model_validate(i) for i in items], total=total)


@router.get("/stats", response_model=WebhookStatsResponse, summary="Webhook statistics")
async def stats(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> WebhookStatsResponse:
    data = await webhook_service.get_webhook_stats(db)
    return WebhookStatsResponse(**data)


@router.get("/{event_id}", response_model=WebhookEventOut, summary="Get webhook event details")
async def get_event(event_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)) -> WebhookEventOut:
    event = await webhook_service.get_webhook_event(db, event_id)
    return WebhookEventOut.model_validate(event)


@router.post("/{event_id}/replay", summary="Replay a webhook event")
async def replay(event_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    event = await webhook_service.process_webhook(db, event_id)
    return {"id": event.id, "status": event.status.value}


@router.get("/{event_id}/logs", response_model=list[WebhookLogOut], summary="Get webhook delivery logs")
async def event_logs(event_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    logs = await webhook_service.get_webhook_logs(db, event_id)
    return [WebhookLogOut.model_validate(l) for l in logs]
