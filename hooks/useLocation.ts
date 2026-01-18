"use client"

import { useState, useEffect, useCallback } from "react"
import { updateUserLocation } from "@/app/actions/auth"

interface LocationData {
  latitude: number
  longitude: number
  city: string
  region: string
  country: string
  timezone: string
  displayName: string
}

export function useLocation(userId?: string) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocode to get location names
          const response = await fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          })
          
          if (!response.ok) {
            throw new Error("Failed to get location data")
          }
          
          const locationData: LocationData = await response.json()
          setLocation(locationData)
          
          // Update user location in database if userId is provided
          if (userId) {
            await updateUserLocation(userId, {
              latitude,
              longitude,
              city: locationData.city,
              region: locationData.region,
              country: locationData.country,
              timezone: locationData.timezone,
            })
          }
          
          setError(null)
        } catch (err) {
          setError("Failed to get location data")
          console.error("Location error:", err)
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        setIsLoading(false)
        
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true)
          setError("Location access denied. Please enable location services.")
        } else {
          setError("Unable to retrieve your location")
        }
      }
    )
  }, [userId])

  useEffect(() => {
    // Auto-fetch location on mount if userId is provided
    if (userId) {
      getLocation()
    }
  }, [userId, getLocation])

  return {
    location,
    isLoading,
    error,
    permissionDenied,
    getLocation,
  }
}
