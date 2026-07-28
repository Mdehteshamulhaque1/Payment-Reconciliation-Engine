import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { GatewayLoader } from '@/components/ui/GatewayLoader'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) {
    return <GatewayLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}
