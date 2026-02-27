import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import PracticePage from '@/pages/PracticePage'
import TestPage from '@/pages/TestPage'
import DashboardPage from '@/pages/DashboardPage'

function ProtectedRoute() {
  const { uid, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={64} />
      </div>
    )
  }
  if (!uid) return <Navigate to="/login" replace />
  return <Outlet />
}

function LoginRoute() {
  const { uid, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={64} />
      </div>
    )
  }
  if (uid) return <Navigate to="/" replace />
  return <LoginPage />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <LearnPage /> },
      { path: '/practice', element: <PracticePage /> },
      { path: '/test', element: <TestPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
