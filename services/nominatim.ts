// Nominatim OpenStreetMap Reverse Geocoding Service
export interface NominatimResponse {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    region?: string
    country?: string
    country_code?: string
  }
  boundingbox: string[]
}

export interface LocationData {
  city: string
  region: string
  country: string
  displayName: string
}

// Reverse geocode: Convert coordinates to location names
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<LocationData | null> {
  try {
    // Add delay to respect Nominatim's rate limit (1 request/second)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "MyChronos/1.0 (Personal Productivity App)",
        },
        cache: "no-store",
      }
    )
    
    if (!response.ok) {
      throw new Error("Failed to reverse geocode")
    }
    
    const data: NominatimResponse = await response.json()
    
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Unknown"
    
    const region = data.address.state || data.address.region || "Unknown"
    
    const country = data.address.country || "Unknown"
    
    return {
      city,
      region,
      country,
      displayName: data.display_name,
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return null
  }
}

// Get timezone from coordinates (using approximate mapping)
export function getTimezoneFromCoordinates(
  latitude: number,
  longitude: number
): string {
  // Simplified timezone detection based on longitude
  // For production, use a proper timezone API or library
  const offset = Math.round(longitude / 15)
  
  // Common timezone mappings (simplified)
  if (latitude > 0) {
    // Northern hemisphere
    if (longitude >= 95 && longitude <= 125) return "Asia/Jakarta" // Indonesia
    if (longitude >= 125 && longitude <= 145) return "Asia/Tokyo" // Japan
    if (longitude >= -10 && longitude <= 30) return "Europe/London" // Europe
    if (longitude >= -130 && longitude <= -60) return "America/New_York" // US East
  } else {
    // Southern hemisphere
    if (longitude >= 110 && longitude <= 155) return "Australia/Sydney"
  }
  
  return "UTC"
}
