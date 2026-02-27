import { useReducer, useCallback } from 'react'
import type { MockTest, AnswerOption, TestAnswer, TestResult, ScoringConfig } from '@/types/question'
import { KSF_SCORING } from '@/types/question'

type TestPhase = 'intro' | 'running' | 'review' | 'results'

interface TestState {
  phase: TestPhase
  test: MockTest | null
  currentIndex: number
  answers: TestAnswer[]
  startedAt: number | null
  completedAt: number | null
  result: TestResult | null
}

type TestAction =
  | { type: 'START'; test: MockTest }
  | { type: 'SELECT_ANSWER'; questionIndex: number; answer: AnswerOption | null }
  | { type: 'NAVIGATE'; index: number }
  | { type: 'GO_TO_REVIEW' }
  | { type: 'FINISH'; scoring: ScoringConfig }
  | { type: 'TIME_UP'; scoring: ScoringConfig }
  | { type: 'RESET' }
  | { type: 'UPDATE_TIME_SPENT'; questionIndex: number; seconds: number }

const initialState: TestState = {
  phase: 'intro',
  test: null,
  currentIndex: 0,
  answers: [],
  startedAt: null,
  completedAt: null,
  result: null,
}

function calculateScore(test: MockTest, answers: TestAnswer[], scoring: ScoringConfig): number {
  let score = scoring.startingScore

  test.questions.forEach((q, i) => {
    const answer = answers[i]
    if (!answer || answer.selectedAnswer === null) {
      // Blank: 0 points
      return
    }
    if (answer.selectedAnswer === q.correctAnswer) {
      const points = q.difficulty === 'easy'
        ? scoring.easyPoints
        : q.difficulty === 'medium'
        ? scoring.mediumPoints
        : scoring.hardPoints
      score += points
    } else {
      score += scoring.wrongPenalty
    }
  })

  return Math.max(scoring.minScore, Math.min(scoring.maxScore, score))
}

function reducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        phase: 'running',
        test: action.test,
        currentIndex: 0,
        answers: action.test.questions.map(q => ({
          questionId: q.id,
          selectedAnswer: null,
          timeSpentSeconds: 0,
        })),
        startedAt: Date.now(),
        completedAt: null,
        result: null,
      }

    case 'SELECT_ANSWER':
      return {
        ...state,
        answers: state.answers.map((a, i) =>
          i === action.questionIndex
            ? { ...a, selectedAnswer: action.answer }
            : a
        ),
      }

    case 'UPDATE_TIME_SPENT':
      return {
        ...state,
        answers: state.answers.map((a, i) =>
          i === action.questionIndex
            ? { ...a, timeSpentSeconds: action.seconds }
            : a
        ),
      }

    case 'NAVIGATE':
      return { ...state, currentIndex: action.index }

    case 'GO_TO_REVIEW':
      return { ...state, phase: 'review' }

    case 'FINISH':
    case 'TIME_UP': {
      if (!state.test || !state.startedAt) return state
      const now = Date.now()
      const score = calculateScore(state.test, state.answers, action.scoring)
      return {
        ...state,
        phase: 'results',
        completedAt: now,
        result: {
          testId: state.test.id,
          score,
          maxScore: action.scoring.maxScore,
          answers: state.answers,
          startedAt: state.startedAt,
          completedAt: now,
          timeTakenSeconds: Math.floor((now - state.startedAt) / 1000),
        },
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function useTestSession() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const startTest = useCallback((test: MockTest) => {
    dispatch({ type: 'START', test })
  }, [])

  const selectAnswer = useCallback((questionIndex: number, answer: AnswerOption | null) => {
    dispatch({ type: 'SELECT_ANSWER', questionIndex, answer })
  }, [])

  const navigate = useCallback((index: number) => {
    dispatch({ type: 'NAVIGATE', index })
  }, [])

  const goToReview = useCallback(() => {
    dispatch({ type: 'GO_TO_REVIEW' })
  }, [])

  const finish = useCallback((scoring: ScoringConfig = KSF_SCORING) => {
    dispatch({ type: 'FINISH', scoring })
  }, [])

  const timeUp = useCallback((scoring: ScoringConfig = KSF_SCORING) => {
    dispatch({ type: 'TIME_UP', scoring })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const updateTimeSpent = useCallback((questionIndex: number, seconds: number) => {
    dispatch({ type: 'UPDATE_TIME_SPENT', questionIndex, seconds })
  }, [])

  const answeredCount = state.answers.filter(a => a.selectedAnswer !== null).length
  const totalQuestions = state.test?.questions.length ?? 0

  return {
    ...state,
    answeredCount,
    totalQuestions,
    startTest,
    selectAnswer,
    navigate,
    goToReview,
    finish,
    timeUp,
    reset,
    updateTimeSpent,
  }
}
