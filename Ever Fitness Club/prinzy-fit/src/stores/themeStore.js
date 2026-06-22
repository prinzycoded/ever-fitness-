import { create } from 'zustand'

const getInitialMode = () => {
  try {
    const saved = localStorage.getItem('theme-mode')
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* ignore */ }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const useThemeStore = create((set) => ({
  mode: getInitialMode(),
  toggleTheme: () => set((state) => {
    const next = state.mode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme-mode', next)
    return { mode: next }
  }),
}))

export const useThemeMode = () => {
  const mode = useThemeStore((s) => s.mode)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  return { mode, isDark: mode === 'dark', toggleTheme }
}
