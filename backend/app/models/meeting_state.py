from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class MeetingState(SQLModel, table=True):
    """Admin-controlled state for a Google Calendar booking (keyed by iCal UID).

    Bookings themselves live in Google Calendar (read via the iCal feed); this
    table only stores our own pipeline status + a dismissed/hidden flag so the
    admin can manage them without touching Google.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    uid: str = Field(index=True, unique=True)
    status: Optional[str] = None       # admin override: pending / completed / closed
    dismissed: bool = False
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MeetingStatus:
    PENDING = "pending"
    COMPLETED = "completed"
    CLOSED = "closed"
    ALL = (PENDING, COMPLETED, CLOSED)
