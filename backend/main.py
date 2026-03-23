from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routers import complaints, users, rewards, ai, auth
from .config import get_settings

settings = get_settings()
app = FastAPI(title=settings.APP_NAME)

# CORS Configuration - Update allow_origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to: ["https://india247.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to create tables
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include Routers
app.include_router(complaints.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(rewards.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to India247 API v1.0 - The most robust civic backend."}
