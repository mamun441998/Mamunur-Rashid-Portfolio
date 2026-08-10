from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Blog(SQLModel, table=True):
    """A blog article. `content_html` holds admin-authored HTML rendered as-is
    on the public blog page, so the owner can design each post freely."""
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True)               # unique URL slug, used at /blog/<slug>
    title: str
    excerpt: str = ""                           # short summary shown in the left list
    content_html: str = ""                      # full HTML body
    hero_image_url: Optional[str] = None        # banner image at the top of the post
    tags: str = ""                              # comma-separated (SEO keywords)
    meta_description: str = ""                  # SEO <meta name="description">
    author: str = "Mamunur Rashid"
    read_time: str = ""                         # e.g. "5 min read" (optional)
    published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class BlogImage(SQLModel, table=True):
    """Uploaded image bytes stored in Postgres (base64) so they survive Render
    redeploys (the container filesystem is ephemeral). Served via /api/blogs/image/{id}."""
    id: Optional[int] = Field(default=None, primary_key=True)
    content_type: str = "image/png"
    data_base64: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
