from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class Visit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    path: str = Field(default="/", index=True)
    country: str = Field(default="Unknown", index=True)
    country_code: str = ""
    city: Optional[str] = None
    ip_hash: str = Field(default="", index=True)
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
