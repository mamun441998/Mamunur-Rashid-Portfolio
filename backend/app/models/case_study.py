from typing import Optional

from sqlmodel import SQLModel, Field


class CaseStudy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True)
    title: str
    subtitle: str = ""
    challenge: str = ""
    github_repo_url: Optional[str] = None
    metrics: str = "[]"      # JSON string of [{label, value, sub}]
    code_snippet: str = ""
    order: int = 0
