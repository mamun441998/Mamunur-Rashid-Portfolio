"""Create or update the admin account.

Usage:
    python create_admin.py                 # uses ADMIN_USERNAME / ADMIN_PASSWORD from .env
    python create_admin.py <username> <password>
"""
import sys

from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import engine, create_db_and_tables
from app.models.admin import Admin


def create_or_update_admin(username: str, password: str) -> None:
    create_db_and_tables()
    with Session(engine) as session:
        admin = session.exec(select(Admin).where(Admin.username == username)).first()
        if admin:
            admin.hashed_password = hash_password(password)
            session.add(admin)
            session.commit()
            print(f"Admin '{username}' password updated successfully.")
        else:
            admin = Admin(username=username, hashed_password=hash_password(password))
            session.add(admin)
            session.commit()
            print(f"Admin '{username}' created successfully.")


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        user, pwd = sys.argv[1], sys.argv[2]
    else:
        user, pwd = settings.admin_username, settings.admin_password
    create_or_update_admin(user, pwd)
