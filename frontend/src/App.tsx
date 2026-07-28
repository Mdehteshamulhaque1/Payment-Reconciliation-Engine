/**
 * App.tsx — Root application component
 * Defines all routes, global providers, and initialization hooks.
 * Routes are split into: public auth routes, marketing pages, and protected app pages.
 */
import { lazy, Suspense, useEffect, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ToastProvider } from '@/components/effects/Toast'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { DevPanel } from '@/components/ui/DevPanel'
import { GatewayLoader } from '@/components/ui/GatewayLoader'

const MarketingLayout = lazy(() => import('@/components/layout/MarketingLayout'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const DocsPage = lazy(() => import('@/pages/DocsPage'))
const ApiDocsPage = lazy(() => import('@/pages/ApiDocsPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'))
const TransactionsPage = lazy(() => import('@/pages/app/TransactionsPage'))
const GatewaysPage = lazy(() => import('@/pages/app/GatewaysPage'))
const ReconciliationPage = lazy(() => import('@/pages/app/ReconciliationPage'))
const SettlementsPage = lazy(() => import('@/pages/app/SettlementsPage'))
const LedgerPage = lazy(() => import('@/pages/app/LedgerPage'))
const FraudPage = lazy(() => import('@/pages/app/FraudPage'))
const ReportsPage = lazy(() => import('@/pages/app/ReportsPage'))
const NotificationsPage = lazy(() => import('@/pages/app/NotificationsPage'))
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'))

// React Query client — 30s stale time, single retry, no refetch on focus
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

/** Gateway logo loader shown while lazy-loaded page chunks are fetching */
function PageLoader() {
  return <GatewayLoader />
}

/** Redirects unauthenticated users to /login; renders DashboardLayout for authenticated users */
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)
  if (!isAuthenticated && !token) return <Navigate to='/login' replace />
  return <DashboardLayout />
}

/** Redirects authenticated users away from login/signup to the dashboard */
function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to='/' replace />
  return <Outlet />
}

/** Catch-all route: authenticated users go to /, unauthenticated to /home */
function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return <Navigate to={isAuthenticated ? '/' : '/home'} replace />
}

/** Initializes theme from localStorage on mount */
function ThemeInit() {
  const initTheme = useThemeStore((s) => s.initTheme)
  useEffect(() => { initTheme?.() }, [])
  return null
}

/** Restores auth state (tokens + user) from localStorage on mount */
function AppInit() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  useEffect(() => { loadFromStorage?.() }, [])
  return null
}

/** Exposes dev store on window for API metrics panel access in dev mode */
function DevStoreInit() {
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).__devStore = useDevStore
  }, [])
  return null
}

class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className='flex min-h-screen items-center justify-center p-8'>
          <div className='max-w-md text-center'>
            <h2 className='text-xl font-bold mb-2'>Something went wrong</h2>
            <p className='text-sm text-muted-foreground mb-4'>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className='rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white'>
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const devPanelOpen = useDevStore((s) => s.devPanelOpen)
  const setDevPanelOpen = useDevStore((s) => s.setDevPanelOpen)

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider />
          <ThemeInit />
          <AppInit />
          <DevStoreInit />
          <CommandPalette />
          <DevPanel open={devPanelOpen} onClose={() => setDevPanelOpen(false)} />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path='/login' element={<PublicRoute />}>
                <Route index element={<LoginPage />} />
              </Route>
              <Route path='/signup' element={<PublicRoute />}>
                <Route index element={<SignupPage />} />
              </Route>
              <Route element={<MarketingLayout />}>
                <Route path='/home' element={<LandingPage />} />
                <Route path='/pricing' element={<PricingPage />} />
                <Route path='/docs' element={<DocsPage />} />
                <Route path='/api-docs' element={<ApiDocsPage />} />
                <Route path='/contact' element={<ContactPage />} />
                <Route path='/about' element={<AboutPage />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path='/' element={<DashboardPage />} />
                <Route path='/transactions' element={<TransactionsPage />} />
                <Route path='/gateways' element={<GatewaysPage />} />
                <Route path='/reconciliation' element={<ReconciliationPage />} />
                <Route path='/settlements' element={<SettlementsPage />} />
                <Route path='/ledger' element={<LedgerPage />} />
                <Route path='/fraud' element={<FraudPage />} />
                <Route path='/reports' element={<ReportsPage />} />
                <Route path='/notifications' element={<NotificationsPage />} />
                <Route path='/settings' element={<SettingsPage />} />
              </Route>
              <Route path='*' element={<RootRedirect />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
