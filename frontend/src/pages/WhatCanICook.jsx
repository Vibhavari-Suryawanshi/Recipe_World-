import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChefHat } from "lucide-react";
import { findByIngredients, aiSuggest } from "../api/client";
import RecipeCard from "../components/RecipeCard";
import SteamLoader from "../components/SteamLoader";

export default function WhatCanICook() {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [matches, setMatches] = useState(null);
  const [aiIdeas, setAiIdeas] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState(null);

  const addIngredient = (e) => {
    e.preventDefault();
    const v = draft.trim();
    if (v && !ingredients.includes(v)) setIngredients([...ingredients, v]);
    setDraft("");
  };

  const removeIngredient = (v) => setIngredients(ingredients.filter((i) => i !== v));

  const runFindRecipes = async () => {
    setLoadingMatches(true);
    setError(null);
    try {
      const data = await findByIngredients(ingredients);
      setMatches(
        data.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          readyInMinutes: null,
          servings: null,
        }))
      );
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const runAskAI = async () => {
    setLoadingAI(true);
    setError(null);
    try {
      const data = await aiSuggest(ingredients);
      setAiIdeas(data.suggestions);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="text-center">
        <span className="text-4xl animate-floaty inline-block">🥕</span>
        <h1 className="mt-3 font-display text-4xl font-semibold">{t("cook.title")}</h1>
        <p className="mt-2 text-ink/70 dark:text-steam/70 max-w-lg mx-auto">
          {t("cook.subtitle")}
        </p>
      </div>

      <form onSubmit={addIngredient} className="mt-8 flex gap-3 max-w-lg mx-auto">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("cook.placeholder")}
          className="flex-1 rounded-full border border-ink/15 dark:border-white/15 bg-white/70 dark:bg-white/5
                     px-4 py-2.5 outline-none focus:ring-2 focus:ring-chili"
        />
        <button
          type="submit"
          className="rounded-full bg-basil text-white px-5 py-2.5 font-medium hover:bg-basil/90 active:scale-95 transition-all"
        >
          {t("cook.add")}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[2rem]">
        <AnimatePresence>
          {ingredients.map((ing) => (
            <motion.span
              key={ing}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-1.5 rounded-full bg-saffron/25 px-3 py-1.5 text-sm font-mono"
            >
              {ing}
              <button onClick={() => removeIngredient(ing)} aria-label={`Remove ${ing}`}>
                <X size={13} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {ingredients.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink/50 dark:text-steam/50">{t("cook.empty")}</p>
      ) : (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={runFindRecipes}
            className="flex items-center gap-2 rounded-full bg-chili text-white px-5 py-2.5 font-medium
                       hover:bg-chili/90 active:scale-95 transition-all shadow-lg shadow-chili/20"
          >
            <ChefHat size={16} /> {t("cook.findRecipes")}
          </button>
          <button
            onClick={runAskAI}
            className="flex items-center gap-2 rounded-full bg-basil text-white px-5 py-2.5 font-medium
                       hover:bg-basil/90 active:scale-95 transition-all shadow-lg shadow-basil/20"
          >
            <Sparkles size={16} /> {t("cook.askAI")}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-6 text-chili font-mono text-sm bg-chili/10 rounded-xl p-4 text-center">
          {error}
        </p>
      )}

      {loadingMatches && <SteamLoader label={t("cook.thinking")} />}
      {matches && !loadingMatches && (
        <section className="mt-10">
          <h2 className="font-display text-2xl mb-4">{t("cook.matches")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}

      {loadingAI && <SteamLoader label={t("cook.thinking")} />}
      {aiIdeas && !loadingAI && (
        <section className="mt-10">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-basil" /> {t("cook.aiIdeas")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {aiIdeas.map((idea, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-ink/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5"
              >
                <h3 className="font-display text-lg font-semibold">{idea.title}</h3>
                <p className="mt-1 text-sm text-ink/70 dark:text-steam/70">{idea.why_it_works}</p>
                <p className="mt-3 text-xs font-mono text-basil">
                  ⏱ {idea.estimated_minutes} {t("recipe.minutes")}
                </p>
                {idea.extra_ingredients_needed?.length > 0 && (
                  <p className="mt-2 text-xs text-ink/60 dark:text-steam/60">
                    {t("cook.extraNeeded")}: {idea.extra_ingredients_needed.join(", ")}
                  </p>
                )}
                <ol className="mt-3 space-y-1 text-sm list-decimal list-inside">
                  {idea.steps?.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
