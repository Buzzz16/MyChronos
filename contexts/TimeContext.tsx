"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react"
import type { WorldTimeResponse } from "@/services/worldtime"

interface TimeContextValue {
  serverTime: Date | null
  offset: number
  isLoading: boolean
  error: string | null
  getCurrentTime: () => Date
}

const TimeContext = createContext<TimeContextValue | undefined>(undefined)

interface TimeProviderProps {
  children: ReactNode
  timezone?: string
}

export function TimeProvider({ children, timezone }: TimeProviderProps) {
  const [serverTime, setServerTime] = useState<Date | null>(null)
  const [offset, setOffset] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasSynced = useRef(false)

  useEffect(() => {
    // Prevent double sync in React StrictMode
    if (hasSynced.current) return
    hasSynced.current = true

    async function syncTime() {
      try {
        const url = timezone
          ? `/api/time?timezone=${encodeURIComponent(timezone)}`
          : "/api/time"
        
        const response = await fetch(url, { cache: "no-store" })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch server time: ${response.status}`)
        }
        
        const data: WorldTimeResponse = await response.json()
        
        if (!data.unixtime) {
          throw new Error("Invalid time data received")
        }
        
        const clientTime = Date.now()
        const serverUnixtime = data.unixtime * 1000
        const timeOffset = serverUnixtime - clientTime
        
        setOffset(timeOffset)
        setServerTime(new Date(serverUnixtime))
        setError(null)
        
        console.log(`✓ Time synced: offset ${Math.round(timeOffset / 1000)}s`)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to sync time"
        setError(errorMessage)
        console.error("Time sync error:", err)
        
        // Use local time as fallback
        setServerTime(new Date())
        setOffset(0)
      } finally {
        setIsLoading(false)
      }
    }

    syncTime()
    
    // Resync every 10 minutes (server time is reliable, no need for frequent syncs)
    const interval = setInterval(() => {
      syncTime()
    }, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [timezone])

  // Get current server-synced time
  const getCurrentTime = useCallback(() => {
    if (!serverTime) return new Date()
    return new Date(Date.now() + offset)
  }, [serverTime, offset])

  return (
    <TimeContext.Provider value={{ serverTime, offset, isLoading, error, getCurrentTime }}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error("useTime must be used within a TimeProvider")
  }
  return context
}
