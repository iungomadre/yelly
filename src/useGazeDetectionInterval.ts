import { useEffect, useState } from "preact/hooks";
import { useGazeCounter } from "./useGazeCounter";
import { useGazeAnalyzer } from "./useGazeAnalyzer";
import { useCameraInput } from "./useCameraInput";
import type { FaceDetectionData } from "./domain/FaceDetectionData";
import type { RefObject } from "preact";

const REFRESH_INTERVAL_MS = 500;
const MISSED_READINGS_LIMIT_SECONDS = 3;

type UseGazeDetectionIntervalParams = {
  videoRef: RefObject<HTMLVideoElement>;
};

export function useGazeDetectionInterval({
  videoRef,
}: UseGazeDetectionIntervalParams) {
  const [predictions, setPredictions] = useState<FaceDetectionData[]>([]);
  const { isLoading: isLoadingVideo } = useCameraInput(videoRef);
  const { analyzeImage, isLoading: isLoadingModels } = useGazeAnalyzer();
  const { gazed, missed, shouldReact } = useGazeCounter(
    REFRESH_INTERVAL_MS,
    MISSED_READINGS_LIMIT_SECONDS
  );

  useEffect(() => {
    const ready = !isLoadingVideo && !isLoadingModels;
    if (!ready) return;

    const intervalId = window.setInterval(async () => {
      const video = videoRef.current;
      if (!video) return;

      const result = await analyzeImage(video);
      if (result?.length) {
        setPredictions(result);
        const everyoneGazed = result.every((p) => p.isLookingAtScreen);
        if (everyoneGazed) {
          gazed();
        } else {
          missed();
        }
      } else {
        missed();
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    isLoadingVideo,
    isLoadingModels,
    analyzeImage,
    gazed,
    missed,
    videoRef,
  ]);

  const isLoading = isLoadingVideo || isLoadingModels;

  return { predictions, shouldReact, isLoading };
}
