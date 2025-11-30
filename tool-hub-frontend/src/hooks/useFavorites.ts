"use client"

import { useState, useEffect } from 'react'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('toolhub_favorites')
        if (stored) {
            setFavorites(JSON.parse(stored))
        }
    }, [])

    const toggleFavorite = (path: string) => {
        const newFavorites = favorites.includes(path)
            ? favorites.filter(f => f !== path)
            : [...favorites, path]

        setFavorites(newFavorites)
        localStorage.setItem('toolhub_favorites', JSON.stringify(newFavorites))
    }

    const isFavorite = (path: string) => favorites.includes(path)

    return { favorites, toggleFavorite, isFavorite }
}
