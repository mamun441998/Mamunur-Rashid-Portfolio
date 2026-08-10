import base64
import hashlib
import hmac
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import get_current_admin
from app.db.session import get_session
from app.models.admin import Admin
from app.models.meeting import Meeting

router = APIRouter(prefix="/api/calendly", tags=["calendly"])


def _verify_signature(raw_body: bytes, header: Optional[str]) -> bool:
    """Verify Calendly's Webhook-Signature header (t=...,v1=...).

    If no signing key is configured, verification is skipped (returns True).
    """
    key = settings.calendly_signing_key
    if not key:
        return True
    if not header:
        return False
    try:
        parts = dict(
            p.split("=", 1) for p in header.split(",") if "=" in p
        )
        timestamp = parts.get("t")
        signature = parts.get("v1")
        if not timestamp or not signature:
            return False
        signed_payload = f"{timestamp}.".encode("utf-8") + raw_body
        expected = hmac.new(
            key.encode("utf-8"), signed_payload, hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception:
        return False


def _parse_dt(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None


@router.post("/webhook")
async def webhook(request: Request, session: Session = Depends(get_session)):
    raw = await request.body()
    if not _verify_signature(raw, request.headers.get("calendly-webhook-signature")):
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    event = body.get("event")
    payload = body.get("payload", {}) or {}
    invitee_uri = payload.get("uri")
    event_data = payload.get("scheduled_event", {}) or {}

    if event == "invitee.created":
        existing = None
        if invitee_uri:
            existing = session.exec(
                select(Meeting).where(Meeting.calendly_invitee_uri == invitee_uri)
            ).first()
        meeting = existing or Meeting()
        meeting.invitee_name = payload.get("name", "") or meeting.invitee_name
        meeting.invitee_email = payload.get("email", "") or meeting.invitee_email
        meeting.event_name = event_data.get("name", "") or meeting.event_name
        meeting.scheduled_at = _parse_dt(event_data.get("start_time")) or meeting.scheduled_at
        meeting.status = "active"
        meeting.calendly_event_uri = event_data.get("uri") or meeting.calendly_event_uri
        meeting.calendly_invitee_uri = invitee_uri or meeting.calendly_invitee_uri
        loc = event_data.get("location") or {}
        if isinstance(loc, dict):
            meeting.location = loc.get("location") or loc.get("type") or meeting.location
        session.add(meeting)
        session.commit()
        return {"status": "ok", "action": "created"}

    if event == "invitee.canceled":
        meeting = None
        if invitee_uri:
            meeting = session.exec(
                select(Meeting).where(Meeting.calendly_invitee_uri == invitee_uri)
            ).first()
        if meeting:
            meeting.status = "canceled"
            session.add(meeting)
            session.commit()
        return {"status": "ok", "action": "canceled"}

    return {"status": "ignored", "event": event}


@router.get("/meetings", response_model=List[Meeting])
def list_meetings(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    return session.exec(select(Meeting).order_by(Meeting.scheduled_at.desc())).all()


@router.delete("/meetings/{id}")
def delete_meeting(
    id: int,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    obj = session.get(Meeting, id)
    if not obj:
        raise HTTPException(404, "Not found")
    session.delete(obj)
    session.commit()
    return {"message": "deleted"}
