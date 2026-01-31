import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState, useRef } from 'preact/hooks'
import type { FaceDetectionData } from './DetectorPreview'

// Standard MediaPipe Face Mesh Keypoints
// 468: Left Iris Center, 473: Right Iris Center
// 33: Left Eye Inner Corner, 133: Left Eye Outer Corner
// 362: Right Eye Inner Corner, 263: Right Eye Outer Corner
const KEYPOINTS = {
  LEFT_EYE: { inner: 33, outer: 133, iris: 468 },
  RIGHT_EYE: { inner: 362, outer: 263, iris: 473 }
}

type VisionSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

export const useGazeAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(true)
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      // Load the MediaPipe FaceMesh model which supports Iris detection
      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true, // Crucial: This enables Iris tracking
          maxFaces: 1
        }
      )

      detectorRef.current = model
      console.log('Loaded face mesh detector')
      setIsLoading(false)
    }

    loadModel()
  }, [])

  // Calculate Euclidean distance between two points
  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  const isLookingAtScreen = (keypoints: faceLandmarksDetection.Keypoint[]): boolean => {
    // If we don't have enough keypoints (FaceMesh has 478 with iris), fail safe
    if (keypoints.length < 478) return false

    const checkEyeGaze = (indices: { inner: number; outer: number; iris: number }) => {
      const pInner = keypoints[indices.inner]
      const pOuter = keypoints[indices.outer]
      const pIris = keypoints[indices.iris]

      // Calculate the total width of the eye
      const eyeWidth = distance(pInner, pOuter)

      // Calculate distance from iris to inner corner
      const distToInner = distance(pIris, pInner)

      // Calculate the ratio (0 = inner corner, 1 = outer corner, 0.5 = center)
      const ratio = distToInner / eyeWidth

      // If the ratio is roughly 0.5, the iris is in the center of the eye
      // We allow a range of 0.4 to 0.6 for "looking straight"
      // Adjust these bounds to make it stricter or looser
      return ratio > 0.35 && ratio < 0.65
    }

    const leftEyeLooking = checkEyeGaze(KEYPOINTS.LEFT_EYE)
    const rightEyeLooking = checkEyeGaze(KEYPOINTS.RIGHT_EYE)

    // Consider looking at screen if both eyes are roughly centered
    return leftEyeLooking && rightEyeLooking
  }

  const mapPredictions = (predictions: faceLandmarksDetection.Face[]): FaceDetectionData[] => {
    return predictions.map(pred => {
      const { box, keypoints } = pred

      return {
        // Map MediaPipe 'box' to the contract's expected coordinates
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

