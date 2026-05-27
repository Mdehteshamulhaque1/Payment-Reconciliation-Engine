from fastapi import APIRouter

router = APIRouter(prefix="/exceptions", tags=["exceptions"])

@router.get("/")
async def list_exceptions():
    return {"exceptions": []}
