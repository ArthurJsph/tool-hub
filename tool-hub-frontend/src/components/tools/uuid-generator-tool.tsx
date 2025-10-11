"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RefreshCw, Copy, Loader2 } from 'lucide-react'
import toolsService from '@/services/api'
import { useToast } from '@/providers/ToastProvider'

export function UuidGeneratorTool() {
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  
  const { toast } = useToast()

  const generateMutation = useMutation({
    mutationFn: async () => {
      const uuids = []
      for (let i = 0; i < quantity; i++) {
        const uuid = await toolsService.generateUUID()
        uuids.push(uuid)
      }
      return uuids
    },
    onSuccess: (data: string[]) => {
      setGeneratedUuids(data)
      toast({
        title: "UUIDs gerados!",
        description: `${data.length} UUID(s) gerado(s) com sucesso`,
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao gerar UUIDs'
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
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "UUID copiado para a área de transferência"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive"
      })
    }
  }

  const copyAllToClipboard = async () => {
    try {
      const allUuids = generatedUuids.join('\n')
      await navigator.clipboard.writeText(allUuids)
      toast({
        title: "Copiado!",
        description: "Todos os UUIDs copiados para a área de transferência"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de UUID</h1>
        <p className="text-gray-600">
          Gere identificadores únicos universais (UUID v4) seguros
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Gerar UUIDs</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de UUIDs (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              Gerar UUIDs
            </Button>

            {generatedUuids.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    UUIDs Gerados ({generatedUuids.length})
                  </h3>
                  <Button
                    variant="secondary"
                    onClick={copyAllToClipboard}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Todos
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generatedUuids.map((uuid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                    >
                      <span className="font-mono text-sm text-gray-800">{uuid}</span>
                      <Button
                        variant="secondary"
                        onClick={() => copyToClipboard(uuid)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
