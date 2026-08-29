import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative h-9 w-16 rounded-full bg-ink/10 dark:bg-white/10 transition-colors
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-chili"
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-saffron shadow-md grid place-items-center
                    transition-transform duration-300 ${dark ? "translate-x-8" : "translate-x-1"}`}
      >
        {dark ? <Moon size={14} className="text-charcoal" /> : <Sun size={14} className="text-charcoal" />}
      </span>
    </button>
  );
}
