"use client"

import React from 'react'
import { Card } from '@/components/Card'
import { TOOLS } from '@/constants/tools'
import { useRecentHistory } from '@/hooks/useRecentHistory'
import { Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function RecentHistorySection() {
    const { history } = useRecentHistory()
    const router = useRouter()

    if (history.length === 0) return null

    return (
        <Card className="h-full">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Atividade Recente
                </h3>

                <div className="space-y-4">
                    {history.slice(0, 3).map((item, index) => {
                        const tool = TOOLS.find(t => t.path === item.path)
                        if (!tool) return null

                        return (
                            <div
                                key={`${item.path}-${index}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => router.push(item.path)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-md text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <tool.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{tool.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
