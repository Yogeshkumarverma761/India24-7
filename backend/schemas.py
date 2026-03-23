from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ComplaintBase(BaseModel):
    category: str
    title: str
    description: str
    location: str
    lat: float
    lng: float
    user_name: str
    user_avatar: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintRead(ComplaintBase):
    id: str
    status: str
    upvotes: int
    comments_count: int
    timestamp: datetime
    escalation_level: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OfficerRead(BaseModel):
    id: str
    name: str
    ward: str
    score: int
    designation: str
    resolution_time: str

    class Config:
        from_attributes = True

class CitizenRead(BaseModel):
    name: str
    points: int
    badge: str

    class Config:
        from_attributes = True

class RewardRead(BaseModel):
    id: int
    title: str
    pts: int
    icon: str

    class Config:
        from_attributes = True
