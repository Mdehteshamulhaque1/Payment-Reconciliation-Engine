from app.core.celery_app import celery_app

@celery_app.task
def reconcile_batch(batch_id: int):
    # placeholder task
    return {"batch_id": batch_id, "status": "started"}
