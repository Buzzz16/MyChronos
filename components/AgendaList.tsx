"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Agenda, Category, Priority } from "@prisma/client"
import { AgendaCard } from "./AgendaCard"
import { CreateAgendaModal } from "./CreateAgendaModal"
import { EditAgendaModal } from "./EditAgendaModal"

type AgendaWithCategory = Agenda & { category: Category | null }

interface AgendaListProps {
  agendas: AgendaWithCategory[]
  categories: Category[]
  userId: string
  displayMode: "DETAILED" | "BROAD"
  timezone: string
  notificationsEnabled: boolean
  // Optional props for external control of create modal
  onOpenCreateModal?: () => void
  showCreateModal?: boolean
  onCloseCreateModal?: () => void
}

export function AgendaList({
  agendas,
  categories,
  userId,
  displayMode,
  timezone,
  notificationsEnabled,
  onOpenCreateModal,
  showCreateModal,
  onCloseCreateModal,
}: AgendaListProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false)
  const [editingAgenda, setEditingAgenda] = useState<AgendaWithCategory | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterPriority, setFilterPriority] = useState<Priority | "">("")
  const [showCompleted, setShowCompleted] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "priority">("date")

  // Use external control if provided, otherwise use internal state
  const isCreateModalOpen = showCreateModal !== undefined ? showCreateModal : internalModalOpen
  const handleOpenCreateModal = useCallback(() => {
    if (onOpenCreateModal) {
      onOpenCreateModal()
    } else {
      setInternalModalOpen(true)
    }
  }, [onOpenCreateModal])
  
  const handleCloseCreateModal = useCallback(() => {
    if (onCloseCreateModal) {
      onCloseCreateModal()
    } else {
      setInternalModalOpen(false)
    }
  }, [onCloseCreateModal])

  // Memoized filtered and sorted agendas for performance
  const filteredAgendas = useMemo(() => {
    let result = agendas.filter((agenda) => {
      if (!showCompleted && agenda.isCompleted) return false
      if (filterCategory && agenda.categoryId !== filterCategory) return false
      if (filterPriority && agenda.priority !== filterPriority) return false
      return true
    })

    // Sort agendas
    if (sortBy === "date") {
      result.sort((a, b) => 
        new Date(a.targetDateTime).getTime() - new Date(b.targetDateTime).getTime()
      )
    } else {
      const priorityOrder: Record<Priority, number> = {
        URGENT: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      }
      result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    }
    
    return result
  }, [agendas, showCompleted, filterCategory, filterPriority, sortBy])

  const activeCount = useMemo(() => agendas.filter((a) => !a.isCompleted).length, [agendas])
  const completedCount = useMemo(() => agendas.filter((a) => a.isCompleted).length, [agendas])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">My Agendas</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {activeCount} active • {completedCount} completed • {100 - agendas.length} slots remaining
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          disabled={agendas.length >= 100}
          className="hidden md:flex px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2 touch-target active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Agenda
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white touch-target"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | "")}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white touch-target"
            aria-label="Filter by priority"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "priority")}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white touch-target"
            aria-label="Sort agendas"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>

          {/* Show Completed Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 cursor-pointer touch-target">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Show completed</span>
          </label>

          {/* Clear Filters */}
          {(filterCategory || filterPriority) && (
            <button
              onClick={() => {
                setFilterCategory("")
                setFilterPriority("")
              }}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Agenda Cards */}
      {filteredAgendas.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            {agendas.length === 0
              ? "No agendas yet"
              : "No agendas match your filters"}
          </p>
          <button
            onClick={handleOpenCreateModal}
            disabled={agendas.length >= 100}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 touch-target"
          >
            Create your first agenda
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {filteredAgendas.map((agenda, index) => (
            <div key={agenda.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <AgendaCard
                agenda={agenda}
                displayMode={displayMode}
                timezone={timezone}
                notificationsEnabled={notificationsEnabled}
                onEdit={setEditingAgenda}
                onDelete={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateAgendaModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        userId={userId}
        categories={categories}
        timezone={timezone}
      />

      <EditAgendaModal
        isOpen={!!editingAgenda}
        onClose={() => setEditingAgenda(null)}
        agenda={editingAgenda}
        userId={userId}
        categories={categories}
      />
    </div>
  )
}
