from pydantic import BaseModel
from typing import List, Optional


class IngredientsRequest(BaseModel):
    ingredients: List[str]
    cuisine: Optional[str] = None


class TranslateRequest(BaseModel):
    title: str
    ingredients: List[str]
    steps: List[str]
    target_lang: str  # "hi" or "mr"


class AISuggestion(BaseModel):
    title: str
    why_it_works: str
    uses_ingredients: List[str]
    extra_ingredients_needed: List[str]
    estimated_minutes: int
    steps: List[str]
