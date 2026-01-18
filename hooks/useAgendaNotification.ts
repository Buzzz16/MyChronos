"use client"

import { useEffect, useRef } from "react"
import { Agenda } from "@prisma/client"
import { useCountdown } from "./useCountdown"

interface UseAgendaNotificationProps {
  agenda: Agenda
  timezone: string
  isEnabled: boolean
}

export function useAgendaNotification({ agenda, timezone, isEnabled }: UseAgendaNotificationProps) {
  const countdown = useCountdown(new Date(agenda.targetDateTime), timezone)
  const hasNotified = useRef(false)

  useEffect(() => {
    // Reset notification flag if countdown changes significantly
    if (!countdown.isExpired && countdown.totalSeconds > 60) {
      hasNotified.current = false
    }

    // Trigger notification when countdown expires
    if (
      countdown.isExpired &&
      !hasNotified.current &&
      isEnabled &&
      !agenda.isCompleted &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      hasNotified.current = true

      // Create notification
      const notification = new Notification("⏰ Agenda Time!", {
        body: agenda.title,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: agenda.id,
        requireInteraction: true,
        silent: false,
      })

      // Optional: Click to open dashboard
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      console.log(`✓ Notification sent for: ${agenda.title}`)
    }
  }, [countdown, agenda, isEnabled])

  return countdown
}
