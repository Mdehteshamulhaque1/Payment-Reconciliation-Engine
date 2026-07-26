from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Payment Reconciliation Engine API"
    APP_VERSION: str = "2.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_TOKEN_ROTATION: bool = True

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    REDIS_URL: str = "redis://localhost:6379/1"
    REDIS_CACHE_TTL: int = 300

    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DB: str = "payment_reconciliation_engine"
    DATABASE_URL: str | None = None

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3004",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3004",
        "http://localhost:5173",
    ]
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_WEBHOOK_PER_MINUTE: int = 300
    RATE_LIMIT_AUTH_PER_MINUTE: int = 20

    MAX_RETRY_ATTEMPTS: int = 3
    WEBHOOK_SIGNATURE_TOLERANCE: int = 300

    FRAUD_VELOCITY_WINDOW_MINUTES: int = 60
    FRAUD_VELOCITY_THRESHOLD: int = 50
    FRAUD_LARGE_AMOUNT_THRESHOLD: float = 100000.0
    FRAUD_MAX_REFUNDS_PER_CUSTOMER: int = 3
    FRAUD_DUPLICATE_WINDOW_SECONDS: int = 300

    MATCH_AMOUNT_TOLERANCE: float = 0.01
    MATCH_TIMESTAMP_TOLERANCE_MINUTES: int = 5
    RECONCILIATION_BATCH_SIZE: int = 500

    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_WEBHOOK_ID: str = ""

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
            f"mysql+pymysql://{self.MYSQL_USER}:{password}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )

    @property
    def is_sqlite(self) -> bool:
        return "sqlite" in self.sqlalchemy_database_uri

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
