import httpx
from fastapi import HTTPException
from app.config import settings

BASE = settings.SPOONACULAR_BASE_URL


async def _get(path: str, params: dict):
    if not settings.SPOONACULAR_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="SPOONACULAR_API_KEY is not set on the server. Add it to backend/.env",
        )
    params = {**params, "apiKey": settings.SPOONACULAR_API_KEY}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(f"{BASE}{path}", params=params)
    if resp.status_code == 402:
        raise HTTPException(status_code=402, detail="Spoonacular daily quota reached.")
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


async def search_recipes(query: str, cuisine: str | None = None, number: int = 12):
    params = {
        "query": query,
        "number": number,
        "addRecipeInformation": True,
        "fillIngredients": True,
    }
    if cuisine:
        params["cuisine"] = cuisine
    return await _get("/recipes/complexSearch", params)


async def get_recipe_detail(recipe_id: int):
    return await _get(
        f"/recipes/{recipe_id}/information",
        {"includeNutrition": False},
    )


async def find_by_ingredients(ingredients: list[str], number: int = 9):
    return await _get(
        "/recipes/findByIngredients",
        {
            "ingredients": ",".join(ingredients),
            "number": number,
            "ranking": 2,
            "ignorePantry": True,
        },
    )
