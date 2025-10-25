# app/core/config.py
import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# .env 파일 자동 로드 (로컬 개발용)
load_dotenv()

class Settings(BaseSettings):
    """애플리케이션 전역 설정 (환경변수 기반)"""

    # App
    APP_NAME: str = "Hot's POD"
    APP_VERSION: str = "3.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_HOST: str = "127.0.0.1"
    DATABASE_PORT: int = 3306
    DATABASE_USER: str = "hots_pod_user"
    DATABASE_PASSWORD: str = "change-me"
    DATABASE_NAME: str = "hots_pod_db"

    # Kakao OAuth
    KAKAO_REST_API_KEY: Optional[str] = None
    KAKAO_REDIRECT_URI: Optional[str] = None
    KAKAO_CLIENT_SECRET: Optional[str] = None

    # JWT
    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # LLM / RAG
    LLM_PROVIDER: str = "API"  # or "DISABLED"
    LLM_API_KEY: Optional[str] = None
    LLM_API_URL: Optional[str] = None
    LLM_MODEL_NAME: Optional[str] = None

    # Vector DB
    CHROMA_DB_PATH: str = "./chroma_db_data"
    EMBEDDING_MODEL_NAME: str = "jhgan/ko-srobert-multitask"
    LOCAL_LLM_MODEL_NAME: Optional[str] = None

    # Optional services
    REDIS_ENABLED: bool = False
    REDIS_HOST: Optional[str] = None
    REDIS_PORT: Optional[int] = None

    # Feature flags
    FEATURE_RAG_ENABLED: bool = True
    FEATURE_RATE_LIMITING: bool = False

    # CORS (comma-separated or JSON array in env)
    CORS_ORIGINS: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # case sensitive mapping on some OS if needed
        # allow_mutation = False

settings = Settings()