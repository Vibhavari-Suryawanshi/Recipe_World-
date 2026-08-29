import json
from fastapi import HTTPException
from anthropic import Anthropic
from app.config import settings

# claude-sonnet-5 gives the best quality; swap to claude-haiku-4-5-20251001
# for a much cheaper/faster model if you're calling this a lot.
MODEL = "claude-sonnet-5"

_client: Anthropic | None = None


def _get_client() -> Anthropic:
    global _client
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY is not set on the server. Add it to backend/.env",
        )
    if _client is None:
        _client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


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


async def suggest_meals(ingredients: list[str], cuisine: str | None = None) -> list[dict]:
    client = _get_client()
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
    resp = client.messages.create(
        model=MODEL,
        max_tokens=1800,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text")
    data = _extract_json(text)
    if isinstance(data, dict):
        data = data.get("meals", data.get("suggestions", [data]))
    return data


async def translate_recipe(title: str, ingredients: list[str], steps: list[str], target_lang: str) -> dict:
    client = _get_client()
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
    resp = client.messages.create(
        model=MODEL,
        max_tokens=1800,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text")
    return _extract_json(text)
