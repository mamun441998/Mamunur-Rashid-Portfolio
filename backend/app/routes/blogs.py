import base64
import re
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import Response
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.blog import Blog, BlogImage
from app.models.admin import Admin
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/blogs", tags=["blogs"])

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/avif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB


def _slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s or "post"


def _unique_slug(session: Session, base: str, exclude_id: Optional[int] = None) -> str:
    slug = base
    n = 2
    while True:
        stmt = select(Blog).where(Blog.slug == slug)
        existing = session.exec(stmt).first()
        if existing is None or existing.id == exclude_id:
            return slug
        slug = f"{base}-{n}"
        n += 1


# ---------- Public reads ----------

@router.get("/", response_model=List[Blog])
def list_blogs(session: Session = Depends(get_session)):
    rows = session.exec(select(Blog).where(Blog.published == True)).all()  # noqa: E712
    return sorted(rows, key=lambda b: (b.created_at or datetime.min), reverse=True)


@router.get("/all", response_model=List[Blog])
def list_all_blogs(
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin view — includes unpublished drafts."""
    rows = session.exec(select(Blog)).all()
    return sorted(rows, key=lambda b: (b.created_at or datetime.min), reverse=True)


@router.get("/slug/{slug}", response_model=Blog)
def get_blog_by_slug(slug: str, session: Session = Depends(get_session)):
    blog = session.exec(select(Blog).where(Blog.slug == slug)).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


# ---------- Image upload / serve ----------

@router.post("/upload-image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    ctype = (file.content_type or "").lower()
    if ctype not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported image type: {ctype or 'unknown'}")
    raw = await file.read()
    if len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image too large (max 5 MB).")
    img = BlogImage(content_type=ctype, data_base64=base64.b64encode(raw).decode("ascii"))
    session.add(img)
    session.commit()
    session.refresh(img)
    base = str(request.base_url).rstrip("/")
    return {"url": f"{base}/api/blogs/image/{img.id}", "id": img.id}


@router.get("/image/{image_id}")
def get_image(image_id: int, session: Session = Depends(get_session)):
    img = session.get(BlogImage, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    data = base64.b64decode(img.data_base64)
    return Response(content=data, media_type=img.content_type,
                    headers={"Cache-Control": "public, max-age=31536000, immutable"})


# ---------- Admin writes ----------

@router.post("/", response_model=Blog)
def create_blog(
    blog: Blog,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    base_slug = _slugify(blog.slug or blog.title)
    blog.slug = _unique_slug(session, base_slug)
    blog.created_at = datetime.utcnow()
    blog.updated_at = datetime.utcnow()
    session.add(blog)
    session.commit()
    session.refresh(blog)
    return blog


@router.put("/{blog_id}", response_model=Blog)
def update_blog(
    blog_id: int,
    updated: Blog,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    blog = session.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    data = updated.model_dump(exclude_unset=True, exclude={"id", "created_at"})
    if "slug" in data or "title" in data:
        base_slug = _slugify(data.get("slug") or data.get("title") or blog.title)
        data["slug"] = _unique_slug(session, base_slug, exclude_id=blog_id)
    for key, value in data.items():
        setattr(blog, key, value)
    blog.updated_at = datetime.utcnow()
    session.add(blog)
    session.commit()
    session.refresh(blog)
    return blog


@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin),
):
    blog = session.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    session.delete(blog)
    session.commit()
    return {"message": "Blog deleted successfully"}
