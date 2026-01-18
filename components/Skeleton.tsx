"use client"

// Loading Skeleton Components for better UX

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-3 w-32 mt-3" />
    </div>
  )
}

export function AgendaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-gray-300 dark:border-gray-600 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <Skeleton className="w-5 h-5 rounded mt-1" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-9 h-9 rounded-lg" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  )
}

export function AgendaListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AgendaCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* Agenda List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Cards */}
        <AgendaListSkeleton count={3} />
      </div>
    </div>
  )
}
