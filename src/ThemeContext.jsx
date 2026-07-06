import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

/* Chapter 2 — the "calm world" direction. Two competing hero treatments:
   pixel  — 16-bit meadow at golden hour (cofounder-style world-building)
   voxel  — isometric block island, same palette, more "engineered"
   Legacy themes (signal/kinetic/blueprint) remain in CSS for reference. */
export const THEMES = ['pastel']
const DEFAULT = 'pastel'
const KEY = 'ai-redesign-theme'

export function ThemeProvider({ children }) {
  /* Direction is locked to Pastel (v1) — ignore any stale saved theme so
     the v2 experiment can't resurrect itself from localStorage. */
  const [theme, setTheme] = useState(DEFAULT)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
