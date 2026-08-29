import json
import httpx
from fastapi import HTTPException
from app.config import settings

# Free-tier friendly model: generous daily quota, no billing required.
# See https://ai.google.dev/gemini-api/docs/models for current options.
MODEL = "gemini-3.6-flash"
BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.lower().startswith("json"):
            text = text[4:]
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"AI returned invalid JSON: {e}")


async def _generate(prompt: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set on the server. Add it to backend/.env",
        )
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.8,
            "maxOutputTokens": 2048,
        },
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            BASE_URL,
            params={"key": settings.GEMINI_API_KEY},
            json=body,
        )
    if resp.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="Gemini free-tier rate limit hit. Wait a bit and try again.",
        )
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail=f"Unexpected Gemini response: {data}")


async def suggest_meals(ingredients: list[str], cuisine: str | None = None) -> list[dict]:
    cuisine_hint = f" Prefer {cuisine} cuisine if it fits." if cuisine else ""
    prompt = f"""You are a creative home-cooking assistant. The user has these ingredients
available: {", ".join(ingredients)}.{cuisine_hint}

Suggest exactly 3 real, cookable meals that make good use of what they have.
Respond with ONLY a JSON array (no prose, no markdown fences) where each item matches:
{{
  "title": string,
  "why_it_works": string (1 short sentence),
  "uses_ingredients": string[] (subset of what they have),
  "extra_ingredients_needed": string[] (pantry staples ok, keep short),
  "estimated_minutes": number,
  "steps": string[] (4-8 concise, specific steps with amounts and times where relevant)
}}"""
    text = await _generate(prompt)
    data = _extract_json(text)
    if isinstance(data, dict):
        data = data.get("meals", data.get("suggestions", [data]))
    return data


async def translate_recipe(title: str, ingredients: list[str], steps: list[str], target_lang: str) -> dict:
    lang_name = {"hi": "Hindi", "mr": "Marathi"}.get(target_lang, target_lang)
    prompt = f"""Translate this recipe into {lang_name}. Keep ingredient quantities/units
as-is (numbers stay numbers), translate ingredient names and instructions naturally,
the way a native {lang_name}-speaking home cook would write it.

Title: {title}
Ingredients:
{chr(10).join(f"- {i}" for i in ingredients)}
Steps:
{chr(10).join(f"{i+1}. {s}" for i, s in enumerate(steps))}

Respond with ONLY JSON (no prose, no markdown fences):
{{"title": string, "ingredients": string[], "steps": string[]}}"""
    text = await _generate(prompt)
    return _extract_json(text)
