"""Unified admin notification feed — aggregates recent activity from every
source (contact leads, client portal replies, scheduled meetings) into one
sorted list. Read/seen state is tracked client-side (by timestamp), so this
endpoint stays stateless and needs no extra table.
"""
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.admin import Admin
from app.models.contact import ContactMessage
from app.models.meeting import Meeting
from app.models.client import Client, ClientUpdate
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

LIMIT = 60


def _epoch(dt: datetime) -> int:
    if dt is None:
        return 0
    if dt.tzinfo is None:                      # naive datetimes are stored as UTC
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp())


def _iso(dt: datetime) -> str:
    if dt is None:
        return ""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def _snip(text: str, n: int = 90) -> str:
    text = (text or "").strip().replace("\n", " ")
    return text if len(text) <= n else text[: n - 1] + "…"


@router.get("")
def list_notifications(session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    items: List[dict] = []

    # 1) Contact leads / messages
    for m in session.exec(select(ContactMessage).order_by(ContactMessage.id.desc()).limit(LIMIT)).all():
        items.append({
            "id": f"lead-{m.id}",
            "type": "lead",
            "title": f"New message from {m.name}",
            "subtitle": _snip(m.subject or m.message),
            "target": "crm",
            "created_at": _iso(m.created_at),
            "ts": _epoch(m.created_at),
            "unread": not m.is_read,
        })

    # 2) Client portal replies (author = client)
    clients = {c.id: c for c in session.exec(select(Client)).all()}
    replies = session.exec(
        select(ClientUpdate).where(ClientUpdate.author == "client").order_by(ClientUpdate.id.desc()).limit(LIMIT)
    ).all()
    for u in replies:
        c = clients.get(u.client_id)
        items.append({
            "id": f"reply-{u.id}",
            "type": "reply",
            "title": f"{c.name if c else 'A client'} replied",
            "subtitle": _snip(u.body),
            "target": "clients",
            "entity_id": u.client_id,
            "created_at": _iso(u.created_at),
            "ts": _epoch(u.created_at),
            "unread": True,
        })

    # 3) Meetings
    for mt in session.exec(select(Meeting).order_by(Meeting.id.desc()).limit(LIMIT)).all():
        when = ""
        if mt.scheduled_at:
            try:
                when = mt.scheduled_at.strftime("%b %d, %Y · %I:%M %p")
            except Exception:
                when = ""
        items.append({
            "id": f"meeting-{mt.id}",
            "type": "meeting",
            "title": f"Meeting booked: {mt.invitee_name or mt.invitee_email or 'Guest'}",
            "subtitle": _snip(" · ".join([x for x in [mt.event_name, when] if x])) or "New meeting scheduled",
            "target": "meetings",
            "created_at": _iso(mt.created_at),
            "ts": _epoch(mt.created_at),
            "unread": (mt.status != "canceled"),
        })

    items.sort(key=lambda x: x["ts"], reverse=True)
    return {
        "items": items[:LIMIT],
        "server_time": int(datetime.now(timezone.utc).timestamp()),
    }
