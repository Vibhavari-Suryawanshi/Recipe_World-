import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChefHat } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-cardamom/70 dark:bg-charcoal/70 border-b border-ink/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-chili text-white group-hover:animate-floaty">
            <ChefHat size={18} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            {t("appName")}
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
          <Link to="/" className="hover:text-chili transition-colors">
            {t("nav.home")}
          </Link>
          <button
            onClick={() => navigate("/what-can-i-cook")}
            className="hover:text-chili transition-colors"
          >
            {t("nav.whatCanICook")}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
