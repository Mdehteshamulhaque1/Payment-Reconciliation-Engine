from fastapi import APIRouter

router = APIRouter(prefix="/fraud", tags=["fraud"])

@router.get("/")
async def fraud_overview():
    return {"alerts": []}
