from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class Meeting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    invitee_name: str = ""
    invitee_email: str = Field(default="", index=True)
    event_name: str = ""
    scheduled_at: Optional[datetime] = None
    status: str = Field(default="active", index=True)
    calendly_event_uri: Optional[str] = Field(default=None, index=True)
    calendly_invitee_uri: Optional[str] = None
    location: str = ""
    notes: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
