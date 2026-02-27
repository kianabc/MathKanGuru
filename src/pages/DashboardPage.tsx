import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import type { TestResult } from '@/types/question'
import { getTestResults } from '@/services/testService'
import { formatTime } from '@/hooks/useTimer'
import KangarooMascot from '@/components/home/KangarooMascot'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { uid, profile } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    getTestResults(uid)
      .then(setResults)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [uid])

  if (!profile) return null
  const { stats } = profile

  return (
    <div className="min-h-screen p-6 bg-warm-50">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-gray-600 font-bold mb-4 cursor-pointer"
        >
          ← Back
        </button>

        <div className="text-center mb-6">
          <KangarooMascot size={80} mood="happy" />
          <h1 className="text-3xl text-primary-600 mt-2">{profile.displayName}'s Dashboard</h1>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-accent-50 border-2 border-accent-300 rounded-2xl p-4 text-center mb-6"
          >
            <p className="text-3xl mb-1">🔥</p>
            <p className="text-xl font-bold text-accent-600">{stats.currentStreak} day streak!</p>
            <p className="text-sm text-accent-500">Keep it up!</p>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Tests Taken" value={stats.totalTests} icon="📝" />
          <StatCard label="Best Score" value={stats.bestScore} icon="⭐" />
          <StatCard label="Avg Score" value={Math.round(stats.averageScore)} icon="📊" />
          <StatCard
            label="Practice Accuracy"
            value={
              stats.totalPracticeQuestions > 0
                ? `${Math.round((stats.correctPracticeAnswers / stats.totalPracticeQuestions) * 100)}%`
                : '—'
            }
            icon="🎯"
          />
          <StatCard label="Questions Practiced" value={stats.totalPracticeQuestions} icon="✏️" />
          <StatCard
            label="Topics Started"
            value={
              Object.values(profile.practiceProgress).filter(arr => arr.length > 0).length
            }
            icon="📚"
          />
        </div>

        {/* Recent tests */}
        <h2 className="text-xl text-gray-700 mb-3">Recent Tests</h2>
        {loading ? (
          <LoadingSpinner size={32} />
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 border border-gray-100">
            No tests taken yet. Go take one!
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((r, i) => (
              <motion.div
                key={r.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-gray-700">{r.testId}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.completedAt).toLocaleDateString()} · {formatTime(r.timeTakenSeconds)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">{r.score}</p>
                  <p className="text-xs text-gray-400">/ {r.maxScore}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
