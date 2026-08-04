from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.experience import Experience

router = APIRouter()


@router.get(
    "",
    response_model=List[Experience],
    status_code=status.HTTP_200_OK,
    summary="Get all work experiences",
    description="Retrieve a list of work experiences ordered by start date descending."
)
@router.get("/", response_model=List[Experience], include_in_schema=False)
def get_experiences(session: Session = Depends(get_session)) -> List[Experience]:
    """Fetch all work experiences ordered by start_date descending."""
    statement = select(Experience).order_by(Experience.start_date.desc())
    experiences = session.exec(statement).all()
    return list(experiences)