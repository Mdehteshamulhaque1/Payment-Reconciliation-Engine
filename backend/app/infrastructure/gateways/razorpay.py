from app.infrastructure.gateways.base import BaseGatewaySimulator


class RazorpaySimulator(BaseGatewaySimulator):
    gateway_prefix = "rzp"

    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict:
        return {
            "gateway_txn_id": self.generate_gateway_txn_id(),
            "entity": "payment",
            "status": "captured",
            "amount": int(amount * 100),
            "currency": currency.upper(),
        }

    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict:
        return {
            "id": f"rfnd_{gateway_txn_id[:16]}",
            "amount": int(amount * 100),
            "status": "processed",
        }
