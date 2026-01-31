import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs';

export const gazeAnalyzer = () => {
  const analyzeImage = async (image: HTMLImageElement) => {
    const model = await blazeface.load()
    const predictions = await model.estimateFaces(image, false)

    console.log(predictions)
  }
  return { analyzeImage }
}
