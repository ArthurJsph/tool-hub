"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useToast } from '@/providers/ToastProvider'
import { testURL } from '@/services/toolsEnhancedService'
import { Globe, Clock, Shield, AlertTriangle, Send } from 'lucide-react'
import { KeyValueBuilder, KeyValueItem } from '@/components/KeyValueBuilder'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'

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
  const [headers, setHeaders] = useState<KeyValueItem[]>([])
  const [params, setParams] = useState<KeyValueItem[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'warning'
    return 'danger'
  }

  // Sync Params with URL (Basic implementation)
  useEffect(() => {
    if (!url) return
    try {
      const urlObj = new URL(url)
      const newParams: KeyValueItem[] = []
      urlObj.searchParams.forEach((value, key) => {
        newParams.push({ id: crypto.randomUUID(), key, value, enabled: true })
      })
      // Only update if different to avoid loop? 
      // For now, let's just use the builder to append to URL on send, 
      // or separate them. The backend takes params separately.
      // Let's keep them separate for the "Builder" feel.
    } catch { }
  }, [url])

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
      // Convert Builders to Objects
      const headersObj = headers.reduce((acc, item) => {
        if (item.enabled && item.key) acc[item.key] = item.value
        return acc
      }, {} as Record<string, string>)

      const paramsObj = params.reduce((acc, item) => {
        if (item.enabled && item.key) acc[item.key] = item.value
        return acc
      }, {} as Record<string, string>)

      const result = await testURL({
        url,
        method,
        headers: headersObj,
        parameters: paramsObj,
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
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 font-mono"
          />
          <Button
            onClick={handleTest}
            disabled={loading || !url}
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Enviando...' : (
              <>
                <Send className="h-4 w-4 mr-2" /> Enviar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Column: Request Config */}
        <Card className="flex flex-col overflow-hidden border-gray-200 shadow-sm">
          <Tabs defaultValue="params" className="flex-1 flex flex-col">
            <div className="border-b px-4 bg-gray-50">
              <TabsList className="bg-transparent p-0 h-12 gap-6">
                <TabsTrigger value="params" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0">Params</TabsTrigger>
                <TabsTrigger value="headers" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0">Headers</TabsTrigger>
                <TabsTrigger value="body" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0">Body</TabsTrigger>
                <TabsTrigger value="auth" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0">Auth</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="params" className="mt-0 space-y-4">
                <div className="text-sm text-gray-500 mb-2">Query Parameters</div>
                <KeyValueBuilder items={params} onChange={setParams} title="Query Params" />
              </TabsContent>

              <TabsContent value="headers" className="mt-0 space-y-4">
                <div className="text-sm text-gray-500 mb-2">HTTP Headers</div>
                <KeyValueBuilder items={headers} onChange={setHeaders} title="Headers" />
              </TabsContent>

              <TabsContent value="body" className="mt-0 h-full flex flex-col">
                <div className="text-sm text-gray-500 mb-2">Request Body (JSON)</div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </TabsContent>

              <TabsContent value="auth" className="mt-0">
                <div className="p-4 text-center text-gray-500 italic">
                  Autenticação simplificada em breve. Use Headers para Authorization.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Right Column: Response */}
        <Card className="flex flex-col overflow-hidden border-gray-200 shadow-sm bg-gray-50/50">
          {testResult ? (
            <div className="flex flex-col h-full">
              {/* Status Bar */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusColor(testResult.statusCode)} className="text-base px-3 py-1">
                    {testResult.statusCode} {testResult.statusText}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {testResult.responseTime}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Blob([testResult.body]).size} bytes
                  </div>
                </div>
                {testResult.security && (
                  <div className="flex items-center gap-2">
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

              {/* Response Body */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs defaultValue="body" className="flex-1 flex flex-col">
                  <div className="border-b px-4 bg-white">
                    <TabsList className="bg-transparent p-0 h-10 gap-4">
                      <TabsTrigger value="body" className="text-xs h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">Body</TabsTrigger>
                      <TabsTrigger value="headers" className="text-xs h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">Headers</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <TabsContent value="body" className="mt-0 h-full">
                      <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-all">
                        {testResult.body || <span className="text-gray-400 italic">Sem conteúdo</span>}
                      </pre>
                    </TabsContent>
                    <TabsContent value="headers" className="mt-0 h-full">
                      <div className="space-y-1">
                        {Object.entries(testResult.headers).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-3 gap-2 text-xs border-b border-gray-100 py-1">
                            <div className="font-semibold text-gray-700">{key}</div>
                            <div className="col-span-2 text-gray-600 font-mono break-all">{formatHeaderValue(value)}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Globe className="h-16 w-16 mb-4 opacity-20" />
              <p>Envie uma requisição para ver a resposta aqui.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
