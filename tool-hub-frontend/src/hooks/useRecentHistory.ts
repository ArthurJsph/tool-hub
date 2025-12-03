"use client"

import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '@/lib/storage'

interface HistoryItem {
    path: string
    timestamp: number
}

export function useRecentHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        const stored = storage.getJSON<HistoryItem[]>(STORAGE_KEYS.HISTORY)
        if (stored) {
            setHistory(stored)
        }
    }, [])

    const addToHistory = useCallback((path: string) => {
        setHistory(prevHistory => {
            const now = Date.now()
            const newHistory = [
                { path, timestamp: now },
                ...prevHistory.filter(h => h.path !== path)
            ].slice(0, 5) // Keep last 5

            storage.setJSON(STORAGE_KEYS.HISTORY, newHistory)
            return newHistory
        })
    }, [])

    return { history, addToHistory }
}
