"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/Card'
import { Textarea } from '@/components/Textarea'
import { Copy, Upload, FileText, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import CryptoJS from 'crypto-js'

export function HashGeneratorTool() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '' })
  const [compareHash, setCompareHash] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const { toast } = useToast()

  const calculateHashes = useCallback((text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
      return
    }
    setHashes({
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString()
    })
  }, [])

  useEffect(() => {
    if (!file) {
      calculateHashes(input)
    }
  }, [input, file, calculateHashes])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    setFile(file)
    setInput(file.name) // Display filename

    const reader = new FileReader()
    reader.onload = (e) => {
      const binary = e.target?.result
      if (binary) {
        // Convert to WordArray for CryptoJS
        const wordArray = CryptoJS.lib.WordArray.create(binary as ArrayBuffer)
        setHashes({
          md5: CryptoJS.MD5(wordArray).toString(),
          sha1: CryptoJS.SHA1(wordArray).toString(),
          sha256: CryptoJS.SHA256(wordArray).toString(),
          sha512: CryptoJS.SHA512(wordArray).toString()
        })
      }
    }
    reader.readAsArrayBuffer(file)
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
    setFile(null)
    setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
    setCompareHash('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Hash copiado para a área de transferência"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao copiar",
        variant: "destructive"
      })
    }
  }

  const checkMatch = (hash: string) => {
    if (!compareHash) return null
    return hash.toLowerCase() === compareHash.toLowerCase().trim()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Hash</h1>
        <p className="text-gray-600">
          Gere e compare hashes MD5, SHA-1, SHA-256 e SHA-512 simultaneamente
        </p>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          {/* INPUT AREA */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Entrada (Texto ou Arquivo)
                </label>
                {(input || file) && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Limpar
                  </button>
                )}
              </div>

              {!file ? (
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite seu texto aqui ou arraste um arquivo..."
                  className="min-h-[100px] border-none shadow-none focus-visible:ring-0 p-0 resize-none"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md text-blue-700">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-xs opacity-75">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Upload className="h-3 w-3" />
                <span>Arraste um arquivo ou</span>
                <label className="text-blue-600 hover:underline cursor-pointer">
                  clique para selecionar
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          {/* COMPARATOR */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comparar com Hash (Opcional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={compareHash}
                  onChange={(e) => setCompareHash(e.target.value)}
                  placeholder="Cole um hash aqui para verificar..."
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {compareHash && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {Object.values(hashes).some(h => h.toLowerCase() === compareHash.toLowerCase().trim()) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RESULTS TABLE */}
          {hashes.md5 && (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-24">Algoritmo</th>
                    <th className="px-4 py-3">Hash</th>
                    <th className="px-4 py-3 w-20 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(hashes).map(([algo, hash]) => {
                    const isMatch = checkMatch(hash)
                    return (
                      <tr
                        key={algo}
                        className={`transition-colors ${isMatch ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-700 uppercase">{algo}</td>
                        <td className="px-4 py-3 font-mono text-gray-600 break-all">
                          {hash}
                          {isMatch && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">MATCH</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => copyToClipboard(hash)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copiar"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
