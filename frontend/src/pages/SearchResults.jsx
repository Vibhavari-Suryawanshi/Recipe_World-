import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import SteamLoader from "../components/SteamLoader";
import { searchRecipes } from "../api/client";

export default function SearchResults() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const cuisine = params.get("cuisine") || undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    searchRecipes(q, cuisine)
      .then((data) => setResults(data.results || []))
      .catch((err) => setError(err?.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, [q, cuisine]);

  const handleSearch = (query, c) => {
    const p = new URLSearchParams({ q: query });
    if (c) p.set("cuisine", c);
    navigate(`/search?${p.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <SearchBar onSearch={handleSearch} initialQuery={q} />

      <h2 className="mt-8 mb-4 font-display text-2xl">
        {t("search.resultsFor")} <span className="text-chili">&ldquo;{q}&rdquo;</span>
      </h2>

      {loading && <SteamLoader label={t("cook.thinking")} />}

      {error && (
        <p className="text-chili font-mono text-sm bg-chili/10 rounded-xl p-4">{error}</p>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-ink/60 dark:text-steam/60">{t("search.noResults")}</p>
      )}

      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RecipeCard recipe={r} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
