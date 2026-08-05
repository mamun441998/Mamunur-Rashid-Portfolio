from sqlmodel import Session, select
from app.db.session import engine, create_db_and_tables
from app.models.admin import Admin
from app.core.security import hash_password

def create_or_update_admin(username: str, password: str):
    create_db_and_tables()
    with Session(engine) as session:
        statement = select(Admin).where(Admin.username == username)
        admin = session.exec(statement).first()
        
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
    create_or_update_admin("admin", "M@mun441998@91")