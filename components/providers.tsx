"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { ConfirmProvider } from "@/contexts/ConfirmContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
