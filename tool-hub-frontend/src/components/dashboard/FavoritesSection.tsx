"use client"

import React from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TOOLS } from '@/constants/tools'
import { useFavorites } from '@/hooks/useFavorites'
import { Star, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function FavoritesSection() {
    const { toggleFavorite, isFavorite } = useFavorites()
    const router = useRouter()

    const favoriteTools = TOOLS.filter(tool => isFavorite(tool.path))
    const popularTools = TOOLS.slice(0, 3) // Mock popular tools

    const displayTools = favoriteTools.length > 0 ? favoriteTools : popularTools
    const title = favoriteTools.length > 0 ? "Minhas Ferramentas Favoritas" : "Ferramentas Populares"

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                {favoriteTools.length > 0 ? <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> : <Star className="h-5 w-5 text-gray-400" />}
                {title}
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayTools.map(tool => (
                    <Card key={tool.path} className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <tool.icon className="h-6 w-6" />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFavorite(tool.path)
                                    }}
                                    className="text-gray-300 hover:text-yellow-500 transition-colors"
                                >
                                    <Star className={`h-5 w-5 ${isFavorite(tool.path) ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                                </button>
                            </div>

                            <h4 className="font-semibold text-gray-900 mb-1">{tool.name}</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{tool.description}</p>

                            <Button
                                className="w-full group-hover:bg-blue-600"
                                onClick={() => router.push(tool.path)}
                            >
                                Acessar
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
