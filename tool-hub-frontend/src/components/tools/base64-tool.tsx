"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Copy, Upload, FileText } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import { copyToClipboard } from '@/lib/clipboard-utils'

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const { toast } = useToast()

  const processInput = useCallback(() => {
    if (file) return // File processing is handled separately

    if (!input) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        // UTF-8 safe encoding
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        // UTF-8 safe decoding
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch {
      // Silent fail for invalid input while typing
      if (mode === 'decode') {
        setOutput('Texto Base64 inválido')
      }
    }
  }, [input, mode, file])

  useEffect(() => {
    const timer = setTimeout(() => {
      processInput()
    }, 100) // Debounce
    return () => clearTimeout(timer)
  }, [processInput])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    setFile(file)
    setMode('encode') // Force encode mode for files
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setInput(file.name) // Just for display
      setOutput(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setFile(null)
  }

  const handleCopy = async (text: string) => {
    if (!text) return
    const success = await copyToClipboard(text)
    if (success) {
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência"
      })
    } else {
      toast({
        title: "Erro",
        description: "Falha ao copiar",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base64 Converter</h1>
          <p className="text-gray-600 text-sm">Codifique e decodifique textos e arquivos em tempo real</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <Button
            variant={mode === 'encode' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setMode('encode'); clearAll(); }}
          >
            Encoder
          </Button>
          <Button
            variant={mode === 'decode' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setMode('decode'); clearAll(); }}
          >
            Decoder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* INPUT AREA */}
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">
              {mode === 'encode' ? 'Entrada (Texto ou Arquivo)' : 'Entrada (Base64)'}
            </h3>
            {input && (
              <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">
                Limpar
              </button>
            )}
          </div>

          <div
            className={`flex-1 relative p-4 transition-colors ${isDragging ? 'bg-blue-50' : 'bg-white'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? "Digite o texto ou arraste um arquivo aqui..." : "Cole a string Base64 aqui..."}
                className="w-full h-full resize-none outline-none text-sm font-mono bg-transparent"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="h-12 w-12 mb-2 text-blue-500" />
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                <button
                  onClick={clearAll}
                  className="mt-4 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs hover:bg-red-100"
                >
                  Remover Arquivo
                </button>
              </div>
            )}

            {/* File Upload Overlay for Drag & Drop */}
            {mode === 'encode' && !file && (
              <div className={`absolute inset-0 pointer-events-none flex items-center justify-center bg-white/80 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                  <p className="text-blue-600 font-medium">Solte o arquivo aqui</p>
                </div>
              </div>
            )}
          </div>

          {mode === 'encode' && !file && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors w-fit">
                <Upload className="h-4 w-4" />
                <span>Carregar arquivo do computador</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </Card>

        {/* OUTPUT AREA */}
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Resultado</h3>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(output)} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>

          <div className="flex-1 p-4 bg-gray-50/50">
            {output ? (
              mode === 'encode' && file && file.type.startsWith('image/') ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center border border-gray-200 rounded-lg bg-white mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={output} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="h-1/3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Data URI</label>
                    <textarea
                      readOnly
                      value={output}
                      className="w-full h-full resize-none text-xs font-mono border border-gray-200 rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={output}
                  className="w-full h-full resize-none outline-none text-sm font-mono bg-transparent text-gray-800"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                O resultado aparecerá aqui...
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
