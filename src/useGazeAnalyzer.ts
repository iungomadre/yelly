import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef } from 'preact/hooks'

type VisionSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

export const useGazeAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(true)
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      modelRef.current = await blazeface.load()
      console.log('Loaded face detector')

      setIsLoading(false)
    }

    loadModel()
  }, [])

  const analyzeImage = async (source: VisionSource) => {
    if (!modelRef.current) return

    const predictions = await modelRef.current.estimateFaces(source, false)
    console.log(predictions)

    return predictions
  }

  return { analyzeImage, isLoading }
}

