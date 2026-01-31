import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef } from 'preact/hooks'
import type { FaceBox } from './DetectorPreview'

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

  const mapPredictions = (predictions: blazeface.NormalizedFace[]): FaceBox[] => {
    return predictions.map(pred => ({
      topLeft: pred.topLeft as [number, number],
      bottomRight: pred.bottomRight as [number, number],
    }))
  }

  const analyzeImage = async (source: VisionSource) => {
    if (!modelRef.current) return

    const predictions = await modelRef.current.estimateFaces(source, false)
    console.log(predictions)

    return mapPredictions(predictions)
  }

  return { analyzeImage, isLoading }
}

