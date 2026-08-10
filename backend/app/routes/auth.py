import logging
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.config import settings
from app.db.session import get_session
from app.models.admin import Admin
from app.models.password_reset import PasswordReset
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    get_current_admin,
)
from app.routes.contact import _smtp_send, EmailSendError

logger = logging.getLogger("portfolio.auth")

router = APIRouter(prefix="/api/auth", tags=["auth"])

RESET_CODE_TTL_MINUTES = 15


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class ForgotPassword(BaseModel):
    username: str | None = None


class ResetPassword(BaseModel):
    code: str
    new_password: str


def _validate_new_password(pw: str) -> None:
    if not pw or len(pw) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    admin = session.exec(select(Admin).where(Admin.username == form_data.username)).first()
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
def me(current_admin: Admin = Depends(get_current_admin)):
    return {"username": current_admin.username}


@router.post("/change-password")
def change_password(
    payload: ChangePassword,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    if not verify_password(payload.current_password, current_admin.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    _validate_new_password(payload.new_password)
    current_admin.hashed_password = hash_password(payload.new_password)
    session.add(current_admin)
    session.commit()
    return {"status": "success", "message": "Password updated."}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPassword, session: Session = Depends(get_session)):
    """Email a 6-digit verification code to the site owner's address."""
    username = (payload.username or settings.admin_username or "admin").strip()
    admin = session.exec(select(Admin).where(Admin.username == username)).first()

    # Always respond the same way so we don't reveal whether the account exists.
    generic = {"status": "ok", "message": "If the account exists, a verification code was emailed."}
    if not admin:
        return generic

    recipient = settings.alert_recipient
    if not recipient:
        raise HTTPException(status_code=400, detail="No owner email configured to send the code to.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    session.add(PasswordReset(
        username=username,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=RESET_CODE_TTL_MINUTES),
    ))
    session.commit()

    body = (
        "You requested to reset your portfolio admin password.\n\n"
        f"Verification code: {code}\n\n"
        f"This code expires in {RESET_CODE_TTL_MINUTES} minutes. "
        "If you did not request this, you can ignore this email."
    )
    try:
        _smtp_send(recipient, "🔐 Your admin password reset code", body, "Portfolio Security")
    except EmailSendError as exc:
        logger.exception("Failed to send reset code")
        raise HTTPException(status_code=502, detail=str(exc))
    return generic


@router.post("/reset-password")
def reset_password(payload: ResetPassword, session: Session = Depends(get_session)):
    _validate_new_password(payload.new_password)
    now = datetime.utcnow()
    reset = session.exec(
        select(PasswordReset)
        .where(PasswordReset.code == payload.code.strip())
        .where(PasswordReset.used == False)  # noqa: E712
        .where(PasswordReset.expires_at >= now)
        .order_by(PasswordReset.id.desc())
    ).first()
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    admin = session.exec(select(Admin).where(Admin.username == reset.username)).first()
    if not admin:
        raise HTTPException(status_code=400, detail="Account not found.")

    admin.hashed_password = hash_password(payload.new_password)
    reset.used = True
    session.add(admin)
    session.add(reset)
    session.commit()
    return {"status": "success", "message": "Password reset. You can now log in with the new password."}
