"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Lightbulb, Newspaper, Activity } from 'lucide-react'

const TIPS = [
    "Use Ctrl+K para buscar ferramentas rapidamente.",
    "Você pode gerar UUIDs sem usar o mouse na ferramenta de UUID.",
    "O Base64 Converter suporta arrastar e soltar arquivos.",
    "O Gerador de Hash suporta múltiplos algoritmos simultaneamente.",
    "Use o Mock Data para gerar SQL INSERTs completos para seus testes."
]

export function InfoCards() {
    const [tip, setTip] = useState("")
    const [toolsUsedCount, setToolsUsedCount] = useState(0)

    useEffect(() => {
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)])

        interface HistoryItem { path: string; timestamp: number }
        const history: HistoryItem[] = JSON.parse(localStorage.getItem('toolhub_history') || '[]')

        // Filter unique tools used today
        const today = new Date().setHours(0, 0, 0, 0)
        const count = new Set(history.filter((h) => h.timestamp > today).map((h) => h.path)).size
        setToolsUsedCount(count)
    }, [])

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold">Atividade Hoje</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">{toolsUsedCount}</p>
                    <p className="text-blue-100 text-sm">Ferramentas utilizadas</p>
                </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold">Dica do Dia</h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                        &quot;{tip}&quot;
                    </p>
                </div>
            </Card>

            <Card className="bg-white border-gray-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Newspaper className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Novidades</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-bold text-green-600">Novo:</span> Testador de Regex
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-blue-600">Update:</span> Validador de URL 2.0
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
