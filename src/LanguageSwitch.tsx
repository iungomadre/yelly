import type { Lang } from "./i18n";

type LanguageSwitchProps = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export function LanguageSwitch({ lang, setLang }: LanguageSwitchProps) {
  return (
    <div className="language-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={`language-switch__btn ${lang === "en" ? "language-switch__btn--active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={`language-switch__btn ${lang === "pl" ? "language-switch__btn--active" : ""}`}
        onClick={() => setLang("pl")}
        aria-pressed={lang === "pl"}
      >
        PL
      </button>
    </div>
  );
}
