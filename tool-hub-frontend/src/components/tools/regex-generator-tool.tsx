"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
const REGEX_TEMPLATES = [
    { name: 'Email', pattern: '[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}', description: 'Ex: usuario@dominio.com' },
    { name: 'CPF', pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}', description: 'Formato: 000.000.000-00' },
    { name: 'Data (DD/MM/AAAA)', pattern: '\\d{2}/\\d{2}/\\d{4}', description: 'Ex: 31/12/2023' },
    { name: 'IPv4', pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)', description: 'Ex: 192.168.0.1' },
]

const CHEAT_SHEET = [
    { label: '\\d', desc: 'Dígito (0-9)', value: '\\d' },
    { label: '\\w', desc: 'Caractere de palavra', value: '\\w' },
    { label: '\\s', desc: 'Espaço em branco', value: '\\s' },
    { label: '.', desc: 'Qualquer caractere', value: '.' },
    { label: '^', desc: 'Início da linha', value: '^' },
    { label: '$', desc: 'Fim da linha', value: '$' },
    { label: '[abc]', desc: 'Qualquer um de a, b, c', value: '[]' },
    { label: '(...)', desc: 'Grupo de captura', value: '()' },
    { label: '+', desc: '1 ou mais', value: '+' },
    { label: '*', desc: '0 ou mais', value: '*' },
    { label: '?', desc: '0 ou 1', value: '?' },
]

