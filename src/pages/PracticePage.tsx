import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import type { Topic, AnswerOption, Question } from '@/types/question'
import QuestionCard from '@/components/practice/QuestionCard'
import FeedbackOverlay from '@/components/practice/FeedbackOverlay'
import HintPanel from '@/components/practice/HintPanel'
import ConfettiOverlay from '@/components/common/ConfettiOverlay'
import BigButton from '@/components/common/BigButton'
import { getQuestionsByTopic } from '@/data/practiceQuestions'
import { topicMeta } from '@/data/tips'
import { savePracticeProgress } from '@/services/practiceService'

type PracticePhase = 'topic-select' | 'practicing' | 'complete'

const topics: Topic[] = ['logic', 'patterns', 'counting', 'geometry', 'arithmetic']

export default function PracticePage() {
  const navigate = useNavigate()
  const { uid, profile, refreshProfile } = useAuth()
  const [phase, setPhase] = useState<PracticePhase>('topic-select')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const questions = useMemo(() => {
    if (!selectedTopic) return []
    return getQuestionsByTopic(selectedTopic)
  }, [selectedTopic])

  const currentQuestion: Question | undefined = questions[currentIndex]

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentIndex(0)
    setCorrectCount(0)
    setPhase('practicing')
  }

  const handleAnswer = useCallback(async (answer: AnswerOption) => {
    if (showFeedback || !currentQuestion || !uid) return
    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    if (correct) {
      setCorrectCount(c => c + 1)
      setShowConfetti(true)
    }
    setShowFeedback(true)

    try {
      await savePracticeProgress(uid, currentQuestion.topic, currentQuestion.id, correct)
    } catch {
      // Silently fail - don't block the user
    }
  }, [showFeedback, currentQuestion, uid])

  const handleContinue = useCallback(() => {
    setShowFeedback(false)
    setSelectedAnswer(null)
    setShowConfetti(false)
    if (currentIndex + 1 >= questions.length) {
      refreshProfile()
      setPhase('complete')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }, [currentIndex, questions.length, refreshProfile])

  if (phase === 'topic-select') {
    return (
      <div className="min-h-screen p-6 bg-warm-50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 font-bold mb-4 cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-3xl text-primary-600 mb-2">Practice</h1>
          <p className="text-gray-500 font-semibold mb-6">Choose a topic to practice!</p>

          <div className="space-y-3">
            {topics.map(topic => {
              const meta = topicMeta[topic]
              const topicQuestions = getQuestionsByTopic(topic)
              const completed = profile?.practiceProgress?.[topic]?.length ?? 0
              return (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTopicSelect(topic)}
                  className={`w-full p-4 rounded-xl border-2 border-gray-200 bg-white
                             text-left flex items-center gap-4 cursor-pointer
                             hover:border-primary-300 transition-colors`}
                >
                  <span className="text-3xl">{meta.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{meta.label}</p>
                    <p className="text-sm text-gray-500">{meta.description}</p>
                    <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-400 rounded-full transition-all"
                        style={{ width: `${(completed / topicQuestions.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{completed}/{topicQuestions.length} completed</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-warm-50">
        <ConfettiOverlay run={true} duration={4000} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl text-primary-600 mb-4">Great job!</h1>
          <p className="text-xl text-gray-600 mb-2">
            You got {correctCount} out of {questions.length} correct!
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <BigButton onClick={() => { setPhase('topic-select'); setSelectedTopic(null) }} variant="secondary">
              Pick another topic
            </BigButton>
            <BigButton onClick={() => navigate('/')}>
              Home
            </BigButton>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div className="p-6 text-center text-gray-500">No questions available.</div>
  }

  return (
    <div className="min-h-screen p-6 bg-warm-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { setPhase('topic-select'); setSelectedTopic(null) }}
            className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
          >
            ← Topics
          </button>
          <span className="text-sm font-bold text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="mb-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-400 rounded-full"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswer}
              showResult={showFeedback}
              disabled={showFeedback}
            />
            <HintPanel hint={currentQuestion.hint} />
          </motion.div>
        </AnimatePresence>

        <ConfettiOverlay run={showConfetti} />
        <FeedbackOverlay
          show={showFeedback}
          isCorrect={isCorrect}
          solution={currentQuestion.solution}
          onContinue={handleContinue}
        />
      </div>
    </div>
  )
}
