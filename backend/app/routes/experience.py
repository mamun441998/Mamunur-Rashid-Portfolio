from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.experience import Experience
from app.models.admin import Admin
from app.core.security import get_current_admin

# Plural Prefix "/api/experiences" ব্যবহার করা হয়েছে যেন ফ্রন্টএন্ডের সাথে পারফেক্টলি মিলে
router = APIRouter(prefix="/api/experiences", tags=["experiences"])


@router.get("", response_model=List[Experience])
@router.get("/", response_model=List[Experience])
def get_experiences(session: Session = Depends(get_session)):
    """Fetch all work experiences ordered by start_date descending"""
    statement = select(Experience).order_by(Experience.start_date.desc())
    return session.exec(statement).all()


@router.get("/{exp_id}", response_model=Experience)
def get_experience(exp_id: int, session: Session = Depends(get_session)):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return exp


@router.post("/", response_model=Experience, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp: Experience,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=Experience)
def update_experience(
    exp_id: int,
    updated: Experience,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    # SQLModel v0.0.14+ compatibility (model_dump is preferred over dict)
    data = updated.model_dump(exclude_unset=True, exclude={"id"})
    for key, value in data.items():
        setattr(exp, key, value)
        
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.delete("/{exp_id}")
def delete_experience(
    exp_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    session.delete(exp)
    session.commit()
    return {"message": "Experience deleted successfully"}