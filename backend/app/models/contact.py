from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone


class LeadStatus:
    """Lead pipeline stages for a contact message."""
    NEW = "new"
    CONTACTED = "contacted"
    MEETING = "meeting"
    CLOSED = "closed"
    ALL = (NEW, CONTACTED, MEETING, CLOSED)


class ContactMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    subject: str = Field(default="Portfolio Contact Inquiry")
    message: str
    is_read: bool = False
    status: str = Field(default="new", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
