from contextlib import asynccontextmanager
from datetime import date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.db.session import create_db_and_tables, engine
from app.models.experience import Experience
from app.models.project import Project
from app.models.skill import Skill
from app.routes import auth, contact, experience, projects, skills

# Data to Seed
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
    # Architecture
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


def run_db_seed():
    """Seed database if tables are empty"""
    with Session(engine) as session:
        # Check if skills table already has data
        existing_skills = session.exec(select(Skill)).first()
        if not existing_skills:
            print("🌱 Database is empty. Seeding data...")
            for data in skills_data:
                session.add(Skill(**data))
            for data in experience_data:
                session.add(Experience(**data))
            for data in projects_data:
                session.add(Project(**data))
            session.commit()
            print("✅ Database successfully seeded!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    try:
        run_db_seed()
    except Exception as e:
        print(f"Error seeding database: {e}")
    yield


app = FastAPI(
    title="Mamunur Rashid Portfolio API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Allowed Origins for Production and Local Development
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mamunur-rashid-portfolio-wine.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, tags=["Auth"])
app.include_router(projects.router, tags=["Projects"])
app.include_router(skills.router, tags=["Skills"])
app.include_router(experience.router, tags=["Experiences"])
app.include_router(contact.router, tags=["Contact"])


@app.get("/", tags=["Health Check"])
def root():
    return {"status": "online", "message": "Mamunur Rashid Portfolio API"}