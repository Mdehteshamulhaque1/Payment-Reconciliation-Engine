from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, NotificationChannel, NotificationStatus


async def create_notification(db: AsyncSession, user_id: int | None, channel: str, subject: str, body: str) -> Notification:
    n = Notification(
        user_id=user_id,
        channel=channel,
        subject=subject,
        body=body,
        status=NotificationStatus.PENDING,
    )
    db.add(n)
    await db.commit()
    await db.refresh(n)
    return n


async def list_notifications(db: AsyncSession, user_id: int | None = None, page: int = 1, size: int = 20) -> tuple[list[Notification], int]:
    query = select(Notification)
    count_query = select(func.count(Notification.id))
    if user_id:
        query = query.where(Notification.user_id == user_id)
        count_query = count_query.where(Notification.user_id == user_id)

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    query = query.order_by(Notification.created_at.desc()).offset(offset).limit(size)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def mark_read(db: AsyncSession, notification_id: int) -> Notification:
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    n = result.scalar_one_or_none()
    if n:
        n.status = NotificationStatus.READ
        n.read_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(n)
    return n


async def mark_all_read(db: AsyncSession, user_id: int) -> int:
    result = await db.execute(
        select(Notification).where(Notification.user_id == user_id, Notification.status != NotificationStatus.READ)
    )
    notifications = result.scalars().all()
    for n in notifications:
        n.status = NotificationStatus.READ
        n.read_at = datetime.now(timezone.utc)
    await db.commit()
    return len(notifications)
