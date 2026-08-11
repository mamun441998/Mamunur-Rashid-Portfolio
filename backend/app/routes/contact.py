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
from app.models.site_setting import SiteSetting

logger = logging.getLogger("portfolio.contact")

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Fail fast rather than hang the request if the SMTP server is unreachable.
SMTP_TIMEOUT = 20


# Owner's Google appointment/Meet scheduling link — used for the welcome-email
# "Schedule a Meeting" CTA when no Meeting URL is set in the admin CMS.
DEFAULT_MEETING_URL = (
    "https://calendar.google.com/calendar/u/0/appointments/schedules/"
    "AcZssZ1BoiiiiIA5Oo22YNFCmFPMHCes4DDo3IATKgLs43xvKX72cWk1MJkpA0Sj-dDwYpJckYI70L-q"
)


def _site_url() -> str:
    """Public site URL, used for absolute image/link URLs inside emails."""
    env = os.getenv("FRONTEND_URL") or os.getenv("SITE_URL")
    if env:
        return env.rstrip("/")
    for origin in settings.cors_origin_list:
        if origin.startswith("https://"):
            return origin.rstrip("/")
    return "https://mamunur-rashid-portfolio-wine.vercel.app"


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
def _send_via_brevo(to_email: str, subject: str, body: str, from_label: str, html_body: Optional[str] = None) -> None:
    """Send an email through Brevo's HTTP API (works from Render, which
    blocks outbound SMTP). Requires BREVO_API_KEY in the environment and a
    Brevo-verified sender (SMTP_EMAIL)."""
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = settings.smtp_email
    if not sender_email:
        raise EmailSendError("Sender email (SMTP_EMAIL) is not configured.")

    body_payload = {
        "sender": {"name": from_label or "Mamunur Rashid", "email": sender_email},
        "to": [{"email": to_email}],
        "replyTo": {"email": sender_email},
        "subject": subject,
        "textContent": body,
    }
    if html_body:
        body_payload["htmlContent"] = html_body
    payload = json.dumps(body_payload).encode("utf-8")

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


def _smtp_send(to_email: str, subject: str, body: str, from_label: str, html_body: Optional[str] = None) -> None:
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
        _send_via_brevo(to_email, subject, body, from_label, html_body=html_body)
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

    email_msg = MIMEMultipart("alternative")
    email_msg["From"] = f"{from_label} <{sender_email}>"
    email_msg["To"] = to_email
    email_msg["Subject"] = subject
    email_msg.attach(MIMEText(body, "plain", "utf-8"))
    if html_body:
        # The HTML part is attached last so clients that support it prefer it.
        email_msg.attach(MIMEText(html_body, "html", "utf-8"))

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
# Auto welcome email to the visitor (beautiful branded HTML template)
# ------------------------------------------------------------------
def _abs_url(url: Optional[str], site_url: str, fallback_path: str = "") -> str:
    if url and url.strip().startswith(("http://", "https://")):
        return url.strip()
    return f"{site_url}{fallback_path}"


