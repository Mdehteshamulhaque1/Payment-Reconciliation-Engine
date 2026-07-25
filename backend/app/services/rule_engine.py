import json

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.reconciliation_rule import ReconciliationRule
from app.models.transaction import Transaction


async def create_rule(db: AsyncSession, data: dict) -> ReconciliationRule:
    rule = ReconciliationRule(**data)
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    return rule


async def list_rules(db: AsyncSession) -> list[ReconciliationRule]:
    result = await db.execute(select(ReconciliationRule).order_by(ReconciliationRule.priority.desc()))
    return list(result.scalars().all())


async def get_rule(db: AsyncSession, rule_id: int) -> ReconciliationRule:
    result = await db.execute(select(ReconciliationRule).where(ReconciliationRule.id == rule_id))
    rule = result.scalar_one_or_none()
    if not rule:
        raise NotFoundException("Rule", rule_id)
    return rule


async def update_rule(db: AsyncSession, rule_id: int, data: dict) -> ReconciliationRule:
    rule = await get_rule(db, rule_id)
    for k, v in data.items():
        if v is not None:
            setattr(rule, k, v)
    await db.commit()
    await db.refresh(rule)
    return rule


async def delete_rule(db: AsyncSession, rule_id: int) -> None:
    rule = await get_rule(db, rule_id)
    await db.delete(rule)
    await db.commit()


async def evaluate_rules(db: AsyncSession, transaction_id: int) -> list[dict]:
    txn_result = await db.execute(select(Transaction).where(Transaction.id == transaction_id))
    txn = txn_result.scalar_one_or_none()
    if not txn:
        raise NotFoundException("Transaction", transaction_id)

    rules_result = await db.execute(
        select(ReconciliationRule).where(ReconciliationRule.is_active == True).order_by(ReconciliationRule.priority.desc())
    )
    rules = list(rules_result.scalars().all())

    matched = []
    for rule in rules:
        try:
            conditions = json.loads(rule.condition_json)
            is_match = True
            for field, op_value in conditions.items():
                txn_value = getattr(txn, field, None)
                if txn_value is None:
                    is_match = False
                    break
                if isinstance(op_value, dict):
                    for op, val in op_value.items():
                        if op == "gt" and not (txn_value > val):
                            is_match = False
                        elif op == "lt" and not (txn_value < val):
                            is_match = False
                        elif op == "eq" and txn_value != val:
                            is_match = False
                        elif op == "contains" and val not in str(txn_value):
                            is_match = False
                elif txn_value != op_value:
                    is_match = False
                if not is_match:
                    break
            if is_match:
                matched.append({"rule_id": rule.id, "rule_name": rule.name, "action": rule.action})
        except (json.JSONDecodeError, TypeError):
            continue
    return matched
