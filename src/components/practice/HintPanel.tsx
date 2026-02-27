import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HintPanelProps {
  hint?: string
}

export default function HintPanel({ hint }: HintPanelProps) {
  const [showHint, setShowHint] = useState(false)

  if (!hint) return null

  return (
    <div className="mt-4 w-full max-w-2xl mx-auto">
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-secondary-600 hover:text-secondary-700 font-bold text-sm cursor-pointer
                   flex items-center gap-2"
      >
        <span>{showHint ? '🙈' : '💡'}</span>
        {showHint ? 'Hide hint' : 'Need a hint?'}
      </button>
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-secondary-50 rounded-xl border border-secondary-200 text-secondary-800">
              {hint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
