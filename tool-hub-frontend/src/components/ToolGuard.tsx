"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toolService } from "@/services/toolService"


interface ToolGuardProps {
    children: React.ReactNode
    toolKey: string
}

export function ToolGuard({ children, toolKey }: ToolGuardProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const checkToolStatus = async () => {
            try {
                const activeTools = await toolService.getActiveTools()
                const isActive = activeTools.some(tool => tool.key === toolKey)
                if (isActive) {
                    setIsAuthorized(true)
                } else {
                    setIsAuthorized(false)
                    setIsAuthorized(false)
                    // Simple alert for now as requested for pure tailwind approach
                    // alert("Acesso Negado: Esta ferramenta está desativada no momento.")
                    router.push("/dashboard")
                    router.push("/dashboard")
                }
            } catch (error) {
                console.error("Failed to check tool status", error)
                setIsAuthorized(false) // Fail safe
            }
        }

        checkToolStatus()
    }, [toolKey, router])

    if (isAuthorized === null) {
        return <div className="p-8 text-center">Verificando disponibilidade...</div>
    }

    if (!isAuthorized) {
        return null // Or a custom "Access Denied" component
    }

    return <>{children}</>
}
