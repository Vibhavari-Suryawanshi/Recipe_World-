import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ChefHat } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-body transition-colors ${
    isActive ? "text-chili" : "text-ink/50 dark:text-steam/50"
  }`;

export default function MobileTabBar() {
  const { t } = useTranslation();

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch
                 bg-cardamom/90 dark:bg-charcoal/90 backdrop-blur-md
                 border-t border-ink/10 dark:border-white/10
                 pb-[env(safe-area-inset-bottom)]"
    >
      <NavLink to="/" end className={linkClass}>
        <Home size={20} />
        {t("nav.home")}
      </NavLink>
      <NavLink to="/what-can-i-cook" className={linkClass}>
        <ChefHat size={20} />
        {t("nav.whatCanICook")}
      </NavLink>
    </nav>
  );
}
