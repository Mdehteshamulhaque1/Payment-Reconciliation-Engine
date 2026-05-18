from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.transaction import TransactionCreate, TransactionListResponse, TransactionRead
from app.services.transaction_service import create_transaction, get_transactions


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED, summary="Create transaction")
def create_transaction_route(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
) -> TransactionRead:
    transaction = create_transaction(db, payload)
    return TransactionRead.model_validate(transaction)


@router.get("", response_model=TransactionListResponse, summary="Get all transactions")
def list_transactions(db: Session = Depends(get_db)) -> TransactionListResponse:
    transactions = get_transactions(db)
    items = [TransactionRead.model_validate(transaction) for transaction in transactions]
    return TransactionListResponse(items=items, total=len(items))
