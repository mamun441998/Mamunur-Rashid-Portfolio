from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, Request
from pydantic import BaseModel
from sqlalchemy import func
from sqlmodel import Session, select

from app.core.security import get_current_admin
from app.db.session import engine, get_session
from app.models.admin import Admin
from app.models.visit import Visit
from app.utils.geo import client_ip_from_request, hash_ip, resolve_country

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


class TrackPayload(BaseModel):
    path: Optional[str] = "/"
    referrer: Optional[str] = None


def _persist_visit(
    path: str,
    ip: str,
    ip_hashed: str,
    referrer: Optional[str],
    user_agent: Optional[str],
) -> None:
    """Runs in a BackgroundTask: resolve country then store the visit."""
    geo = resolve_country(ip)
    with Session(engine) as session:
        visit = Visit(
            path=path or "/",
            country=geo["country"],
            country_code=geo["country_code"],
            city=geo["city"] or None,
            ip_hash=ip_hashed,
            referrer=referrer,
            user_agent=user_agent,
        )
        session.add(visit)
        session.commit()


@router.post("/track")
def track(
    payload: TrackPayload,
    request: Request,
    background_tasks: BackgroundTasks,
):
    """Public: record a visit. Country resolution happens in the background."""
    ip = client_ip_from_request(request)
    ip_hashed = hash_ip(ip)
    user_agent = request.headers.get("user-agent")
    background_tasks.add_task(
        _persist_visit, payload.path or "/", ip, ip_hashed, payload.referrer, user_agent
    )
    return {"status": "ok"}


@router.get("/stats")
def stats(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin),
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = today_start - timedelta(days=7)
    span_start = today_start - timedelta(days=13)  # last 14 days inclusive

    total_visits = session.exec(select(func.count()).select_from(Visit)).one()
    unique_visitors = session.exec(
        select(func.count(func.distinct(Visit.ip_hash)))
    ).one()
    today = session.exec(
        select(func.count()).select_from(Visit).where(Visit.created_at >= today_start)
    ).one()
    this_week = session.exec(
        select(func.count()).select_from(Visit).where(Visit.created_at >= week_start)
    ).one()

    by_country_rows = session.exec(
        select(Visit.country, Visit.country_code, func.count().label("count"))
        .group_by(Visit.country, Visit.country_code)
        .order_by(func.count().desc())
    ).all()
    by_country = [
        {"country": c or "Unknown", "country_code": cc or "", "count": int(n)}
        for c, cc, n in by_country_rows
    ]

    by_day_rows = session.exec(
        select(func.date(Visit.created_at).label("day"), func.count().label("count"))
        .where(Visit.created_at >= span_start)
        .group_by(func.date(Visit.created_at))
        .order_by(func.date(Visit.created_at))
    ).all()
    by_day = [{"day": str(d), "count": int(n)} for d, n in by_day_rows]

    top_path_rows = session.exec(
        select(Visit.path, func.count().label("count"))
        .group_by(Visit.path)
        .order_by(func.count().desc())
        .limit(10)
    ).all()
    top_paths = [{"path": p or "/", "count": int(n)} for p, n in top_path_rows]

    return {
        "total_visits": int(total_visits),
        "unique_visitors": int(unique_visitors),
        "today": int(today),
        "this_week": int(this_week),
        "by_country": by_country,
        "by_day": by_day,
        "top_paths": top_paths,
    }
