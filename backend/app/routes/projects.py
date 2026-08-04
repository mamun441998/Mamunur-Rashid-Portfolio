from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.project import Project
from app.models.admin import Admin
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=List[Project])
def get_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project)).all()

@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/", response_model=Project)
def create_project(
    project: Project,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.put("/{project_id}", response_model=Project)
def update_project(
    project_id: int,
    updated: Project,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    data = updated.dict(exclude_unset=True, exclude={"id"})
    for key, value in data.items():
        setattr(project, key, value)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"message": "Project deleted successfully"}