from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Portfolio API"
    
    # Database
    database_url: str
    
    # JWT Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # SMTP Email Configuration
    smtp_email: Optional[str] = None
    smtp_password: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Syntax error fixed here
settings = Settings()