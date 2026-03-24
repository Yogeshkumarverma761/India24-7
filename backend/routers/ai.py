import os
from google import genai
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

def get_client():
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured in environment variables.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)

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
async def ai_report(request: ChatRequest):
    try:
        client = get_client()
        
        # Mapping history roles to gemini format
        formatted_history = []
        for h in request.history:
             role = h.get("role", "user")
             parts = h.get("parts", [])
             formatted_history.append({"role": role, "parts": parts})

        chat = client.chats.create(
            model='gemini-1.5-flash',
            config={"system_instruction": request.system_prompt or SYSTEM_INSTRUCTION},
            history=formatted_history
        )
        
        response = chat.send_message(request.message)
        
        return {
            "status": "success", 
            "response": response.text,
            "new_history": [
                *request.history, 
                {"role": "user", "parts": [{"text": request.message}]}, 
                {"role": "model", "parts": [{"text": response.text}]}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice")
async def ai_voice(request: ChatRequest):
    try:
        client = get_client()
        
        chat = client.chats.create(
            model='gemini-1.5-flash',
            config={"system_instruction": request.system_prompt or "You are Meera, the personal voice assistant for India247. Keep it brief."}
        )
        
        response = chat.send_message(request.message)
        return {"status": "success", "response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-photo")
async def analyze_photo(
    file: UploadFile = File(...), 
    category: Optional[str] = Form(None)
):
    try:
        img_data = await file.read()
        client = get_client()
        
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
        
        # In new SDK, we use types.Part for multi-modal
        from google.genai import types
        contents = [
            types.Part.from_bytes(data=img_data, mime_type=file.content_type),
            prompt
        ]
        
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=contents
        )
        
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
        client = get_client()
        
        prompt = f"""
        Generate a formal 2-sentence complaint summary for an Indian civic body.
        Issue: {request.category}
        Details: {request.description}
        Location: {request.location}
        
        Use professional yet empathetic language.
        """
        
        response = client.models.generate_content(model='gemini-1.5-flash', contents=prompt)
        return {"status": "success", "summary": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
