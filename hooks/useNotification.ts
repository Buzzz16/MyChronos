"use client"

import { useState, useEffect } from "react"

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === "granted"
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== "granted") {
      console.warn("Notification permission not granted")
      return
    }

    try {
      new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/icon-96x96.png",
        ...options,
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  }
}
