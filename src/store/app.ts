import { create } from 'zustand'

interface IAppState {
  darkMode: boolean,
  setDarkMode: (val: boolean) => void,
  themeColor: string
  setThemeColor: (color: string) => void
  previewMode: boolean
  showEdit: boolean
  setPreviewMode: (gotoPreview: boolean) => void
  setShowEdit: (showEdit: boolean) => void
  showEditStyle: boolean,
  setShowEditStyle: (showEdit: boolean) => void
}

export const useAppStore = create<IAppState>()((set) => ({
  darkMode: false,
  setDarkMode: (val) => set(() => ({ darkMode: val })),
  previewMode: false,
  showEdit: false,
  showEditStyle: false,
  themeColor: '#4896d5',
  setThemeColor: (themeColor: string) => set(() => ({ themeColor })),
  setPreviewMode: (gotoPreview: boolean) => set(() => ({ previewMode: gotoPreview })),
  setShowEdit: (showEdit: boolean) => set(() => ({ showEdit })),
  setShowEditStyle: (showEditStyle: boolean) => set(() => ({ showEditStyle })),
}))
