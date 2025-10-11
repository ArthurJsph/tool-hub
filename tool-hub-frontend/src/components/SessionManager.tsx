"use client"

import { useSessionExpiry } from '@/hooks/useSessionExpiry'

export function SessionManager({ children }: { children: React.ReactNode }) {
  useSessionExpiry()
  
  return <>{children}</>
}
