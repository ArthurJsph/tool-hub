"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"
import { Switch } from "../Switch"
import { Badge } from "../Badge"
import { Key, Copy, RefreshCw } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import apiService from "@/services/api"
import { useToast } from '@/providers/ToastProvider'

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(12)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const generateMutation = useMutation({
    mutationFn: () => apiService.generatePassword({ length, includeSymbols }),
    onSuccess: (data: string) => {
      setPassword(data)
      toast({
        description: "Senha gerada com sucesso!",
      })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erro ao gerar senha"

      toast({
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  const handleGenerate = () => {
    if (length < 4 || length > 128) {
      toast({
        description: "O tamanho da senha deve estar entre 4 e 128 caracteres",
        variant: "destructive",
      })
      return
    }
    generateMutation.mutate()
  }

  const copyToClipboard = async () => {
    if (!password) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(password)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = password
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
        description: "Senha copiada para a área de transferência!",
        variant: "success",
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      toast({
        title: "Erro",
        description: "Erro ao copiar senha",
        variant: "destructive",
      })
    }
  }

  const getPasswordStrength = () => {
    if (length < 8) return { level: "Fraca", color: "danger" }
    if (length < 12) return { level: "Média", color: "warning" }
    if (length >= 16 && includeSymbols) return { level: "Muito Forte", color: "success" }
    return { level: "Forte", color: "success" }
  }

  const strength = getPasswordStrength()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Key className="h-8 w-8 text-blue-600" />
          Gerador de Senhas
        </h1>
        <p className="text-gray-600 mt-2">
          Gere senhas seguras e personalizadas para suas contas
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Ajuste os parâmetros para gerar sua senha ideal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tamanho da senha: {length} caracteres
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            <Switch
              checked={includeSymbols}
              onCheckedChange={setIncludeSymbols}
              label="Incluir símbolos especiais (!@#$%^&*)"
              className="flex items-center justify-between"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Força da senha:</span>
              <Badge variant={strength.color === 'danger' ? 'danger' : strength.color === 'warning' ? 'warning' : 'success'}>
                {strength.level}
              </Badge>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Gerar Senha
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Senha Gerada</CardTitle>
            <CardDescription>
              Sua nova senha segura está pronta para uso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {password ? (
              <>
                <div className="relative">
                  <Input
                    value={password}
                    readOnly
                    className="font-mono text-lg pr-10"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tamanho:</span>
                    <span className="ml-2 font-medium">{password.length} caracteres</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Símbolos:</span>
                    <span className="ml-2 font-medium">{includeSymbols ? "Incluídos" : "Não incluídos"}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Clique em &quot;Gerar Senha&quot; para criar uma nova senha</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Use senhas diferentes para cada conta importante
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Considere usar um gerenciador de senhas
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Senhas com 16+ caracteres são mais seguras
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              Ative a autenticação de dois fatores quando possível
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
