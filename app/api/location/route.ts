import { NextResponse } from "next/server"
import { reverseGeocode, getTimezoneFromCoordinates } from "@/services/nominatim"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    // Reverse geocode to get location names
    const locationData = await reverseGeocode(latitude, longitude)

    if (!locationData) {
      return NextResponse.json(
        { error: "Failed to reverse geocode" },
        { status: 500 }
      )
    }

    // Get timezone from coordinates
    const timezone = getTimezoneFromCoordinates(latitude, longitude)

    return NextResponse.json({
      ...locationData,
      timezone,
      latitude,
      longitude,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
