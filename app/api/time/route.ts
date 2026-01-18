import { NextResponse } from "next/server"

// Use server time directly - more reliable than external API
// Modern servers have accurate time via NTP
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timezone = searchParams.get("timezone") || "UTC"

  try {
    const now = new Date()
    
    // Get time in requested timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    
    const parts = formatter.formatToParts(now)
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || "0"
    
    const tzDate = new Date(
      `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}:${getPart("second")}`
    )

    return NextResponse.json({
      datetime: now.toISOString(),
      timezone: timezone,
      unixtime: Math.floor(now.getTime() / 1000),
      utc_datetime: now.toISOString(),
      utc_offset: "+00:00",
      day_of_week: tzDate.getDay(),
      day_of_year: Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000),
      week_number: Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7),
    })
  } catch (error) {
    console.error("Time API error:", error)
    
    const now = new Date()
    return NextResponse.json({
      datetime: now.toISOString(),
      timezone: "UTC",
      unixtime: Math.floor(now.getTime() / 1000),
      utc_datetime: now.toISOString(),
      utc_offset: "+00:00",
      day_of_week: now.getDay(),
      day_of_year: 1,
      week_number: 1,
    })
  }
}
