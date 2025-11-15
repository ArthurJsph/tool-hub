"use client"

import { DashboardSidebarResponsive } from '@/components/dashboard-sidebar-responsive'
import { DashboardHeader } from '@/components/dashboard-header'
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { parseJWT, parseJSON, formatJSON } from '@/services/toolsEnhancedService'

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

export default function JSONJWTPage() {
  const [activeTab, setActiveTab] = useState('parse-jwt')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleParseJWT = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await parseJWT({ data: input })
      setOutput(JSON.stringify(result, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar JWT')
    } finally {
      setLoading(false)
    }
  }

  const handleParseJSON = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await parseJSON({ data: input })
      setOutput(JSON.stringify(result, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar JSON')
    } finally {
      setLoading(false)
    }
  }

  const handleFormatJSON = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await formatJSON({ data: input, prettify: true })
      setOutput(result.formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao formatar JSON')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'parse-jwt', label: 'Parse JWT' },
    { id: 'parse-json', label: 'Parse JSON' },
    { id: 'format-json', label: 'Format JSON' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebarResponsive />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">JSON/JWT Parser</h1>
            <p className="text-gray-600 mt-2">Decodifique, valide e formate JSON e JWT</p>
          </div>

          <Card className="p-6">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'parse-jwt' ? 'Token JWT' : 'JSON'}
                </label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === 'parse-jwt'
                      ? 'Cole seu token JWT aqui...'
                      : 'Cole seu JSON aqui...'
                  }
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (activeTab === 'parse-jwt') handleParseJWT()
                    else if (activeTab === 'parse-json') handleParseJSON()
                    else handleFormatJSON()
                  }}
                  disabled={loading || !input}
                >
                  {loading ? 'Processando...' : 'Processar'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setInput('')
                    setOutput('')
                    setError('')
                  }}
                >
                  Limpar
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {output && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resultado
                    </label>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(output)
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                  <Textarea
                    value={output}
                    readOnly
                    rows={15}
                    className="font-mono text-sm bg-gray-50"
                  />
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Parse JWT</h3>
              <p className="text-sm text-gray-600">
                Decodifica um token JWT em header, payload e signature
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Parse JSON</h3>
              <p className="text-sm text-gray-600">
                Valida e parseia uma string JSON
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Format JSON</h3>
              <p className="text-sm text-gray-600">
                Formata e embeleza uma string JSON
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
