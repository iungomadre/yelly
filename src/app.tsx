import "./app.css";
import { useEffect, useRef } from "preact/hooks";
import { DetectorPreview } from "./DetectorPreview";
import { useGazeDetectionInterval } from "./useGazeDetectionInterval";
import goatMp3 from "./assets/goat.mp3";

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { predictions, shouldReact, isLoading } = useGazeDetectionInterval({
    videoRef,
  });

  useEffect(() => {
    const audio = new Audio(goatMp3);
    audio.volume = 0.5;
    audio.loop = true;
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldReact) {
      audio.play().catch((e) => console.log("Audio blocked until interaction", e));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [shouldReact]);

  return (
    <>
      <h1>Yellyyyyyyyy</h1>
      {isLoading && <>Loading...</>}
      <div className={shouldReact ? "preview-wrapper chaos-mode" : "preview-wrapper"}>
        <video width={640} height={480} ref={videoRef} />
        <DetectorPreview faces={predictions} />
      </div>
    </>
  );
}
