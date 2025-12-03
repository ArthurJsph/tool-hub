"use client"

import { useState, useEffect } from 'react'
import { storage, STORAGE_KEYS } from '@/lib/storage'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const stored = storage.getJSON<string[]>(STORAGE_KEYS.FAVORITES)
        if (stored) {
            setFavorites(stored)
        }
    }, [])

    const toggleFavorite = (path: string) => {
        const newFavorites = favorites.includes(path)
            ? favorites.filter(f => f !== path)
            : [...favorites, path]

        setFavorites(newFavorites)
        storage.setJSON(STORAGE_KEYS.FAVORITES, newFavorites)
    }

    const isFavorite = (path: string) => favorites.includes(path)

    return { favorites, toggleFavorite, isFavorite }
}
