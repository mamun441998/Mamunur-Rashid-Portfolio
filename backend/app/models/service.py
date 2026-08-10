from typing import Optional

from sqlmodel import SQLModel, Field


class Service(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True)
    title: str
    tagline: str = ""
    description: str = ""
    icon_name: str = "Layers"
    features: str = ""      # comma-separated list
    tech_stack: str = ""    # comma-separated list
    highlight: bool = False
    order: int = 0
