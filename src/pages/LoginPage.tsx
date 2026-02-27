import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import KangarooMascot from '@/components/home/KangarooMascot'
import PinDisplay from '@/components/auth/PinDisplay'
import PinPad from '@/components/auth/PinPad'
import BigButton from '@/components/common/BigButton'
import LoadingSpinner from '@/components/common/LoadingSpinner'

type Mode = 'choose' | 'login' | 'create'

export default function LoginPage() {
  const { login, createAccount, isLoading, error } = useAuth()
  const [mode, setMode] = useState<Mode>('choose')
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [createdPin, setCreatedPin] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleDigit = (d: string) => {
    if (pin.length < 4) setPin(p => p + d)
  }
  const handleDelete = () => setPin(p => p.slice(0, -1))
  const handleClear = () => setPin('')

  const handleLogin = async () => {
    if (pin.length !== 4) return
    setLocalError(null)
    try {
      await login(pin)
    } catch {
      setLocalError('PIN not found. Please check and try again.')
      setPin('')
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      setLocalError('Please enter your name!')
      return
    }
    setLocalError(null)
    try {
      const newPin = await createAccount(name.trim())
      setCreatedPin(newPin)
    } catch {
      setLocalError('Could not create account. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={64} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-warm-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <KangarooMascot size={100} mood="happy" />
        <h1 className="text-4xl text-primary-600 mt-4">Math KanGuru</h1>
        <p className="text-gray-500 mt-2 font-semibold">Jump into math fun!</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <BigButton onClick={() => setMode('login')} variant="primary">
              I have a PIN
            </BigButton>
            <BigButton onClick={() => setMode('create')} variant="secondary">
              Create new account
            </BigButton>
          </motion.div>
        )}

        {mode === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-2xl text-center text-gray-700 mb-2">Enter your PIN</h2>
            <PinDisplay pin={pin} />
            {(localError || error) && (
              <p className="text-wrong text-center text-sm mb-3">{localError || error}</p>
            )}
            <PinPad
              onDigit={handleDigit}
              onDelete={handleDelete}
              onClear={handleClear}
              disabled={isLoading}
            />
            <div className="flex gap-3 mt-6 justify-center">
              <BigButton
                onClick={() => { setMode('choose'); setPin(''); setLocalError(null) }}
                variant="accent"
                className="!text-base !px-5 !py-2"
              >
                Back
              </BigButton>
              <BigButton
                onClick={handleLogin}
                disabled={pin.length !== 4 || isLoading}
                className="!text-base !px-5 !py-2"
              >
                Enter
              </BigButton>
            </div>
          </motion.div>
        )}

        {mode === 'create' && !createdPin && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-2xl text-center text-gray-700 mb-4">What's your name?</h2>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full px-4 py-3 text-xl text-center rounded-xl border-2 border-gray-300
                         focus:border-primary-500 focus:outline-none bg-white"
            />
            {localError && (
              <p className="text-wrong text-center text-sm mt-2">{localError}</p>
            )}
            <div className="flex gap-3 mt-6 justify-center">
              <BigButton
                onClick={() => { setMode('choose'); setName(''); setLocalError(null) }}
                variant="accent"
                className="!text-base !px-5 !py-2"
              >
                Back
              </BigButton>
              <BigButton
                onClick={handleCreate}
                disabled={isLoading}
                className="!text-base !px-5 !py-2"
              >
                Create
              </BigButton>
            </div>
          </motion.div>
        )}

        {mode === 'create' && createdPin && (
          <motion.div
            key="created"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-sm"
          >
            <KangarooMascot size={80} mood="celebrating" />
            <h2 className="text-2xl text-secondary-600 mt-4 mb-2">Welcome, {name}!</h2>
            <p className="text-gray-600 mb-4">Your secret PIN is:</p>
            <div className="text-5xl font-bold text-primary-600 tracking-widest mb-4">
              {createdPin}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Remember this PIN! You'll use it to log in on any device.
            </p>
            <BigButton onClick={() => window.location.reload()}>
              Let's Go!
            </BigButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
