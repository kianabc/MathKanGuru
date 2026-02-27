import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerOptions {
  initialSeconds: number
  onTimeUp?: () => void
  countDown?: boolean
}

export function useTimer({ initialSeconds, onTimeUp, countDown = true }: UseTimerOptions) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeUpRef = useRef(onTimeUp)
  onTimeUpRef.current = onTimeUp

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    clear()
  }, [clear])

  const reset = useCallback((newSeconds?: number) => {
    clear()
    setSeconds(newSeconds ?? initialSeconds)
    setIsRunning(false)
  }, [clear, initialSeconds])

  useEffect(() => {
    if (!isRunning) {
      clear()
      return
    }

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = countDown ? prev - 1 : prev + 1
        if (countDown && next <= 0) {
          clear()
          setIsRunning(false)
          onTimeUpRef.current?.()
          return 0
        }
        return next
      })
    }, 1000)

    return clear
  }, [isRunning, countDown, clear])

  const formatted = formatTime(seconds)

  return { seconds, formatted, isRunning, start, pause, reset }
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
