import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SPOONACULAR_API_KEY: str = os.getenv("SPOONACULAR_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    SPOONACULAR_BASE_URL: str = "https://api.spoonacular.com"


settings = Settings()
