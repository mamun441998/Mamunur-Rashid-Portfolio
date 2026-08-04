import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.contact import ContactMessage
from app.models.admin import Admin
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Email Notification Logic (Background Task)
def send_email_notification(msg: ContactMessage):
    """
    Sends an email notification to mamun441998@gmail.com 
    when a new message is submitted through the portfolio contact form.
    """
    sender_email = os.getenv("SMTP_EMAIL", "mamun441998@gmail.com")
    sender_password = os.getenv("SMTP_PASSWORD")  # Gmail App Password
    receiver_email = "mamun441998@gmail.com"

    # If password is not configured in .env, skip sending email gracefully
    if not sender_password:
        print("[Email Notification Skipped] SMTP_PASSWORD not found in environment variables.")
        return

    subject = f"🚀 New Portfolio Message: {msg.subject}"
    body = f"""
    You received a new message from your Portfolio Contact Form!

    --------------------------------------------------
    Sender Name : {msg.name}
    Sender Email: {msg.email}
    Subject     : {msg.subject}
    --------------------------------------------------

    Message Body:
    {msg.message}

    --------------------------------------------------
    Reply directly to: {msg.email}
    """

    email_msg = MIMEMultipart()
    email_msg["From"] = f"Portfolio Alert <{sender_email}>"
    email_msg["To"] = receiver_email
    email_msg["Subject"] = subject
    email_msg.attach(MIMEText(body, "plain"))

    try:
        # Connecting to Gmail SMTP Server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(email_msg)
        server.quit()
        print(f"[Email Sent Successfully] Notification delivered to {receiver_email}")
    except Exception as e:
        print(f"[Email Sending Failed] Error: {str(e)}")


# ------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------

# Public Endpoint - Anyone can submit a message
@router.post(
    "",
    response_model=ContactMessage,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "/",
    response_model=ContactMessage,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_message(
    msg: ContactMessage,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    """Save contact message to DB and trigger email notification asynchronously."""
    # 1. Save to Database
    session.add(msg)
    session.commit()
    session.refresh(msg)

    # 2. Trigger Email Notification in Background Task (Non-blocking)
    background_tasks.add_task(send_email_notification, msg)

    return msg


# Protected Endpoints - Admin Only
@router.get("", response_model=List[ContactMessage])
@router.get("/", response_model=List[ContactMessage], include_in_schema=False)
def get_messages(
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    """Retrieve all contact messages (Ordered by newest first)."""
    statement = select(ContactMessage).order_by(ContactMessage.id.desc())
    return session.exec(statement).all()


@router.put("/{msg_id}/read", response_model=ContactMessage)
def mark_as_read(
    msg_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    """Mark a message as read."""
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    msg.is_read = True
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
    """Delete a contact message."""
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    session.delete(msg)
    session.commit()
    return {"message": "Message deleted successfully"}