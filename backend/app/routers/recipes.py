from fastapi import APIRouter, Query
from app.services import spoonacular
from app.schemas import IngredientsRequest

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("/search")
async def search(query: str = Query(..., min_length=1), cuisine: str | None = None):
    return await spoonacular.search_recipes(query, cuisine)


@router.get("/{recipe_id}")
async def detail(recipe_id: int):
    return await spoonacular.get_recipe_detail(recipe_id)


@router.post("/by-ingredients")
async def by_ingredients(body: IngredientsRequest):
    return await spoonacular.find_by_ingredients(body.ingredients)
