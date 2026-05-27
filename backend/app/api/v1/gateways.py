from fastapi import APIRouter

router = APIRouter(prefix="/gateways", tags=["gateways"])

@router.get("/")
async def list_gateways():
    return {"gateways": []}
