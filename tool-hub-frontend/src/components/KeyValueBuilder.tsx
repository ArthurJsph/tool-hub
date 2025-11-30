"use client"

import React from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react'

export interface KeyValueItem {
    id: string
    key: string
    value: string
    enabled: boolean
}

interface KeyValueBuilderProps {
    items: KeyValueItem[]
    onChange: (items: KeyValueItem[]) => void
    title?: string
}

export function KeyValueBuilder({ items, onChange, title }: KeyValueBuilderProps) {
    const handleAdd = () => {
        onChange([
            ...items,
            { id: crypto.randomUUID(), key: '', value: '', enabled: true }
        ])
    }

    const handleRemove = (id: string) => {
        onChange(items.filter(item => item.id !== id))
    }

    const handleChange = (id: string, field: 'key' | 'value', value: string) => {
        onChange(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ))
    }

    const handleToggle = (id: string) => {
        onChange(items.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        ))
    }

    return (
        <div className="space-y-2">
            {title && <div className="text-sm font-medium text-gray-700">{title}</div>}
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center">
                        <button
                            onClick={() => handleToggle(item.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            {item.enabled ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <Square className="h-4 w-4" />}
                        </button>
                        <Input
                            placeholder="Key"
                            value={item.key}
                            onChange={(e) => handleChange(item.id, 'key', e.target.value)}
                            className={`flex-1 h-9 text-sm ${!item.enabled && 'opacity-50'}`}
                        />
                        <Input
                            placeholder="Value"
                            value={item.value}
                            onChange={(e) => handleChange(item.id, 'value', e.target.value)}
                            className={`flex-1 h-9 text-sm ${!item.enabled && 'opacity-50'}`}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 px-2"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleAdd}
                className="w-full mt-2 border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300"
            >
                <Plus className="h-4 w-4 mr-2" /> Adicionar {title || 'Item'}
            </Button>
        </div>
    )
}
