"use client"

import { useEffect } from "react"

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts, enabled])
}

// Keyboard shortcuts help modal component
export function KeyboardShortcutsHelp({ 
  shortcuts, 
  isOpen, 
  onClose 
}: { 
  shortcuts: KeyboardShortcut[]
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                {shortcut.ctrl && "Ctrl + "}
                {shortcut.shift && "Shift + "}
                {shortcut.alt && "Alt + "}
                {shortcut.key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd> anytime to see this help
        </p>
      </div>
    </div>
  )
}
