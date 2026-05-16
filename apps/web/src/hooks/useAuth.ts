import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'
import { useProfileStore } from '../store/useProfileStore'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, setUser, logout } = useAuthStore()
  return { user, token, isAuthenticated, setAuth, setUser, logout }
}

export function useTheme() {
  const { theme, setTheme, resetTheme } = useThemeStore()
  return { theme, setTheme, resetTheme }
}

export function useProfiles() {
  const { profiles, activeProfile, setProfiles, setActiveProfile, addProfile, removeProfile } = useProfileStore()
  return { profiles, activeProfile, setProfiles, setActiveProfile, addProfile, removeProfile }
}
