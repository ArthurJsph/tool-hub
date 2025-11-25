"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { Input } from '@/components/Input'
import { testRegex, replaceRegex, identifyRegex, getRegexPatterns } from '@/services/toolsEnhancedService'

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
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
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

export default function RegexPage() {
  const [activeTab, setActiveTab] = useState('test')
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [replacement, setReplacement] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [patterns, setPatterns] = useState<Record<string, string>>({})

  useEffect(() => {
    loadPatterns()
  }, [])

  const loadPatterns = async () => {
    try {
      const data = await getRegexPatterns()
      setPatterns(data.patterns)
    } catch (err) {
      console.error('Erro ao carregar padrões:', err)
    }
  }

  const handleTest = async () => {
    if (!pattern.trim() || !text.trim()) {
      setOutput(JSON.stringify({ error: 'Pattern e texto sao obrigatorios' }, null, 2))
      return
    }

    try {
      setLoading(true)
      console.log('Testando regex:', { pattern, text })
      const result = await testRegex({ pattern, text })
      console.log('Resultado regex:', result)
      setOutput(JSON.stringify(result, null, 2))
    } catch (error: unknown) {
      console.error('Erro ao testar regex:', error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      setOutput(JSON.stringify({
        error: 'Erro ao testar regex',
        details: err?.response?.data?.message || err?.message || 'Erro desconhecido'
      }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleReplace = async () => {
    try {
      setLoading(true)
      const result = await replaceRegex({ pattern, text, replacement })
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao substituir' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleIdentify = async () => {
    try {
      setLoading(true)
      const result = await identifyRegex({ text })
      setOutput(JSON.stringify(result, null, 2))
    } catch {
      setOutput(JSON.stringify({ error: 'Erro ao identificar' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'test', label: 'Testar' },
    { id: 'replace', label: 'Substituir' },
    { id: 'identify', label: 'Identificar' },
  ]

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Testador de Regex</h1>
        <p className="text-gray-600 mt-2">Teste e valide expressões regulares</p>
      </div>

      <Card className="p-6">
        <SimpleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6 space-y-4">
          {activeTab !== 'identify' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Padrão Regex</label>
                {Object.keys(patterns).length > 0 && (
                  <select
                    onChange={(e) => setPattern(patterns[e.target.value] || '')}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Exemplos...</option>
                    {Object.entries(patterns).map(([key]) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                )}
              </div>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="^[a-zA-Z0-9]+$"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Texto</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto aqui..."
              rows={6}
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-sm font-medium mb-2">Substituição</label>
              <Input
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Texto de substituição"
              />
            </div>
          )}

          <Button
            onClick={() => {
              if (activeTab === 'test') handleTest()
              else if (activeTab === 'replace') handleReplace()
              else handleIdentify()
            }}
            disabled={loading || !text || (activeTab !== 'identify' && !pattern)}
          >
            {loading ? 'Processando...' : activeTab === 'test' ? 'Testar' : activeTab === 'replace' ? 'Substituir' : 'Identificar'}
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
    </>
  )
}
