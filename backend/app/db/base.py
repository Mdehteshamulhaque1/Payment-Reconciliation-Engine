from sqlalchemy.orm import declarative_base


Base = declarative_base()


def import_models() -> None:
	from app.models import transaction  # noqa: F401
