from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import create_db_and_tables
from app.routes import auth, contact, experience, projects, skills


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Database & Table creation
    create_db_and_tables()
    yield
    # Shutdown logic (if needed)


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
    "https://mamunur-rashid-portfolio-wine.vercel.app",  # ✅ Vercel Live URL যোগ করা হয়েছে
]

# CORS Configuration Fixed for security and credentials support
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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