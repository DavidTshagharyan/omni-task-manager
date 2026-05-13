from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # App
    SECRET_KEY: str = "your-secret-key"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()