def _welcome_email(visitor_name: str, s: Optional[SiteSetting]) -> tuple[str, str]:
    """Return (html, plain_text) for the auto welcome email. Works for any inquiry
    type — one warm, universal acknowledgement."""
    site = _site_url()
    name = (getattr(s, "full_name", None) or "Mamunur Rashid").strip()
    role = (getattr(s, "role_title", None) or "Full Stack Software Engineer").strip()
    avatar = _abs_url(getattr(s, "profile_image_url", None), site, "/Profile-Picture.png")
    first = (visitor_name or "there").strip().split(" ")[0]

    email_addr = getattr(s, "email", None) or settings.smtp_email or ""
    phone = (getattr(s, "phone", None) or "").strip()
    wa = "".join(ch for ch in phone if ch.isdigit())
    calendly = (getattr(s, "calendly_url", None) or "").strip() or DEFAULT_MEETING_URL

    # Social circles — only those that are configured.
    socials = []
    gh = (getattr(s, "github_url", None) or "").strip()
    li = (getattr(s, "linkedin_url", None) or "").strip()
    fb = (getattr(s, "facebook_url", None) or "").strip()
    tw = (getattr(s, "twitter_url", None) or "").strip()
    if gh: socials.append(("#24292F", "https://img.icons8.com/ios-filled/50/ffffff/github.png", gh, "GitHub"))
    if li: socials.append(("#0A66C2", "https://img.icons8.com/ios-filled/50/ffffff/linkedin.png", li, "LinkedIn"))
    if fb: socials.append(("#1877F2", "https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png", fb, "Facebook"))
    if tw: socials.append(("#000000", "https://img.icons8.com/ios-filled/50/ffffff/twitterx.png", tw, "Twitter"))
    if wa: socials.append(("#25D366", "https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png", f"https://wa.me/{wa}", "WhatsApp"))
    if email_addr: socials.append(("#0E9E85", "https://img.icons8.com/ios-filled/50/ffffff/new-post.png", f"mailto:{email_addr}", "Email"))

    social_cells = "".join(
        f'<td style="padding:0 6px;">'
        f'<a href="{url}" target="_blank" style="display:inline-block;width:44px;height:44px;'
        f'background:{color};border-radius:50%;text-align:center;line-height:44px;text-decoration:none;">'
        f'<img src="{icon}" alt="{label}" width="20" height="20" style="vertical-align:middle;border:0;" />'
        f'</a></td>'
        for color, icon, url, label in socials
    )

    # CTA buttons
    ctas = (
        f'<a href="{site}" target="_blank" style="display:inline-block;background:#2DD4BF;color:#06211C;'
        f'font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px;font-size:14px;margin:6px;">'
        f'Explore my work &rarr;</a>'
    )
    if calendly:
        ctas += (
            f'<a href="{calendly}" target="_blank" style="display:inline-block;background:transparent;color:#2DD4BF;'
            f'font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;margin:6px;'
            f'border:1px solid #2DD4BF;">Schedule a Meeting</a>'
        )

    html = f"""\
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2f2;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f2;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0F1E24;border-radius:18px;overflow:hidden;border:1px solid #1E3339;">
        <!-- accent bar -->
        <tr><td style="height:5px;background:#2DD4BF;line-height:5px;font-size:0;">&nbsp;</td></tr>
        <!-- header -->
        <tr><td align="center" style="padding:34px 30px 10px;">
          <img src="{avatar}" alt="{name}" width="88" height="88" style="width:88px;height:88px;border-radius:50%;border:3px solid #2DD4BF;object-fit:cover;" />
          <div style="color:#F1F5F4;font-size:21px;font-weight:700;margin-top:14px;">{name}</div>
          <div style="color:#2DD4BF;font-size:13px;font-family:monospace;margin-top:4px;">{role}</div>
        </td></tr>
        <!-- body -->
        <tr><td style="padding:14px 36px 6px;">
          <h1 style="color:#F1F5F4;font-size:22px;margin:10px 0 6px;">Hi {first}, thanks for reaching out! 👋</h1>
          <p style="color:#9FB4B2;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your message just landed in my inbox and I truly appreciate you taking the time to write.
            I read every message personally and I&rsquo;ll get back to you <strong style="color:#F1F5F4;">within 24 hours</strong> —
            usually much sooner.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
            <tr><td style="background:#142B31;border:1px solid #1E3339;border-left:3px solid #2DD4BF;border-radius:10px;padding:14px 18px;color:#C9E7E2;font-size:14px;">
              ✓ &nbsp;Your inquiry has been received. Sit tight — a real reply from me is on the way.
            </td></tr>
          </table>
          <p style="color:#9FB4B2;font-size:15px;line-height:1.7;margin:0 0 22px;">
            In the meantime, feel free to explore my work or connect with me below.
          </p>
          <div style="text-align:center;margin:6px 0 22px;">{ctas}</div>
        </td></tr>
        <!-- socials -->
        <tr><td align="center" style="padding:4px 30px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>{social_cells}</tr></table>
        </td></tr>
        <!-- footer -->
        <tr><td style="padding:22px 30px 30px;border-top:1px solid #1E3339;margin-top:10px;">
          <p style="color:#5b6f6d;font-size:12px;line-height:1.6;margin:14px 0 0;text-align:center;">
            {name} &middot; {role}<br>
            You&rsquo;re receiving this because you contacted me through my portfolio.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""

    text = (
        f"Hi {first}, thanks for reaching out!\n\n"
        "Your message just landed in my inbox. I read every message personally and "
        "I'll get back to you within 24 hours.\n\n"
        f"In the meantime, explore my work: {site}\n"
        + (f"Schedule a Meeting: {calendly}\n" if calendly else "")
        + f"\n— {name}, {role}\n"
    )
    return html, text


def send_welcome_email(to_email: str, subject: str, html: str, text: str) -> None:
    """Best-effort auto welcome email to the visitor. Never blocks the request."""
    try:
        _smtp_send(to_email, subject, text, "Mamunur Rashid", html_body=html)
        print(f"[Welcome Email Sent] -> {to_email}")
    except Exception as e:
        print(f"[Welcome Email Failed] {e}")


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

    # Notify the site owner.
    background_tasks.add_task(
        send_email_notification, msg.name, msg.email, msg.subject, msg.message
    )

    # Auto welcome email to the visitor (built now while the session is open).
    site_setting = session.get(SiteSetting, 1)
    html, text = _welcome_email(msg.name, site_setting)
    welcome_subject = f"Thanks for reaching out, {msg.name.split(' ')[0]}! 👋"
    background_tasks.add_task(send_welcome_email, msg.email, welcome_subject, html, text)

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
