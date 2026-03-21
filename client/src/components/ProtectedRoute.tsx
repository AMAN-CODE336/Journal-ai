import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <p className="p-6">Loading...</p>
  if (!user) return <Navigate to="/login" />

  return <Outlet />
}

export default ProtectedRoute