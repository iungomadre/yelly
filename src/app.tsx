import './app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useGazeAnalyzer } from './useGazeAnalyzer'
import { DetectorPreview } from './DetectorPreview'
import type { FaceDetectionData } from './DetectorPreview'
import { useCameraInput } from './useCameraInput'

export function App() {
  const [predictions, setPredictions] = useState<FaceDetectionData[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const { analyzeImage, isLoading: isLoadingModels } = useGazeAnalyzer()
  const { isLoading: isLoadingVideo } = useCameraInput(videoRef)

  useEffect(() => {
    let intervalId: number
    if (!isLoadingVideo && !isLoadingModels) {
      intervalId = window.setInterval(async () => {
        const predictions = await analyzeImage(videoRef.current!)
        if (predictions) setPredictions(predictions)
      }, 500)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isLoadingVideo, isLoadingModels])

  return (
    <>
      <h1>Yellyyyyyyyy</h1>
      {(isLoadingModels || isLoadingVideo) ?? <>Loading...</>}
      <div className={'preview-wrapper'}>
        <video width={640} height={480} ref={videoRef}></video>
        <DetectorPreview faces={predictions} />
      </div>
    </>
  )
}
