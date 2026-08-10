from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.security import get_current_admin
from app.db.session import get_session
from app.models.admin import Admin
from app.models.service import Service

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=List[Service])
@router.get("/", response_model=List[Service], include_in_schema=False)
def list_(session: Session = Depends(get_session)):
    return session.exec(select(Service).order_by(Service.order, Service.id)).all()


@router.post("", response_model=Service, status_code=201)
@router.post("/", response_model=Service, status_code=201, include_in_schema=False)
def create(
    item: Service,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    item.id = None
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.put("/{id}", response_model=Service)
def update(
    id: int,
    upd: Service,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    obj = session.get(Service, id)
    if not obj:
        raise HTTPException(404, "Not found")
    for k, v in upd.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(obj, k, v)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


@router.delete("/{id}")
def delete(
    id: int,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    obj = session.get(Service, id)
    if not obj:
        raise HTTPException(404, "Not found")
    session.delete(obj)
    session.commit()
    return {"message": "deleted"}
