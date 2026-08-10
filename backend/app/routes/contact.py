import logging
import smtplib
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
def _smtp_send(to_email: str, subject: str, body: str, from_label: str) -> None:
    """Send an email via SMTP (STARTTLS). Raises EmailSendError with a clear,
    admin-facing reason on any failure; logs full details server-side."""
    sender_email = settings.smtp_email
    sender_password = settings.smtp_password
    if not sender_email or not sender_password:
        raise EmailSendError(
            "SMTP credentials are not configured (set SMTP_EMAIL and SMTP_PASSWORD "
            "in the Render environment)."
        )

    email_msg = MIMEMultipart()
    email_msg["From"] = f"{from_label} <{sender_email}>"
    email_msg["To"] = to_email
    email_msg["Subject"] = subject
    email_msg.attach(MIMEText(body, "plain"))

    logger.info(
        "Sending email via %s:%s as %s -> %s",
        settings.smtp_host, settings.smtp_port, sender_email, to_email,
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=SMTP_TIMEOUT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(sender_email, sender_password)
            server.send_message(email_msg)
    except smtplib.SMTPAuthenticationError as exc:
        logger.exception("SMTP authentication failed")
        raise EmailSendError(
            "SMTP auth failed — the Gmail App Password for "
            f"{sender_email} was rejected. Verify SMTP_PASSWORD in Render is a valid "
            "16-character Gmail App Password (no spaces) and that 2-Step Verification "
            "is enabled on that account."
        ) from exc
    except (smtplib.SMTPException, OSError, TimeoutError) as exc:
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
