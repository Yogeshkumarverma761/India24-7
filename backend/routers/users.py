from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Citizen, Officer
from ..schemas import CitizenRead, OfficerRead

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/leaderboard", response_model=List[CitizenRead])
def read_leaderboard(session: Session = Depends(get_session)):
    citizens = session.exec(select(Citizen).order_by(Citizen.points.desc())).all()
    return citizens

@router.get("/officer", response_model=OfficerRead)
def read_officer_stats(session: Session = Depends(get_session)):
    # Simulating a logged-in officer
    officer = session.exec(select(Officer)).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    return officer
