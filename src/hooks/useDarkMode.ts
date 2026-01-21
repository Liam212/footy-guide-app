import { useEffect, useState } from 'react'

export function useDarkMode() {
  const getInitialDarkMode = () => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
  }
}
