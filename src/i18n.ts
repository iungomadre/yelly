import { useCallback, useEffect, useState } from "preact/hooks";

export type Lang = "en" | "pl";

export const translations = {
  en: {
    appTitle: "Yelly",
    introTitle: "Yelly",
    introBody: "Uses your camera to detect when you look at the screen. Look away for a few seconds and it will nicely ask you to come back.",
    introPrivacy: "Nothing is sent anywhere; everything runs locally in your browser.",
    start: "Start",
    loading: "Loading...",
  },
  pl: {
    appTitle: "Yelly",
    introTitle: "Yelly",
    introBody: "Kamera wykrywa, kiedy patrzysz w ekran. Gdy przestaniesz, poprosi o powrót.",
    introPrivacy: "Żadne dane nie są zbierane; aplikacja działa lokalnie",
    start: "Start",
    loading: "Ładowanie...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

const STORAGE_KEY = "yelly-lang";

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "pl") return stored;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("pl")) return "pl";
  return "en";
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => getStoredLang());

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key],
    [lang]
  );

  return { lang, setLang, t };
}
