import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

const isReady = (video: HTMLVideoElement) =>
  video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;

export const useCameraInput = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("getUserMedia not supported");
      setIsLoading(false);
      return;
    }

    let stream: MediaStream | null = null;

    const updateLoadingState = () => {
      setIsLoading(!isReady(video));
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        video.srcObject = s;
        video.play();
        updateLoadingState();
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setIsLoading(false);
      });

    video.addEventListener("loadeddata", updateLoadingState);
    video.addEventListener("canplay", updateLoadingState);

    return () => {
      video.removeEventListener("loadeddata", updateLoadingState);
      video.removeEventListener("canplay", updateLoadingState);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [videoRef]);

  return { isLoading };
}
