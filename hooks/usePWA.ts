"use client"

import { useState, useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      console.log('✓ PWA is installed')
    }

    // Check if online
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('✓ Back online')
      setIsOnline(true)
    }
    const handleOffline = () => {
      console.log('✗ Gone offline')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
      console.log('✓ PWA install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('✓ PWA installed successfully')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✓ Service Worker registered:', registration.scope)
          setSwRegistration(registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            console.log('✓ Service Worker update found')

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✓ New Service Worker available')
                  // Optionally prompt user to reload
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('✗ Service Worker registration failed:', error)
        })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('✗ No install prompt available')
      return false
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('✓ User accepted PWA install')
        setDeferredPrompt(null)
        setIsInstallable(false)
        return true
      } else {
        console.log('✗ User dismissed PWA install')
        return false
      }
    } catch (error) {
      console.error('✗ Error installing PWA:', error)
      return false
    }
  }

  const updateServiceWorker = () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  return {
    isInstalled,
    isInstallable,
    isOnline,
    installPWA,
    updateServiceWorker,
    swRegistration,
  }
}
