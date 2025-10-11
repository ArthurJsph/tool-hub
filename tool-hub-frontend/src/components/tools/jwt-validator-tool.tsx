"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { Shield, Copy, Loader2, CheckCircle } from 'lucide-react'
import toolsService from '@/services/api'
import { useToast } from '@/providers/ToastProvider'

export function JwtValidatorTool() {
  const [token, setToken] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [algorithm, setAlgorithm] = useState('HS256')
  const [validationResult, setValidationResult] = useState<string | null>(null)
  
  const { toast } = useToast()

  const validateMutation = useMutation({
    mutationFn: ({ jwt }: { jwt: string; secret: string; algo: string }) => 
      toolsService.validateJWT(jwt, algorithm),
    onSuccess: (data: string) => {
      setValidationResult(data)
      toast({
        title: "JWT processado!",
        description: "Token JWT processado com sucesso",
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao validar JWT'
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    }
  })

  const handleValidate = () => {
    if (!token.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o token JWT",
        variant: "destructive"
      })
      return
    }
    validateMutation.mutate({ jwt: token, secret: secretKey, algo: algorithm })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Validador JWT</h1>
        <p className="text-gray-600">
          Valide e decodifique tokens JWT com verificação de assinatura
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Validar Token JWT</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token JWT
              </label>
              <Textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole o token JWT aqui..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave secreta (opcional)
                </label>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Digite a chave secreta..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <option value="HS256">HS256</option>
                  <option value="HS384">HS384</option>
                  <option value="HS512">HS512</option>
                  <option value="RS256">RS256</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={handleValidate}
              disabled={validateMutation.isPending}
              className="w-full"
            >
              {validateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Validar JWT
            </Button>

            {validationResult && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50 text-blue-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    JWT processado
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resultado
                    </label>
                    <Button
                      variant="secondary"
                      onClick={() => copyToClipboard(validationResult)}
                      className="text-xs"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copiar
                    </Button>
                  </div>
                  <Textarea
                    value={validationResult}
                    readOnly
                    className="min-h-[200px] bg-gray-50 font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
