from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.infrastructure.gateways.registry import get_gateway_simulator
from app.models.payment_gateway import PaymentGateway
from app.models.gateway_health import GatewayHealth


async def list_gateways(db: AsyncSession) -> list[PaymentGateway]:
    result = await db.execute(select(PaymentGateway).order_by(PaymentGateway.id))
    return list(result.scalars().all())


async def get_gateway(db: AsyncSession, gateway_id: int) -> PaymentGateway:
    result = await db.execute(select(PaymentGateway).where(PaymentGateway.id == gateway_id))
    gw = result.scalar_one_or_none()
    if not gw:
        raise NotFoundException("Gateway", gateway_id)
    return gw


async def get_gateway_by_name(db: AsyncSession, name: str) -> PaymentGateway | None:
    result = await db.execute(select(PaymentGateway).where(PaymentGateway.name == name.lower()))
    return result.scalar_one_or_none()


async def ensure_seed_gateways(db: AsyncSession) -> None:
    existing = await db.execute(select(PaymentGateway.name))
    existing_names = {r[0] for r in existing.all()}

    seeds = [
        ("stripe", "stripe", "Stripe", True),
        ("razorpay", "razorpay", "Razorpay", True),
        ("paypal", "paypal", "PayPal", True),
        ("upi", "upi", "UPI", True),
        ("bank", "bank", "Bank Transfer", True),
    ]
    for name, gtype, display, active in seeds:
        if name not in existing_names:
            db.add(PaymentGateway(name=name, gateway_type=gtype, display_name=display, is_active=active, sandbox_mode=True))
    await db.commit()


async def simulate_payment(db: AsyncSession, gateway_name: str, amount: float, currency: str = "INR") -> dict:
    gw = await get_gateway_by_name(db, gateway_name)
    if not gw:
        raise NotFoundException("Gateway", gateway_name)

    simulator = get_gateway_simulator(gateway_name)
    response = simulator.process_payment(amount, currency)

    health = GatewayHealth(
        gateway_id=gw.id,
        status="healthy" if response.success else "degraded",
        latency_ms=response.latency_ms,
    )
    db.add(health)
    await db.commit()

    return {
        "success": response.success,
        "gateway_name": gateway_name,
        "gateway_transaction_id": response.gateway_transaction_id,
        "status": response.status,
        "amount": response.amount,
        "currency": response.currency,
        "latency_ms": response.latency_ms,
        "error_message": response.error_message,
    }


async def get_gateway_health(db: AsyncSession, gateway_id: int) -> GatewayHealth | None:
    result = await db.execute(
        select(GatewayHealth)
        .where(GatewayHealth.gateway_id == gateway_id)
        .order_by(GatewayHealth.last_checked.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()
