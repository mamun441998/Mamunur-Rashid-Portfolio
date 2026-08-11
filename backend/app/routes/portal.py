import base64
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.client import Client, Milestone, ClientUpdate, PortalFile, Invoice
from app.core.portal_security import (
    make_session_token, make_magic_token, decode_scoped, get_current_client, SCOPE_MAGIC,
)
from app.routes.contact import _smtp_send, _site_url, AVATAR_PATH, AVATAR_CID

logger = logging.getLogger("portfolio.portal")
router = APIRouter(prefix="/api/portal", tags=["portal"])


class EmailReq(BaseModel):
    email: EmailStr


class TokenReq(BaseModel):
    token: str


class ReplyReq(BaseModel):
    body: str


def _magic_email(name: str, link: str) -> tuple[str, str]:
    first = (name or "there").strip().split(" ")[0]
    html = f"""\
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2f2;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f2;padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0F1E24;border-radius:18px;overflow:hidden;border:1px solid #1E3339;">
      <tr><td style="height:5px;background:#2DD4BF;line-height:5px;font-size:0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:32px 30px 6px;">
        <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td style="width:80px;height:80px;background:#0b2a2a;border:3px solid #2DD4BF;border-radius:50%;text-align:center;overflow:hidden;">
          <img src="cid:{AVATAR_CID}" alt="Mamunur Rashid" width="80" height="80" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;" />
        </td></tr></table>
      </td></tr>
      <tr><td style="padding:12px 40px 8px;">
        <h1 style="color:#F1F5F4;font-size:22px;margin:8px 0 6px;text-align:center;">Your secure sign-in link</h1>
        <p style="color:#9FB4B2;font-size:15px;line-height:1.7;margin:0 0 22px;text-align:center;">
          Hi {first}, click the button below to open your private client portal. This link expires in 15 minutes and can be used once.
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="{link}" target="_blank" style="display:inline-block;background:#2DD4BF;color:#06211C;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:10px;font-size:15px;">Open my portal &rarr;</a>
        </div>
        <p style="color:#5b6f6d;font-size:12px;line-height:1.6;margin:0;text-align:center;word-break:break-all;">
          Or paste this link into your browser:<br>{link}
        </p>
      </td></tr>
      <tr><td style="padding:20px 30px 28px;border-top:1px solid #1E3339;">
        <p style="color:#5b6f6d;font-size:12px;line-height:1.6;margin:12px 0 0;text-align:center;">
          If you didn&rsquo;t request this, you can safely ignore this email.
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>"""
    text = (
        f"Hi {first},\n\nOpen your private client portal with this secure link "
        f"(expires in 15 minutes):\n{link}\n\nIf you didn't request this, ignore this email."
    )
    return html, text


@router.post("/request-link")
def request_link(payload: EmailReq, session: Session = Depends(get_session)):
    """Email a one-time magic sign-in link. Always responds generically so the
    endpoint can't be used to discover which emails are registered clients."""
    generic = {"status": "ok", "message": "If that email belongs to a client, a secure sign-in link is on its way."}
    client = session.exec(select(Client).where(Client.email == str(payload.email))).first()
    if not client or client.id is None:
        return generic

    token = make_magic_token(client.id)
    link = f"{_site_url()}/portal/verify?token={token}"
    html, text = _magic_email(client.name, link)
    inline = None
    try:
        with open(AVATAR_PATH, "rb") as f:
            inline = (AVATAR_CID, f.read(), "image/png")
    except Exception:
        inline = None
    try:
        _smtp_send(client.email, "Your secure client portal link", text, "Mamunur Rashid",
                   html_body=html, inline_image=inline)
    except Exception as e:  # never leak send failures to the caller
        logger.warning("portal magic link send failed: %s", e)
    return generic


@router.post("/verify")
def verify(payload: TokenReq, session: Session = Depends(get_session)):
    cid = decode_scoped(payload.token, SCOPE_MAGIC)
    if cid is None:
        raise HTTPException(status_code=400, detail="This sign-in link is invalid or has expired.")
    client = session.get(Client, cid)
    if not client:
        raise HTTPException(status_code=400, detail="Account not found.")
    return {"access_token": make_session_token(cid), "token_type": "bearer"}


@router.get("/me")
def me(client: Client = Depends(get_current_client), session: Session = Depends(get_session)):
    """Everything the signed-in client is allowed to see — strictly scoped to
    their own client_id."""
    cid = client.id
    milestones = session.exec(select(Milestone).where(Milestone.client_id == cid)).all()
    updates = session.exec(
        select(ClientUpdate).where(ClientUpdate.client_id == cid).order_by(ClientUpdate.id.asc())
    ).all()
    files = session.exec(select(PortalFile).where(PortalFile.client_id == cid)).all()
    invoices = session.exec(select(Invoice).where(Invoice.client_id == cid)).all()

    return {
        "client": {
            "id": cid,
            "name": client.name,
            "email": client.email,
            "company": client.company,
            "project_title": client.project_title,
            "project_description": client.project_description,
            "status": client.status,
            "progress": client.progress,
            "meeting_url": client.meeting_url,
            "proposal_text": client.proposal_text,
            "next_steps": client.next_steps,
        },
        "milestones": sorted(
            [m.model_dump() for m in milestones], key=lambda x: (x["order"], x["id"])
        ),
        "updates": [u.model_dump() for u in updates],
        "files": [
            {"id": f.id, "filename": f.filename, "content_type": f.content_type,
             "size": f.size, "created_at": f.created_at}
            for f in files
        ],
        "invoices": [i.model_dump() for i in invoices],
    }


@router.post("/updates")
def post_reply(payload: ReplyReq, client: Client = Depends(get_current_client),
               session: Session = Depends(get_session)):
    """Let the signed-in client reply to the project thread."""
    body = (payload.body or "").strip()
    if not body:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    upd = ClientUpdate(client_id=client.id, title="", body=body, author="client")
    session.add(upd)
    session.commit()
    session.refresh(upd)
    return upd.model_dump()


@router.get("/files/{file_id}")
def download_file(file_id: int, client: Client = Depends(get_current_client),
                  session: Session = Depends(get_session)):
    f = session.get(PortalFile, file_id)
    if not f or f.client_id != client.id:   # ownership check — no cross-client access
        raise HTTPException(status_code=404, detail="File not found")
    data = base64.b64decode(f.data_base64)
    return Response(
        content=data,
        media_type=f.content_type or "application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{f.filename}"'},
    )
