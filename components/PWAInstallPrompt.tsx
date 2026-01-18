"use client"

import { useState, useEffect } from "react"
import { usePWA } from "@/hooks/usePWA"

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installPWA } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    const success = await installPWA()
    setIsInstalling(false)
    
    if (!success) {
      // User dismissed, remember their choice
      localStorage.setItem('pwa-prompt-dismissed', 'true')
      setIsDismissed(true)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true')
    setIsDismissed(true)
  }

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || isDismissed || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-in-up safe-area-bottom">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Install MyChronos</h3>
            <p className="text-sm text-blue-50 mb-4">
              Install this app on your device for a better experience with offline access and quick launch!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition disabled:opacity-50 text-sm touch-target active:scale-95"
              >
                {isInstalling ? "Installing..." : "Install"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-blue-700/50 text-white rounded-lg font-medium hover:bg-blue-700/70 transition text-sm touch-target active:scale-95"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
