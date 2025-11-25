"use client"

import React, { createContext, useContext } from 'react'
import { useToast as useToastHook } from '@/hooks/use-toast'
import { Toaster } from '@/components/Toast'

interface ToastContextType {
  toast: (options: { title?: string; description: string; variant?: 'default' | 'destructive' | 'success' }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, toasts, removeToast } = useToastHook()

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
