"use client"

import { DashboardSidebarResponsive } from '@/components/dashboard-sidebar-responsive'
import { DashboardHeader } from '@/components/dashboard-header'
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { testURL, checkURLSecurity } from '@/services/toolsEnhancedService'

interface SimpleTab {
  id: string
  label: string
}

interface SimpleTabsProps {
  tabs: SimpleTab[]
  activeTab: string
  onChange: (id: string) => void
}

function SimpleTabs({ tabs, activeTab, onChange }: SimpleTabsProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function URLTesterPage() {
  const [activeTab, setActiveTab] = useState('test')
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    try {
      setLoading(true)
      let parsedHeaders: Record<string, string> = {}
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers)
        } catch {
          setOutput(JSON.stringify({ error: 'Headers deve ser um JSON válido' }, null, 2))
          return
        }
      }

      const result = await testURL({
        url,
        method,
        headers: parsedHeaders,
        body: body.trim() || undefined
      })
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao testar URL' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleSecurity = async () => {
    try {
      setLoading(true)
      const result = await checkURLSecurity(url)
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao verificar segurança' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'test', label: 'Testar URL' },
    { id: 'security', label: 'Verificar Segurança' },
  ]

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebarResponsive />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Testador de URL</h1>
            <p className="text-gray-600 mt-2">Teste URLs e verifique sua segurança</p>
          </div>

          <Card className="p-6">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/api/endpoint"
                />
              </div>

              {activeTab === 'test' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Método HTTP</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {methods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
                    <Input
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      placeholder='{"Content-Type": "application/json"}'
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Body</label>
                    <Input
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Request body (opcional)"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={activeTab === 'test' ? handleTest : handleSecurity}
                disabled={loading || !url}
              >
                {loading ? 'Processando...' : activeTab === 'test' ? 'Testar URL' : 'Verificar Segurança'}
              </Button>

              {output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Resultado</label>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(output)}>
                      Copiar
                    </Button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
