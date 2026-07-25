from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.schemas.rules_fraud import MessageResponse, NotificationListResponse, NotificationOut
from app.services import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=NotificationListResponse, summary="List notifications")
async def list_notifications(
    page: int = 1, size: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    items, total = await notification_service.list_notifications(db, current_user.id, page, size)
    return NotificationListResponse(
        items=[NotificationOut.model_validate(n) for n in items],
        total=total,
    )


@router.put("/{notification_id}/read", response_model=NotificationOut, summary="Mark as read")
async def mark_read(notification_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    n = await notification_service.mark_read(db, notification_id)
    return NotificationOut.model_validate(n)


@router.post("/{notification_id}/read", response_model=NotificationOut, summary="Mark as read (POST)")
async def mark_read_post(notification_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    n = await notification_service.mark_read(db, notification_id)
    return NotificationOut.model_validate(n)


@router.put("/read-all", response_model=MessageResponse, summary="Mark all as read")
async def mark_all(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    count = await notification_service.mark_all_read(db, current_user.id)
    return MessageResponse(message=f"Marked {count} notifications as read")


@router.post("/read-all", response_model=MessageResponse, summary="Mark all as read (POST)")
async def mark_all_post(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    count = await notification_service.mark_all_read(db, current_user.id)
    return MessageResponse(message=f"Marked {count} notifications as read")
