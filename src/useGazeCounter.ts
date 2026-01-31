import { useState, useRef, useCallback } from "preact/hooks"

export const useGazeCounter = (refreshRateMs: number, missedThresholdSeconds: number) => {
  const [shouldReact, setShouldReact] = useState(false)

  const counterRef = useRef(0)

  const thresholdMs = missedThresholdSeconds * 1000

  const missed = useCallback(() => {
    if (shouldReact) return

    counterRef.current += 1

    const currentElapsed = counterRef.current * refreshRateMs

    if (currentElapsed >= thresholdMs) {
      setShouldReact(true)
    }
  }, [shouldReact, refreshRateMs, thresholdMs])

  const gazed = useCallback(() => {
    if (counterRef.current !== 0 || shouldReact) {
      counterRef.current = 0
      setShouldReact(false)
    }
  }, [shouldReact])

  return { shouldReact, missed, gazed }
}
