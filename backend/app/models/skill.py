from sqlmodel import SQLModel, Field
from typing import Optional

class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str          # যেমন: "Frontend", "Backend", "Database", "Tools"
    proficiency: int        # 0-100 এর মধ্যে (progress bar এর জন্য)
    icon_url: Optional[str] = None