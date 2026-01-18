"use client"

import { useEffect, useState, useMemo } from "react"
import { signOut } from "next-auth/react"
import { useTime } from "@/contexts/TimeContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useLocation } from "@/hooks/useLocation"
import { useNotification } from "@/hooks/useNotification"
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from "@/hooks/useKeyboardShortcuts"
import { AgendaList } from "@/components/AgendaList"
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt"
import { OfflineBanner } from "@/components/OfflineBanner"
import { format } from "date-fns"
import { Agenda, Category } from "@prisma/client"

interface User {
  id: string
  email: string
  name: string | null
  city: string | null
  region: string | null
  country: string | null
  timezone: string
  lastLatitude: number | null
  lastLongitude: number | null
  displayMode: "DETAILED" | "BROAD"
  notificationsEnabled: boolean
  lastLocationUpdate: Date | null
}

type AgendaWithCategory = Agenda & { category: Category | null }

interface DashboardClientProps {
  user: User
  agendas: AgendaWithCategory[]
  categories: Category[]
}

export default function DashboardClient({ user, agendas, categories }: DashboardClientProps) {
  const { serverTime, offset, isLoading: timeLoading, getCurrentTime } = useTime()
  const { theme, toggleTheme } = useTheme()
  const { location, isLoading: locationLoading, error: locationError, getLocation } = useLocation(user.id)
  const { permission, isSupported, requestPermission } = useNotification()
  
  // Add a state that updates every second to trigger re-renders
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showNewAgendaModal, setShowNewAgendaModal] = useState(false)

  // Keyboard shortcuts
  const shortcuts = useMemo(() => [
    { key: "n", description: "New Agenda", action: () => setShowNewAgendaModal(true) },
    { key: "d", description: "Toggle Dark Mode", action: toggleTheme },
    { key: "?", shift: true, description: "Show Shortcuts", action: () => setShowShortcuts(true) },
    { key: "Escape", description: "Close Modals", action: () => setShowShortcuts(false) },
  ], [toggleTheme])

  useKeyboardShortcuts({ shortcuts })

  useEffect(() => {
    // Update the displayed time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Request notification permission on mount
    if (isSupported && permission === "default") {
      requestPermission()
    }
  }, [isSupported, permission, requestPermission])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors pb-20 md:pb-8">
      {/* Offline Banner */}
      <OfflineBanner />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyChronos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name || user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* Keyboard shortcuts help - Desktop */}
              <button
                onClick={() => setShowShortcuts(true)}
                className="hidden md:flex p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (Shift+?)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-target"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Server Time Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 dark:border-gray-700 animate-slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Server Time</h2>
              <span className="text-2xl" role="img" aria-label="Clock">🕐</span>
            </div>
            {timeLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            ) : serverTime ? (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 font-mono tabular-nums">
                  {format(currentTime, "HH:mm:ss")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(currentTime, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                  Timezone: {user.timezone}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                  ✓ Synced with server
                </p>
              </div>
            ) : (
              <div>
                <p className="text-red-500 dark:text-red-400 text-sm mb-2">Time sync unavailable</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Using local time as fallback</p>
              </div>
            )}
          </div>

          {/* Location Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 dark:border-gray-700 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h2>
              <span className="text-2xl" role="img" aria-label="Location">📍</span>
            </div>
            {user.city ? (
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {user.city}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.region}, {user.country}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                  Timezone: {user.timezone}
                </p>
                <button
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:opacity-50 touch-target"
                >
                  {locationLoading ? "Updating..." : "↻ Update Location"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Location not detected
                </p>
                <button
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50 touch-target"
                >
                  {locationLoading ? "Detecting..." : "Detect Location"}
                </button>
                {locationError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-2">{locationError}</p>
                )}
              </div>
            )}
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 dark:border-gray-700 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <span className="text-2xl" role="img" aria-label="Bell">🔔</span>
            </div>
            <div>
              {!isSupported ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Not supported in your browser</p>
              ) : permission === "granted" ? (
                <div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Enabled</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll receive notifications when agendas start
                  </p>
                </div>
              ) : permission === "denied" ? (
                <div>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Blocked</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please enable notifications in your browser settings
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enable notifications to get alerts
                  </p>
                  <button
                    onClick={requestPermission}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium touch-target"
                  >
                    Enable Notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agendas Section */}
        <AgendaList
          agendas={agendas}
          categories={categories}
          userId={user.id}
          displayMode={user.displayMode}
          timezone={user.timezone}
          notificationsEnabled={user.notificationsEnabled}
          onOpenCreateModal={() => setShowNewAgendaModal(true)}
          showCreateModal={showNewAgendaModal}
          onCloseCreateModal={() => setShowNewAgendaModal(false)}
        />
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        shortcuts={shortcuts}
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Mobile Bottom Nav Spacer */}
      <div className="h-16 md:hidden" />
    </div>
  )
}
