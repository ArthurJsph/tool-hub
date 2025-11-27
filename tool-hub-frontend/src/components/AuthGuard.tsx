"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/providers/ToastProvider'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()

    useEffect(() => {
        if (isLoading) return

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
    }, [user, isLoading, pathname, router, toast])

    return <>{children}</>
}
