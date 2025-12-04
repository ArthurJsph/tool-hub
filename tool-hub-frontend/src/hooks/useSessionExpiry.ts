"use client"

import { useEffect } from 'react'
import { useToast } from '@/providers/ToastProvider'
import { usePathname } from 'next/navigation'

export function useSessionExpiry() {
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      // Don't show session expired message if we're already on the auth page
      if (pathname === '/auth' || pathname === '/') return

      const customEvent = event as CustomEvent<{ message?: string }>
      const message = customEvent.detail?.message || "Sua sessão expirou. Por favor, faça login novamente."
      toast({
        title: "Sessão Expirada",
        description: message,
        variant: "destructive"
      })
    }

    const handleAccessDenied = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>
      const message = customEvent.detail?.message || "Acesso negado"
      toast({
        title: "Acesso Negado",
        description: message,
        variant: "destructive"
      })
    }

    const handleNetworkError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>
      const message = customEvent.detail?.message || "Erro de conexão. Verifique sua internet."
      toast({
        title: "Erro de Conexão",
        description: message,
        variant: "destructive"
      })
    }

    // Escuta os eventos customizados
    window.addEventListener('sessionExpired', handleSessionExpired)
    window.addEventListener('accessDenied', handleAccessDenied)
    window.addEventListener('networkError', handleNetworkError)

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
      window.removeEventListener('accessDenied', handleAccessDenied)
      window.removeEventListener('networkError', handleNetworkError)
    }
  }, [toast, pathname])
}
