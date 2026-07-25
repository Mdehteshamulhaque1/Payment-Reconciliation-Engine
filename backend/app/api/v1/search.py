from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_active_user, get_db
from app.schemas.reports_search import SearchResponse, SearchResult
from app.services import search_service

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=SearchResponse, summary="Global search")
async def search(q: str = Query(default="", min_length=0), db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    results = await search_service.global_search(db, q)
    return SearchResponse(query=q, results=[SearchResult(**r) for r in results], total=len(results))


@router.get("/suggestions", summary="Search autocomplete suggestions")
async def suggestions(q: str = Query(default=""), db: AsyncSession = Depends(get_db), _user=Depends(get_current_active_user)):
    results = await search_service.global_search(db, q, limit=5)
    return [r["title"] for r in results]
