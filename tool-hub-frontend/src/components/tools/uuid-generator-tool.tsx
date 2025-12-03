"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RefreshCw, Copy, Settings } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import { ulid } from 'ulid'
import { nanoid, customAlphabet } from 'nanoid'

type IdType = 'uuid' | 'ulid' | 'nanoid' | 'pin'

// UUID v4 generator fallback for server-side rendering
function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function UuidGeneratorTool() {
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(5)
  const [type, setType] = useState<IdType>('uuid')
  const [isMounted, setIsMounted] = useState(false)

  // Options
  const [uuidOptions, setUuidOptions] = useState({ hyphens: true, uppercase: false, braces: false, quotes: false })
  const [pinLength, setPinLength] = useState(6)
  const [nanoIdLength, setNanoIdLength] = useState(21)
  const [nanoIdAlphabet, setNanoIdAlphabet] = useState('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-')

  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const generateIds = useCallback(() => {
    if (!isMounted) return
    
    const ids: string[] = []

    for (let i = 0; i < quantity; i++) {
      let id = ''

      switch (type) {
        case 'uuid':
          id = generateUUIDv4()
          if (!uuidOptions.hyphens) id = id.replace(/-/g, '')
          if (uuidOptions.uppercase) id = id.toUpperCase()
          if (uuidOptions.braces) id = `{${id}}`
          if (uuidOptions.quotes) id = `"${id}"`
          break

        case 'ulid':
          id = ulid()
          break

        case 'nanoid':
          if (nanoIdAlphabet !== '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-') {
            const nanoidCustom = customAlphabet(nanoIdAlphabet, nanoIdLength)
            id = nanoidCustom()
          } else {
            id = nanoid(nanoIdLength)
          }
          break

        case 'pin':
          const pinChars = '0123456789'
          const randomValues = new Uint32Array(pinLength)
          if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomValues)
          } else {
            // Fallback for environments without crypto
            for (let j = 0; j < pinLength; j++) {
              randomValues[j] = Math.floor(Math.random() * 10)
            }
          }
          for (let j = 0; j < pinLength; j++) {
            id += pinChars[randomValues[j] % pinChars.length]
          }
          break
      }
      ids.push(id)
    }

    setGeneratedIds(ids)
  }, [isMounted, type, quantity, uuidOptions, pinLength, nanoIdLength, nanoIdAlphabet])

  // Auto-generate on load and when options change
  useEffect(() => {
    generateIds()
  }, [generateIds])

  const copyToClipboard = async (text: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
        variant: "success"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao copiar",
        variant: "destructive"
      })
    }
  }

  const copyAllToClipboard = () => {
    const allIds = generatedIds.join('\n')
    copyToClipboard(allIds)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerador de Identificadores</h1>
          <p className="text-gray-600 text-sm">UUID, ULID, NanoID e PINs seguros</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - CONTROLS */}
        <Card className="lg:col-span-1 h-fit">
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Settings className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Configuração</h2>
            </div>

            {/* Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {(['uuid', 'ulid', 'nanoid', 'pin'] as IdType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-all ${type === t
                      ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {t === 'uuid' && 'UUID v4'}
                    {t === 'ulid' && 'ULID'}
                    {t === 'nanoid' && 'NanoID'}
                    {t === 'pin' && 'PIN / OTP'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">Quantidade</label>
                <span className="text-sm font-mono bg-gray-100 px-2 rounded">{quantity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between gap-2">
                {[1, 5, 10, 50].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Options */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {type === 'uuid' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Formatação</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uuidOptions.hyphens}
                      onChange={(e) => setUuidOptions({ ...uuidOptions, hyphens: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Com Hífens
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uuidOptions.uppercase}
                      onChange={(e) => setUuidOptions({ ...uuidOptions, uppercase: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    MAIÚSCULAS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uuidOptions.braces}
                      onChange={(e) => setUuidOptions({ ...uuidOptions, braces: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Chaves {'{uuid}'}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uuidOptions.quotes}
                      onChange={(e) => setUuidOptions({ ...uuidOptions, quotes: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Aspas &quot;uuid&quot;
                  </label>
                </div>
              )}

              {type === 'pin' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Dígitos: {pinLength}</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={pinLength}
                    onChange={(e) => setPinLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between gap-2">
                    {[4, 6, 8].map(l => (
                      <button
                        key={l}
                        onClick={() => setPinLength(l)}
                        className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {type === 'nanoid' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tamanho: {nanoIdLength}</label>
                    <input
                      type="range"
                      min="5"
                      max="36"
                      value={nanoIdLength}
                      onChange={(e) => setNanoIdLength(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Alfabeto</label>
                    <input
                      type="text"
                      value={nanoIdAlphabet}
                      onChange={(e) => setNanoIdAlphabet(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs font-mono border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {type === 'ulid' && (
                <div className="p-3 bg-blue-50 rounded-md text-xs text-blue-700">
                  ULIDs são ordenáveis lexicograficamente por tempo. Ótimo para chaves de banco de dados.
                </div>
              )}
            </div>

            <Button onClick={generateIds} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Novos
            </Button>
          </div>
        </Card>

        {/* RIGHT COLUMN - RESULTS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">
              {generatedIds.length} resultados gerados
            </span>
            <Button variant="secondary" size="sm" onClick={copyAllToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Todos
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {generatedIds.map((id, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-mono text-gray-800 break-all">{id}</span>
                  <button
                    onClick={() => copyToClipboard(id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copiar"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
