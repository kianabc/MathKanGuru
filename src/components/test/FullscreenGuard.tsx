import { motion, AnimatePresence } from 'framer-motion'
import BigButton from '@/components/common/BigButton'

interface FullscreenGuardProps {
  isFullscreen: boolean
  onReenter: () => void
}

export default function FullscreenGuard({ isFullscreen, onReenter }: FullscreenGuardProps) {
  return (
    <AnimatePresence>
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-900/90 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          >
            <p className="text-5xl mb-4">🔒</p>
            <h2 className="text-2xl text-gray-800 mb-3">Test in Progress!</h2>
            <p className="text-gray-600 mb-6">
              You need to be in fullscreen mode during the test.
              The timer is paused — click below to continue!
            </p>
            <BigButton onClick={onReenter}>
              Return to Fullscreen
            </BigButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
