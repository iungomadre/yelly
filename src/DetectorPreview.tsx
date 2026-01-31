import { useEffect, useRef } from 'preact/hooks'

export type FaceDetectionData = {
  topLeft: [number, number]
  bottomRight: [number, number]
  isLookingAtScreen: boolean
}

export const DetectorPreview = ({
  src,
  faces,
}: {
  src: string
  faces: FaceDetectionData[]
}) => {
  const previewRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const img = previewRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    if (!faces?.length) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 2

    faces.forEach(face => {
      ctx.strokeStyle = face.isLookingAtScreen ? 'lime' : 'red'
      const [x1, y1] = face.topLeft
      const [x2, y2] = face.bottomRight

      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    })
  }, [faces, src])

  return (
    <div style={{
      position: "relative",
      display: "inline-block"
    }}>
      <img
        ref={previewRef}
        src={src}
        alt="Photo preview"
        onLoad={() => {
          const img = previewRef.current
          const canvas = canvasRef.current
          if (img && canvas) {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
          }
        }}
      />
      <canvas style={{
        position: "absolute",
        top: 0,
        left: 0
      }} ref={canvasRef} />
    </div>
  )
}

