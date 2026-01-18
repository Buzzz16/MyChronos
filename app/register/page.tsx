"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser, loginUser } from "@/app/actions/auth"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    // Auto login after registration
    const loginResult = await loginUser(formData)
    
    if (loginResult.success) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            MyChronos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create your account</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm animate-slide-in-up">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">At least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target active:scale-95"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
