import { motion } from 'framer-motion'

interface PinPadProps {
  onDigit: (digit: string) => void
  onDelete: () => void
  onClear: () => void
  disabled?: boolean
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '<']

export default function PinPad({ onDigit, onDelete, onClear, disabled }: PinPadProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {digits.map((key) => {
        const isAction = key === 'C' || key === '<'
        return (
          <motion.button
            key={key}
            type="button"
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (key === 'C') onClear()
              else if (key === '<') onDelete()
              else onDigit(key)
            }}
            className={`
              h-16 rounded-xl text-2xl font-bold cursor-pointer
              transition-colors duration-150
              disabled:opacity-50
              ${isAction
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-white text-gray-800 hover:bg-primary-50 border border-gray-200 shadow-sm'
              }
            `}
          >
            {key === '<' ? '⌫' : key}
          </motion.button>
        )
      })}
    </div>
  )
}
