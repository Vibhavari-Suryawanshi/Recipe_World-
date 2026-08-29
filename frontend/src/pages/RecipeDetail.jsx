import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Users, Languages } from "lucide-react";
import { getRecipe, aiTranslate } from "../api/client";
import ProcessAnimation, { detectProcess } from "../components/ProcessAnimation";
import SteamLoader from "../components/SteamLoader";

function flattenSteps(recipe) {
  const blocks = recipe?.analyzedInstructions || [];
  return blocks.flatMap((b) => b.steps || []).map((s) => s.step);
}

export default function RecipeDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translated, setTranslated] = useState(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTranslated(null);
    getRecipe(id)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SteamLoader label="Simmering the recipe…" />;
  if (!recipe) return null;

  const ingredients = recipe.extendedIngredients?.map((i) => i.original) || [];
  const steps = flattenSteps(recipe);
  const shown = translated || { title: recipe.title, ingredients, steps };

  const canTranslate = i18n.language !== "en";

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const data = await aiTranslate(recipe.title, ingredients, steps, i18n.language);
      setTranslated(data);
    } catch (e) {
      console.error(e);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border border-ink/10 dark:border-white/10"
      >
        {recipe.image && (
          <img src={recipe.image} alt={shown.title} className="w-full h-72 object-cover" />
        )}
        <div className="p-6">
          <h1 className="font-display text-3xl font-semibold">{shown.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-mono text-ink/60 dark:text-steam/60">
            {recipe.readyInMinutes != null && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {recipe.readyInMinutes} {t("recipe.minutes")}
              </span>
            )}
            {recipe.servings != null && (
              <span className="flex items-center gap-1.5">
                <Users size={15} /> {recipe.servings} {t("recipe.servings")}
              </span>
            )}
          </div>

          {canTranslate && (
            <button
              onClick={translated ? () => setTranslated(null) : handleTranslate}
              disabled={translating}
              className="mt-4 flex items-center gap-2 rounded-full border border-chili text-chili
                         px-4 py-2 text-sm font-medium hover:bg-chili hover:text-white transition-colors
                         disabled:opacity-50"
            >
              <Languages size={15} />
              {translating
                ? t("recipe.translating")
                : translated
                ? t("recipe.original")
                : t("recipe.translate")}
            </button>
          )}
        </div>
      </motion.div>

      <section className="mt-10">
        <h2 className="font-display text-2xl mb-4">{t("recipe.ingredients")}</h2>
        <ul className="grid sm:grid-cols-2 gap-2 font-mono text-sm">
          {shown.ingredients.map((ing, i) => (
            <li
              key={i}
              className="rounded-xl bg-white/60 dark:bg-white/5 border border-ink/10 dark:border-white/10 px-3 py-2"
            >
              {ing}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl mb-4">{t("recipe.instructions")}</h2>
        <ol className="space-y-4">
          {shown.steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="flex items-center gap-4 rounded-2xl bg-white/60 dark:bg-white/5
                         border border-ink/10 dark:border-white/10 p-3"
            >
              <ProcessAnimation type={detectProcess(step)} />
              <div>
                <p className="text-xs font-mono text-chili mb-1">
                  {t("recipe.step")} {i + 1}
                </p>
                <p className="text-sm leading-relaxed">{step}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>
    </div>
  );
}
