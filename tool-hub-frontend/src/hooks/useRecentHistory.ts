"use client"

import { useState, useEffect, useCallback } from 'react'

interface HistoryItem {
    path: string
    timestamp: number
}

export function useRecentHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('toolhub_history')
        if (stored) {
            setHistory(JSON.parse(stored))
        }
    }, [])

    const addToHistory = useCallback((path: string) => {
        setHistory(prevHistory => {
            const now = Date.now()
            const newHistory = [
                { path, timestamp: now },
                ...prevHistory.filter(h => h.path !== path)
            ].slice(0, 5) // Keep last 5

            localStorage.setItem('toolhub_history', JSON.stringify(newHistory))
            return newHistory
        })
    }, [])

    return { history, addToHistory }
}
