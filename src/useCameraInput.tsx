import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

export const useCameraInput = (videoRef: RefObject<HTMLVideoElement>) => {

  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (!navigator) throw "Couldn't load video stream"
    if (!videoRef.current) return
    const video = videoRef.current

    const updateLoadingState = () => {
      setIsLoading(!Boolean(video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0))
      console.log('Video loading:', isLoading)
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        videoRef.current!.srcObject = stream;
        videoRef.current?.play();
        console.log("Camera loaded")
      })
      .catch(err => console.error("Camera error: ", err))

    video?.addEventListener('loadeddata', updateLoadingState)
    video?.addEventListener('canplay', updateLoadingState)

    return () => {
      video?.removeEventListener('loadeddata', updateLoadingState)
      video?.removeEventListener('canplay', updateLoadingState)
    }
  }, [videoRef])



  return { isLoading }
}
