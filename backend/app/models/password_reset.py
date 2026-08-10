from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class PasswordReset(SQLModel, table=True):
    """A short-lived email verification code for resetting the admin password."""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    code: str = Field(index=True)
    expires_at: datetime
    used: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
