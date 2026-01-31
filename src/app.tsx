import './app.css'
import { useEffect, useRef } from 'preact/hooks'

export function App() {

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          videoRef.current!.srcObject = stream;
          videoRef.current?.play();
        })
    }
  })

  return (
    <>
      <h1>Test video streaming first</h1>
      <video id='video' ref={videoRef}></video>
      <canvas id='canvas'></canvas>
    </>
  )
}
