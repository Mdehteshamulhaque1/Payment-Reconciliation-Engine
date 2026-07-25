from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.rules_fraud import MessageResponse, RuleCreate, RuleOut, RuleTestRequest
from app.services import rule_engine

router = APIRouter(prefix="/rules", tags=["Rules"])


@router.get("", response_model=list[RuleOut], summary="List rules")
async def list_rules(db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    rules = await rule_engine.list_rules(db)
    return [RuleOut.model_validate(r) for r in rules]


@router.post("", response_model=RuleOut, status_code=201, summary="Create rule")
async def create(payload: RuleCreate, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    rule = await rule_engine.create_rule(db, payload.model_dump())
    return RuleOut.model_validate(rule)


@router.get("/{rule_id}", response_model=RuleOut, summary="Get rule")
async def get_one(rule_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    rule = await rule_engine.get_rule(db, rule_id)
    return RuleOut.model_validate(rule)


@router.put("/{rule_id}", response_model=RuleOut, summary="Update rule")
async def update(rule_id: int, payload: RuleCreate, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    rule = await rule_engine.update_rule(db, rule_id, payload.model_dump())
    return RuleOut.model_validate(rule)


@router.delete("/{rule_id}", response_model=MessageResponse, summary="Delete rule")
async def delete(rule_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    await rule_engine.delete_rule(db, rule_id)
    return MessageResponse(message="Rule deleted")


@router.post("/evaluate/{transaction_id}", summary="Evaluate rules for transaction")
async def evaluate(transaction_id: int, db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    matched = await rule_engine.evaluate_rules(db, transaction_id)
    return {"transaction_id": transaction_id, "matched_rules": matched}
