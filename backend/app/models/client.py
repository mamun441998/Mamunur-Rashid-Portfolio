from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date


class Client(SQLModel, table=True):
    """A portal client. Each client is one engagement; sign-in is via a
    short-lived magic link emailed to `email` (no password stored)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True)
    company: str = ""
    project_title: str = ""
    project_description: str = ""
    status: str = "active"          # active | on_hold | completed
    progress: int = 0               # 0..100
    meeting_url: str = ""
    proposal_text: str = ""         # plain text / light HTML shown in portal
    next_steps: str = ""            # what's needed from the client
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Milestone(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(index=True, foreign_key="client.id")
    title: str
    status: str = "pending"         # pending | in_progress | done
    order: int = 0


class ClientUpdate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(index=True, foreign_key="client.id")
    title: str = ""
    body: str = ""
    author: str = "owner"           # "owner" (Mamunur) | "client" (their reply)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PortalFile(SQLModel, table=True):
    """Deliverable file stored in Postgres (base64) so it survives Render
    redeploys. Downloaded via /api/portal/files/{id} (client-scoped)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(index=True, foreign_key="client.id")
    filename: str
    content_type: str = "application/octet-stream"
    data_base64: str
    size: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Invoice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(index=True, foreign_key="client.id")
    title: str
    amount: float = 0
    currency: str = "USD"
    status: str = "due"             # due | paid
    due_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
