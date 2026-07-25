import { create } from 'zustand'

export interface ApiMetric {
  endpoint: string
  method: string
  status: number
  responseTime: number
  cacheStatus: 'HIT' | 'STALE' | 'MISS'
  lastRefresh: number
  timestamp: number
}

interface DevState {
  devMode: boolean
  metrics: ApiMetric[]
  devPanelOpen: boolean
  toggleDevMode: () => void
  addMetric: (m: ApiMetric) => void
  clearMetrics: () => void
  setDevPanelOpen: (open: boolean) => void
}

const DEV_KEY = 'pf_dev_mode'

export const useDevStore = create<DevState>((set, get) => ({
  devMode: localStorage.getItem(DEV_KEY) === 'true',
  metrics: [],
  devPanelOpen: false,
  toggleDevMode: () => {
    const next = !get().devMode
    localStorage.setItem(DEV_KEY, String(next))
    set({ devMode: next })
  },
  addMetric: (m) => {
    const metrics = get().metrics
    const next = [m, ...metrics].slice(0, 200)
    set({ metrics: next })
  },
  clearMetrics: () => set({ metrics: [] }),
  setDevPanelOpen: (open) => set({ devPanelOpen: open }),
}))
