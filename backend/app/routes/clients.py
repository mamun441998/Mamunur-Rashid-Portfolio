import base64
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.admin import Admin
from app.models.client import Client, Milestone, ClientUpdate, PortalFile, Invoice
from app.core.security import get_current_admin
from app.core.portal_security import make_magic_token
from app.routes.portal import _magic_email
from app.routes.contact import _smtp_send, _site_url, AVATAR_PATH, AVATAR_CID

logger = logging.getLogger("portfolio.clients")
router = APIRouter(prefix="/api/clients", tags=["clients"])

MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB per deliverable


def _require_client(session: Session, cid: int) -> Client:
    client = session.get(Client, cid)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


# ---------------- Clients ----------------
@router.get("/", response_model=List[Client])
def list_clients(session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    rows = session.exec(select(Client)).all()
    return sorted(rows, key=lambda c: -(c.id or 0))


@router.post("/", response_model=Client)
def create_client(client: Client, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    client.id = None
    session.add(client)
    session.commit()
    session.refresh(client)
    return client


@router.get("/{cid}")
def client_detail(cid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    client = _require_client(session, cid)
    milestones = session.exec(select(Milestone).where(Milestone.client_id == cid)).all()
    updates = session.exec(select(ClientUpdate).where(ClientUpdate.client_id == cid).order_by(ClientUpdate.id.desc())).all()
    files = session.exec(select(PortalFile).where(PortalFile.client_id == cid)).all()
    invoices = session.exec(select(Invoice).where(Invoice.client_id == cid)).all()
    return {
        "client": client.model_dump(),
        "milestones": sorted([m.model_dump() for m in milestones], key=lambda x: (x["order"], x["id"])),
        "updates": [u.model_dump() for u in updates],
        "files": [{"id": f.id, "filename": f.filename, "content_type": f.content_type,
                   "size": f.size, "created_at": f.created_at} for f in files],
        "invoices": [i.model_dump() for i in invoices],
    }


@router.put("/{cid}", response_model=Client)
def update_client(cid: int, updated: Client, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    client = _require_client(session, cid)
    for k, v in updated.model_dump(exclude_unset=True, exclude={"id", "created_at"}).items():
        setattr(client, k, v)
    session.add(client)
    session.commit()
    session.refresh(client)
    return client


@router.delete("/{cid}")
def delete_client(cid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    client = _require_client(session, cid)
    for model in (Milestone, ClientUpdate, PortalFile, Invoice):
        for row in session.exec(select(model).where(model.client_id == cid)).all():
            session.delete(row)
    session.delete(client)
    session.commit()
    return {"message": "Client deleted"}


@router.post("/{cid}/send-link")
def send_magic_link(cid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    """Admin convenience: email the client their secure portal sign-in link now."""
    client = _require_client(session, cid)
    if not client.email:
        raise HTTPException(status_code=400, detail="This client has no email address.")
    link = f"{_site_url()}/portal/verify?token={make_magic_token(cid)}"
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
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not send email: {e}")
    return {"status": "success", "message": f"Portal link sent to {client.email}"}


# ---------------- Milestones ----------------
@router.post("/{cid}/milestones", response_model=Milestone)
def add_milestone(cid: int, milestone: Milestone, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    _require_client(session, cid)
    milestone.id = None
    milestone.client_id = cid
    session.add(milestone)
    session.commit()
    session.refresh(milestone)
    return milestone


@router.put("/{cid}/milestones/{mid}", response_model=Milestone)
def update_milestone(cid: int, mid: int, updated: Milestone, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    m = session.get(Milestone, mid)
    if not m or m.client_id != cid:
        raise HTTPException(status_code=404, detail="Milestone not found")
    for k, v in updated.model_dump(exclude_unset=True, exclude={"id", "client_id"}).items():
        setattr(m, k, v)
    session.add(m)
    session.commit()
    session.refresh(m)
    return m


@router.delete("/{cid}/milestones/{mid}")
def delete_milestone(cid: int, mid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    m = session.get(Milestone, mid)
    if not m or m.client_id != cid:
        raise HTTPException(status_code=404, detail="Milestone not found")
    session.delete(m)
    session.commit()
    return {"message": "Milestone deleted"}


# ---------------- Updates ----------------
@router.post("/{cid}/updates", response_model=ClientUpdate)
def add_update(cid: int, update: ClientUpdate, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    _require_client(session, cid)
    update.id = None
    update.client_id = cid
    session.add(update)
    session.commit()
    session.refresh(update)
    return update


@router.delete("/{cid}/updates/{uid}")
def delete_update(cid: int, uid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    u = session.get(ClientUpdate, uid)
    if not u or u.client_id != cid:
        raise HTTPException(status_code=404, detail="Update not found")
    session.delete(u)
    session.commit()
    return {"message": "Update deleted"}


# ---------------- Invoices ----------------
@router.post("/{cid}/invoices", response_model=Invoice)
def add_invoice(cid: int, invoice: Invoice, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    _require_client(session, cid)
    invoice.id = None
    invoice.client_id = cid
    session.add(invoice)
    session.commit()
    session.refresh(invoice)
    return invoice


@router.put("/{cid}/invoices/{iid}", response_model=Invoice)
def update_invoice(cid: int, iid: int, updated: Invoice, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    inv = session.get(Invoice, iid)
    if not inv or inv.client_id != cid:
        raise HTTPException(status_code=404, detail="Invoice not found")
    for k, v in updated.model_dump(exclude_unset=True, exclude={"id", "client_id"}).items():
        setattr(inv, k, v)
    session.add(inv)
    session.commit()
    session.refresh(inv)
    return inv


@router.delete("/{cid}/invoices/{iid}")
def delete_invoice(cid: int, iid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    inv = session.get(Invoice, iid)
    if not inv or inv.client_id != cid:
        raise HTTPException(status_code=404, detail="Invoice not found")
    session.delete(inv)
    session.commit()
    return {"message": "Invoice deleted"}


# ---------------- Files ----------------
@router.post("/{cid}/files")
async def upload_file(cid: int, file: UploadFile = File(...), session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    _require_client(session, cid)
    raw = await file.read()
    if len(raw) > MAX_FILE_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB).")
    pf = PortalFile(
        client_id=cid,
        filename=file.filename or "file",
        content_type=file.content_type or "application/octet-stream",
        data_base64=base64.b64encode(raw).decode("ascii"),
        size=len(raw),
    )
    session.add(pf)
    session.commit()
    session.refresh(pf)
    return {"id": pf.id, "filename": pf.filename, "content_type": pf.content_type, "size": pf.size}


@router.delete("/{cid}/files/{fid}")
def delete_file(cid: int, fid: int, session: Session = Depends(get_session), admin: Admin = Depends(get_current_admin)):
    f = session.get(PortalFile, fid)
    if not f or f.client_id != cid:
        raise HTTPException(status_code=404, detail="File not found")
    session.delete(f)
    session.commit()
    return {"message": "File deleted"}
