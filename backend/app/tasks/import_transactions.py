from app.core.celery_app import celery_app

@celery_app.task
def import_transactions(source: str):
    # placeholder
    return {"source": source, "imported": 0}
