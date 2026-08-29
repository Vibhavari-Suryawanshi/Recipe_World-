import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (query, cuisine) => {
    const params = new URLSearchParams({ q: query });
    if (cuisine) params.set("cuisine", cuisine);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 text-center">
      <span className="inline-block text-5xl animate-floaty">🍲</span>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl font-semibold tracking-tight">
        {t("appName")}
      </h1>
      <p className="mt-4 text-lg text-ink/70 dark:text-steam/70 font-body max-w-xl mx-auto">
        {t("tagline")}
      </p>

      <div className="mt-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["Butter Chicken", "Ramen", "Tacos", "Paella", "Pad Thai"].map((s) => (
          <button
            key={s}
            onClick={() => handleSearch(s)}
            className="px-4 py-1.5 rounded-full text-sm font-mono border border-ink/15 dark:border-white/15
                       hover:bg-chili hover:text-white hover:border-chili transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
