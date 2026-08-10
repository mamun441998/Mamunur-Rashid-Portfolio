from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.security import get_current_admin
from app.db.session import get_session
from app.models.admin import Admin
from app.models.case_study import CaseStudy

router = APIRouter(prefix="/api/case-studies", tags=["case-studies"])


@router.get("", response_model=List[CaseStudy])
@router.get("/", response_model=List[CaseStudy], include_in_schema=False)
def list_(session: Session = Depends(get_session)):
    return session.exec(select(CaseStudy).order_by(CaseStudy.order, CaseStudy.id)).all()


# NOTE: keep /slug/{slug} BEFORE /{id} so it is not swallowed by the int route.
@router.get("/slug/{slug}", response_model=CaseStudy)
def get_by_slug(slug: str, session: Session = Depends(get_session)):
    obj = session.exec(select(CaseStudy).where(CaseStudy.slug == slug)).first()
    if not obj:
        raise HTTPException(404, "Not found")
    return obj


@router.get("/{id}", response_model=CaseStudy)
def get_one(id: int, session: Session = Depends(get_session)):
    obj = session.get(CaseStudy, id)
    if not obj:
        raise HTTPException(404, "Not found")
    return obj


@router.post("", response_model=CaseStudy, status_code=201)
@router.post("/", response_model=CaseStudy, status_code=201, include_in_schema=False)
def create(
    item: CaseStudy,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    item.id = None
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.put("/{id}", response_model=CaseStudy)
def update(
    id: int,
    upd: CaseStudy,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    obj = session.get(CaseStudy, id)
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
    obj = session.get(CaseStudy, id)
    if not obj:
        raise HTTPException(404, "Not found")
    session.delete(obj)
    session.commit()
    return {"message": "deleted"}
