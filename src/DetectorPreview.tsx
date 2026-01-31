import { useRef } from "preact/hooks"

export const DetectorPreview = ({ src }: { src: string }) => {

  const previewRef = useRef<HTMLImageElement>(null)

  return (
    <>
      <img ref={previewRef} src={src} alt={"Photo preview"} > : Element</img>
    </>
  )
}
