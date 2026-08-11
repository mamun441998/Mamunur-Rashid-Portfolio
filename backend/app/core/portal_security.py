"""Client-portal authentication — deliberately separate from admin auth.

Tokens carry a `scope` claim so a portal token can never be used on admin
endpoints (and vice-versa), and every token is bound to a single `cid`
(client id). Sign-in is passwordless: a short-lived "magic" token is emailed
as a link; exchanging it yields a longer-lived portal session token.
"""
from datetime import timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session

from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_session
from app.models.client import Client

SCOPE_SESSION = "portal"
SCOPE_MAGIC = "portal_magic"
MAGIC_TTL_MINUTES = 15
SESSION_TTL_DAYS = 7

portal_oauth = OAuth2PasswordBearer(tokenUrl="/api/portal/verify", auto_error=True)


def make_session_token(client_id: int) -> str:
    return create_access_token(
        {"scope": SCOPE_SESSION, "cid": client_id},
        expires_delta=timedelta(days=SESSION_TTL_DAYS),
    )


def make_magic_token(client_id: int) -> str:
    return create_access_token(
        {"scope": SCOPE_MAGIC, "cid": client_id},
        expires_delta=timedelta(minutes=MAGIC_TTL_MINUTES),
    )


def decode_scoped(token: str, expected_scope: str) -> Optional[int]:
    """Return the client id if the token is valid AND has the expected scope."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
    if payload.get("scope") != expected_scope:
        return None
    cid = payload.get("cid")
    return cid if isinstance(cid, int) else None


def get_current_client(
    token: str = Depends(portal_oauth),
    session: Session = Depends(get_session),
) -> Client:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate portal credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    cid = decode_scoped(token, SCOPE_SESSION)
    if cid is None:
        raise credentials_exception
    client = session.get(Client, cid)
    if client is None:
        raise credentials_exception
    return client
