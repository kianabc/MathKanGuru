import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { UserProfile } from '@/types/question'
import { loginWithPin, createAccountWithPin, getUserProfile } from '@/services/authService'

interface AuthState {
  uid: string | null
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  login: (pin: string) => Promise<void>
  createAccount: (displayName: string) => Promise<string>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'mathkanguru_auth'

function loadPersistedAuth(): { uid: string; pin: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persistAuth(uid: string, pin: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid, pin }))
}

function clearPersistedAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    uid: null,
    profile: null,
    isLoading: true,
    error: null,
  })

  // Try restoring session on mount
  useEffect(() => {
    const stored = loadPersistedAuth()
    if (!stored) {
      setState(s => ({ ...s, isLoading: false }))
      return
    }
    loginWithPin(stored.pin)
      .then(({ uid, profile }) => {
        setState({ uid, profile, isLoading: false, error: null })
      })
      .catch(() => {
        clearPersistedAuth()
        setState({ uid: null, profile: null, isLoading: false, error: null })
      })
  }, [])

  const login = useCallback(async (pin: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const { uid, profile } = await loginWithPin(pin)
      persistAuth(uid, pin)
      setState({ uid, profile, isLoading: false, error: null })
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Login failed',
      }))
      throw err
    }
  }, [])

  const createAccount = useCallback(async (displayName: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const { uid, pin } = await createAccountWithPin(displayName)
      persistAuth(uid, pin)
      const profile = await getUserProfile(uid)
      setState({ uid, profile, isLoading: false, error: null })
      return pin
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Account creation failed',
      }))
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    clearPersistedAuth()
    setState({ uid: null, profile: null, isLoading: false, error: null })
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!state.uid) return
    const profile = await getUserProfile(state.uid)
    if (profile) {
      setState(s => ({ ...s, profile }))
    }
  }, [state.uid])

  return (
    <AuthContext.Provider value={{ ...state, login, createAccount, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
