import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useBlocker } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useTestSession } from '@/hooks/useTestSession'
import { useTimer, formatTime } from '@/hooks/useTimer'
import { useFullscreen } from '@/hooks/useFullscreen'
import { KSF_SCORING } from '@/types/question'
import type { AnswerOption } from '@/types/question'
import { mockTests } from '@/data/mockTests'
import QuestionCard from '@/components/practice/QuestionCard'
import TestNavigation from '@/components/test/TestNavigation'
import FullscreenGuard from '@/components/test/FullscreenGuard'
import BigButton from '@/components/common/BigButton'
import ConfettiOverlay from '@/components/common/ConfettiOverlay'
import KangarooMascot from '@/components/home/KangarooMascot'
import { saveTestResult } from '@/services/testService'
import { updateUserStats, getUserProfile } from '@/services/authService'

export default function TestPage() {
  const navigate = useNavigate()
  const { uid, refreshProfile } = useAuth()
  const session = useTestSession()
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()
  const [saved, setSaved] = useState(false)

  const timer = useTimer({
    initialSeconds: (session.test?.timeLimitMinutes ?? 75) * 60,
    countDown: true,
    onTimeUp: () => session.timeUp(KSF_SCORING),
  })

  // Block navigation during test
  useBlocker(
    useCallback(
      () => session.phase === 'running' || session.phase === 'review',
      [session.phase]
    )
  )

  // Beforeunload warning
  useEffect(() => {
    if (session.phase !== 'running' && session.phase !== 'review') return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [session.phase])

  // Pause timer when fullscreen is lost
  useEffect(() => {
    if (session.phase !== 'running') return
    if (isFullscreen) {
      timer.start()
    } else {
      timer.pause()
    }
  }, [isFullscreen, session.phase])

  // Save results
  useEffect(() => {
    if (session.phase !== 'results' || !session.result || !uid || saved) return
    setSaved(true)
    const doSave = async () => {
      try {
        await saveTestResult(uid, session.result!)
        const profile = await getUserProfile(uid)
        if (profile) {
          const totalTests = profile.stats.totalTests + 1
          const newAvg =
            (profile.stats.averageScore * profile.stats.totalTests + session.result!.score) / totalTests
          await updateUserStats(uid, {
            totalTests,
            averageScore: Math.round(newAvg * 10) / 10,
            bestScore: Math.max(profile.stats.bestScore, session.result!.score),
          })
        }
        refreshProfile()
      } catch {
        // Silently fail
      }
    }
    doSave()
  }, [session.phase, session.result, uid, saved, refreshProfile])

  // Keyboard shortcut blocking during test
  useEffect(() => {
    if (session.phase !== 'running') return
    const handler = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['w', 't', 'n', 'l', 'r'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [session.phase])

  const handleStartTest = async (testId: string) => {
    const test = mockTests.find(t => t.id === testId)
    if (!test) return
    session.startTest(test)
    timer.reset(test.timeLimitMinutes * 60)
    await enterFullscreen()
    timer.start()
  }

  const handleFinish = async () => {
    session.finish(KSF_SCORING)
    await exitFullscreen()
  }

  const handleReset = () => {
    session.reset()
    setSaved(false)
  }

  // Test selection
  if (session.phase === 'intro') {
    return (
      <div className="min-h-screen p-6 bg-warm-50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 font-bold mb-4 cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-3xl text-accent-500 mb-2">Test Mode</h1>
          <p className="text-gray-500 font-semibold mb-6">
            Choose a test. You'll have 75 minutes. The test runs in fullscreen!
          </p>

          <div className="space-y-3">
            {mockTests.map(test => (
              <motion.button
                key={test.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartTest(test.id)}
                className="w-full p-5 rounded-xl border-2 border-gray-200 bg-white
                           text-left cursor-pointer hover:border-accent-300 transition-colors"
              >
                <p className="font-bold text-gray-800 text-lg">{test.name}</p>
                <p className="text-sm text-gray-500">{test.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {test.questions.length} questions · {test.timeLimitMinutes} minutes
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Running
  if (session.phase === 'running' && session.test) {
    const question = session.test.questions[session.currentIndex]
    return (
      <div className="min-h-screen p-4 bg-warm-50">
        <FullscreenGuard isFullscreen={isFullscreen} onReenter={enterFullscreen} />

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm">
            <span className="font-bold text-gray-600">
              Q{session.currentIndex + 1}/{session.totalQuestions}
            </span>
            <span className={`font-bold text-lg ${timer.seconds < 300 ? 'text-wrong' : 'text-gray-700'}`}>
              ⏱ {timer.formatted}
            </span>
            <span className="text-sm text-secondary-600 font-bold">
              {session.answeredCount} answered
            </span>
          </div>

          {/* Question */}
          <QuestionCard
            question={question}
            selectedAnswer={session.answers[session.currentIndex]?.selectedAnswer ?? null}
            onSelect={(a: AnswerOption) => session.selectAnswer(session.currentIndex, a)}
          />

          {/* Navigation dots */}
          <div className="mt-6">
            <TestNavigation
              answers={session.answers}
              currentIndex={session.currentIndex}
              onNavigate={session.navigate}
            />
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => session.navigate(Math.max(0, session.currentIndex - 1))}
              disabled={session.currentIndex === 0}
              className="px-5 py-2 rounded-xl font-bold text-gray-500 bg-gray-100
                         disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              ← Previous
            </button>
            {session.currentIndex === session.totalQuestions - 1 ? (
              <BigButton onClick={session.goToReview} variant="accent" className="!text-base !py-2">
                Review Answers
              </BigButton>
            ) : (
              <button
                onClick={() => session.navigate(session.currentIndex + 1)}
                className="px-5 py-2 rounded-xl font-bold text-white bg-primary-500
                           hover:bg-primary-600 cursor-pointer"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Review
  if (session.phase === 'review' && session.test) {
    const unanswered = session.answers.filter(a => a.selectedAnswer === null).length
    return (
      <div className="min-h-screen p-6 bg-warm-50">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl text-gray-800 mb-4">Review Your Answers</h1>
          <p className="text-gray-600 mb-2">
            ⏱ Time remaining: <span className="font-bold">{timer.formatted}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Answered: {session.answeredCount}/{session.totalQuestions}
            {unanswered > 0 && (
              <span className="text-wrong font-bold"> ({unanswered} blank)</span>
            )}
          </p>

          <TestNavigation
            answers={session.answers}
            currentIndex={-1}
            onNavigate={(i) => {
              session.navigate(i)
              // go back to running to change answers
            }}
          />

          <div className="flex gap-4 mt-8 justify-center">
            <BigButton
              onClick={() => {
                session.navigate(session.currentIndex)
                // The phase goes back to running via navigation
              }}
              variant="secondary"
              className="!text-base"
            >
              Go back to questions
            </BigButton>
            <BigButton onClick={handleFinish} variant="primary" className="!text-base">
              Submit Test
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  // Results
  if (session.phase === 'results' && session.result && session.test) {
    const { result } = session
    const percentage = Math.round((result.score / result.maxScore) * 100)
    const correct = session.test.questions.filter(
      (q, i) => session.answers[i]?.selectedAnswer === q.correctAnswer
    ).length
    const wrong = session.test.questions.filter(
      (q, i) => session.answers[i]?.selectedAnswer !== null && session.answers[i]?.selectedAnswer !== q.correctAnswer
    ).length
    const blank = session.answers.filter(a => a.selectedAnswer === null).length

    return (
      <div className="min-h-screen p-6 bg-warm-50">
        <ConfettiOverlay run={percentage >= 50} duration={5000} />
        <div className="max-w-lg mx-auto text-center">
          <KangarooMascot size={90} mood={percentage >= 50 ? 'celebrating' : 'thinking'} />
          <h1 className="text-3xl text-primary-600 mt-4 mb-2">Test Complete!</h1>
          <p className="text-gray-500 mb-6">{session.test.name}</p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <p className="text-6xl font-bold text-primary-600 mb-1">{result.score}</p>
            <p className="text-gray-500">out of {result.maxScore} points ({percentage}%)</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <p className="text-2xl font-bold text-correct">{correct}</p>
              <p className="text-xs text-green-700">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-2xl font-bold text-wrong">{wrong}</p>
              <p className="text-xs text-red-700">Wrong</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-2xl font-bold text-gray-500">{blank}</p>
              <p className="text-xs text-gray-500">Blank</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Time: {formatTime(result.timeTakenSeconds)}
          </p>

          <div className="flex gap-4 justify-center">
            <BigButton onClick={handleReset} variant="secondary">
              Try Another Test
            </BigButton>
            <BigButton onClick={() => navigate('/')}>
              Home
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  return null
}
