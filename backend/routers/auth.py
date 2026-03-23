import random
import time
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

# Temporary in-memory store for OTPs (In production, use Redis or a DB)
# Format: { email: { "otp": str, "expires": float } }
otp_store: Dict[str, Dict] = {}

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

def cleanup_otp(email: str):
    """Wait and cleanup OTP after 5 minutes"""
    time.sleep(300)
    if email in otp_store:
        del otp_store[email]

@router.post("/send-otp")
async def send_otp(request: OTPRequest, background_tasks: BackgroundTasks):
    # FOR DEMO: Set a fixed OTP 123456 so user can test without email
    # In production, use: str(random.randint(100000, 999999))
    otp = "123456" 
    expires = time.time() + 300 # 5 minutes
    
    otp_store[request.email] = {"otp": otp, "expires": expires}
    
    # Simulate sending email
    print(f"\n[SECURITY] OTP for {request.email}: {otp}\n")
    
    return {
        "status": "success", 
        "message": "OTP sent successfully. [DEMO MODE: Use 123456]",
        "demo_otp": "123456" # Returning it in response for easy testing
    }

@router.post("/verify-otp")
async def verify_otp(request: OTPVerify):
    if request.email not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not sent or expired")
    
    stored = otp_store[request.email]
    
    if time.time() > stored["expires"]:
        del otp_store[request.email]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if stored["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # OTP is valid!
    del otp_store[request.email]
    
    # In a real app, you'd generate a JWT here
    return {
        "status": "success", 
        "message": "Login successful",
        "token": "mock-jwt-token-for-india247",
        "user": {
            "email": request.email,
            "name": request.email.split('@')[0].capitalize()
        }
    }
