import './app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useGazeAnalyzer } from './useGazeAnalyzer'
import { DetectorPreview } from './DetectorPreview'
import type { FaceDetectionData } from './DetectorPreview'
import { useCameraInput } from './useCameraInput'
import { useGazeCounter } from './useGazeCounter'
import goatMp3 from './assets/goat.mp3'


const REFRESH_INTERVAL_MS = 500
const MISSED_READINGS_LIMIT_SECONDS = 3

export function App() {
  const [predictions, setPredictions] = useState<FaceDetectionData[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { analyzeImage, isLoading: isLoadingModels } = useGazeAnalyzer()
  const { isLoading: isLoadingVideo } = useCameraInput(videoRef)

  const { gazed, missed, shouldReact } = useGazeCounter(REFRESH_INTERVAL_MS, MISSED_READINGS_LIMIT_SECONDS)

  useEffect(() => {
    let intervalId: number
    if (!isLoadingVideo && !isLoadingModels) {
      intervalId = window.setInterval(async () => {
        const predictions = await analyzeImage(videoRef.current!)
        if (predictions) {
          setPredictions(predictions)
          const everyoneGazed = predictions.every(prediction => prediction.isLookingAtScreen)
          if (everyoneGazed) {
            gazed()
          }
          else {
            missed()
          }
        }
      }, REFRESH_INTERVAL_MS)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isLoadingVideo, isLoadingModels])

  useEffect(() => {
    console.log("COME BAAACK")
  }, [shouldReact])

  useEffect(() => {
    const audio = new Audio(goatMp3)
    audio.volume = 0.5
    audio.loop = true
    audioRef.current = audio
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    console.log('should react', shouldReact)

    if (shouldReact) {
      audio.play().catch(e => console.log("Audio blocked until interaction", e))
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [shouldReact])

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
