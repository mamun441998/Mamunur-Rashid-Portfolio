from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# echo=False in production; pool_pre_ping keeps pooled Supabase connections healthy.
engine = create_engine(settings.database_url, echo=False, pool_pre_ping=True)


def create_db_and_tables():
    """Create any missing tables. NEVER drops existing data."""
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
