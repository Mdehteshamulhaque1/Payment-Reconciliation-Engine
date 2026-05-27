"""Celery app placeholder."""
from celery import Celery
from .config import get_settings

settings = get_settings()
celery_app = Celery("recon_tasks", broker=settings.celery_broker_url)
