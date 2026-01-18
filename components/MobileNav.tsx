"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface MobileNavProps {
  onNewAgenda: () => void
  activeTab: "dashboard" | "agendas" | "settings"
  onTabChange: (tab: "dashboard" | "agendas" | "settings") => void
}

export function MobileNav({ onNewAgenda, activeTab, onTabChange }: MobileNavProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {/* Dashboard */}
        <button
          onClick={() => onTabChange("dashboard")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === "dashboard"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* Agendas */}
        <button
          onClick={() => onTabChange("agendas")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === "agendas"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Agendas"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">Agendas</span>
        </button>

        {/* Add Button - Floating */}
        <button
          onClick={onNewAgenda}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all active:scale-95"
          aria-label="New Agenda"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="text-xs mt-1">Theme</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange("settings")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === "settings"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Settings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </nav>
  )
}
