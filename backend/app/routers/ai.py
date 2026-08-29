from fastapi import APIRouter
from app.services import claude_ai
from app.schemas import IngredientsRequest, TranslateRequest

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/suggest")
async def suggest(body: IngredientsRequest):
    suggestions = await claude_ai.suggest_meals(body.ingredients, body.cuisine)
    return {"suggestions": suggestions}


@router.post("/translate")
async def translate(body: TranslateRequest):
    return await claude_ai.translate_recipe(
        body.title, body.ingredients, body.steps, body.target_lang
    )
