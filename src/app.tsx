import './app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useGazeAnalyzer } from './useGazeAnalyzer'
import { DetectorPreview } from './DetectorPreview'
import type { FaceDetectionData } from './DetectorPreview'

export function App() {
  const [isOnCameraCapture, setIsOnCameraCapture] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState("")
  const [predictions, setPredictions] = useState<FaceDetectionData[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const WIDTH = 640
  const HEIGHT = 480

  const { analyzeImage, isLoading } = useGazeAnalyzer()

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (isOnCameraCapture) {
            videoRef.current!.srcObject = stream;
            videoRef.current?.play();
          }
          else {
            videoRef.current!.srcObject = null;
          }
        })
    }
    else {
      videoRef.current = null
    }
  }, [isOnCameraCapture])

  const toggleCameraOn = () => {
    setIsOnCameraCapture(!isOnCameraCapture)
  }

  const takePicture = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      canvasRef.current.width = WIDTH;
      canvasRef.current.height = HEIGHT;
      context?.drawImage(videoRef.current!, 0, 0, canvasRef.current.width, canvasRef.current.height)
      setImageUrl(canvasRef.current.toDataURL("image/png"))
    }
  }

  return (
    <>
      {isLoading ? <>loading</> : <>
        <h1>Test video streaming first</h1>
        <video ref={videoRef}></video>
        <canvas ref={canvasRef} style={{ "display": "none" }}></canvas>
        <DetectorPreview src={imageUrl} faces={predictions} />
        <button onClick={toggleCameraOn}>Start/stop</button>
        <button onClick={takePicture}>Take Picture</button>
        <button onClick={async () => {
          const predictions = await analyzeImage(canvasRef.current!)
          if (predictions) setPredictions(predictions)
        }}>Analyze image (see console)</button>
      </>}</>
  )
}
