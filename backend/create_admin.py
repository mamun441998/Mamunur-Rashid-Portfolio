from sqlmodel import Session
from app.db.session import engine, create_db_and_tables
from app.models.admin import Admin
from app.core.security import hash_password

def create_admin(username: str, password: str):
    create_db_and_tables()
    with Session(engine) as session:
        admin = Admin(username=username, hashed_password=hash_password(password))
        session.add(admin)
        session.commit()
        print(f"Admin '{username}' created successfully.")

if __name__ == "__main__":
    # Change username and password before running
    create_admin("admin", "M@mun441998@91")