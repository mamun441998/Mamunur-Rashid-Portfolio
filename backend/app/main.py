import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import engine, create_db_and_tables

# Import every model so SQLModel.metadata knows about all tables at create_all time.
from app.models.admin import Admin
from app.models.project import Project
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.contact import ContactMessage
from app.models.service import Service
from app.models.case_study import CaseStudy
from app.models.visit import Visit
from app.models.site_setting import SiteSetting
from app.models.meeting import Meeting
from app.models.meeting_state import MeetingState
from app.models.password_reset import PasswordReset

from app.routes import (
    auth, projects, skills, experience, contact,
    services, case_studies, analytics, settings as settings_routes, calendly,
    meetings,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio")


def ensure_admin() -> None:
    """Create the admin account from env credentials ONLY if it doesn't exist.

    We intentionally do NOT overwrite an existing admin's password on startup so
    that password changes made from the admin UI (or via email reset) persist
    across restarts/redeploys.
    """
    with Session(engine) as session:
        admin = session.exec(
            select(Admin).where(Admin.username == settings.admin_username)
        ).first()
        if admin is None:
            session.add(Admin(
                username=settings.admin_username,
                hashed_password=get_password_hash(settings.admin_password),
            ))
            session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()  # only creates missing tables; NEVER drops data
    try:
        ensure_admin()
    except Exception as exc:
        logger.exception("Admin bootstrap failed: %s", exc)
    yield


app = FastAPI(title=settings.PROJECT_NAME, version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Auth"])
app.include_router(projects.router, tags=["Projects"])
app.include_router(skills.router, tags=["Skills"])
app.include_router(experience.router, tags=["Experiences"])
app.include_router(contact.router, tags=["Contact"])
app.include_router(services.router, tags=["Services"])
app.include_router(case_studies.router, tags=["Case Studies"])
app.include_router(analytics.router, tags=["Analytics"])
app.include_router(settings_routes.router, tags=["Site Settings"])
app.include_router(calendly.router, tags=["Calendly"])
app.include_router(meetings.router, tags=["Meetings"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "online", "message": settings.PROJECT_NAME}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
