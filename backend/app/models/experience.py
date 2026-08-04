from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Experience(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    company: str
    description: str
    start_date: date
    end_date: Optional[date] = None   # None মানে "Present" / চলমান
    is_current: bool = False