from app.core.celery_app import celery_app

@celery_app.task
def generate_reports(report_id: int):
    # placeholder
    return {"report_id": report_id, "status": "generated"}
