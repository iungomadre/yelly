import { useCallback, useEffect, useState } from "preact/hooks";

export type Lang = "en" | "pl";

export const translations = {
  en: {
    appTitle: "Yelly",
    introTitle: "Yelly",
    introBody1:
      "This app uses your camera to detect when you're looking at the screen. If you look away for a few seconds, it will play a sound and enter \"chaos mode\" until you look back.",
    introBody2:
      "No video or face data is sent anywhere—everything runs in your browser. You'll be asked for camera permission when you start.",
    start: "Start",
    loading: "Loading...",
  },
  pl: {
    appTitle: "Yelly",
    introTitle: "Yelly",
    introBody1:
      "Ta aplikacja używa kamery, żeby wykryć, kiedy patrzysz w ekran. Jeśli odwrócisz wzrok na kilka sekund, włączy dźwięk i tryb \"chaos\", dopóki nie spojrzysz z powrotem.",
    introBody2:
      "Żadne wideo ani dane z twarzy nie są nigdzie wysyłane—wszystko działa w Twojej przeglądarce. Po naciśnięciu Start poprosimy o dostęp do kamery.",
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
