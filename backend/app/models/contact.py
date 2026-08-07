from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

class ContactMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    subject: str = Field(default="Portfolio Contact Inquiry")
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False