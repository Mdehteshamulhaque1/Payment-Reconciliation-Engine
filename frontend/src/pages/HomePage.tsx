import { useAuthStore } from '@/store/authStore'
import { GatewayLoader } from '@/components/ui/GatewayLoader'
import DashboardLayout from '@/components/layout/DashboardLayout'
import MarketingLayout from '@/components/layout/MarketingLayout'
import DashboardPage from '@/pages/app/DashboardPage'
import { LandingPageContent } from './LandingPage'

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loading = useAuthStore((s) => s.isLoading)

  if (loading) return <GatewayLoader />

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    )
  }

  return (
    <MarketingLayout>
      <LandingPageContent />
    </MarketingLayout>
  )
}
