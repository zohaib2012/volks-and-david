import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeConfig } from '@volks/types'

interface ThemeStore {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  resetTheme: () => void
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#4F6FF5',
  primaryColorName: 'Navy Blue',
  mode: 'light',
  sidebarStyle: 'solid',
  fontSize: 'md',
  borderRadius: 'rounded',
  density: 'default',
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      setTheme: (newTheme) =>
        set((state) => ({
          theme: { ...state.theme, ...newTheme },
        })),
      resetTheme: () => set({ theme: defaultTheme }),
    }),
    {
      name: 'volks-theme',
    }
  )
)
