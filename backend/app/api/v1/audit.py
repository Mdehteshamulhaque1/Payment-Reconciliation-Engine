from fastapi import APIRouter

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/")
async def recent_audit():
    return {"audit": []}
