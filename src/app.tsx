import './app.css'
import { useRef, useState } from 'preact/hooks'
import { useGazeAnalyzer } from './useGazeAnalyzer'
import { DetectorPreview } from './DetectorPreview'
import type { FaceDetectionData } from './DetectorPreview'
import { useCameraInput } from './useCameraInput'

export function App() {
  const [predictions, setPredictions] = useState<FaceDetectionData[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const { analyzeImage, isLoading: isLoadingModels } = useGazeAnalyzer()
  const { isLoading: isLoadingVideo } = useCameraInput(videoRef)

  return (
    <>
      <h1>Yellyyyyyyyy</h1>
      {(isLoadingModels || isLoadingVideo) ?? <>Loading...</>}
      <video ref={videoRef} height={100} width={100}></video>
      <DetectorPreview faces={predictions} />
      <button onClick={async () => {
        const predictions = await analyzeImage(videoRef.current!)
        if (predictions) setPredictions(predictions)
      }}>Do I look at the screen?</button>
    </>
  )
}
