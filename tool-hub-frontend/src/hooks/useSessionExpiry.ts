"use client"

import { useEffect } from 'react'
import { useToast } from '@/providers/ToastProvider'

export function useSessionExpiry() {
  const { toast } = useToast()

  useEffect(() => {
    const handleSessionExpired = () => {
      toast({
        title: "Sessão Expirada",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive"
      })
    }

    // Escuta o evento customizado de sessão expirada
    window.addEventListener('sessionExpired', handleSessionExpired)

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
    }
  }, [toast])
}
