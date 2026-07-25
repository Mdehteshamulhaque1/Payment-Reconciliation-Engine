from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction
from app.models.merchant import Merchant
from app.models.payment_gateway import PaymentGateway
from app.models.user import User


async def global_search(db: AsyncSession, query: str, limit: int = 20) -> list[dict]:
    results = []
    q = f"%{query}%"

    txns = await db.execute(
        select(Transaction).where(
            or_(Transaction.transaction_ref.ilike(q), Transaction.description.ilike(q))
        ).limit(limit)
    )
    for t in txns.scalars().all():
        results.append({
            "id": t.id, "type": "transaction",
            "title": t.transaction_ref, "subtitle": f"{t.amount} {t.currency} - {t.status.value}",
            "url": f"/transactions/{t.id}",
        })

    merchants = await db.execute(
        select(Merchant).where(or_(Merchant.name.ilike(q), Merchant.email.ilike(q))).limit(limit)
    )
    for m in merchants.scalars().all():
        results.append({
            "id": m.id, "type": "merchant",
            "title": m.name, "subtitle": m.email,
            "url": f"/admin/merchants/{m.id}",
        })

    gateways = await db.execute(
        select(PaymentGateway).where(PaymentGateway.name.ilike(q)).limit(limit)
    )
    for g in gateways.scalars().all():
        results.append({
            "id": g.id, "type": "gateway",
            "title": g.display_name, "subtitle": g.gateway_type.value,
            "url": f"/gateways/{g.id}",
        })

    return results[:limit]
