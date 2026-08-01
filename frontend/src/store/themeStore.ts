import { create } from 'zustand'

type Theme = 'light' | 'dark'
const THEME_KEY = 'pf_theme'
const THEMES: Theme[] = ['light', 'dark']

function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.classList.remove('dark')
  if (theme === 'dark') html.classList.add('dark')
}

function getInitialTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || 'light'
}

applyTheme(getInitialTheme())

interface ThemeState {
  theme: Theme
  initTheme: () => void
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  initTheme: () => applyTheme(getInitialTheme()),
  setTheme: (theme) => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
    set({ theme })
  },
  cycleTheme: () => {
    const current = get().theme
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]
    applyTheme(next)
    localStorage.setItem(THEME_KEY, next)
    set({ theme: next })
  },
}))
