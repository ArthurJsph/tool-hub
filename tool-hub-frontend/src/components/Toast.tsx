import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  id: string
  title?: string
  description: string
  variant?: 'default' | 'destructive' | 'success'
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const styles = {
    default: 'bg-white border-gray-200 text-gray-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const icons = {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle
  }

  const Icon = icons[variant]

  return (
    <div className={`p-4 border rounded-lg shadow-lg flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right-full ${styles[variant]}`}>
      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm">{title}</h4>}
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToasterProps {
  toasts: Array<{
    id: string
    title?: string
    description: string
    variant?: 'default' | 'destructive' | 'success'
  }>
  onClose: (id: string) => void
}

export function Toaster({ toasts, onClose }: ToasterProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  )
}
