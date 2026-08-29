import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "mr", label: "मर" },
];

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const setLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("mw-lang", code);
  };

  return (
    <div className="flex rounded-full border border-ink/15 dark:border-white/15 p-1 gap-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full text-sm font-mono transition-colors ${
            i18n.language === code
              ? "bg-chili text-white"
              : "text-ink/60 dark:text-steam/60 hover:bg-ink/5 dark:hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
