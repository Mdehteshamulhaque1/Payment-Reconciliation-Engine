from fastapi import APIRouter, Depends

router = APIRouter(prefix="/reconciliation", tags=["reconciliation"])

@router.get("/")
async def health_check():
    return {"msg": "reconciliation endpoint placeholder"}
