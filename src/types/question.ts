export type Difficulty = 'easy' | 'medium' | 'hard'
export type Topic = 'logic' | 'patterns' | 'counting' | 'geometry' | 'arithmetic'
export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Question {
  id: string
  text: string
  options: Record<AnswerOption, string>
  correctAnswer: AnswerOption
  difficulty: Difficulty
  topic: Topic
  hint?: string
  solution: string
  imageUrl?: string
}

export interface MockTest {
  id: string
  name: string
  description: string
  questions: Question[]
  timeLimitMinutes: number
}

export interface Tip {
  id: string
  topic: Topic
  title: string
  content: string
  example?: string
}

export interface TestAnswer {
  questionId: string
  selectedAnswer: AnswerOption | null
  timeSpentSeconds: number
}

export interface TestResult {
  id?: string
  testId: string
  score: number
  maxScore: number
  answers: TestAnswer[]
  startedAt: number
  completedAt: number
  timeTakenSeconds: number
}

export interface UserStats {
  totalTests: number
  averageScore: number
  bestScore: number
  totalPracticeQuestions: number
  correctPracticeAnswers: number
  currentStreak: number
  lastActiveDate: string
}

export interface UserProfile {
  displayName: string
  pin: string
  stats: UserStats
  practiceProgress: Record<Topic, string[]> // topic -> completed question IDs
}

export type ScoringModel = 'ksf' | 'usa'

export interface ScoringConfig {
  model: ScoringModel
  startingScore: number
  easyPoints: number
  mediumPoints: number
  hardPoints: number
  wrongPenalty: number
  maxScore: number
  minScore: number
}

export const KSF_SCORING: ScoringConfig = {
  model: 'ksf',
  startingScore: 24,
  easyPoints: 3,
  mediumPoints: 4,
  hardPoints: 5,
  wrongPenalty: -1,
  maxScore: 120,
  minScore: 0,
}

export const USA_SCORING: ScoringConfig = {
  model: 'usa',
  startingScore: 0,
  easyPoints: 3,
  mediumPoints: 4,
  hardPoints: 5,
  wrongPenalty: 0,
  maxScore: 96,
  minScore: 0,
}
