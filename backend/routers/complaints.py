from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from typing import List, Optional
from ..database import get_session
from ..models import Complaint, StatusEnum
from ..schemas import ComplaintRead, ComplaintCreate
import uuid

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.get("/", response_model=List[ComplaintRead])
def read_complaints(
    offset: int = 0,
    limit: int = Query(default=10, le=100),
    category: Optional[str] = None,
    status: Optional[StatusEnum] = None,
    session: Session = Depends(get_session)
):
    query = select(Complaint)
    if category:
        query = query.where(Complaint.category == category)
    if status:
        query = query.where(Complaint.status == status)
    
    complaints = session.exec(query.offset(offset).limit(limit).order_by(Complaint.timestamp.desc())).all()
    return complaints

@router.get("/{complaint_id}", response_model=ComplaintRead)
def read_complaint(complaint_id: str, session: Session = Depends(get_session)):
    complaint = session.get(Complaint, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.post("/", response_model=ComplaintRead)
def create_complaint(complaint: ComplaintCreate, session: Session = Depends(get_session)):
    db_complaint = Complaint.model_validate(complaint)
    db_complaint.id = f"IND-{uuid.uuid4().hex[:8].upper()}"
    session.add(db_complaint)
    session.commit()
    session.refresh(db_complaint)
    return db_complaint

@router.post("/{complaint_id}/upvote")
def upvote_complaint(complaint_id: str, session: Session = Depends(get_session)):
    complaint = session.get(Complaint, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    complaint.upvotes += 1
    session.add(complaint)
    session.commit()
    session.refresh(complaint)
    return {"status": "success", "upvotes": complaint.upvotes}

@router.get("/stats/summary")
def get_stats_summary(session: Session = Depends(get_session)):
    # Quick count of issues by status
    pending = session.exec(select(func.count(Complaint.id)).where(Complaint.status == StatusEnum.PENDING)).first()
    resolved = session.exec(select(func.count(Complaint.id)).where(Complaint.status == StatusEnum.RESOLVED)).first()
    in_progress = session.exec(select(func.count(Complaint.id)).where(Complaint.status == StatusEnum.IN_PROGRESS)).first()
    
    return {
        "pending": pending,
        "resolved": resolved,
        "in_progress": in_progress,
        "total": pending + resolved + in_progress
    }
