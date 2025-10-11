"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { Binary, Copy, Loader2, ArrowRightLeft } from 'lucide-react'
import toolsService from '@/services/api'
import { useToast } from '@/providers/ToastProvider'

export function Base64Tool() {
  const [inputText, setInputText] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [encodedResult, setEncodedResult] = useState('')
  const [decodedResult, setDecodedResult] = useState('')
  const [activeTab, setActiveTab] = useState('encode')
  
  const { toast } = useToast()

  const encodeMutation = useMutation({
    mutationFn: (input: string) => toolsService.encodeBase64(input),
    onSuccess: (data: string) => {
      setEncodedResult(data)
      toast({
        title: "Codificado!",
        description: "Texto codificado em Base64 com sucesso",
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao codificar'
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const decodeMutation = useMutation({
    mutationFn: (input: string) => toolsService.decodeBase64(input),
    onSuccess: (data: string) => {
      setDecodedResult(data)
      toast({
        title: "Decodificado!",
        description: "Base64 decodificado com sucesso",
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao decodificar'
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const handleEncode = () => {
    if (!inputText.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o texto para codificar",
        variant: "destructive"
      })
      return
    }
    encodeMutation.mutate(inputText)
  }

  const handleDecode = () => {
    if (!base64Input.trim()) {
      toast({
        title: "Campo obrigatório", 
        description: "Por favor, insira o Base64 para decodificar",
        variant: "destructive"
      })
      return
    }
    decodeMutation.mutate(base64Input)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Codificador/Decodificador Base64</h1>
        <p className="text-gray-600">
          Converta texto para Base64 e vice-versa com facilidade
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('encode')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'encode' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Codificar
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'decode' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Decodificar
          </button>
        </div>
      </div>

      {/* Encode Tab */}
      {activeTab === 'encode' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Binary className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Codificar para Base64</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Digite o texto que você deseja codificar em Base64
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto para codificar
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Digite o texto aqui..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleEncode}
                  disabled={encodeMutation.isPending}
                  className="flex-1"
                >
                  {encodeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                  )}
                  Codificar
                </Button>
                
                {encodedResult && (
                  <Button
                    variant="secondary"
                    onClick={() => copyToClipboard(encodedResult)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                )}
              </div>

              {encodedResult && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resultado (Base64)
                  </label>
                  <Textarea
                    value={encodedResult}
                    readOnly
                    className="min-h-[120px] bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Decode Tab */}
      {activeTab === 'decode' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Binary className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Decodificar Base64</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Digite o código Base64 que você deseja decodificar
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base64 para decodificar
                </label>
                <Textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="Cole o código Base64 aqui..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleDecode}
                  disabled={decodeMutation.isPending}
                  className="flex-1"
                >
                  {decodeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                  )}
                  Decodificar
                </Button>
                
                {decodedResult && (
                  <Button
                    variant="secondary"
                    onClick={() => copyToClipboard(decodedResult)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                )}
              </div>

              {decodedResult && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resultado (Texto)
                  </label>
                  <Textarea
                    value={decodedResult}
                    readOnly
                    className="min-h-[120px] bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
