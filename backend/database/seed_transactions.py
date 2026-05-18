from sqlalchemy import select

from app.db.base import Base, import_models
from app.db.session import SessionLocal, engine
from app.models.transaction import Transaction, TransactionStatus


SEED_TRANSACTIONS = [
    Transaction(
        transaction_ref="TXN-20260517-0001",
        gateway_name="stripe",
        merchant_reference="ORD-1001",
        amount=2499.00,
        currency="INR",
        status=TransactionStatus.SUCCESS,
        description="Subscription payment",
    ),
    Transaction(
        transaction_ref="TXN-20260517-0002",
        gateway_name="razorpay",
        merchant_reference="ORD-1002",
        amount=799.50,
        currency="INR",
        status=TransactionStatus.PENDING,
        description="Checkout payment",
    ),
    Transaction(
        transaction_ref="TXN-20260517-0003",
        gateway_name="paypal",
        merchant_reference="ORD-1003",
        amount=12999.00,
        currency="INR",
        status=TransactionStatus.RECONCILED,
        description="Enterprise invoice settlement",
    ),
]


def seed_transactions() -> None:
    import_models()
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_refs = set(db.scalars(select(Transaction.transaction_ref)).all())
        new_rows = [transaction for transaction in SEED_TRANSACTIONS if transaction.transaction_ref not in existing_refs]

        if new_rows:
            db.add_all(new_rows)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_transactions()
