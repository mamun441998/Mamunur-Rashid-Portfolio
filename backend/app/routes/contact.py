import json
import logging
import os
import smtplib
import socket
import ssl
import urllib.error
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import get_current_admin
from app.db.session import get_session
from app.models.admin import Admin
from app.models.contact import ContactMessage, LeadStatus

logger = logging.getLogger("portfolio.contact")

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Fail fast rather than hang the request if the SMTP server is unreachable.
SMTP_TIMEOUT = 20


class EmailSendError(Exception):
    """Raised with a human-readable reason when an SMTP send fails."""


# ------------------------------------------------------------------
# Schemas
# ------------------------------------------------------------------
class ContactCreate(BaseModel):
    """Public payload — clients cannot forge status/is_read/timestamps."""
    name: str
    email: EmailStr
    subject: str = "Portfolio Contact Inquiry"
    message: str


class EmailReplySchema(BaseModel):
    to_email: str
    subject: str
    reply_message: str


class StatusUpdate(BaseModel):
    status: str


# ------------------------------------------------------------------
# Email helpers (SMTP config from settings, not os.getenv)
# ------------------------------------------------------------------
def _send_via_brevo(to_email: str, subject: str, body: str, from_label: str) -> None:
    """Send a plain-text email through Brevo's HTTP API (works from Render, which
    blocks outbound SMTP). Requires BREVO_API_KEY in the environment and a
    Brevo-verified sender (SMTP_EMAIL)."""
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = settings.smtp_email
    if not sender_email:
        raise EmailSendError("Sender email (SMTP_EMAIL) is not configured.")

    payload = json.dumps({
        "sender": {"name": from_label or "Mamunur Rashid", "email": sender_email},
        "to": [{"email": to_email}],
        "replyTo": {"email": sender_email},
        "subject": subject,
        "textContent": body,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email",
        data=payload,
        method="POST",
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
            "accept": "application/json",
        },
    )
    logger.info("Sending email via Brevo API as %s -> %s", sender_email, to_email)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status not in (200, 201):
                raise EmailSendError(f"Brevo returned status {resp.status}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "ignore")
        logger.exception("Brevo send failed: %s", detail)
        raise EmailSendError(
            f"Email delivery failed (Brevo {exc.code}). "
            "401 = wrong/missing BREVO_API_KEY; 400 = sender not verified in Brevo. "
            f"Details: {detail}"
        ) from exc
    except Exception as exc:
        logger.exception("Brevo send failed")
        raise EmailSendError(f"Email delivery failed: {exc}") from exc


def _smtp_send(to_email: str, subject: str, body: str, from_label: str) -> None:
    """Send an email. Prefers the Brevo HTTP API when BREVO_API_KEY is set (required
    on Render, which blocks SMTP); otherwise falls back to direct SMTP for local dev.

    SMTP path forces an IPv4 connection:

    Render containers often resolve smtp.gmail.com to an IPv6 (AAAA) address but
    have no IPv6 route, so a plain connect fails with "[Errno 101] Network is
    unreachable". We resolve the host to IPv4 and connect to that IP, but set the
    SMTP object's `_host` back to the real hostname before STARTTLS so the TLS
    certificate is validated against the hostname (not the IP).

    Raises EmailSendError with a clear, admin-facing reason on any failure.
    """
    # Prefer Brevo HTTP API when configured (Render blocks outbound SMTP).
    if os.getenv("BREVO_API_KEY"):
        _send_via_brevo(to_email, subject, body, from_label)
        return

    sender_email = settings.smtp_email
    sender_password = settings.smtp_password
    if not sender_email or not sender_password:
        raise EmailSendError(
            "SMTP credentials are not configured (set SMTP_EMAIL and SMTP_PASSWORD "
            "in the Render environment)."
        )

    host = settings.smtp_host or "smtp.gmail.com"
    port = int(settings.smtp_port or 587)

    email_msg = MIMEMultipart()
    email_msg["From"] = f"{from_label} <{sender_email}>"
    email_msg["To"] = to_email
    email_msg["Subject"] = subject
    email_msg.attach(MIMEText(body, "plain", "utf-8"))

    logger.info("Sending email via %s:%s as %s -> %s", host, port, sender_email, to_email)

    try:
        # Force IPv4 to avoid "[Errno 101] Network is unreachable" on IPv6-less hosts.
        ipv4 = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)[0][4][0]
        context = ssl.create_default_context()
        server = smtplib.SMTP(ipv4, port, timeout=SMTP_TIMEOUT)
        try:
            server._host = host  # validate the TLS cert against the hostname, not the IP
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, sender_password)
            server.send_message(email_msg)
        finally:
            try:
                server.quit()
            except Exception:
                pass
    except smtplib.SMTPAuthenticationError as exc:
        logger.exception("SMTP authentication failed")
        raise EmailSendError(
            "SMTP auth failed — the Gmail App Password for "
            f"{sender_email} was rejected. Verify SMTP_PASSWORD in Render is a valid "
            "16-character Gmail App Password (no spaces) and that 2-Step Verification "
            "is enabled on that account."
        ) from exc
    except Exception as exc:
        logger.exception("SMTP send failed")
        raise EmailSendError(f"Email delivery failed: {exc}") from exc


