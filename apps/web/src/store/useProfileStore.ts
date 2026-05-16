import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@volks/types'

interface ProfileStore {
  profiles: Profile[]
  activeProfile: Profile | null
  setProfiles: (profiles: Profile[]) => void
  setActiveProfile: (profile: Profile) => void
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfile: null,
      setProfiles: (profiles) => set({ profiles }),
      setActiveProfile: (profile) => set({ activeProfile: profile }),
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          activeProfile: state.activeProfile?.id === id ? null : state.activeProfile,
        })),
    }),
    {
      name: 'volks-profiles',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfile: state.activeProfile,
      }),
    }
  )
)
