import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AIPediaState {
  language: string | null
  response: string | null
  updateLanguage: (language: string | null) => void
  updateResponse: (response: string | null) => void
}

export const useAIPediaStore = create<AIPediaState>()(
  persist(
    (set) => ({
      language: '',
      response: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
      neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
      quasi quidem quibusdam.`,
      updateLanguage: (newLanguage) => set(() => ({ language: newLanguage })),
      updateResponse: (newResponse) => set(() => ({ response: newResponse }))
    }),
    {
      name: 'aipedia-storage',
    },
  ),
)