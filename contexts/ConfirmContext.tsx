"use client"

import { useState, useCallback, createContext, useContext, ReactNode } from "react"

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: "danger" | "primary"
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts)
      setResolver(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const handleConfirm = () => {
    setIsOpen(false)
    resolver?.(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    resolver?.(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <ConfirmModal
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider")
  }
  return context.confirm
}

interface ConfirmModalProps extends ConfirmOptions {
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            confirmVariant === "danger" ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"
          }`}>
            {confirmVariant === "danger" ? (
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
