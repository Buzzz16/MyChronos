"use client"

import { useState, memo, useCallback } from "react"
import { Agenda, Category, Priority } from "@prisma/client"
import { useAgendaNotification } from "@/hooks/useAgendaNotification"
import { formatCountdown, getCountdownColor } from "@/hooks/useCountdown"
import { toggleAgendaComplete, deleteAgenda } from "@/app/actions/agendas"
import { useToast } from "@/contexts/ToastContext"
import { useConfirm } from "@/contexts/ConfirmContext"
import { format } from "date-fns"
import { PRIORITY_COLORS } from "@/lib/constants"

type AgendaWithCategory = Agenda & { category: Category | null }

interface AgendaCardProps {
  agenda: AgendaWithCategory
  displayMode: "DETAILED" | "BROAD"
  timezone: string
  notificationsEnabled: boolean
  onEdit: (agenda: AgendaWithCategory) => void
  onDelete: () => void
}

export const AgendaCard = memo(function AgendaCard({ 
  agenda, 
  displayMode, 
  timezone, 
  notificationsEnabled,
  onEdit, 
  onDelete 
}: AgendaCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()
  const confirm = useConfirm()
  const countdown = useAgendaNotification({ 
    agenda, 
    timezone, 
    isEnabled: notificationsEnabled 
  })
  const countdownColor = getCountdownColor(countdown)
  const isUrgent = countdown.totalSeconds > 0 && countdown.totalSeconds <= 3600 // < 1 hour

  const handleToggleComplete = useCallback(async () => {
    setIsLoading(true)
    const result = await toggleAgendaComplete(agenda.id, agenda.userId)
    setIsLoading(false)
    
    if (result.error) {
      showToast(result.error, "error")
    } else {
      showToast(
        agenda.isCompleted ? "Agenda marked as active" : "Agenda completed! 🎉", 
        "success"
      )
    }
  }, [agenda.id, agenda.userId, agenda.isCompleted, showToast])

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: "Delete Agenda",
      message: `Are you sure you want to delete "${agenda.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
    })
    
    if (!confirmed) return
    
    setIsDeleting(true)
    // Small delay for animation
    setTimeout(async () => {
      const result = await deleteAgenda(agenda.id, agenda.userId)
      
      if (result.error) {
        setIsDeleting(false)
        showToast(result.error, "error")
      } else {
        showToast("Agenda deleted", "success")
        onDelete()
      }
    }, 200)
  }, [agenda.id, agenda.userId, agenda.title, confirm, showToast, onDelete])

  const priorityColor = PRIORITY_COLORS[agenda.priority]

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 p-4 transition-all duration-300 hover:shadow-lg animate-slide-in-up ${
        agenda.isCompleted ? "opacity-60" : ""
      } ${isDeleting ? "opacity-0 scale-95" : ""} ${isUrgent && !agenda.isCompleted ? "animate-pulse-subtle" : ""}`}
      style={{ borderLeftColor: priorityColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={agenda.isCompleted}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer touch-target transition-transform active:scale-90"
            aria-label={agenda.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-1 truncate ${
                agenda.isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
              }`}
            >
              {agenda.title}
            </h3>
            {agenda.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{agenda.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Countdown */}
          <div className={`text-xl sm:text-2xl font-bold font-mono ${countdownColor} ${isUrgent && !agenda.isCompleted ? "animate-countdown-urgent" : ""}`}>
            {formatCountdown(countdown, displayMode)}
          </div>

          {/* Category Badge */}
          {agenda.category && (
            <span
              className="px-2 py-1 text-xs font-medium rounded-full text-white whitespace-nowrap"
              style={{ backgroundColor: agenda.category.color }}
            >
              {agenda.category.name}
            </span>
          )}

          {/* Priority Badge */}
          <span
            className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
            style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}
          >
            {agenda.priority}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(agenda)}
            disabled={isLoading}
            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 touch-target"
            title="Edit"
            aria-label="Edit agenda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 touch-target"
            title="Delete"
            aria-label="Delete agenda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Target Date */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Target: {format(new Date(agenda.targetDateTime), "PPpp")}
        </p>
      </div>
    </div>
  )
})
