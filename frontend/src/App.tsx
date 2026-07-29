import { lazy, Suspense, useEffect, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ToastProvider } from '@/components/effects/Toast'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { DevPanel } from '@/components/ui/DevPanel'
import { GatewayLoader } from '@/components/ui/GatewayLoader'
import MarketingLayout from '@/components/layout/MarketingLayout'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const TransactionsPage = lazy(() => import('@/pages/app/TransactionsPage'))
const GatewaysPage = lazy(() => import('@/pages/app/GatewaysPage'))
const ReconciliationPage = lazy(() => import('@/pages/app/ReconciliationPage'))
const SettlementsPage = lazy(() => import('@/pages/app/SettlementsPage'))
const LedgerPage = lazy(() => import('@/pages/app/LedgerPage'))
const FraudPage = lazy(() => import('@/pages/app/FraudPage'))
const ReportsPage = lazy(() => import('@/pages/app/ReportsPage'))
const NotificationsPage = lazy(() => import('@/pages/app/NotificationsPage'))
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return <GatewayLoader />
}

function ThemeInit() {
  const initTheme = useThemeStore((s) => s.initTheme)
  useEffect(() => { initTheme?.() }, [])
  return null
}

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
          <DevStoreInit />
          <CommandPalette />
          <DevPanel open={devPanelOpen} onClose={() => setDevPanelOpen(false)} />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MarketingLayout />}>
                <Route path='/home' element={<LandingPage />} />
              </Route>
              <Route element={<DashboardLayout />}>
                <Route path='/' element={<LandingPage />} />
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
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