def send_email_notification(msg_name: str, msg_email: str, msg_subject: str, msg_body: str) -> None:
    """Notify the site owner of a new contact submission."""
    recipient = settings.alert_recipient
    if not recipient:
        return
    subject = f"🚀 New Portfolio Message: {msg_subject}"
    body = (
        "You received a new message from your Portfolio Contact Form!\n\n"
        "--------------------------------------------------\n"
        f"Sender Name : {msg_name}\n"
        f"Sender Email: {msg_email}\n"
        f"Subject     : {msg_subject}\n"
        "--------------------------------------------------\n\n"
        "Message Body:\n"
        f"{msg_body}\n\n"
        "--------------------------------------------------\n"
        f"Reply directly to: {msg_email}\n"
    )
    try:
        _smtp_send(recipient, subject, body, "Portfolio Alert")
        print(f"[Email Sent] Notification delivered to {recipient}")
    except Exception as e:
        print(f"[Email Failed] {e}")


# ------------------------------------------------------------------
# Public endpoints
# ------------------------------------------------------------------
@router.post("", response_model=ContactMessage, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ContactMessage, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_message(
    payload: ContactCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    """Save contact message and trigger an email alert asynchronously."""
    msg = ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
        status=LeadStatus.NEW,
    )
    session.add(msg)
    session.commit()
    session.refresh(msg)

    background_tasks.add_task(
        send_email_notification, msg.name, msg.email, msg.subject, msg.message
    )
    return msg


# ------------------------------------------------------------------
# Admin endpoints
# ------------------------------------------------------------------
@router.get("", response_model=List[ContactMessage])
@router.get("/", response_model=List[ContactMessage], include_in_schema=False)
def get_messages(
    status: Optional[str] = None,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    stmt = select(ContactMessage).order_by(ContactMessage.id.desc())
    if status:
        stmt = stmt.where(ContactMessage.status == status)
    return session.exec(stmt).all()


@router.get("/stats")
def contact_stats(
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    all_msgs = session.exec(select(ContactMessage)).all()
    return {
        "total": len(all_msgs),
        "unread": sum(1 for m in all_msgs if not m.is_read),
        "new": sum(1 for m in all_msgs if m.status == LeadStatus.NEW),
        "contacted": sum(1 for m in all_msgs if m.status == LeadStatus.CONTACTED),
        "meeting": sum(1 for m in all_msgs if m.status == LeadStatus.MEETING),
        "closed": sum(1 for m in all_msgs if m.status == LeadStatus.CLOSED),
    }


@router.put("/{msg_id}/read", response_model=ContactMessage)
def mark_as_read(
    msg_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    msg.updated_at = datetime.now(timezone.utc)
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg


@router.put("/{msg_id}/status", response_model=ContactMessage)
def update_status(
    msg_id: int,
    payload: StatusUpdate,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    if payload.status not in LeadStatus.ALL:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {LeadStatus.ALL}")
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.status = payload.status
    msg.updated_at = datetime.now(timezone.utc)
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg


@router.delete("/{msg_id}")
def delete_message(
    msg_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    session.delete(msg)
    session.commit()
    return {"message": "Message deleted successfully"}


@router.post("/reply")
def reply_to_message(
    reply_data: EmailReplySchema,
    current_admin: Admin = Depends(get_current_admin),
):
    """Send a direct email reply to a client. Returns a clear error on failure."""
    try:
        _smtp_send(
            reply_data.to_email,
            reply_data.subject,
            reply_data.reply_message,
            "Mamunur Rashid",
        )
        return {"status": "success", "message": f"Email sent to {reply_data.to_email}"}
    except EmailSendError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/test-email")
def test_email(current_admin: Admin = Depends(get_current_admin)):
    """Admin-only: send a test email to NOTIFICATION_EMAIL to verify SMTP config."""
    recipient = settings.alert_recipient
    if not recipient:
        raise HTTPException(
            status_code=400,
            detail="No NOTIFICATION_EMAIL / SMTP_EMAIL configured to send a test to.",
        )
    try:
        _smtp_send(
            recipient,
            "✅ Portfolio SMTP test",
            "This is a test email from your portfolio backend. "
            "If you received this, SMTP replies are working.",
            "Portfolio Alert",
        )
        return {"status": "success", "message": f"Test email sent to {recipient}"}
    except EmailSendError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
