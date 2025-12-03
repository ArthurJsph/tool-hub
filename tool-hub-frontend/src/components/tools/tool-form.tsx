"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { Select } from '@/components/Select'
import { Switch } from '@/components/Switch'
import { X } from 'lucide-react'
import { ToolDTO, CreateToolRequest, UpdateToolRequest } from '@/types/tools'

interface ToolFormProps {
  tool?: ToolDTO | null
  onSubmit: (data: CreateToolRequest | UpdateToolRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const AVAILABLE_ICONS = [
  'Key', 'FileText', 'Hash', 'Database', 'Shield', 'Lock', 'Link', 'Code', 'Search',
  'Settings', 'Tool', 'Wrench', 'Zap', 'Globe', 'Terminal', 'Package', 'Layers'
]

const ICON_OPTIONS = AVAILABLE_ICONS.map(icon => ({ value: icon, label: icon }))

export function ToolForm({ tool, onSubmit, onCancel, isLoading = false }: ToolFormProps) {
  const [formData, setFormData] = useState<CreateToolRequest>({
    name: '',
    description: '',
    path: '',
    icon: 'Tool',
    keywords: [],
    enabled: true,
    order: 0
  })
  
  const [keywordInput, setKeywordInput] = useState('')

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        description: tool.description,
        path: tool.path,
        icon: tool.icon,
        keywords: tool.keywords,
        enabled: tool.enabled,
        order: tool.order
      })
    }
  }, [tool])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      })
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    })
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {tool ? 'Editar Ferramenta' : 'Nova Ferramenta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Ferramenta
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Gerador UUID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caminho (Path)
              </label>
              <Input
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                placeholder="/dashboard/tools/uuid-generator"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição breve da ferramenta"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <Select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                options={ICON_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordem
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                min={0}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavras-chave
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addKeyword()
                  }
                }}
                placeholder="Adicionar palavra-chave"
              />
              <Button type="button" onClick={addKeyword} variant="secondary">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map(keyword => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ferramenta Ativa
              </label>
              <p className="text-xs text-gray-500">
                Desative para ocultar a ferramenta da sidebar
              </p>
            </div>
            <Switch
              checked={formData.enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: !!checked })}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : (tool ? 'Atualizar' : 'Criar')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
