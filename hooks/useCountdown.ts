"use client"

import { useState, useEffect } from "react"
import { useTime } from "@/contexts/TimeContext"

export interface CountdownData {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  isExpired: boolean
  isToday: boolean
  isTomorrow: boolean
}

export function useCountdown(targetDate: Date, timezone?: string) {
  const { getCurrentTime } = useTime()
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false,
    isToday: false,
    isTomorrow: false,
  })

  const calculateCountdown = (): CountdownData => {
    const now = getCurrentTime()
    const target = new Date(targetDate)
    const diff = target.getTime() - now.getTime()

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: true,
        isToday: false,
        isTomorrow: false,
      }
    }

    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // Check if target is today or tomorrow
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate())
    const diffDays = Math.floor((targetDateOnly.getTime() - nowDate.getTime()) / 86400000)

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      isExpired: false,
      isToday: diffDays === 0,
      isTomorrow: diffDays === 1,
    }
  }

  useEffect(() => {
    // Initial calculation
    setCountdown(calculateCountdown())

    // Update every second
    const interval = setInterval(() => {
      setCountdown(calculateCountdown())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}

// Format countdown for display
export function formatCountdown(countdown: CountdownData, mode: "DETAILED" | "BROAD"): string {
  if (countdown.isExpired) {
    return "Expired"
  }

  if (mode === "DETAILED") {
    // Show HH:MM:SS for items within 24 hours
    if (countdown.days === 0) {
      return `${String(countdown.hours).padStart(2, "0")}:${String(countdown.minutes).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`
    }
    // Show days + HH:MM:SS for items beyond 24 hours
    return `${countdown.days}d ${String(countdown.hours).padStart(2, "0")}:${String(countdown.minutes).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`
  } else {
    // BROAD mode: Only days and hours
    if (countdown.days === 0) {
      return `${countdown.hours}h ${countdown.minutes}m`
    }
    return `${countdown.days}d ${countdown.hours}h`
  }
}

// Get countdown status color
export function getCountdownColor(countdown: CountdownData): string {
  if (countdown.isExpired) return "text-gray-400"
  if (countdown.totalSeconds < 3600) return "text-red-600" // Less than 1 hour
  if (countdown.totalSeconds < 86400) return "text-orange-600" // Less than 1 day
  if (countdown.days < 3) return "text-yellow-600" // Less than 3 days
  return "text-blue-600"
}
