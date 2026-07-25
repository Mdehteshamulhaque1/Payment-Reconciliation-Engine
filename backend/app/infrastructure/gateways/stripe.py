from app.infrastructure.gateways.base import BaseGatewaySimulator


class StripeSimulator(BaseGatewaySimulator):
    gateway_prefix = "stripe"

    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict:
        return {
            "gateway_txn_id": self.generate_gateway_txn_id(),
            "object": "charge",
            "paid": True,
            "captured": True,
            "amount": int(amount * 100),
            "currency": currency.lower(),
        }

    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict:
        return {
            "id": f"re_{gateway_txn_id[:16]}",
            "amount": int(amount * 100),
            "status": "succeeded",
        }
