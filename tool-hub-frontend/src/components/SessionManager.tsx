"use client"

import { useSessionExpiry } from '@/hooks/useSessionExpiry'
import { configureMonaco } from '@/lib/monaco'

// Configure Monaco Editor to use local assets
configureMonaco()

export function SessionManager({ children }: { children: React.ReactNode }) {
  useSessionExpiry()

  return <>{children}</>
}
