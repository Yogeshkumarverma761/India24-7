from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from enum import Enum

class StatusEnum(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    ASSIGNED = "Assigned"
    UNDER_INSPECTION = "Under Inspection"

class EscalationEnum(str, Enum):
    L1 = "L1"
    L2 = "L2"
    L3 = "L3"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    hashed_password: str
    full_name: str
    avatar_url: Optional[str] = None
    points: int = Field(default=0)
    badge: str = Field(default="🥉")
    is_officer: bool = Field(default=False)
    
    complaints: List["Complaint"] = Relationship(back_populates="creator")

class Complaint(SQLModel, table=True):
    id: str = Field(primary_key=True)
    category: str
    title: str
    description: str
    location: str
    lat: float
    lng: float
    status: StatusEnum = Field(default=StatusEnum.PENDING)
    upvotes: int = Field(default=0)
    comments_count: int = Field(default=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    escalation_level: EscalationEnum = Field(default=EscalationEnum.L1)
    image_url: Optional[str] = None
    
    creator_id: Optional[int] = Field(default=None, foreign_key="user.id")
    creator: Optional[User] = Relationship(back_populates="complaints")
    
    officer_id: Optional[str] = Field(default=None, foreign_key="officer.id")
    assigned_officer: Optional["Officer"] = Relationship(back_populates="complaints")

class Officer(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    ward: str
    score: int = Field(default=0)
    designation: str
    resolution_time: str = Field(default="N/A")
    
    complaints: List[Complaint] = Relationship(back_populates="assigned_officer")

class Reward(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    pts: int
    icon: str
