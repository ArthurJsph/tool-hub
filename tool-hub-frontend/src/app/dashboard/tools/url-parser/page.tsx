"use client"

import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { parseURL, buildURL, ParseURLResponse } from '@/services/toolsEnhancedService'
import { Badge } from '@/components/Badge'
import { Copy } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'

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
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
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
    const [parsedResult, setParsedResult] = useState<ParseURLResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    // Build URL states
    const [protocol, setProtocol] = useState('https')
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')
    const [path, setPath] = useState('')

    const handleParse = async () => {
        if (!url.trim()) return

        try {
            setLoading(true)
            const result = await parseURL({ url })
            setParsedResult(result)
        } catch {
            toast({
                title: "Erro",
                description: "Falha ao analisar URL",
                variant: "destructive"
            })
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
            setUrl(result.url)
            setActiveTab('parse')
            // Auto parse the built URL
            const parseResult = await parseURL({ url: result.url })
            setParsedResult(parseResult)
        } catch {
            toast({
                title: "Erro",
                description: "Falha ao construir URL",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copiado!",
            description: "Conteúdo copiado para a área de transferência",
            variant: "success"
        })
    }

    const tabs = [
        { id: 'parse', label: 'Analisar URL' },
        { id: 'build', label: 'Construir URL' },
    ]

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analisador de URL</h1>
                <p className="text-muted-foreground mt-2">Decompor e construir URLs complexas</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-3 p-6">
                    <SimpleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="mt-6 space-y-6">
                        {activeTab === 'parse' ? (
                            <div className="flex gap-2">
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/path?query=value"
                                    className="flex-1"
                                />
                                <Button onClick={handleParse} disabled={loading || !url}>
                                    {loading ? 'Analisando...' : 'Analisar'}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-2">Protocolo</label>
                                    <select
                                        value={protocol}
                                        onChange={(e) => setProtocol(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                                    >
                                        <option value="https">https</option>
                                        <option value="http">http</option>
                                        <option value="ftp">ftp</option>
                                        <option value="ws">ws</option>
                                        <option value="wss">wss</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Host</label>
                                    <Input
                                        value={host}
                                        onChange={(e) => setHost(e.target.value)}
                                        placeholder="example.com"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-2">Porta</label>
                                    <Input
                                        value={port}
                                        onChange={(e) => setPort(e.target.value)}
                                        placeholder="443"
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-sm font-medium mb-2">Caminho (Path)</label>
                                    <Input
                                        value={path}
                                        onChange={(e) => setPath(e.target.value)}
                                        placeholder="/api/v1/resource"
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <Button onClick={handleBuild} disabled={loading || !host} className="w-full">
                                        {loading ? 'Construindo...' : 'Construir e Analisar'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {parsedResult && (
                    <>
                        {/* Overview Card Removed temporarily to fix build error */}

                        {/* Query Params Card */}
                        <Card className="lg:col-span-2 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Parâmetros de Consulta</h3>
                                <Badge variant="default">{Object.keys(parsedResult.parameters || {}).length}</Badge>
                            </div>

                            {Object.keys(parsedResult.parameters || {}).length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-2">Parâmetro</th>
                                                <th className="px-4 py-2">Valor</th>
                                                <th className="px-4 py-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(parsedResult.parameters || {}).map(([k, v]) => (
                                                <tr key={k} className="border-b border-border last:border-0">
                                                    <td className="px-4 py-2 font-medium">{k}</td>
                                                    <td className="px-4 py-2 font-mono text-muted-foreground break-all">{v}</td>
                                                    <td className="px-4 py-2">
                                                        <button onClick={() => copyToClipboard(Array.isArray(v) ? v.join(',') : v)} className="text-muted-foreground hover:text-primary">
                                                            <Copy className="h-3 w-3" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum parâmetro encontrado
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </>
    )
}
