import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AIPediaState {
  language: string | null
  updateLanguage: (language: string | null) => void
}

export const useAIPediaStore = create<AIPediaState>()(
  persist(
    (set) => ({
      language: '',
      updateLanguage: (newLanguage) => set(() => ({ language: newLanguage })),
    }),
    {
      name: 'aipedia-storage',
    },
  ),
)