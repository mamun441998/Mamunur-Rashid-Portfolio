from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Mamunur Rashid Portfolio API"
    ENVIRONMENT: str = "production"

    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    admin_username: str = "admin"
    admin_password: str

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_email: Optional[str] = None
    smtp_password: Optional[str] = None
    notification_email: Optional[str] = None

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,https://mamunur-rashid-portfolio-wine.vercel.app"

    calendly_signing_key: Optional[str] = None
    calendly_access_token: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def alert_recipient(self) -> Optional[str]:
        return self.notification_email or self.smtp_email


settings = Settings()
