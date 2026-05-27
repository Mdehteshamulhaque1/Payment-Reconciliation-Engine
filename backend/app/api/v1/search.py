from fastapi import APIRouter

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
async def search(query: str = ""):
    return {"query": query, "results": []}
