import { useRef, useState } from "preact/hooks";
import { DetectorPreview } from "./DetectorPreview";
import { useGazeDetectionInterval } from "./useGazeDetectionInterval";
import { useReactionAudio } from "./useReactionAudio";
import { useLanguage } from "./i18n";
import goatMp3 from "./assets/goat.mp3";

const DEFAULT_VIDEO_SIZE = { width: 640, height: 480 };

export function MainContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();
  const [videoSize, setVideoSize] = useState(DEFAULT_VIDEO_SIZE);

  const { predictions, shouldReact, isLoading } = useGazeDetectionInterval({
    videoRef,
  });

  useReactionAudio(shouldReact, goatMp3, { volume: 0.5, loop: true });

  const onVideoLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      setVideoSize({ width: video.videoWidth, height: video.videoHeight });
    }
  };

  return (
    <>
      <h1>{t("appTitle")}</h1>
      {isLoading && <p>{t("loading")}</p>}
      <div className={shouldReact ? "preview-wrapper chaos-mode" : "preview-wrapper"}>
        <video
          ref={videoRef}
          width={videoSize.width}
          height={videoSize.height}
          playsInline
          muted
          onLoadedMetadata={onVideoLoadedMetadata}
        />
        <DetectorPreview
          faces={predictions}
          width={videoSize.width}
          height={videoSize.height}
        />
      </div>
      <footer className="app-footer">
        <a href="http://www.wtfpl.net/" target="_blank" rel="noopener noreferrer">
          {t("license")}
        </a>
      </footer>
    </>
  );
}
