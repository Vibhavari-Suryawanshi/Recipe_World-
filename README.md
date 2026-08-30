# Masala Atlas 🍲 — global recipes, AI-powered

A full-stack recipe explorer: search recipes from around the world, view
detailed step-by-step instructions with animated cooking illustrations
(steam, sizzling pans, whisking...), switch between light/dark mode and
English/Hindi/Marathi, and tell the AI chef what's in your fridge to get
real recipe matches plus creative AI-generated ideas.

**Live site:** https://recipe-world-jade.vercel.app
**Backend API:** https://recipe-world-xaw4.onrender.com/docs

recipe-world/
├── backend/ FastAPI — proxies Spoonacular, calls Gemini for AI features
└── frontend/ React + Vite + Tailwind + Framer Motion

## 1. Get your free API keys

| Service | What it's for | Get a key |
|---|---|---|
| Spoonacular | Recipe search, details, ingredient matching (150 free req/day) | https://spoonacular.com/food-api |
| Google Gemini | "What can I cook" AI ideas + recipe translation (free tier, no card) | https://aistudio.google.com/apikey |

## 2. Run the backend locally

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # then paste your two API keys into .env
uvicorn app.main:app --reload --port 8000
```

Backend now runs at `http://localhost:8000` (interactive docs at `/docs`).

## 3. Run the frontend locally

```bash
cd frontend
npm install
cp .env.example .env        # defaults are fine for local dev
npm run dev
```

Open `http://localhost:5173`.

## 4. Deploying it yourself

**Backend → Render**
- New Web Service → connect the repo → Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `SPOONACULAR_API_KEY`, `GEMINI_API_KEY`, and (once
  you have your frontend URL) `FRONTEND_ORIGIN`
- Also set `PYTHON_VERSION=3.11.9` as an environment variable — Render's
  default Python version can be too new for some dependencies to build.

**Frontend → Vercel**
- Add New Project → connect the repo → Root Directory: `frontend`
- Environment variable: `VITE_API_BASE_URL` = your Render URL
- Because this is a single-page app with client-side routing, Vercel needs
  `frontend/vercel.json` (already included) so refreshing a route like
  `/what-can-i-cook` doesn't 404.

## What's implemented

- **Search** — hits `/api/recipes/search` (Spoonacular complexSearch), with an
  optional cuisine filter, results shown as animated cards.
- **Recipe detail** — ingredients with exact amounts, and every instruction
  step paired with a small animated glyph (`ProcessAnimation.jsx`) chosen by
  keyword: boiling shows rising steam + bubbles, frying shows a flickering
  flame, baking pulses like an oven, chopping animates a knife, mixing spins
  a whisk. Add more mappings in `KEYWORD_MAP`.
- **What Can I Cook?** — add ingredients as chips, then either:
  - *Find recipes*: real matches from Spoonacular's `findByIngredients`.
  - *Ask the AI chef*: Gemini returns 3 structured, creative suggestions
    (title, why it works, extra ingredients needed, timed steps) — see
    `backend/app/services/gemini_ai.py`.
- **Translate this recipe** — when the UI language is Hindi or Marathi, a
  button on the recipe page asks Gemini to translate the title, ingredients
  and steps, keeping quantities intact.
- **Dark / light mode** — persisted to `localStorage`, respects the OS
  preference on first visit.
- **EN / HI / MR** UI language switch via `i18next` (`src/i18n/locales`).
- **Ambient motion** — floating background blobs/glyphs, card hover "steam",
  staggered result animations (Framer Motion), all respecting
  `prefers-reduced-motion`.

## Notes on the AI provider

This project uses the Gemini API's free tier (`gemini-3.6-flash`) so it costs
nothing to run at small scale. Two things worth knowing:
- Gemini 3.x models "think" before answering by default, and those tokens
  count against `maxOutputTokens` — `gemini_ai.py` sets `thinkingLevel: low`
  and a generous token budget so responses don't get cut off mid-JSON.
- Google's free tier may use prompts/outputs to improve their models — a
  reasonable trade for free usage on a project like this, but worth knowing.

## Where to take it next

- Swap Spoonacular for your own recipe database if you want full control /
  no rate limit — `services/spoonacular.py` is the only file that would need
  to change.
- Cache AI responses (e.g. Redis) so repeat ingredient combos don't re-call
  the API.
- Add more `ProcessAnimation` types (grating, kneading, deglazing...) as you
  notice instructions that fall through to the generic "cook" glyph.
- Render's free tier sleeps after inactivity — the first request after a
  while can take 30-50 seconds while it wakes back up.
