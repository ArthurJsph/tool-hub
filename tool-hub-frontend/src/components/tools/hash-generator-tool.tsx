"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { Hash, Copy, Loader2 } from 'lucide-react'
import toolsService from '@/services/api'
import { useToast } from '@/providers/ToastProvider'

export function HashGeneratorTool() {
  const [inputText, setInputText] = useState('')
  const [algorithm, setAlgorithm] = useState('md5')
  const [hashResult, setHashResult] = useState('')
  
  const { toast } = useToast()

  const hashMutation = useMutation({
    mutationFn: ({ text, algo }: { text: string; algo: string }) => 
      toolsService.generateHash(text, algo),
    onSuccess: (data: string) => {
      setHashResult(data)
      toast({
        title: "Hash gerado!",
        description: `Hash ${algorithm.toUpperCase()} gerado com sucesso`,
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao gerar hash'
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o texto para gerar o hash",
        variant: "destructive"
      })
      return
    }
    hashMutation.mutate({ text: inputText, algo: algorithm })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Hash copiado para a área de transferência"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Hash</h1>
        <p className="text-gray-600">
          Gere hashes MD5, SHA-1, SHA-256 e SHA-512 para seus textos
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Gerar Hash</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto para gerar hash
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite o texto aqui..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algoritmo
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="md5">MD5</option>
                <option value="sha1">SHA-1</option>
                <option value="sha256">SHA-256</option>
                <option value="sha512">SHA-512</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleGenerate}
                disabled={hashMutation.isPending}
                className="flex-1"
              >
                {hashMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Hash className="mr-2 h-4 w-4" />
                )}
                Gerar Hash
              </Button>
              
              {hashResult && (
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(hashResult)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              )}
            </div>

            {hashResult && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hash {algorithm.toUpperCase()}
                </label>
                <Textarea
                  value={hashResult}
                  readOnly
                  className="min-h-[60px] bg-gray-50 font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
