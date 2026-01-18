import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center max-w-3xl">
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
          MyChronos
        </h1>
        <p className="text-2xl text-gray-700 mb-4 font-medium">
          Personal Productivity & Time Management
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Manage your agendas with precise time-tracking, location-based contexts, 
          and real-time countdown timers. Stay organized, stay productive.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-gray-200"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🕐</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Precision Time</h3>
            <p className="text-gray-600 text-sm">
              Server-synced time with WorldTimeAPI. Never miss a deadline due to clock errors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Location Aware</h3>
            <p className="text-gray-600 text-sm">
              Automatic location detection with timezone synchronization for global teams.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Smart Countdown</h3>
            <p className="text-gray-600 text-sm">
              Real-time countdowns that resume accurately even after closing your browser.
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-white/50 backdrop-blur rounded-xl border border-white/20">
          <p className="text-sm text-gray-600 mb-2">
            🎉 <strong>Phase 2 & 3 Complete!</strong>
          </p>
          <p className="text-xs text-gray-500">
            Authentication, Server Time Sync, and Location Detection are live.
          </p>
        </div>
      </div>
    </main>
  )
}
