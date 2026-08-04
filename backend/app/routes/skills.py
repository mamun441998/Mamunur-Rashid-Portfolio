from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.skill import Skill
from app.models.admin import Admin
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("/", response_model=List[Skill])
def get_skills(session: Session = Depends(get_session)):
    return session.exec(select(Skill)).all()

@router.get("/{skill_id}", response_model=Skill)
def get_skill(skill_id: int, session: Session = Depends(get_session)):
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.post("/", response_model=Skill)
def create_skill(
    skill: Skill,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill

@router.put("/{skill_id}", response_model=Skill)
def update_skill(
    skill_id: int,
    updated: Skill,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    data = updated.dict(exclude_unset=True, exclude={"id"})
    for key, value in data.items():
        setattr(skill, key, value)
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill

@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    session.delete(skill)
    session.commit()
    return {"message": "Skill deleted successfully"}