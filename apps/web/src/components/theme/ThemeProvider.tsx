import React, { useEffect } from 'react'
import { useThemeStore } from '../../store/useThemeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--primary', hexToHsl(theme.primaryColor))
    root.style.setProperty('--accent', getAccentForTheme(theme.primaryColorName))

    const mode = theme.mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme.mode

    root.classList.toggle('dark', mode === 'dark')

    root.className = root.className
      .replace(/theme-\w+/g, '')
      .replace(/sidebar-\w+/g, '')
      .replace(/font-size-\w+/g, '')
      .replace(/radius-\w+/g, '')
      .replace(/density-\w+/g, '')
      .trim()

    const themeClass = getThemeClass(theme.primaryColorName)
    if (themeClass) root.classList.add(themeClass)

    root.classList.add(`sidebar-${theme.sidebarStyle}`)
    root.classList.add(`font-size-${theme.fontSize}`)
    root.classList.add(`radius-${theme.borderRadius}`)
    root.classList.add(`density-${theme.density}`)
  }, [theme])

  return <>{children}</>
}

function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255
    g = parseInt(hex.slice(3, 5), 16) / 255
    b = parseInt(hex.slice(5, 7), 16) / 255
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function getAccentForTheme(name: string): string {
  const accents: Record<string, string> = {
    'Navy Blue': '160 84% 39%',
    'Forest Green': '152 76% 46%',
    'Royal Purple': '280 75% 55%',
    'Midnight Black': '160 100% 44%',
    'Crimson Red': '25 90% 55%',
  }
  return accents[name] || '160 84% 39%'
}

function getThemeClass(name: string): string {
  const classes: Record<string, string> = {
    'Navy Blue': 'theme-navy',
    'Forest Green': 'theme-green',
    'Royal Purple': 'theme-purple',
    'Midnight Black': 'theme-dark',
    'Crimson Red': 'theme-crimson',
  }
  return classes[name] || ''
}
