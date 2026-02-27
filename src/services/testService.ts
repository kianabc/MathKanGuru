import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { TestResult } from '@/types/question'

export async function saveTestResult(uid: string, result: TestResult): Promise<string> {
  const ref = collection(db, 'users', uid, 'testResults')
  const doc = await addDoc(ref, {
    ...result,
    completedAt: Date.now(),
  })
  return doc.id
}

export async function getTestResults(uid: string, maxResults = 20): Promise<TestResult[]> {
  const ref = collection(db, 'users', uid, 'testResults')
  const q = query(ref, orderBy('completedAt', 'desc'), limit(maxResults))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TestResult))
}
