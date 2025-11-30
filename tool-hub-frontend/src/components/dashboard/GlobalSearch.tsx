"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TOOLS } from '@/constants/tools'

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const filteredTools = TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    )

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
                setTimeout(() => inputRef.current?.focus(), 100)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleSelect = (path: string) => {
        router.push(path)
        setIsOpen(false)
        setQuery('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % filteredTools.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredTools[selectedIndex]) {
                handleSelect(filteredTools[selectedIndex].path)
            }
        }
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-8">
            <div
                className="relative group cursor-text"
                onClick={() => {
                    setIsOpen(true)
                    setTimeout(() => inputRef.current?.focus(), 100)
                }}
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                    placeholder="O que você quer fazer hoje? (ex: UUID, JWT, Base64...)"
                    readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">
                        Ctrl + K
                    </span>
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-0 left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400 ml-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 py-2 px-2 text-sm outline-none text-gray-800 placeholder-gray-400"
                                placeholder="Buscar ferramenta..."
                                value={query}
                                onChange={e => {
                                    setQuery(e.target.value)
                                    setSelectedIndex(0)
                                }}
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 px-2">
                                ESC
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {filteredTools.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    Nenhuma ferramenta encontrada.
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTools.map((tool, index) => (
                                        <button
                                            key={tool.path}
                                            onClick={() => handleSelect(tool.path)}
                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-colors ${index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{tool.name}</div>
                                                <div className={`text-xs ${index === selectedIndex ? 'text-blue-500' : 'text-gray-500'}`}>
                                                    {tool.description}
                                                </div>
                                            </div>
                                            <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${index === selectedIndex ? 'opacity-100' : ''
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
