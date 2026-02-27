import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import KangarooMascot from '@/components/home/KangarooMascot'
import BigButton from '@/components/common/BigButton'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-warm-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8 mb-8"
      >
        <KangarooMascot size={100} mood="happy" />
        <h1 className="text-3xl text-primary-600 mt-3">
          Hi, {profile?.displayName || 'Mathlete'}!
        </h1>
        <p className="text-gray-500 font-semibold mt-1">What would you like to do today?</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <motion.div variants={item}>
          <BigButton
            onClick={() => navigate('/learn')}
            variant="secondary"
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📖</span> Learn
          </BigButton>
        </motion.div>
        <motion.div variants={item}>
          <BigButton
            onClick={() => navigate('/practice')}
            variant="primary"
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-2xl">✏️</span> Practice
          </BigButton>
        </motion.div>
        <motion.div variants={item}>
          <BigButton
            onClick={() => navigate('/test')}
            variant="accent"
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🏆</span> Test
          </BigButton>
        </motion.div>
        <motion.div variants={item}>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 text-lg font-bold text-secondary-600 hover:text-secondary-700
                       bg-white rounded-xl border-2 border-secondary-200 hover:border-secondary-300
                       transition-colors cursor-pointer"
          >
            📊 My Dashboard
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pt-8 pb-4"
      >
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Log out (PIN: {profile?.pin})
        </button>
      </motion.div>
    </div>
  )
}
