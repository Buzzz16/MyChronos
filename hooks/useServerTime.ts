"use client"

// This hook is now deprecated - use useTime from TimeContext instead
// Kept for backward compatibility
import { useTime } from "@/contexts/TimeContext"

export function useServerTime(timezone?: string) {
  return useTime()
}
