"""Meetings panel backed by a Google Calendar secret iCal feed.

Google Calendar "Appointment schedules" (Google Meet) do NOT send webhooks, so
we cannot receive bookings the way Calendly pushed them. Instead the admin sets
GOOGLE_CALENDAR_ICAL_URL (the calendar's private "Secret address in iCal
format") in the environment, and this endpoint fetches + parses that feed on
demand so bookings appear in the admin Meetings Panel.

The iCal URL is secret (anyone with it can read the calendar), so it lives only
in the environment — never in the database or any public response.
"""
import os
import re
import urllib.request
from datetime import datetime, date, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends
from icalendar import Calendar

from app.core.security import get_current_admin
from app.models.admin import Admin

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

_MEET_RE = re.compile(r"https://meet\.google\.com/[a-z0-9\-]+", re.I)
ICAL_TIMEOUT = 20
# Keep events from ~2 days ago onward so a just-finished/ongoing meeting stays visible.
PAST_WINDOW_SECONDS = 2 * 86400


def _to_utc(value) -> Optional[datetime]:
    if isinstance(value, datetime):
        return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)
    if isinstance(value, date):
        return datetime(value.year, value.month, value.day, tzinfo=timezone.utc)
    return None


def _clean(text: str) -> str:
    return (text or "").replace("\\n", "\n").replace("\\,", ",").replace("\\;", ";").strip()


def _fetch_ical(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "portfolio-meetings"})
    with urllib.request.urlopen(req, timeout=ICAL_TIMEOUT) as resp:
        return resp.read()


def _parse_events(raw: bytes) -> List[dict]:
    cal = Calendar.from_ical(raw)
    out: List[dict] = []
    for comp in cal.walk("VEVENT"):
        start = _to_utc(getattr(comp.get("dtstart"), "dt", None))
        end = _to_utc(getattr(comp.get("dtend"), "dt", None))
        summary = _clean(str(comp.get("summary", "")))
        description = _clean(str(comp.get("description", "")))
        location = _clean(str(comp.get("location", "")))
        status = str(comp.get("status", "CONFIRMED")).lower()
        uid = str(comp.get("uid", ""))

        organizer = comp.get("organizer")
        org_email = str(organizer).replace("mailto:", "").lower() if organizer is not None else ""

        attendee = comp.get("attendee")
        attendees = attendee if isinstance(attendee, list) else ([attendee] if attendee else [])
        invitee_name = ""
        invitee_email = ""
        for a in attendees:
            email = str(a).replace("mailto:", "").strip()
            if not email or email.lower() == org_email:
                continue
            cn = ""
            try:
                cn = str(a.params.get("CN", ""))
            except Exception:
                cn = ""
            invitee_name = cn or email.split("@")[0]
            invitee_email = email
            break

        meet_link = ""
        match = _MEET_RE.search(location) or _MEET_RE.search(description)
        if match:
            meet_link = match.group(0)
        elif comp.get("X-GOOGLE-CONFERENCE"):
            meet_link = str(comp.get("X-GOOGLE-CONFERENCE"))

        out.append({
            "id": uid or f"{summary}-{start}",
            "event_name": summary or "Meeting",
            "invitee_name": invitee_name,
            "invitee_email": invitee_email,
            "scheduled_at": start.isoformat() if start else None,
            "end_at": end.isoformat() if end else None,
            "location": location,
            "meet_link": meet_link,
            "notes": description,
            "status": "canceled" if status == "cancelled" else "active",
            "_start": start,
        })
    return out


@router.get("")
@router.get("/", include_in_schema=False)
def list_meetings(admin: Admin = Depends(get_current_admin)):
    """Return upcoming Google Calendar bookings parsed from the iCal feed."""
    url = os.getenv("GOOGLE_CALENDAR_ICAL_URL", "").strip()
    if not url:
        return {"configured": False, "meetings": []}

    try:
        raw = _fetch_ical(url)
        events = _parse_events(raw)
    except Exception as exc:
        return {
            "configured": True,
            "error": f"Could not read the Google Calendar feed: {exc}",
            "meetings": [],
        }

    now_ts = datetime.now(timezone.utc).timestamp()
    upcoming = [e for e in events if e["_start"] and e["_start"].timestamp() >= now_ts - PAST_WINDOW_SECONDS]
    upcoming.sort(key=lambda e: e["_start"])
    for e in upcoming:
        e.pop("_start", None)
    return {"configured": True, "meetings": upcoming[:100]}
