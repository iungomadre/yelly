import { useRef } from "preact/hooks";
import { DetectorPreview } from "./DetectorPreview";
import { useGazeDetectionInterval } from "./useGazeDetectionInterval";
import { useReactionAudio } from "./useReactionAudio";
import { useLanguage } from "./i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import goatMp3 from "./assets/goat.mp3";

export function MainContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, setLang, t } = useLanguage();

  const { predictions, shouldReact, isLoading } = useGazeDetectionInterval({
    videoRef,
  });

  useReactionAudio(shouldReact, goatMp3, { volume: 0.5, loop: true });

  return (
    <>
      <div className="main-header">
        <h1>{t("appTitle")}</h1>
        <LanguageSwitch lang={lang} setLang={setLang} />
      </div>
      {isLoading && <p>{t("loading")}</p>}
      <div className={shouldReact ? "preview-wrapper chaos-mode" : "preview-wrapper"}>
        <video width={640} height={480} ref={videoRef} />
        <DetectorPreview faces={predictions} />
      </div>
    </>
  );
}
