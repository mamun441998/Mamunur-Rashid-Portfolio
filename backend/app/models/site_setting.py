from typing import Optional

from sqlmodel import SQLModel, Field


class SiteSetting(SQLModel, table=True):
    """Single-row table (id=1) holding all admin-controlled site content."""
    id: Optional[int] = Field(default=1, primary_key=True)

    full_name: str = ""
    role_title: str = ""
    hero_tagline: str = ""
    about_text: str = ""
    profile_image_url: str = ""
    resume_url: str = ""

    email: str = ""
    phone: str = ""
    location: str = ""

    github_url: str = ""
    linkedin_url: str = ""
    twitter_url: str = ""
    facebook_url: str = ""

    years_experience: str = ""
    projects_completed: str = ""
    happy_clients: str = ""
    satisfaction: str = ""

    calendly_url: str = ""
