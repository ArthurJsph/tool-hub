"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RefreshCw, Copy, Loader2, Settings } from 'lucide-react'
import toolsService from '@/services/api'
import { useToast } from '@/providers/ToastProvider'


type IdType = 'uuid' | 'numeric' | 'alphanumeric'

export function UuidGeneratorTool() {
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [type, setType] = useState<IdType>('uuid')
  const [length, setLength] = useState(16)

  const { toast } = useToast()

  const generateIds = async () => {
    const ids: string[] = []

    if (type === 'uuid') {
      // Use backend for UUID to verify connectivity, or could use crypto.randomUUID()
      for (let i = 0; i < quantity; i++) {
        const uuid = await toolsService.generateUUID()
        ids.push(uuid)
      }
    } else {
      // Local generation for other types
      const chars = type === 'numeric'
        ? '0123456789'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < quantity; i++) {
        let result = ''
        const randomValues = new Uint32Array(length)
        crypto.getRandomValues(randomValues)

        for (let j = 0; j < length; j++) {
          result += chars[randomValues[j] % chars.length]
        }
        ids.push(result)
      }
    }
    return ids
  }

  const generateMutation = useMutation({
    mutationFn: generateIds,
    onSuccess: (data: string[]) => {
      setGeneratedIds(data)
      toast({
        title: "Gerado com sucesso!",
        description: `${data.length} identificador(es) gerado(s)`,
        variant: "success"
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erro ao gerar identificadores'
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const handleGenerate = () => {
    if (quantity < 1 || quantity > 100) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade entre 1 e 100",
        variant: "destructive"
      })
      return
    }
    generateMutation.mutate()
  }

  const copyToClipboard = async (text: string) => {
    if (!text) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-9999px"
        textArea.style.top = "0"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }

      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
        variant: "success"
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      toast({
        title: "Erro",
        description: "Falha ao copiar. Tente selecionar e copiar manualmente.",
        variant: "destructive"
      })
    }
  }

  const copyAllToClipboard = () => {
    const allIds = generatedIds.join('\n')
    copyToClipboard(allIds)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Identificadores</h1>
        <p className="text-muted-foreground">
          Gere UUIDs, IDs numéricos e strings aleatórias seguras
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Configurações</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Identificador
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IdType)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="uuid">UUID v4</option>
                <option value="numeric">Numérico</option>
                <option value="alphanumeric">Alfanumérico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantidade (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {type !== 'uuid' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tamanho (Caracteres)
                </label>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>4</span>
                  <span className="font-medium text-primary">{length}</span>
                  <span>64</span>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Gerar {type === 'uuid' ? 'UUIDs' : 'Identificadores'}
          </Button>

          {generatedIds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">
                  Resultados ({generatedIds.length})
                </h3>
                <Button
                  variant="secondary"
                  onClick={copyAllToClipboard}
                  size="sm"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Todos
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {generatedIds.map((id, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border group hover:border-primary/50 transition-colors"
                  >
                    <span className="font-mono text-sm text-foreground break-all">{id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
