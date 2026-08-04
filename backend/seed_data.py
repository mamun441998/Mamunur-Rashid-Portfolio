from datetime import date
from sqlmodel import Session, select
from app.db.session import engine, create_db_and_tables
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project

skills_data = [
    # Backend
    {"name": "Python", "category": "Backend", "proficiency": 88},
    {"name": "FastAPI", "category": "Backend", "proficiency": 85},
    {"name": "Laravel", "category": "Backend", "proficiency": 92},
    {"name": "PHP", "category": "Backend", "proficiency": 88},
    {"name": "REST APIs", "category": "Backend", "proficiency": 90},
    {"name": "Authentication & Authorization", "category": "Backend", "proficiency": 88},
    {"name": "Object-Oriented Programming", "category": "Backend", "proficiency": 85},

    # Frontend
    {"name": "Next.js", "category": "Frontend", "proficiency": 85},
    {"name": "React.js", "category": "Frontend", "proficiency": 82},
    {"name": "TypeScript", "category": "Frontend", "proficiency": 78},
    {"name": "JavaScript", "category": "Frontend", "proficiency": 85},
    {"name": "Tailwind CSS", "category": "Frontend", "proficiency": 80},

    # Database
    {"name": "PostgreSQL", "category": "Database", "proficiency": 85},
    {"name": "MySQL", "category": "Database", "proficiency": 82},
    {"name": "Query Optimization", "category": "Database", "proficiency": 80},
    {"name": "Database Design", "category": "Database", "proficiency": 82},

    # Architecture & Business Logic
    {"name": "SaaS Architecture", "category": "Architecture", "proficiency": 85},
    {"name": "Multi-Tenant Architecture", "category": "Architecture", "proficiency": 82},
    {"name": "Business Process Automation", "category": "Architecture", "proficiency": 80},
    {"name": "CRM Development", "category": "Architecture", "proficiency": 82},
    {"name": "System Design", "category": "Architecture", "proficiency": 78},

    # Tools
    {"name": "Git & GitHub", "category": "Tools", "proficiency": 88},
    {"name": "Docker", "category": "Tools", "proficiency": 70},
    {"name": "Linux", "category": "Tools", "proficiency": 75},
]

experience_data = [
    {
        "role": "Web Developer",
        "company": "Ecommerized IT Institute",
        "description": (
            "Building SaaS platforms, CRM systems, marketplace applications, and "
            "business automation software using Laravel, Next.js, and PostgreSQL. "
            "Designing multi-tenant architectures and scalable backend systems for "
            "growing businesses. Working remotely with an Abu Dhabi-based team."
        ),
        "start_date": date(2025, 12, 1),
        "end_date": None,
        "is_current": True,
    },
]

projects_data = [
    {
        "title": "MotoHave - Multi-Tenant Automotive SaaS Platform",
        "description": (
            "A full-stack multi-tenant SaaS platform built for automotive dealerships. "
            "Dealers can manage vehicle inventory, leads, team members, marketing "
            "campaigns, and website customization from a centralized dashboard."
        ),
        "tech_stack": "Laravel, Next.js, React, PostgreSQL, TypeScript",
        "image_url": None,
        "project_url": None,
        "github_url": "https://github.com/mamun441998/Auto-Marketplace-Modernization",
    },
    {
        "title": "MotoHave Dealer Admin Dashboard",
        "description": (
            "Multi-tenant SaaS admin dashboard for automotive dealerships covering "
            "inventory management, CRM pipelines, team management, marketing "
            "campaigns, website customization, and subscription billing."
        ),
        "tech_stack": "Laravel, Next.js, PostgreSQL, REST APIs",
        "image_url": None,
        "project_url": None,
        "github_url": None,
    },
    {
        "title": "Home Service Website",
        "description": (
            "A web application for booking and managing home service requests, "
            "built with a focus on clean UI and streamlined service scheduling."
        ),
        "tech_stack": "PHP, MySQL, JavaScript",
        "image_url": None,
        "project_url": None,
        "github_url": "https://github.com/mamun441998/Home-Service-Website",
    },
    {
        "title": "Saleh Basahel Business Platform",
        "description": (
            "A custom web application built for modern business management and "
            "digital representation, offering clean UI/UX and interactive features."
        ),
        "tech_stack": "Next.js, React, TypeScript, Tailwind CSS",
        "image_url": None,
        "project_url": None,
        "github_url": "https://github.com/freedomwithdxn2026/Saleh-Basahel.git",
    },
]


def seed():
    create_db_and_tables()
    with Session(engine) as session:
        # Safe deletion using select queries
        for item in session.exec(select(Skill)).all():
            session.delete(item)
        for item in session.exec(select(Experience)).all():
            session.delete(item)
        for item in session.exec(select(Project)).all():
            session.delete(item)
        session.commit()

        # Add Skills
        for data in skills_data:
            session.add(Skill(**data))

        # Add Experience
        for data in experience_data:
            session.add(Experience(**data))

        # Add Projects
        for data in projects_data:
            session.add(Project(**data))

        session.commit()
        print(f"✅ Database successfully re-seeded with {len(skills_data)} skills, {len(projects_data)} projects, and {len(experience_data)} experience entries!")


if __name__ == "__main__":
    seed()