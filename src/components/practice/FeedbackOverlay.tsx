import { motion, AnimatePresence } from 'framer-motion'
import KangarooMascot from '@/components/home/KangarooMascot'

interface FeedbackOverlayProps {
  show: boolean
  isCorrect: boolean
  solution: string
  onContinue: () => void
}

export default function FeedbackOverlay({ show, isCorrect, solution, onContinue }: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`
              bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl
              border-4 ${isCorrect ? 'border-correct' : 'border-wrong'}
            `}
          >
            <KangarooMascot
              size={80}
              mood={isCorrect ? 'celebrating' : 'thinking'}
            />
            <h2 className={`text-3xl mt-4 mb-2 ${isCorrect ? 'text-correct' : 'text-wrong'}`}>
              {isCorrect ? 'Awesome!' : 'Not quite!'}
            </h2>
            <p className="text-gray-600 mb-2">
              {isCorrect
                ? 'Great job! You got it right!'
                : "Don't worry, let's learn from this!"
              }
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-bold text-gray-500 mb-1">Solution:</p>
              <p className="text-gray-700">{solution}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className={`
                px-8 py-3 rounded-xl text-lg font-bold text-white cursor-pointer
                ${isCorrect ? 'bg-correct hover:bg-green-600' : 'bg-primary-500 hover:bg-primary-600'}
              `}
            >
              {isCorrect ? 'Next Question' : 'Got it!'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
