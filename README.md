# Masala Atlas 🍲 — global recipes, AI-powered

A full-stack recipe explorer: search recipes from around the world, view
detailed step-by-step instructions with animated cooking illustrations
(steam, sizzling pans, whisking...), switch between light/dark mode and
English/Hindi/Marathi, and tell the AI chef what's in your fridge to get
real recipe matches plus creative AI-generated ideas.

```
recipe-world/
├── backend/     FastAPI — proxies Spoonacular, calls Claude for AI features
└── frontend/    React + Vite + Tailwind + Framer Motion
```

## 1. Get your free API keys

| Service | What it's for | Get a key |
|---|---|---|
| Spoonacular | Recipe search, details, ingredient matching (150 free req/day) | https://spoonacular.com/food-api |
| Anthropic | "What can I cook" AI ideas + recipe translation | https://console.anthropic.com |

## 2. Run the backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # then paste your two API keys into .env
uvicorn app.main:app --reload --port 8000
```

Backend now runs at `http://localhost:8000` (docs at `/docs`).

## 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env        # defaults are fine for local dev
npm run dev
```

Open `http://localhost:5173`.

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
  - *Ask the AI chef*: Claude returns 3 structured, creative suggestions
    (title, why it works, extra ingredients needed, timed steps) — see
    `backend/app/services/claude_ai.py`.
- **Translate this recipe** — when the UI language is Hindi or Marathi, a
  button on the recipe page asks Claude to translate the title, ingredients
  and steps, keeping quantities intact.
- **Dark / light mode** — persisted to `localStorage`, respects the OS
  preference on first visit.
- **EN / HI / MR** UI language switch via `i18next` (`src/i18n/locales`).
- **Ambient motion** — floating background blobs/glyphs, card hover "steam",
  staggered result animations (Framer Motion), all respecting
  `prefers-reduced-motion`.

## Where to take it next

- Swap Spoonacular for your own recipe database (Postgres + a scraper or a
  seeded dataset) if you want full control / no rate limit — the backend's
  `services/spoonacular.py` is the only file that would need to change.
- Cache AI responses (e.g. Redis) so repeat ingredient combos don't re-call
  the API.
- Add more `ProcessAnimation` types (grating, kneading, deglazing...) as you
  notice instructions that fall through to the generic "cook" glyph.
- Deploy: frontend to Vercel/Netlify, backend to Render/Fly.io/Railway —
  remember to set `FRONTEND_ORIGIN` on the backend and `VITE_API_BASE_URL`
  on the frontend to your real deployed URLs.
