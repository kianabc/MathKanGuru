import { motion } from 'framer-motion'
import type { TestAnswer } from '@/types/question'

interface TestNavigationProps {
  answers: TestAnswer[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export default function TestNavigation({ answers, currentIndex, onNavigate }: TestNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {answers.map((answer, i) => {
        const isCurrent = i === currentIndex
        const isAnswered = answer.selectedAnswer !== null
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onNavigate(i)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-10 h-10 rounded-lg text-sm font-bold cursor-pointer transition-colors
              ${isCurrent
                ? 'bg-primary-500 text-white ring-2 ring-primary-300'
                : isAnswered
                ? 'bg-secondary-100 text-secondary-700 border border-secondary-300'
                : 'bg-gray-100 text-gray-400 border border-gray-200'
              }
            `}
          >
            {i + 1}
          </motion.button>
        )
      })}
    </div>
  )
}
