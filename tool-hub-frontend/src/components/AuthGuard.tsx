"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/providers/ToastProvider'
import { useRecentHistory } from '@/hooks/useRecentHistory'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()

    const { addToHistory } = useRecentHistory()

    useEffect(() => {
        if (isLoading) return

        // Track history for tools
        if (pathname.startsWith('/dashboard/tools/')) {
            addToHistory(pathname)
        }

        // Define protected routes and required roles
        const protectedRoutes = [
            { path: '/dashboard/users', role: 'ADMIN' }
        ]

        const restrictedRoute = protectedRoutes.find(route => pathname.startsWith(route.path))

        if (restrictedRoute) {
            if (!user || user.role !== restrictedRoute.role) {
                // Show notification
                toast({
                    title: "Acesso Negado",
                    description: "Você não possui permissão para acessar essa área.",
                    variant: "destructive"
                })

                // Redirect back or to dashboard
                if (window.history.length > 1) {
                    router.back()
                } else {
                    router.push('/dashboard')
                }
            }
        }
    }, [user, isLoading, pathname, router, toast, addToHistory])

    return <>{children}</>
}
