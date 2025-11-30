"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Button } from "@/components/Button"
import { useToast } from '@/providers/ToastProvider'
import { Copy, RefreshCw } from 'lucide-react'

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false
  })
  const [password, setPassword] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const { toast } = useToast()

  const generatePassword = () => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
      ambiguous: "il1Lo0O"
    }

    let chars = ""
    if (options.uppercase) chars += charset.uppercase
    if (options.lowercase) chars += charset.lowercase
    if (options.numbers) chars += charset.numbers
    if (options.symbols) chars += charset.symbols

    if (options.avoidAmbiguous) {
      // Remove ambiguous characters from the allowed set
      for (const char of charset.ambiguous) {
        chars = chars.split(char).join("")
      }
    }

    if (!chars) {
      toast({
        description: "Selecione pelo menos um tipo de caractere",
        variant: "destructive"
      })
      return
    }

    let newPassword = ""
    const array = new Uint32Array(length)
    window.crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      newPassword += chars[array[i] % chars.length]
    }

    setPassword(newPassword)
    setHistory(prev => [newPassword, ...prev].slice(0, 3))

    toast({
      description: "Senha gerada localmente com sucesso!",
      variant: "default" // Using default variant instead of success if not available
    })
  }

  const copyToClipboard = async (text: string) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência!",
        variant: "default" // Using default/success variant
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

  const calculateStrength = () => {
    let score = 0
    if (length >= 8) score += 1
    if (length >= 12) score += 1
    if (length >= 16) score += 1
    if (options.uppercase && options.lowercase) score += 1
    if (options.numbers) score += 1
    if (options.symbols) score += 1

    if (score < 3) return { label: "Fraca", color: "bg-red-500", width: "33%" }
    if (score < 5) return { label: "Média", color: "bg-yellow-500", width: "66%" }
    return { label: "Forte", color: "bg-green-500", width: "100%" }
  }

  const strength = calculateStrength()

  return (
    <div className="space-y-6">
      {/* Title removed as requested (handled by sidebar/breadcrumb usually, but keeping simple header if needed or removing completely if redundant) */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Personalize sua senha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Tamanho: {length}</label>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="uppercase" className="text-sm text-gray-700">A-Z (Maiúsculas)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="lowercase" className="text-sm text-gray-700">a-z (Minúsculas)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={options.numbers}
                  onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="numbers" className="text-sm text-gray-700">0-9 (Números)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={options.symbols}
                  onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="symbols" className="text-sm text-gray-700">!@# (Símbolos)</label>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="ambiguous"
                checked={options.avoidAmbiguous}
                onChange={(e) => setOptions({ ...options, avoidAmbiguous: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="ambiguous" className="text-sm text-gray-700">Evitar caracteres ambíguos (ex: i, l, 1, 0, o)</label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Força:</span>
                <span className="font-medium text-gray-900">{strength.label}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Senha
            </Button>

            <p className="text-xs text-center text-gray-400">
              Gerado localmente no seu navegador
            </p>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card>
          <CardHeader>
            <CardTitle>Senha Gerada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {password ? (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-center break-all">
                    <span className="font-mono text-2xl text-gray-800 tracking-wider">
                      {password}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(password)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                    title="Copiar senha"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => copyToClipboard(password)}
                  className="w-full"
                  variant="secondary"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Senha
                </Button>

                {history.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Histórico Recente</p>
                    <div className="space-y-2">
                      {history.map((hist, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm group hover:bg-gray-100 transition-colors">
                          <span className="font-mono text-gray-600 truncate max-w-[200px]">{hist}</span>
                          <button
                            onClick={() => copyToClipboard(hist)}
                            className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copiar"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Configure e clique em gerar</p>
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
