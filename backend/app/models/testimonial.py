from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Testimonial(SQLModel, table=True):
    """A client / colleague testimonial shown as social proof on the public site."""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str = ""                       # e.g. "CTO", "Founder"
    company: str = ""
    avatar_url: Optional[str] = None
    quote: str = ""
    rating: int = 5                      # 1..5 stars
    featured: bool = False               # highlight in the UI
    order: int = 0                       # lower = shown first
    created_at: datetime = Field(default_factory=datetime.utcnow)
