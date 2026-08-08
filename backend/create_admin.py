"""Ensure the admin user exists with the admin role.

Run directly:  python create_admin.py
"""
from app import create_app
from database import db, bcrypt
from models import User


def main():
    app = create_app()

    with app.app_context():
        admin_user = User.query.filter_by(email="admin@gmail.com").first()

        if admin_user:
            admin_user.role = "admin"
            db.session.commit()
            print("Admin role updated successfully")
            print(f"Email: {admin_user.email}")
            print(f"Role: {admin_user.role}")
        else:
            hashed_password = bcrypt.generate_password_hash("admin1234").decode('utf-8')
            new_admin = User(
                full_name="ADMIN",
                email="admin@gmail.com",
                phone="08000000000",
                password_hash=hashed_password,
                role="admin",
                is_active=True
            )
            db.session.add(new_admin)
            db.session.commit()
            print("Admin user created successfully")
            print(f"Email: {new_admin.email}")
            print(f"Role: {new_admin.role}")


if __name__ == "__main__":
    main()
