// WorldTimeAPI service for server time synchronization
export interface WorldTimeResponse {
  datetime: string
  timezone: string
  unixtime: number
  utc_datetime: string
  utc_offset: string
  day_of_week: number
  day_of_year: number
  week_number: number
}

export async function getServerTime(): Promise<WorldTimeResponse | null> {
  try {
    const response = await fetch("https://worldtimeapi.org/api/ip", {
      cache: "no-store",
      next: { revalidate: 0 },
    })
    
    if (!response.ok) {
      console.error(`WorldTimeAPI responded with status: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    console.log("✓ WorldTimeAPI sync successful")
    return data
  } catch (error) {
    console.error("Error fetching server time from WorldTimeAPI:", error)
    return null
  }
}

export async function getServerTimeByTimezone(
  timezone: string
): Promise<WorldTimeResponse | null> {
  try {
    const response = await fetch(
      `https://worldtimeapi.org/api/timezone/${timezone}`,
      {
        cache: "no-store",
      }
    )
    
    if (!response.ok) {
      throw new Error("Failed to fetch server time")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching server time:", error)
    return null
  }
}

// Calculate time deviation between client and server
export function calculateTimeDeviation(
  serverUnixtime: number,
  clientUnixtime: number
): number {
  return Math.abs(serverUnixtime - clientUnixtime) * 1000 // Convert to milliseconds
}

// Check if time deviation is acceptable (< 5 minutes)
export function isTimeDeviationAcceptable(
  deviationMs: number,
  maxDeviationMs: number = 5 * 60 * 1000
): boolean {
  return deviationMs < maxDeviationMs
}
