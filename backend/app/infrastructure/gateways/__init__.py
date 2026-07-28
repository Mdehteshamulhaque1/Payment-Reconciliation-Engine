"""Payment gateway simulators — mock implementations for each supported gateway.

Each simulator implements BaseGatewaySimulator (ABC) and provides
process_payment/process_refund with realistic latency and failure modes:

- stripe: Stripe-style charge/refund responses
- razorpay: Razorpay-style payment/capture responses
- paypal: PayPal-style authorization/capture responses
- upi: UPI-style collect/push responses
- bank: NEFT/RTGS/IMPS bank transfer simulation
- registry: Gateway name -> simulator class lookup
"""

from app.infrastructure.gateways.base import BaseGatewaySimulator, GatewayResponse
from app.infrastructure.gateways.registry import get_gateway_simulator, list_available_gateways

__all__ = [
    "BaseGatewaySimulator",
    "GatewayResponse",
    "get_gateway_simulator",
    "list_available_gateways",
]
