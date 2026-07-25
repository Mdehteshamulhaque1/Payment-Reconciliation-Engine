from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.report import Report, ReportStatus, ReportType
from app.models.transaction import Transaction
from app.models.user import User


async def create_report(db: AsyncSession, data: dict) -> Report:
    report = Report(**data)
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


async def list_reports(db: AsyncSession, page: int = 1, size: int = 20) -> tuple[list[Report], int]:
    count_query = select(func.count(Report.id))
    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * size
    result = await db.execute(select(Report).order_by(Report.created_at.desc()).offset(offset).limit(size))
    return list(result.scalars().all()), total


async def get_report(db: AsyncSession, report_id: int) -> Report:
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise NotFoundException("Report", report_id)
    return report


async def generate_csv_report(db: AsyncSession, report_id: int) -> str:
    report = await get_report(db, report_id)
    report.status = ReportStatus.GENERATING
    await db.commit()

    result = await db.execute(select(Transaction).limit(1000))
    transactions = result.scalars().all()

    lines = ["id,ref,amount,currency,status,created_at"]
    for t in transactions:
        lines.append(f"{t.id},{t.transaction_ref},{t.amount},{t.currency},{t.status.value},{t.created_at}")

    content = "\n".join(lines)
    filename = f"report_{report_id}.csv"
    filepath = f"/tmp/{filename}"

    with open(filepath, "w") as f:
        f.write(content)

    report.status = ReportStatus.COMPLETED
    report.file_path = filepath
    report.file_size = len(content)
    await db.commit()
    return filepath
