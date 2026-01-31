import './app.css'
import { useEffect, useRef, useState } from 'preact/hooks'

export function App() {
  const [isOnCameraCapture, setIsOnCameraCapture] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null)

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

  return (
    <>
      <h1>Test video streaming first</h1>
      <video ref={videoRef}></video>
      <button onClick={toggleCameraOn}>Start/stop</button>
    </>
  )
}
