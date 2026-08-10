from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.security import get_current_admin
from app.db.session import get_session
from app.models.admin import Admin
from app.models.site_setting import SiteSetting

router = APIRouter(prefix="/api/settings", tags=["settings"])


def _get_or_create(session: Session) -> SiteSetting:
    obj = session.get(SiteSetting, 1)
    if not obj:
        obj = SiteSetting(id=1)
        session.add(obj)
        session.commit()
        session.refresh(obj)
    return obj


@router.get("", response_model=SiteSetting)
@router.get("/", response_model=SiteSetting, include_in_schema=False)
def get_settings(session: Session = Depends(get_session)):
    return _get_or_create(session)


@router.put("", response_model=SiteSetting)
@router.put("/", response_model=SiteSetting, include_in_schema=False)
def update_settings(
    upd: SiteSetting,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    obj = _get_or_create(session)
    for k, v in upd.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(obj, k, v)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj
