from sqlmodel import Session
from .database import engine, create_db_and_tables
from .models import Complaint, Officer, User, Reward, StatusEnum, EscalationEnum
from datetime import datetime

# Redesigned mocks to fit the new schema
def seed_db():
    print("Beginning professional seeding...")
    create_db_and_tables()
    with Session(engine) as session:
        # Check if already seeded
        if session.exec(select(User)).first():
            print("DB already seeded. Skipping.")
            return

        # Users
        users_list = [
            User(username="rahul88", email="rahul@example.com", hashed_password="hashed_pass_here", full_name="Rahul S.", avatar_url="RS", points=1540, badge="🥇"),
            User(username="sneha_v", email="sneha@example.com", hashed_password="hashed_pass_here", full_name="Sneha V.", points=1980, badge="🥇"),
            User(username="officer1", email="officer1@gov.in", hashed_password="hashed_pass_here", full_name="Officer Sharma", is_officer=True)
        ]
        
        for u in users_list:
            session.add(u)
        session.commit() # Commit to get User IDs
        
        # Officer Model
        off = Officer(id="OFF-101", name="Officer Sharma", ward="North Delhi - Ward 14", score=87, designation="Junior Engineer", resolution_time="18 hrs")
        session.add(off)
        session.commit()

        # Complaints
        c1 = Complaint(
            id="IND-2026-04821", category="Roads", title="Large pothole causing traffic",
            description="There is a large pothole near the crossing that has been causing traffic jams and minor accidents.",
            location="Lajpat Nagar", lat=28.5677, lng=77.2433, status=StatusEnum.PENDING, 
            upvotes=42, comments_count=5, creator_id=users_list[0].id, escalation_level=EscalationEnum.L1
        )
        
        c2 = Complaint(
            id="IND-2026-04822", category="Garbage", title="Garbage pile uncollected",
            description="Garbage has not been collected for 4 days here. It is causing a foul smell.",
            location="Karol Bagh", lat=28.6517, lng=77.1901, status=StatusEnum.IN_PROGRESS, 
            upvotes=120, comments_count=14, creator_id=users_list[1].id, escalation_level=EscalationEnum.L2, 
            assigned_officer=off
        )
        
        session.add(c1)
        session.add(c2)
        
        # Rewards
        rew1 = Reward(id=1, title="Metro Smart Card", pts=200, icon="🚇")
        rew2 = Reward(id=2, title="Mobile Recharge ₹50", pts=150, icon="📱")
        session.add(rew1)
        session.add(rew2)
        
        session.commit()
    print("Seeding complete. The backend is now data-rich.")

from sqlmodel import select
if __name__ == "__main__":
    seed_db()
