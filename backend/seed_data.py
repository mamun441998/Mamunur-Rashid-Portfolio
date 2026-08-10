"""Non-destructive database seed.

Each table is seeded ONLY if it is currently empty, so running this repeatedly
(or after adding real data through the admin panel) never wipes anything.

Usage (from backend/):  python seed_data.py
"""
import json
from datetime import date

from sqlmodel import Session, select

from app.db.session import engine, create_db_and_tables
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project
from app.models.service import Service
from app.models.case_study import CaseStudy
from app.models.site_setting import SiteSetting


def _seed_if_empty(session: Session, model, rows: list) -> None:
    existing = session.exec(select(model)).first()
    if existing is not None:
        print(f"• {model.__name__}: already has data — skipped.")
        return
    for data in rows:
        session.add(model(**data))
    session.commit()
    print(f"✓ {model.__name__}: seeded {len(rows)} row(s).")


skills_data = [
    {"name": "Python", "category": "Backend", "proficiency": 88},
    {"name": "FastAPI", "category": "Backend", "proficiency": 85},
    {"name": "Laravel", "category": "Backend", "proficiency": 92},
    {"name": "PHP", "category": "Backend", "proficiency": 88},
    {"name": "REST APIs", "category": "Backend", "proficiency": 90},
    {"name": "Authentication & Authorization", "category": "Backend", "proficiency": 88},
    {"name": "Object-Oriented Programming", "category": "Backend", "proficiency": 85},
    {"name": "Next.js", "category": "Frontend", "proficiency": 85},
    {"name": "React.js", "category": "Frontend", "proficiency": 82},
    {"name": "TypeScript", "category": "Frontend", "proficiency": 78},
    {"name": "JavaScript", "category": "Frontend", "proficiency": 85},
    {"name": "Tailwind CSS", "category": "Frontend", "proficiency": 80},
    {"name": "PostgreSQL", "category": "Database", "proficiency": 85},
    {"name": "MySQL", "category": "Database", "proficiency": 82},
    {"name": "Query Optimization", "category": "Database", "proficiency": 80},
    {"name": "Database Design", "category": "Database", "proficiency": 82},
    {"name": "SaaS Architecture", "category": "Architecture", "proficiency": 85},
    {"name": "Multi-Tenant Architecture", "category": "Architecture", "proficiency": 82},
    {"name": "Business Process Automation", "category": "Architecture", "proficiency": 80},
    {"name": "CRM Development", "category": "Architecture", "proficiency": 82},
    {"name": "System Design", "category": "Architecture", "proficiency": 78},
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

services_data = [
    {
        "slug": "saas",
        "title": "SaaS Platform Development",
        "tagline": "Multi-tenant products built to scale",
        "description": (
            "End-to-end SaaS platforms with multi-tenant architecture, subscription "
            "billing, and role-based access — engineered for growth from day one."
        ),
        "icon_name": "Layers",
        "features": "Multi-Tenant Architecture,Subscription Billing,Role-Based Access,Admin Dashboards",
        "tech_stack": "Laravel,Next.js,PostgreSQL",
        "highlight": True,
        "order": 1,
    },
    {
        "slug": "webapps",
        "title": "Full-Stack Web Applications",
        "tagline": "Modern apps, front to back",
        "description": (
            "Responsive, high-performance web applications with clean UI/UX and "
            "robust backend logic tailored to your business workflows."
        ),
        "icon_name": "Code2",
        "features": "Responsive UI,Server-Side Rendering,Clean Architecture,SEO Optimized",
        "tech_stack": "Next.js,React,TypeScript,Tailwind CSS",
        "highlight": False,
        "order": 2,
    },
    {
        "slug": "api-backend",
        "title": "API & Backend Engineering",
        "tagline": "Secure, well-documented APIs",
        "description": (
            "Scalable REST APIs with authentication, authorization, and clean data "
            "models — the reliable backbone your products depend on."
        ),
        "icon_name": "Cpu",
        "features": "REST APIs,JWT Auth,Data Modeling,OpenAPI Docs",
        "tech_stack": "FastAPI,Laravel,PostgreSQL",
        "highlight": False,
        "order": 3,
    },
    {
        "slug": "performance",
        "title": "Performance Optimization",
        "tagline": "Faster load, happier users",
        "description": (
            "Profiling and tuning of queries, rendering, and delivery to make your "
            "application measurably faster and more efficient."
        ),
        "icon_name": "Zap",
        "features": "Query Optimization,Caching,Bundle Analysis,Core Web Vitals",
        "tech_stack": "PostgreSQL,Next.js,Cloudflare",
        "highlight": False,
        "order": 4,
    },
    {
        "slug": "cloud-devops",
        "title": "Cloud & DevOps",
        "tagline": "Ship reliably, deploy often",
        "description": (
            "Deployment pipelines and cloud hosting setup so your product ships "
            "reliably and scales without surprises."
        ),
        "icon_name": "Globe2",
        "features": "CI/CD,Cloud Hosting,Environment Config,Monitoring",
        "tech_stack": "Docker,Render,Vercel,Supabase",
        "highlight": False,
        "order": 5,
    },
    {
        "slug": "maintenance",
        "title": "Maintenance & Support",
        "tagline": "Keep systems healthy",
        "description": (
            "Ongoing maintenance, bug fixes, and feature iteration to keep your "
            "platform secure, stable, and evolving with your business."
        ),
        "icon_name": "ShieldCheck",
        "features": "Bug Fixes,Security Updates,Feature Iteration,Code Reviews",
        "tech_stack": "Git,GitHub,Linux",
        "highlight": False,
        "order": 6,
    },
]

case_studies_data = [
    {
        "slug": "auto-marketplace",
        "title": "Auto Marketplace Modernization",
        "subtitle": "Multi-tenant automotive SaaS platform",
        "challenge": (
            "Car dealerships needed a single platform to manage inventory, generate "
            "leads, and run their own branded websites — without maintaining separate "
            "tools. The challenge was designing a multi-tenant architecture that keeps "
            "each dealer's data isolated while sharing one scalable codebase, plus "
            "subscription billing and an admin dashboard that non-technical staff can use."
        ),
        "github_repo_url": "https://github.com/mamun441998/Auto-Marketplace-Modernization",
        "metrics": json.dumps([
            {"label": "Tenants Supported", "value": "Multi", "sub": "isolated dealer workspaces"},
            {"label": "Core Modules", "value": "6+", "sub": "inventory, CRM, billing, sites"},
            {"label": "Architecture", "value": "SaaS", "sub": "subscription-ready"},
        ]),
        "code_snippet": (
            "// Tenant-scoped query middleware\n"
            "Model::addGlobalScope('tenant', function ($builder) {\n"
            "    $builder->where('dealer_id', auth()->user()->dealer_id);\n"
            "});"
        ),
        "order": 1,
    },
]


def seed():
    create_db_and_tables()
    with Session(engine) as session:
        _seed_if_empty(session, Skill, skills_data)
        _seed_if_empty(session, Experience, experience_data)
        _seed_if_empty(session, Project, projects_data)
        _seed_if_empty(session, Service, services_data)
        _seed_if_empty(session, CaseStudy, case_studies_data)

        # SiteSetting: single default row (id=1) only if none exists.
        if session.get(SiteSetting, 1) is None and session.exec(select(SiteSetting)).first() is None:
            session.add(SiteSetting(
                id=1,
                full_name="Mamunur Rashid",
                role_title="Full Stack Software Engineer",
                hero_tagline=(
                    "I build SaaS platforms, CRM systems, and marketplace applications "
                    "using Laravel, Next.js, and PostgreSQL."
                ),
                about_text=(
                    "I help businesses solve disconnected, hard-to-scale software by "
                    "building SaaS platforms, CRM systems, marketplace applications, and "
                    "business automation software using Laravel, Next.js, and PostgreSQL."
                ),
                email="mamun441998@gmail.com",
                phone="+880 1978529953",
                location="Dhaka, Bangladesh",
                github_url="https://github.com/mamun441998",
                linkedin_url="https://www.linkedin.com/in/mamun441998/",
                facebook_url="https://www.facebook.com/mamunsoftwareengineer/",
                years_experience="2+",
                projects_completed="3+",
                happy_clients="3+",
                satisfaction="100%",
                calendly_url="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1BoiiiiIA5Oo22YNFCmFPMHCes4DDo3IATKgLs43xvKX72cWk1MJkpA0Sj-dDwYpJckYI70L-q",
            ))
            session.commit()
            print("✓ SiteSetting: seeded default row.")
        else:
            print("• SiteSetting: already exists — skipped.")

    print("\nDone. Seed is non-destructive; existing data was preserved.")


if __name__ == "__main__":
    seed()
