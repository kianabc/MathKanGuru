import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Topic } from '@/types/question'
import { getTipsByTopic, topicMeta } from '@/data/tips'

const topicList: Topic[] = ['logic', 'patterns', 'counting', 'geometry', 'arithmetic']

export default function LearnPage() {
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const currentTips = selectedTopic ? getTipsByTopic(selectedTopic) : []

  return (
    <div className="min-h-screen p-6 bg-warm-50">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => selectedTopic ? setSelectedTopic(null) : navigate('/')}
          className="text-gray-400 hover:text-gray-600 font-bold mb-4 cursor-pointer"
        >
          ← {selectedTopic ? 'Topics' : 'Back'}
        </button>

        <h1 className="text-3xl text-secondary-600 mb-2">
          {selectedTopic ? topicMeta[selectedTopic].label : 'Learn'}
        </h1>
        <p className="text-gray-500 font-semibold mb-6">
          {selectedTopic
            ? `Tips and tricks for ${topicMeta[selectedTopic].label.toLowerCase()}`
            : 'Choose a topic to learn tips and tricks!'
          }
        </p>

        <AnimatePresence mode="wait">
          {!selectedTopic ? (
            <motion.div
              key="topics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {topicList.map(topic => {
                const meta = topicMeta[topic]
                const tipCount = getTipsByTopic(topic).length
                return (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTopic(topic)}
                    className="w-full p-5 rounded-xl border-2 border-gray-200 bg-white
                               text-left flex items-center gap-4 cursor-pointer
                               hover:border-secondary-300 transition-colors"
                  >
                    <span className="text-4xl">{meta.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{meta.label}</p>
                      <p className="text-sm text-gray-500">{tipCount} tips & tricks</p>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="tips"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              {currentTips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg text-secondary-700 mb-2">{tip.title}</h3>
                  <p className="text-gray-700 mb-3">{tip.content}</p>
                  {tip.example && (
                    <div className="bg-accent-50 rounded-xl p-4 border border-accent-200">
                      <p className="text-sm font-bold text-accent-600 mb-1">Example:</p>
                      <p className="text-gray-700">{tip.example}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
