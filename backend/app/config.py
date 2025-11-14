"""Application configuration."""
import os
import logging
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
from dotenv import load_dotenv

# Set up logger
logger = logging.getLogger(__name__)

# Load env.txt explicitly from backend directory
env_file = Path(__file__).resolve().parent.parent / "env.txt"
load_dotenv(env_file, override=True)

# Also load from .env if it exists (for local development)
env_local_file = Path(__file__).resolve().parent.parent / ".env"
if env_local_file.exists():
    load_dotenv(env_local_file, override=True)
    logger.debug(f"Loaded environment from: {env_local_file}")
else:
    logger.debug(f"Local .env file not found, using env.txt")


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    ENV: str = "dev"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173"
    GEMINI_API_KEY: str = ""
    GEMINI_PROJECT_ID: str = ""
    GEMINI_LOCATION: str = "us-central1"
    MONGODB_URI: str = "mongodb://localhost:27017/resumegenie"
    JWT_SECRET: str = "change-me-later"
    
    model_config = SettingsConfigDict(
        env_file=str(env_file),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

