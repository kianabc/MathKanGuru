import { motion } from 'framer-motion'

interface PinDisplayProps {
  pin: string
  maxLength?: number
}

export default function PinDisplay({ pin, maxLength = 4 }: PinDisplayProps) {
  return (
    <div className="flex gap-3 justify-center my-6">
      {Array.from({ length: maxLength }).map((_, i) => (
        <motion.div
          key={i}
          className={`
            w-14 h-16 rounded-xl border-3 flex items-center justify-center
            text-3xl font-bold
            ${pin[i]
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-300 bg-white text-transparent'
            }
          `}
          animate={pin[i] ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {pin[i] || '0'}
        </motion.div>
      ))}
    </div>
  )
}
