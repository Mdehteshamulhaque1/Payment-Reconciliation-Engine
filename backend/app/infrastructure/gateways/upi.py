from app.infrastructure.gateways.base import BaseGatewaySimulator


class UPISimulator(BaseGatewaySimulator):
    gateway_prefix = "upi"

    def _process_payment(self, amount: float, currency: str, metadata: dict) -> dict:
        return {
            "gateway_txn_id": self.generate_gateway_txn_id(),
            "upi_txn_id": f"UPI{self.generate_gateway_txn_id()}",
            "status": "SUCCESS",
            "amount": str(amount),
            "currency": currency.upper(),
        }

    def _process_refund(self, gateway_txn_id: str, amount: float) -> dict:
        return {
            "upi_txn_id": f"UPIRV_{gateway_txn_id[:16]}",
            "status": "SUCCESS",
            "amount": str(amount),
        }
