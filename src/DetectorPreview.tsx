import { useEffect, useRef } from 'preact/hooks'
import type { FaceDetectionData } from './domain/FaceDetectionData'


type DetectorPreviewProps = {
  faces: FaceDetectionData[]
  width?: number
  height?: number
}

export const DetectorPreview = ({
  faces,
  width = 640,
  height = 480,
}: DetectorPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    faces.forEach(face => {
      ctx.lineWidth = 4
      ctx.strokeStyle = face.isLookingAtScreen ? '#00ff00' : '#ff0000'

      const [x1, y1] = face.topLeft
      const [x2, y2] = face.bottomRight

      ctx.beginPath()
      ctx.rect(x1, y1, x2 - x1, y2 - y1)
      ctx.stroke()
    })
  }, [faces, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={'detector-preview'}
    />
  )
}
