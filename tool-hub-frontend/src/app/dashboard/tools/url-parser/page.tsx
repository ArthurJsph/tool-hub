"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Badge } from '@/components/Badge'
import { Copy, Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import queryString from 'query-string'

interface QueryParam {
    id: string
    key: string
    value: string
    active: boolean
}

export default function URLParserPage() {
    const [url, setUrl] = useState('')
    const [protocol, setProtocol] = useState('https:')
    const [host, setHost] = useState('')
    const [path, setPath] = useState('')
    const [hash, setHash] = useState('')
    const [queryParams, setQueryParams] = useState<QueryParam[]>([])

    const { toast } = useToast()

    // Parse URL when input changes
    const parseUrl = useCallback((inputUrl: string) => {
        try {
            // Add protocol if missing for parsing
            let urlToParse = inputUrl
            if (!inputUrl.match(/^([a-z]+:)?\/\//i)) {
                urlToParse = 'https://' + inputUrl
            }

            const parsed = new URL(urlToParse)

            setProtocol(parsed.protocol)
            setHost(parsed.host)
            setPath(parsed.pathname)
            setHash(parsed.hash)

            // Parse query params
            const params = queryString.parse(parsed.search)
            const newParams: QueryParam[] = []

            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        newParams.push({
                            id: crypto.randomUUID(),
                            key,
                            value: v || '',
                            active: true
                        })
                    })
                } else {
                    newParams.push({
                        id: crypto.randomUUID(),
                        key,
                        value: value as string || '',
                        active: true
                    })
                }
            })

            setQueryParams(newParams)
        } catch {
            // Invalid URL, just update state without parsing components
        }
    }, [])

    // Rebuild URL when components change
    const buildUrl = useCallback(() => {
        try {
            const activeParams: Record<string, string | string[]> = {}
            queryParams.forEach(p => {
                if (!p.active || !p.key) return

                if (p.key in activeParams) {
                    const current = activeParams[p.key]
                    if (Array.isArray(current)) {
                        current.push(p.value)
                    } else {
                        activeParams[p.key] = [current as string, p.value]
                    }
                } else {
                    activeParams[p.key] = p.value
                }
            })

            const stringifiedParams = queryString.stringify(activeParams)
            const search = stringifiedParams ? `?${stringifiedParams}` : ''

            // Ensure protocol has slashes
            const cleanProtocol = protocol.endsWith('//') ? protocol : `${protocol}//`
            // Remove leading slash from host if present (rare)
            const cleanHost = host.replace(/^\//, '')
            // Ensure path starts with slash
            const cleanPath = path.startsWith('/') ? path : `/${path}`

            const newUrl = `${cleanProtocol}${cleanHost}${cleanPath}${search}${hash}`
            setUrl(newUrl)
        } catch (e) {
            console.error(e)
        }
    }, [protocol, host, path, hash, queryParams])

    // Handle URL Input Change


    // Handle Component Changes (Trigger Build)
    useEffect(() => {
        // We need to debounce or check source of change to avoid loops
        // For simplicity, we'll use a separate effect that only runs when components change
        // But we need to avoid overwriting URL if the change came from URL input
        // This is tricky. Let's use a "lastUpdated" ref or similar?
        // Actually, since we parse on URL change, we can just build here.
        // But if we type in URL, it parses -> updates components -> builds URL -> updates URL.
        // This loop is fine if the build result matches the input.
        // To avoid cursor jumping, we might need to be careful.
        // For now, let's trigger build only when user interacts with components.
    }, [])



    // Effect to rebuild URL when components change
    // We need to skip this if the change came from parseUrl
    // We can use a flag
    const [isParsing, setIsParsing] = useState(false)

    useEffect(() => {
        if (!isParsing) {
            buildUrl()
        }
        setIsParsing(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [protocol, host, path, hash, queryParams, buildUrl])

    // Wrap parseUrl to set flag
    const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value
        setUrl(newUrl)
        setIsParsing(true)
        parseUrl(newUrl)
    }

    const addParam = () => {
        setQueryParams([...queryParams, { id: crypto.randomUUID(), key: '', value: '', active: true }])
    }

    const removeParam = (id: string) => {
        setQueryParams(queryParams.filter(p => p.id !== id))
    }

    const updateParam = (id: string, field: keyof QueryParam, value: string | boolean) => {
        setQueryParams(queryParams.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copiado!",
            description: "Conteúdo copiado para a área de transferência",
            variant: "success"
        })
    }

    const decodeUrl = () => {
        try {
            const decoded = decodeURIComponent(url)
            setUrl(decoded)
            setIsParsing(true)
            parseUrl(decoded)
        } catch {
            toast({ title: "Erro", description: "Falha ao decodificar URL", variant: "destructive" })
        }
    }

    const encodeUrl = () => {
        try {
            const encoded = encodeURIComponent(url)
            setUrl(encoded)
        } catch {
            toast({ title: "Erro", description: "Falha ao codificar URL", variant: "destructive" })
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analisador de URL</h1>
                <p className="text-gray-600 mt-2">Edite parâmetros, caminhos e hosts com facilidade</p>
            </div>

            <Card className="p-6">
                <div className="space-y-6">
                    {/* Main URL Input */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                value={url}
                                onChange={handleUrlInput}
                                placeholder="https://example.com/path?query=value"
                                className="pr-10 font-mono text-sm"
                            />
                            {url && (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                        <Button variant="secondary" onClick={() => copyToClipboard(url)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex gap-2 text-sm">
                        <button onClick={decodeUrl} className="text-blue-600 hover:underline">Decodificar URL</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={encodeUrl} className="text-blue-600 hover:underline">Codificar URL</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-gray-100">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Protocolo</label>
                            <select
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                                className="w-full h-9 px-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="https:">https://</option>
                                <option value="http:">http://</option>
                                <option value="ftp:">ftp://</option>
                                <option value="ws:">ws://</option>
                                <option value="wss:">wss://</option>
                            </select>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Host</label>
                            <Input
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                placeholder="example.com"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="md:col-span-6">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Caminho (Path)</label>
                            <Input
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                placeholder="/api/users"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Query Params */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Parâmetros de Consulta (Query Params)
                        </h3>
                        <Badge variant="default">{queryParams.filter(p => p.active).length}</Badge>
                    </div>

                    <div className="space-y-3">
                        {queryParams.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                Nenhum parâmetro na URL
                            </div>
                        ) : (
                            queryParams.map((param) => (
                                <div key={param.id} className={`flex gap-2 items-center group ${!param.active ? 'opacity-50' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={param.active}
                                        onChange={(e) => updateParam(param.id, 'active', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Input
                                        value={param.key}
                                        onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                                        placeholder="Chave"
                                        className="flex-1 h-9 text-sm"
                                    />
                                    <span className="text-gray-400">=</span>
                                    <Input
                                        value={param.value}
                                        onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                                        placeholder="Valor"
                                        className="flex-1 h-9 text-sm"
                                    />
                                    <button
                                        onClick={() => removeParam(param.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={addParam}
                            className="w-full mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Parâmetro
                        </Button>
                    </div>
                </Card>

                {/* Hash Fragment */}
                <Card className="lg:col-span-1 p-6 h-fit">
                    <h3 className="font-semibold text-gray-900 mb-4">Fragmento (Hash)</h3>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        <span className="text-gray-400 font-bold">#</span>
                        <input
                            value={hash.replace(/^#/, '')}
                            onChange={(e) => setHash(e.target.value ? `#${e.target.value}` : '')}
                            placeholder="section-id"
                            className="bg-transparent border-none focus:outline-none w-full text-sm"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
