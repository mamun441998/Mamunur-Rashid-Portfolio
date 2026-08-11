from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.testimonial import Testimonial
from app.models.admin import Admin
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("/", response_model=List[Testimonial])
def list_testimonials(session: Session = Depends(get_session)):
    rows = session.exec(select(Testimonial)).all()
    return sorted(rows, key=lambda t: (t.order, -(t.id or 0)))


@router.post("/", response_model=Testimonial)
def create_testimonial(
    testimonial: Testimonial,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    session.add(testimonial)
    session.commit()
    session.refresh(testimonial)
    return testimonial


@router.put("/{testimonial_id}", response_model=Testimonial)
def update_testimonial(
    testimonial_id: int,
    updated: Testimonial,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    obj = session.get(Testimonial, testimonial_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    data = updated.model_dump(exclude_unset=True, exclude={"id", "created_at"})
    for key, value in data.items():
        setattr(obj, key, value)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    obj = session.get(Testimonial, testimonial_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    session.delete(obj)
    session.commit()
    return {"message": "Testimonial deleted successfully"}
