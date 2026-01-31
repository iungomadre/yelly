import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef } from 'preact/hooks'
import type { FaceDetectionData } from './DetectorPreview'

// Expanded Keypoints to include Vertical (Top/Bottom eyelids)
const KEYPOINTS = {
  LEFT_EYE: {
    inner: 33,
    outer: 133,
    top: 159,
    bottom: 145,
    iris: 468
  },
  RIGHT_EYE: {
    inner: 362,
    outer: 263,
    top: 386,
    bottom: 374,
    iris: 473
  }
}

type VisionSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

export const useGazeAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(true)
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      // Reverted to WebGL backend as requested
      await tf.setBackend('webgl')
      await tf.ready()

      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs', // Standard JS runtime
          refineLandmarks: true, // Essential for Iris tracking
          maxFaces: 1
        }
      )

      detectorRef.current = model
      console.log('Loaded face mesh detector')
      setIsLoading(false)
    }

    loadModel()
  }, [])

  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  const isLookingAtScreen = (keypoints: faceLandmarksDetection.Keypoint[]): boolean => {
    if (keypoints.length < 478) return false

    const checkEyeGaze = (indices: typeof KEYPOINTS.LEFT_EYE) => {
      const pInner = keypoints[indices.inner]
      const pOuter = keypoints[indices.outer]
      const pTop = keypoints[indices.top]
      const pBottom = keypoints[indices.bottom]
      const pIris = keypoints[indices.iris]

      // --- Horizontal Check ---
      const eyeWidth = distance(pInner, pOuter)
      const distToInner = distance(pIris, pInner)
      const horizontalRatio = distToInner / eyeWidth

      // --- Vertical Check ---
      const eyeHeight = distance(pTop, pBottom)
      const distToTop = distance(pIris, pTop)
      const verticalRatio = distToTop / eyeHeight

      // Check Horizontal: 0.5 is center. < 0.35 is looking inside, > 0.65 is looking outside
      const isHorizontalCenter = horizontalRatio > 0.35 && horizontalRatio < 0.65

      // Check Vertical: 0.5 is center. 
      // Higher value (> 0.5) means iris is far from top (looking down)
      // Lower value (< 0.5) means iris is close to top (looking up)
      // I set the limit to 0.6 to catch "looking below screen"
      const isVerticalCenter = verticalRatio > 0.30 && verticalRatio < 0.60

      return isHorizontalCenter && isVerticalCenter
    }

    const leftEyeLooking = checkEyeGaze(KEYPOINTS.LEFT_EYE)
    const rightEyeLooking = checkEyeGaze(KEYPOINTS.RIGHT_EYE)

    return leftEyeLooking && rightEyeLooking
  }

  const mapPredictions = (predictions: faceLandmarksDetection.Face[]): FaceDetectionData[] => {
    return predictions.map(pred => {
      const { box, keypoints } = pred
      return {
        topLeft: [box.xMin, box.yMin] as [number, number],
        bottomRight: [box.xMax, box.yMax] as [number, number],
        isLookingAtScreen: isLookingAtScreen(keypoints)
      }
    })
  }

  const analyzeImage = async (source: VisionSource) => {
    if (!detectorRef.current) return

    const predictions = await detectorRef.current.estimateFaces(source, {
      flipHorizontal: false
    })

    return mapPredictions(predictions)
  }

  return { analyzeImage, isLoading }
}
