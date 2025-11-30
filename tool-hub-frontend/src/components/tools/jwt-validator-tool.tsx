"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/Card'

import { Textarea } from '@/components/Textarea'
import { Shield, CheckCircle, XCircle } from 'lucide-react'


export function JwtValidatorTool() {
  const [token, setToken] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [algorithm, setAlgorithm] = useState('HS256')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [decodedHeader, setDecodedHeader] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [decodedPayload, setDecodedPayload] = useState<any>(null)
  const [signatureStatus, setSignatureStatus] = useState<'valid' | 'invalid' | 'unchecked'>('unchecked')
  const [isExpired, setIsExpired] = useState(false)



  // Reactive decoding
  useEffect(() => {
    if (!token) {
      setDecodedHeader(null)
      setDecodedPayload(null)
      setSignatureStatus('unchecked')
      setIsExpired(false)
      return
    }

    try {
      // 1. Sanitize input (remove "Bearer ")
      const cleanToken = token.replace(/^Bearer\s+/i, "").trim()

      const parts = cleanToken.split('.')
      if (parts.length !== 3) {
        // Invalid structure, don't clear if user is typing, just wait
        return
      }

      // 2. Decode Header
      const header = JSON.parse(atob(parts[0]))
      setDecodedHeader(header)

      // 3. Decode Payload
      const payload = JSON.parse(atob(parts[1]))
      setDecodedPayload(payload)

      // 4. Check Expiration
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000)
        setIsExpired(expDate < new Date())
      } else {
        setIsExpired(false)
      }

      // Reset signature status when token changes (requires manual re-verification or auto if secret is present?)
      // For now, let's keep signature check manual or auto if secret is typed
      if (secretKey) {
        verifySignature(cleanToken, secretKey)
      } else {
        setSignatureStatus('unchecked')
      }

    } catch (e) {
      // Silent fail for decoding while typing
      console.error("Decoding error", e)
    }
  }, [token, secretKey])

  const verifySignature = async (jwt: string, secret: string) => {
    if (!secret) {
      setSignatureStatus('unchecked')
      return
    }

    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) return

      const encoder = new TextEncoder()
      const data = encoder.encode(`${parts[0]}.${parts[1]}`)
      const keyData = encoder.encode(secret)

      const key = await window.crypto.subtle.importKey(
        "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      )

      const signature = await window.crypto.subtle.sign("HMAC", key, data)

      // Convert signature to base64url
      const signatureArray = Array.from(new Uint8Array(signature))
      const base64Signature = btoa(String.fromCharCode.apply(null, signatureArray))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      if (base64Signature === parts[2]) {
        setSignatureStatus('valid')
      } else {
        setSignatureStatus('invalid')
      }
    } catch (e) {
      console.error("Verification error", e)
      setSignatureStatus('invalid')
    }
  }



  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('pt-BR')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - INPUT */}
        <div className="space-y-6">
          <Card className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Codificado
                </label>
                <Textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Cole seu token aqui (Bearer ...)"
                  className="min-h-[400px] font-mono text-sm resize-y"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verificar Assinatura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Algoritmo
                    </label>
                    <select
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="HS256">HS256</option>
                      <option value="RS256">RS256</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Chave Secreta
                    </label>
                    <input
                      type="text"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Digite para verificar..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {signatureStatus !== 'unchecked' && (
                  <div className={`flex items-center gap-2 text-sm font-medium ${signatureStatus === 'valid' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {signatureStatus === 'valid' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Assinatura Válida
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Assinatura Inválida
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN - OUTPUT */}
        <div className="space-y-6">
          <Card className="h-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Decoded</h3>
                {isExpired && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Expirado
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Header</h4>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="text-red-600">
                      {decodedHeader ? JSON.stringify(decodedHeader, null, 2) : '// Header'}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payload</h4>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="text-purple-600">
                      {decodedPayload ? JSON.stringify(decodedPayload, null, 2) : '// Payload'}
                    </pre>
                  </div>
                </div>

                {decodedPayload && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Emitido em (iat):</span>
                      <span className="font-medium">{decodedPayload.iat ? formatTime(decodedPayload.iat) : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Expira em (exp):</span>
                      <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                        {decodedPayload.exp ? formatTime(decodedPayload.exp) : '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-500">Verificação</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 font-mono text-sm overflow-x-auto text-blue-600 break-all">
                  HMACSHA256(
                  <br />
                  &nbsp;&nbsp;base64UrlEncode(header) + &quot;.&quot; +
                  <br />
                  &nbsp;&nbsp;base64UrlEncode(payload),
                  <br />
                  &nbsp;&nbsp;<span className="font-bold">your-256-bit-secret</span>
                  <br />
                  )
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        A validação é feita no seu navegador (Client-side). Sua chave secreta e token não são enviados ao servidor.
      </p>
    </div>
  )
}