export function RegexGeneratorTool() {
    const [regex, setRegex] = useState('')
    const [flags, setFlags] = useState({ g: true, i: true, m: false })
    const [testText, setTestText] = useState('Olá, meu email é joseph@admin.com e o outro é test@dev.com.')
    const [replaceText, setReplaceText] = useState('')
    const [showReplace, setShowReplace] = useState(false)
    const [matches, setMatches] = useState<RegExpExecArray[]>([])
    const [error, setError] = useState<string | null>(null)

    const activeFlags = useMemo(() => {
        return (flags.g ? 'g' : '') + (flags.i ? 'i' : '') + (flags.m ? 'm' : '')
    }, [flags])

    useEffect(() => {
        if (!regex) {
            setMatches([])
            setError(null)
            return
        }

        try {
            const re = new RegExp(regex, activeFlags)
            const newMatches: RegExpExecArray[] = []

            if (!flags.g) {
                const match = re.exec(testText)
                if (match) newMatches.push(match)
            } else {
                let match
                // Prevent infinite loop with zero-length matches
                let lastIndex = 0
                while ((match = re.exec(testText)) !== null) {
                    newMatches.push(match)
                    if (re.lastIndex === lastIndex) {
                        re.lastIndex++
                    }
                    lastIndex = re.lastIndex
                }
            }

            setMatches(newMatches)
            setError(null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid regex')
            setMatches([])
        }
    }, [regex, activeFlags, testText, flags.g])

    const highlightedText = useMemo(() => {
        if (!regex || error || matches.length === 0) return testText

        let lastIndex = 0
        const parts = []

        matches.forEach((match, i) => {
            // Text before match
            if (match.index > lastIndex) {
                parts.push(<span key={`text-${i}`}>{testText.slice(lastIndex, match.index)}</span>)
            }

            // Match
            parts.push(
                <span key={`match-${i}`} className="bg-blue-200 text-blue-900 font-semibold border-b-2 border-blue-400" title={`Match ${i + 1}`}>
                    {match[0]}
                </span>
            )

            lastIndex = match.index + match[0].length
        })

        // Remaining text
        if (lastIndex < testText.length) {
            parts.push(<span key="text-end">{testText.slice(lastIndex)}</span>)
        }

        return parts
    }, [testText, matches, regex, error])

    const replacedResult = useMemo(() => {
        if (!regex || error) return testText
        try {
            return testText.replace(new RegExp(regex, activeFlags), replaceText)
        } catch {
            return testText
        }
    }, [testText, regex, activeFlags, replaceText, error])

    const insertAtCursor = (value: string) => {
        // Simple append for now, ideally would insert at cursor position
        setRegex(prev => prev + value)
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Testador de Regex</h1>
                    <p className="text-muted-foreground">Construa, teste e debugue expressões regulares em tempo real</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Main Workspace */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Regex Input Bar */}
                    <Card className="p-4 bg-gray-50/50 border-blue-100">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono text-lg">/</span>
                                <Input
                                    value={regex}
                                    onChange={(e) => setRegex(e.target.value)}
                                    placeholder="Digite sua expressão regular..."
                                    className={`font-mono text-lg h-12 ${error ? 'border-red-500 focus:ring-red-500' : 'border-blue-200 focus:ring-blue-500'}`}
                                />
                                <span className="text-gray-400 font-mono text-lg">/</span>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 h-12">
                                    <button
                                        onClick={() => setFlags(f => ({ ...f, g: !f.g }))}
                                        className={`px-2 py-1 rounded text-sm font-mono font-bold ${flags.g ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Global (g)"
                                    >
                                        g
                                    </button>
                                    <button
                                        onClick={() => setFlags(f => ({ ...f, i: !f.i }))}
                                        className={`px-2 py-1 rounded text-sm font-mono font-bold ${flags.i ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Case Insensitive (i)"
                                    >
                                        i
                                    </button>
                                    <button
                                        onClick={() => setFlags(f => ({ ...f, m: !f.m }))}
                                        className={`px-2 py-1 rounded text-sm font-mono font-bold ${flags.m ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Multiline (m)"
                                    >
                                        m
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Test Area */}
                    <Card className="overflow-hidden">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-2 flex items-center justify-between">
                            <h3 className="font-medium text-sm text-gray-700">Texto de Teste</h3>
                            <div className="text-xs text-gray-500">
                                {matches.length} correspondência{matches.length !== 1 ? 's' : ''} encontrada{matches.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <div className="relative min-h-[200px] font-mono text-base">
                            {/* Highlight Layer */}
                            <div className="absolute inset-0 p-4 whitespace-pre-wrap break-words pointer-events-none text-transparent z-10" aria-hidden="true">
                                {highlightedText}
                            </div>
                            {/* Input Layer */}
                            <textarea
                                value={testText}
                                onChange={(e) => setTestText(e.target.value)}
                                className="w-full h-full min-h-[200px] p-4 bg-transparent border-none focus:ring-0 resize-y font-mono text-gray-800 relative z-20"
                                placeholder="Insira o texto para testar..."
                                spellCheck={false}
                            />
                        </div>
                    </Card>

                    {/* Match Details */}
                    {matches.length > 0 && (
                        <Card>
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-medium text-sm text-gray-700">Detalhes das Correspondências</h3>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-2 space-y-2">
                                {matches.map((match, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md text-sm font-mono">
                                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold mt-0.5">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="text-gray-900 font-medium break-all">{match[0]}</div>
                                            <div className="text-gray-500 text-xs">
                                                Index: {match.index} • Groups: {match.length - 1}
                                            </div>
                                            {match.length > 1 && (
                                                <div className="pl-2 border-l-2 border-gray-200 mt-1 space-y-1">
                                                    {Array.from(match).slice(1).map((group, gIndex) => (
                                                        <div key={gIndex} className="text-xs text-gray-600">
                                                            <span className="text-purple-600 font-bold">$ {gIndex + 1}:</span> {group}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Replacement Panel */}
                    <Card>
                        <button
                            onClick={() => setShowReplace(!showReplace)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2 font-medium text-gray-700">
                                {showReplace ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                Substituição
                            </div>
                        </button>

                        {showReplace && (
                            <div className="p-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Substituir por:</label>
                                    <Input
                                        value={replaceText}
                                        onChange={(e) => setReplaceText(e.target.value)}
                                        placeholder="Ex: $1-oculto"
                                        className="font-mono"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Use $1, $2 para referenciar grupos de captura.</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Resultado</div>
                                    <div className="font-mono text-sm text-gray-800 break-all whitespace-pre-wrap">
                                        {replacedResult}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Cheat Sheet */}
                    <Card>
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-sm">Cheat Sheet</h3>
                        </div>
                        <div className="p-2 grid grid-cols-1 gap-1">
                            {CHEAT_SHEET.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => insertAtCursor(item.value)}
                                    className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-md group text-left transition-colors"
                                    title={item.desc}
                                >
                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 font-bold text-xs group-hover:bg-blue-200 transition-colors">
                                        {item.label}
                                    </code>
                                    <span className="text-xs text-gray-500 truncate ml-2 flex-1">{item.desc}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Templates */}
                    <Card>
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-sm">Modelos</h3>
                        </div>
                        <div className="p-2 space-y-1">
                            {REGEX_TEMPLATES.map((template) => (
                                <button
                                    key={template.name}
                                    onClick={() => setRegex(template.pattern)}
                                    className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium text-sm text-gray-700">{template.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{template.description}</div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
