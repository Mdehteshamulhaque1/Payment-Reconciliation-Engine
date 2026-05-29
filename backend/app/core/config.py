from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Payment Reconciliation Engine API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    secret_key: str = "replace-me"
    jwt_algorithm: str = "HS256"
    celery_broker_url: str = "redis://redis:6379/0"
    redis_url: str = "redis://redis:6379/1"

    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DB: str = "payment_reconciliation_engine"
    MYSQL_DRIVER: str = "pymysql"

    DATABASE_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL

        password = quote_plus(self.MYSQL_PASSWORD)
        return (
            f"mysql+{self.MYSQL_DRIVER}://"
            f"{self.MYSQL_USER}:{password}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/"
            f"{self.MYSQL_DB}"
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
