from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Reward
from ..schemas import RewardRead

router = APIRouter(prefix="/rewards", tags=["rewards"])

@router.get("/", response_model=List[RewardRead])
def read_rewards(session: Session = Depends(get_session)):
    rewards = session.exec(select(Reward)).all()
    return rewards
