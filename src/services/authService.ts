import { signInAnonymously } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import type { UserProfile, UserStats, Topic } from '@/types/question'

const DEFAULT_STATS: UserStats = {
  totalTests: 0,
  averageScore: 0,
  bestScore: 0,
  totalPracticeQuestions: 0,
  correctPracticeAnswers: 0,
  currentStreak: 0,
  lastActiveDate: '',
}

const DEFAULT_PROGRESS: Record<Topic, string[]> = {
  logic: [],
  patterns: [],
  counting: [],
  geometry: [],
  arithmetic: [],
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function createAccountWithPin(displayName: string): Promise<{ uid: string; pin: string }> {
  const cred = await signInAnonymously(auth)
  const uid = cred.user.uid

  let pin = generatePin()
  let attempts = 0
  while (attempts < 20) {
    const pinDoc = await getDoc(doc(db, 'pins', pin))
    if (!pinDoc.exists()) break
    pin = generatePin()
    attempts++
  }
  if (attempts >= 20) throw new Error('Could not generate a unique PIN. Please try again.')

  await setDoc(doc(db, 'pins', pin), {
    pin,
    uid,
    createdAt: serverTimestamp(),
  })

  const profile: UserProfile = {
    displayName,
    pin,
    stats: DEFAULT_STATS,
    practiceProgress: DEFAULT_PROGRESS,
  }
  await setDoc(doc(db, 'users', uid), profile)

  return { uid, pin }
}

export async function loginWithPin(pin: string): Promise<{ uid: string; profile: UserProfile }> {
  const pinDoc = await getDoc(doc(db, 'pins', pin))
  if (!pinDoc.exists()) throw new Error('PIN not found')

  const { uid } = pinDoc.data() as { uid: string }

  // Sign in anonymously then we use the PIN-mapped UID to load data
  // We need to check if we're already signed in
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }

  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) throw new Error('User profile not found')

  return { uid, profile: userDoc.data() as UserProfile }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) return null
  return userDoc.data() as UserProfile
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

export async function updateUserStats(uid: string, stats: Partial<UserStats>): Promise<void> {
  const profile = await getUserProfile(uid)
  if (!profile) return
  await setDoc(doc(db, 'users', uid), {
    stats: { ...profile.stats, ...stats },
  }, { merge: true })
}
