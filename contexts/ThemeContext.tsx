"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ThemeContextValue {
  theme: "light" | "dark"
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage and system preference
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = stored || systemPreference
    setThemeState(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Always provide the context, but use default theme before mount to prevent hydration mismatch
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
