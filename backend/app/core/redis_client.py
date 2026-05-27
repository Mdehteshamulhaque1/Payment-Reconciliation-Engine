"""Redis client placeholder."""
import aioredis
from .config import get_settings

_redis = None

async def get_redis():
    global _redis
    if _redis is None:
        settings = get_settings()
        _redis = await aioredis.from_url(settings.redis_url)
    return _redis
