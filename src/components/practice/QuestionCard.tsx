import { motion } from 'framer-motion'
import type { Question, AnswerOption } from '@/types/question'

interface QuestionCardProps {
  question: Question
  selectedAnswer: AnswerOption | null
  onSelect: (answer: AnswerOption) => void
  showResult?: boolean
  disabled?: boolean
}

const optionLabels: AnswerOption[] = ['A', 'B', 'C', 'D', 'E']

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  disabled = false,
}: QuestionCardProps) {
  const getOptionStyle = (opt: AnswerOption) => {
    const isSelected = selectedAnswer === opt
    const isCorrect = opt === question.correctAnswer

    if (showResult) {
      if (isCorrect) return 'border-correct bg-green-50 text-green-800'
      if (isSelected && !isCorrect) return 'border-wrong bg-red-50 text-red-800'
      return 'border-gray-200 bg-white text-gray-500'
    }

    if (isSelected) return 'border-primary-500 bg-primary-50 text-primary-800'
    return 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50'
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.text}
        </p>
      </div>

      <div className="space-y-3">
        {optionLabels.map((opt) => (
          <motion.button
            key={opt}
            type="button"
            onClick={() => !disabled && onSelect(opt)}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.01 }}
            whileTap={disabled ? {} : { scale: 0.99 }}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl border-2
              text-left transition-colors duration-150
              disabled:cursor-default cursor-pointer
              ${getOptionStyle(opt)}
            `}
          >
            <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center
                             text-sm font-bold shrink-0">
              {opt}
            </span>
            <span className="text-base font-medium">{question.options[opt]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
