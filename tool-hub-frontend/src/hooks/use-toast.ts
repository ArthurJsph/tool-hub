import { useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type }
    
    setToasts(prev => [...prev, toast])
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((options: { title?: string; description: string; variant?: 'default' | 'destructive' }) => {
    const type = options.variant === 'destructive' ? 'error' : 'info'
    addToast(options.description, type)
  }, [addToast])

  return { toast, toasts, removeToast }
}

export type { Toast }