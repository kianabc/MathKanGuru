import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="rounded-full border-4 border-primary-200 border-t-primary-500"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
