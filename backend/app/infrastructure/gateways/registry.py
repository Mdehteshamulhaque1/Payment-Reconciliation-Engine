from app.infrastructure.gateways.base import BaseGatewaySimulator
from app.infrastructure.gateways.stripe import StripeSimulator
from app.infrastructure.gateways.razorpay import RazorpaySimulator
from app.infrastructure.gateways.paypal import PayPalSimulator
from app.infrastructure.gateways.upi import UPISimulator
from app.infrastructure.gateways.bank import BankTransferSimulator

GATEWAY_REGISTRY: dict[str, type[BaseGatewaySimulator]] = {
    "stripe": StripeSimulator,
    "razorpay": RazorpaySimulator,
    "paypal": PayPalSimulator,
    "upi": UPISimulator,
    "bank": BankTransferSimulator,
}

_gateway_instances: dict[str, BaseGatewaySimulator] = {}


def get_gateway_simulator(name: str, **kwargs) -> BaseGatewaySimulator:
    name = name.lower()
    if name not in _gateway_instances:
        cls = GATEWAY_REGISTRY.get(name)
        if cls is None:
            raise ValueError(f"Unknown gateway: {name}. Available: {list(GATEWAY_REGISTRY.keys())}")
        _gateway_instances[name] = cls(**kwargs)
    return _gateway_instances[name]


def list_available_gateways() -> list[str]:
    return list(GATEWAY_REGISTRY.keys())
