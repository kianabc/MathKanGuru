import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Topic, UserStats } from '@/types/question'
import { getUserProfile } from './authService'

export async function savePracticeProgress(
  uid: string,
  topic: Topic,
  questionId: string,
  isCorrect: boolean,
): Promise<void> {
  const profile = await getUserProfile(uid)
  if (!profile) return

  const progress = { ...profile.practiceProgress }
  if (!progress[topic].includes(questionId)) {
    progress[topic] = [...progress[topic], questionId]
  }

  const stats: UserStats = {
    ...profile.stats,
    totalPracticeQuestions: profile.stats.totalPracticeQuestions + 1,
    correctPracticeAnswers: profile.stats.correctPracticeAnswers + (isCorrect ? 1 : 0),
    lastActiveDate: new Date().toISOString().split('T')[0],
  }

  // Update streak
  const today = new Date().toISOString().split('T')[0]
  const lastActive = profile.stats.lastActiveDate
  if (lastActive) {
    const lastDate = new Date(lastActive)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      stats.currentStreak = profile.stats.currentStreak + 1
    } else if (diffDays > 1) {
      stats.currentStreak = 1
    }
  } else {
    stats.currentStreak = 1
  }

  await setDoc(doc(db, 'users', uid), { practiceProgress: progress, stats }, { merge: true })
}
