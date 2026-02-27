import Confetti from 'react-confetti'
import { useState, useEffect } from 'react'

interface ConfettiOverlayProps {
  run: boolean
  duration?: number
}

export default function ConfettiOverlay({ run, duration = 3000 }: ConfettiOverlayProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (run) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), duration)
      return () => clearTimeout(timer)
    }
    setShow(false)
  }, [run, duration])

  if (!show) return null

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      colors={['#F97316', '#14B8A6', '#FACC15', '#22C55E', '#EF4444']}
    />
  )
}
