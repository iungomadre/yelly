import { useLanguage } from "./i18n";
import { LanguageSwitch } from "./LanguageSwitch";

type IntroPanelProps = {
  onStart: () => void;
};

export function IntroPanel({ onStart }: IntroPanelProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="intro-panel">
      <div className="intro-panel__card">
        <div className="intro-panel__header">
          <h2 className="intro-panel__title">{t("introTitle")}</h2>
          <LanguageSwitch lang={lang} setLang={setLang} />
        </div>
        <p className="intro-panel__text">{t("introBody1")}</p>
        <p className="intro-panel__text">{t("introBody2")}</p>
        <button type="button" className="intro-panel__button" onClick={onStart}>
          {t("start")}
        </button>
      </div>
    </div>
  );
}
