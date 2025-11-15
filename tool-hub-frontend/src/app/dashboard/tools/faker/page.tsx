"use client"

import { DashboardSidebarResponsive } from '@/components/dashboard-sidebar-responsive'
import { DashboardHeader } from '@/components/dashboard-header'
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { generateFakeData, getFakerTypes } from '@/services/toolsEnhancedService'

export default function FakerPage() {
  const [type, setType] = useState('name')
  const [count, setCount] = useState<number>(5)
  const [locale, setLocale] = useState('pt-BR')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState<string[]>(['name', 'email', 'address', 'phone', 'date', 'company', 'person', 'internet'])
  const [locales, setLocales] = useState<string[]>(['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'])

  useEffect(() => {
    loadTypes()
  }, [])

  const loadTypes = async () => {
    try {
      const data = await getFakerTypes()
      setTypes(data.types)
      setLocales(data.locales)
    } catch {
      console.error('Erro ao carregar tipos')
    }
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      console.log('Gerando dados faker:', { type, count, locale })
      const result = await generateFakeData({ type, count, locale })
      console.log('Resultado faker:', result)
      setOutput(JSON.stringify(result.data, null, 2))
    } catch (error: unknown) {
      console.error('Erro ao gerar dados faker:', error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      setOutput(JSON.stringify({ 
        error: 'Erro ao gerar dados',
        details: err?.response?.data?.message || err?.message || 'Erro desconhecido'
      }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebarResponsive />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Gerador de Dados Falsos</h1>
            <p className="text-gray-600 mt-2">Gere dados fictícios para testes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Dado</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {types.length === 0 ? (
                      <option value="">Carregando...</option>
                    ) : (
                      types.map(t => (
                        <option key={t} value={t}>
                          {t === 'name' && 'Nome'}
                          {t === 'email' && 'E-mail'}
                          {t === 'address' && 'Endereco'}
                          {t === 'phone' && 'Telefone'}
                          {t === 'date' && 'Data'}
                          {t === 'company' && 'Empresa'}
                          {t === 'person' && 'Pessoa Completa'}
                          {t === 'internet' && 'Internet'}
                          {!['name', 'email', 'address', 'phone', 'date', 'company', 'person', 'internet'].includes(t) && t}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade</label>
                  <Input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Locale</label>
                  <select 
                    value={locale} 
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {locales.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? 'Gerando...' : 'Gerar Dados'}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Resultado</h3>
                {output && (
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(output)}
                  >
                    Copiar
                  </Button>
                )}
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {output || 'Clique em "Gerar Dados" para começar'}
              </pre>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
