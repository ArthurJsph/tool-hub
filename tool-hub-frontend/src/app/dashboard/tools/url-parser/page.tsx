"use client"

import { DashboardSidebarResponsive } from '@/components/dashboard-sidebar-responsive'
import { DashboardHeader } from '@/components/dashboard-header'
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { parseURL, buildURL } from '@/services/toolsEnhancedService'

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

export default function URLParserPage() {
  const [activeTab, setActiveTab] = useState('parse')
  const [url, setUrl] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  // Build URL states
  const [protocol, setProtocol] = useState('https')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')
  const [path, setPath] = useState('')

  const handleParse = async () => {
    try {
      setLoading(true)
      const result = await parseURL({ url })
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao analisar URL' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleBuild = async () => {
    try {
      setLoading(true)
      const result = await buildURL({
        protocol,
        host,
        port: port ? Number(port) : undefined,
        path
      })
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao construir URL' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'parse', label: 'Parse URL' },
    { id: 'build', label: 'Build URL' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebarResponsive />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Analisador de URL</h1>
            <p className="text-gray-600 mt-2">Decompor e construir URLs</p>
          </div>

          <Card className="p-6">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6 space-y-4">
              {activeTab === 'parse' ? (
                <>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/path?query=value"
                  />
                  <Button onClick={handleParse} disabled={loading || !url}>
                    {loading ? 'Analisando...' : 'Analisar URL'}
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Protocolo</label>
                    <Input
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                      placeholder="https"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Host</label>
                    <Input
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Porta (opcional)</label>
                    <Input
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="443"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Path (opcional)</label>
                    <Input
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      placeholder="/path/to/resource"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={handleBuild} disabled={loading || !host}>
                      {loading ? 'Construindo...' : 'Construir URL'}
                    </Button>
                  </div>
                </div>
              )}

              {output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Resultado</label>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(output)}>
                      Copiar
                    </Button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
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
