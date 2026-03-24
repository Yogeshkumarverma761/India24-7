import os
import google.generativeai as genai
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from sqlmodel import Session
from ..database import get_session
from ..config import get_settings
from ..models import Complaint, StatusEnum, EscalationEnum
import uuid
import json

settings = get_settings()
router = APIRouter(prefix="/ai", tags=["ai"])

# ─── Common System Instruction ───────────────────────────────────────────────
SYSTEM_INSTRUCTION = """
You are Meera, the friendly AI assistant for India247. 
India247 is a civic complaint platform for Indian citizens. 
Key Features:
1. Report Issues: Users can report civic issues like potholes, garbage, etc.
2. Track Issues: Real-time tracking of complaints.
3. Live Map: Interactive map showing issues.
4. Rewards: Citizens earn points and badges.

Your goal is to be helpful and polite. Guide users on how to use the platform.
Keep responses concise and use emojis where appropriate.
"""

class ChatRequest(BaseModel):
    message: str
    history: list = []
    system_prompt: Optional[str] = None

@router.post("/report")
async def ai_report(request: ChatRequest, session: Session = Depends(get_session)):
    try:
        # Use Report Key
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        current_model = genai.GenerativeModel(
            model_name='gemini-1.5-flash-latest',
            system_instruction=request.system_prompt or SYSTEM_INSTRUCTION
        )
            
        chat = current_model.start_chat(history=request.history)
        response = chat.send_message(request.message)
        
        return {
            "status": "success", 
            "response": response.text,
            "new_history": [
                *request.history, 
                {"role": "user", "parts": [request.message]}, 
                {"role": "model", "parts": [response.text]}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice")
async def ai_voice(request: ChatRequest, session: Session = Depends(get_session)):
    try:
        # Use Voice Key
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        current_model = genai.GenerativeModel(
            model_name='gemini-1.5-flash-latest',
            system_instruction=request.system_prompt or "You are Meera, the personal voice assistant for India247. Keep it brief."
        )
            
        chat = current_model.start_chat(history=request.history)
        response = chat.send_message(request.message)
        
        return {"status": "success", "response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-photo")
async def analyze_photo(
    file: UploadFile = File(...), 
    category: Optional[str] = Form(None),
    session: Session = Depends(get_session)
):
    try:
        img_data = await file.read()
        
        # Use Report Key
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        prompt = f"""
        You are an image verification AI for India247.
        The user claims this is a photo of a civic issue categorized as: "{category or 'General Civic Issue'}".
        Analyze the image and decide if it is a valid, real-world photo.
        
        CRITERIA:
        1. REALISM: Reject if AI-generated, illustration, etc.
        2. CLARITY: Reject if too blurry.
        3. CATEGORY MATCH: Does it show a "{category or 'civic'}" issue?
        
        Respond ONLY with a JSON object:
        {{
          "passed": boolean,
          "failReason": "concise explanation",
          "confidence": "low/medium/high",
          "category": "detected category",
          "description": "brief summary"
        }}
        """
        
        contents = [{"mime_type": file.content_type, "data": img_data}, prompt]
        response = model.generate_content(contents)
        
        # Robust JSON extraction
        raw_text = response.text.strip()
        if "{" in raw_text:
            json_str = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
            analysis = json.loads(json_str)
        else:
            raise ValueError("AI did not return a valid JSON object")
        
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        print(f"Vision Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Vision Error: {str(e)}")

class SummaryRequest(BaseModel):
    category: str
    description: str
    location: str

@router.post("/summarize")
async def ai_summarize(request: SummaryRequest):
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        prompt = f"""
        Generate a formal 2-sentence complaint summary for an Indian civic body.
        Issue: {request.category}
        Details: {request.description}
        Location: {request.location}
        
        Use professional yet empathetic language.
        """
        
        response = model.generate_content(prompt)
        return {"status": "success", "summary": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
