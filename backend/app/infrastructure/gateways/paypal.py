from app.infrastructure.gateways.base import BaseGatewaySimulator


class PayPalSimulator(BaseGatewaySimulator):
    gateway_prefix = "pp"

    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict:
        return {
            "gateway_txn_id": self.generate_gateway_txn_id(),
            "intent": "CAPTURE",
            "status": "COMPLETED",
            "amount": str(amount),
            "currency_code": currency.upper(),
        }

    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict:
        return {
            "id": f"re_{gateway_txn_id[:16]}",
            "amount": str(amount),
            "status": "COMPLETED",
        }
