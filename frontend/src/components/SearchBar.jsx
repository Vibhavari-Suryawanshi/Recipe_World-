import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const CUISINES = [
  "", "Indian", "Italian", "Chinese", "Mexican", "Thai", "Japanese",
  "French", "Mediterranean", "American", "Korean",
];

export default function SearchBar({ onSearch, initialQuery = "" }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [cuisine, setCuisine] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim(), cuisine || undefined);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto"
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-steam/40"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full rounded-full border border-ink/15 dark:border-white/15 bg-white/70 dark:bg-white/5
                     pl-11 pr-4 py-3 font-body outline-none focus:ring-2 focus:ring-chili transition-shadow"
        />
      </div>
      <select
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        className="rounded-full border border-ink/15 dark:border-white/15 bg-white/70 dark:bg-white/5
                   px-4 py-3 font-body outline-none focus:ring-2 focus:ring-chili"
      >
        <option value="">{t("search.cuisine")}</option>
        {CUISINES.filter(Boolean).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-full bg-chili text-white px-6 py-3 font-medium hover:bg-chili/90
                   active:scale-95 transition-all shadow-lg shadow-chili/20"
      >
        {t("search.button")}
      </button>
    </form>
  );
}
