from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "India247 API"
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_MAPS_API_KEY: str
    DATABASE_URL: str
    SECRET_KEY: str = "your-very-secret-key-change-it"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = "backend/.env"

@lru_cache()
def get_settings():
    return Settings()
