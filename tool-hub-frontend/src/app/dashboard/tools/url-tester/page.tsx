"use client"

import React, { useState } from 'react'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useToast } from '@/providers/ToastProvider'
import { testURL } from '@/services/toolsEnhancedService'
import { Globe, Clock, Shield, AlertTriangle } from 'lucide-react'

interface TestResult {
  statusCode: number
  statusText: string
  responseTime: string
  headers: Record<string, string | string[]>
  body: string
  security?: {
    isHttps: boolean
  }
}

export default function URLTesterPage() {
  const { toast } = useToast()
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [activeTab, setActiveTab] = useState('body')

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'warning'
    return 'danger'
  }

  const handleTest = async () => {
    if (!url) {
      toast({
        title: "Erro",
        description: "URL é obrigatória",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      let parsedHeaders = {}
      if (headers) {
        try {
          parsedHeaders = JSON.parse(headers)
        } catch {
          toast({
            title: "Erro",
            description: "Headers deve ser um JSON válido",
            variant: "destructive"
          })
          return
        }
      }

      const result = await testURL({
        url,
        method,
        headers: parsedHeaders,
        body: body.trim() || undefined
      })
      setTestResult(result as TestResult)
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao testar URL",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatHeaderValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Testador de URL</h1>
        <p className="text-muted-foreground mt-2">Teste endpoints e verifique respostas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 p-6 h-fit">
          <h3 className="font-semibold mb-4 text-foreground">Configuração da Requisição</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/v1/users"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Método</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {methods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                className="w-full px-3 py-2 bg-background border border-input rounded-md min-h-[100px] font-mono text-sm"
              />
            </div>

            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <div>
                <label className="block text-sm font-medium mb-2">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full px-3 py-2 bg-background border border-input rounded-md min-h-[100px] font-mono text-sm"
                />
              </div>
            )}

            <Button
              onClick={handleTest}
              disabled={loading || !url}
              className="w-full"
            >
              {loading ? 'Enviando Requisição...' : 'Enviar Requisição'}
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 flex flex-col h-full min-h-[500px]">
          <h3 className="font-semibold mb-4 text-foreground">Resposta</h3>

          {testResult ? (
            <div className="space-y-6">
              {/* Status Bar */}
              <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(testResult.statusCode)}>
                    {testResult.statusCode} {testResult.statusText}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{testResult.responseTime}</span>
                </div>
                {testResult.security && (
                  <div className="flex items-center gap-2 ml-auto">
                    {testResult.security.isHttps ? (
                      <Badge variant="success" className="gap-1">
                        <Shield className="h-3 w-3" /> HTTPS
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> HTTP
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Tabs for Body/Headers */}
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-border">
                  <button
                    onClick={() => setActiveTab('body')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Body
                  </button>
                  <button
                    onClick={() => setActiveTab('headers')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'headers' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Headers
                  </button>
                </div>

                {activeTab === 'body' ? (
                  <div className="relative">
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px] text-xs font-mono border border-border">
                      {testResult.body || <span className="text-muted-foreground italic">Sem conteúdo</span>}
                    </pre>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2">Header</th>
                          <th className="px-4 py-2">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(testResult.headers).map(([key, value]) => (
                          <tr key={key} className="border-b border-border last:border-0">
                            <td className="px-4 py-2 font-medium">{key}</td>
                            <td className="px-4 py-2 font-mono text-muted-foreground break-all">
                              {formatHeaderValue(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Globe className="h-16 w-16 mb-4" />
              <p>Envie uma requisição para ver os resultados</p>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
