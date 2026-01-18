"use client"

import { useState, useEffect } from "react"
import { Category } from "@prisma/client"
import { createAgenda } from "@/app/actions/agendas"
import { useToast } from "@/contexts/ToastContext"
import { Priority } from "@prisma/client"

interface CreateAgendaModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  categories: Category[]
  timezone: string
}

export function CreateAgendaModal({
  isOpen,
  onClose,
  userId,
  categories,
  timezone,
}: CreateAgendaModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [priority, setPriority] = useState<Priority>("MEDIUM")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // Set default date/time to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      
      setTargetDate(tomorrow.toISOString().split("T")[0])
      setTargetTime("09:00")
      setTitle("")
      setDescription("")
      setCategoryId("")
      setPriority("MEDIUM")
      setError("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!targetDate || !targetTime) {
      setError("Target date and time are required")
      return
    }

    const targetDateTime = new Date(`${targetDate}T${targetTime}`)
    
    if (targetDateTime <= new Date()) {
      setError("Target date must be in the future")
      return
    }

    setIsLoading(true)

    const result = await createAgenda(userId, {
      title: title.trim(),
      description: description.trim() || undefined,
      targetDateTime,
      categoryId: categoryId || undefined,
      priority,
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      showToast("Agenda created successfully! 🎉", "success")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Agenda</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm animate-slide-in-up">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter agenda title"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{title.length}/200</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Add details about this agenda"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description.length}/1000</p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date *
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Time *
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category (Optional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["LOW", "MEDIUM", "HIGH", "URGENT"] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm touch-target ${
                    priority === p
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 touch-target active:scale-95"
            >
              {isLoading ? "Creating..." : "Create Agenda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
