import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export type Theme = 'home' | 'builder' | 'ats' | 'cover-letter' | 'interview' | 'roaster'

interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    dark: string
    light: string
    gradient: string
    navbarBg: string
    navbarBorder: string
    navbarText: string
    navbarActive: string
  }
  navbarStyle: 'default' | 'minimal' | 'bold' | 'elegant' | 'modern' | 'floating' | 'sidebar' | 'ribbon' | 'circular' | 'diagonal' | 'playful'
}

const themes: Record<Theme, ThemeConfig> = {
  home: {
    name: 'Home',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      dark: '#1e293b',
      light: '#f8fafc',
      gradient: 'from-blue-500 via-purple-500 to-green-500',
      navbarBg: 'bg-white',
      navbarBorder: 'border-brand-primary',
      navbarText: 'text-gray-700',
      navbarActive: 'from-brand-primary to-brand-secondary',
    },
    navbarStyle: 'floating', // Home: Floating glass navbar
  },
  builder: {
    name: 'Builder',
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      dark: '#1e40af',
      light: '#eff6ff',
      gradient: 'from-blue-600 to-blue-800',
      navbarBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      navbarBorder: 'border-blue-500',
      navbarText: 'text-blue-900',
      navbarActive: 'from-blue-600 to-indigo-600',
    },
    navbarStyle: 'sidebar', // Builder: Sidebar-style horizontal
  },
  ats: {
    name: 'ATS Checker',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      dark: '#047857',
      light: '#ecfdf5',
      gradient: 'from-green-500 to-emerald-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-green-500',
      navbarText: 'text-gray-700',
      navbarActive: 'from-green-500 to-emerald-500',
    },
    navbarStyle: 'circular', // ATS: Circular floating buttons
  },
  'cover-letter': {
    name: 'Cover Letter',
    colors: {
      primary: '#a855f7',
      secondary: '#9333ea',
      accent: '#c084fc',
      dark: '#7e22ce',
      light: '#faf5ff',
      gradient: 'from-purple-500 to-pink-500',
      navbarBg: 'bg-gradient-to-r from-purple-50 to-pink-50',
      navbarBorder: 'border-purple-500',
      navbarText: 'text-purple-900',
      navbarActive: 'from-purple-600 to-pink-600',
    },
    navbarStyle: 'ribbon', // Cover Letter: Elegant ribbon style
  },
  interview: {
    name: 'Interview Prep',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      dark: '#b45309',
      light: '#fffbeb',
      gradient: 'from-orange-500 to-red-500',
      navbarBg: 'bg-white',
      navbarBorder: 'border-orange-500',
      navbarText: 'text-gray-800',
      navbarActive: 'from-orange-500 to-red-500',
    },
    navbarStyle: 'diagonal', // Interview: Bold diagonal layout
  },
  roaster: {
    name: 'Resume Roaster',
    colors: {
      primary: '#f97316',
      secondary: '#dc2626',
      accent: '#fbbf24',
      dark: '#c2410c',
      light: '#fff7ed',
      gradient: 'from-orange-500 to-red-600',
      navbarBg: 'bg-gradient-to-r from-orange-50 to-red-50',
      navbarBorder: 'border-orange-400',
      navbarText: 'text-gray-900',
      navbarActive: 'from-orange-500 to-red-600',
    },
    navbarStyle: 'playful', // Roaster: Playful, fun, energetic style
  },
}

interface ThemeContextType {
  theme: Theme
  themeConfig: ThemeConfig
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [theme, setTheme] = useState<Theme>('home')

  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      setTheme('home')
    } else if (path.startsWith('/builder')) {
      setTheme('builder')
    } else if (path.startsWith('/ats-checker')) {
      setTheme('ats')
    } else if (path.startsWith('/cover-letter')) {
      setTheme('cover-letter')
    } else if (path.startsWith('/interview-questions')) {
      setTheme('interview')
    } else if (path.startsWith('/resume-roaster')) {
      setTheme('roaster')
    } else {
      setTheme('home')
    }
  }, [location.pathname])

  const themeConfig = themes[theme]

  // Apply CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', themeConfig.colors.primary)
    root.style.setProperty('--theme-secondary', themeConfig.colors.secondary)
    root.style.setProperty('--theme-accent', themeConfig.colors.accent)
    root.style.setProperty('--theme-dark', themeConfig.colors.dark)
    root.style.setProperty('--theme-light', themeConfig.colors.light)
  }, [themeConfig])

  return (
    <ThemeContext.Provider value={{ theme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

