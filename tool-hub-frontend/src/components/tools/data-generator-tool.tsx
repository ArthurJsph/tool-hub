"use client"

import React, { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, Trash2, RefreshCw, Copy, FileJson, FileText, Table } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import { generateFakeData } from '@/services/toolsEnhancedService'

type FieldType = 'name' | 'email' | 'phone' | 'address' | 'date' | 'company' | 'internet' | 'uuid'

interface SchemaField {
    id: string
    name: string
    type: FieldType
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Telefone' },
    { value: 'address', label: 'Endereço' },
    { value: 'date', label: 'Data' },
    { value: 'company', label: 'Empresa' },
    { value: 'internet', label: 'Internet' },
]

export function DataGeneratorTool() {
    const { toast } = useToast()
    const [fields, setFields] = useState<SchemaField[]>([
        { id: '1', name: 'id', type: 'uuid' },
        { id: '2', name: 'nome', type: 'name' },
        { id: '3', name: 'email', type: 'email' }
    ])
    const [count, setCount] = useState(10)
    const [format, setFormat] = useState<'json' | 'csv' | 'yaml'>('json')
    const [generatedData, setGeneratedData] = useState('')
    const [loading, setLoading] = useState(false)

    const addField = () => {
        setFields([...fields, { id: crypto.randomUUID(), name: '', type: 'name' }])
    }

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
    }

    const updateField = (id: string, key: keyof SchemaField, value: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f))
    }

    const generateData = async () => {
        setLoading(true)
        try {
            // Generate data for each field
            const promises = fields.map(async (field) => {
                if (field.type === 'uuid') {
                    // Generate UUIDs locally to save backend calls if possible, 
                    // or just use the service if it supports it.
                    // For now, let's use a simple local generator for UUIDs to be fast
                    const data = Array.from({ length: count }, () => crypto.randomUUID())
                    return { name: field.name, data }
                }

                // For other types, use the service (or local faker if available)
                // Assuming generateFakeData takes type and count
                const response = await generateFakeData({ type: field.type, count })
                return { name: field.name, data: response.data }
            })

            const results = await Promise.all(promises)

            // Pivot data: columns to rows
            const rows = Array.from({ length: count }, (_, rowIndex) => {
                const row: Record<string, unknown> = {}
                results.forEach(col => {
                    row[col.name] = col.data[rowIndex]
                })
                return row
            })

            // Format output
            let output = ''
            if (format === 'json') {
                output = JSON.stringify(rows, null, 2)
            } else if (format === 'csv') {
                const headers = fields.map(f => f.name).join(',')
                const csvRows = rows.map(row =>
                    fields.map(f => JSON.stringify(row[f.name])).join(',')
                )
                output = [headers, ...csvRows].join('\n')
            } else if (format === 'yaml') {
                output = rows.map(row => {
                    return '- ' + Object.entries(row).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n  ')
                }).join('\n')
            }

            setGeneratedData(output)
            toast({
                title: "Sucesso",
                description: "Dados gerados com sucesso!",
                variant: "success"
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Erro",
                description: "Falha ao gerar dados",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = async () => {
        if (!generatedData) return
        try {
            await navigator.clipboard.writeText(generatedData)
            toast({
                title: "Copiado!",
                description: "Dados copiados para a área de transferência",
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

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Dados</h1>
                <p className="text-muted-foreground">
                    Crie datasets personalizados em JSON, CSV ou YAML para seus testes
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Configuration Panel */}
                <Card className="lg:col-span-1 p-6 h-fit">
                    <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        Estrutura dos Dados
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Quantidade de Registros</label>
                            <Input
                                type="number"
                                min={1}
                                max={1000}
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Formato de Saída</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={format === 'json' ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setFormat('json')}
                                    className="w-full"
                                >
                                    JSON
                                </Button>
                                <Button
                                    variant={format === 'csv' ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setFormat('csv')}
                                    className="w-full"
                                >
                                    CSV
                                </Button>
                                <Button
                                    variant={format === 'yaml' ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setFormat('yaml')}
                                    className="w-full"
                                >
                                    YAML
                                </Button>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <label className="text-sm font-medium text-foreground mb-2 block">Campos</label>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {fields.map((field) => (
                                    <div key={field.id} className="flex gap-2 items-start bg-muted/30 p-2 rounded-md">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                value={field.name}
                                                onChange={(e) => updateField(field.id, 'name', e.target.value)}
                                                placeholder="Nome do campo"
                                                className="h-8 text-sm"
                                            />
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateField(field.id, 'type', e.target.value as FieldType)}
                                                className="w-full h-8 text-sm px-2 bg-background border border-input rounded-md"
                                            >
                                                <option value="uuid">UUID</option>
                                                {FIELD_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeField(field.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={addField}
                                className="w-full mt-3"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Campo
                            </Button>
                        </div>

                        <Button
                            onClick={generateData}
                            disabled={loading}
                            className="w-full mt-4"
                        >
                            {loading ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Gerar Dados
                        </Button>
                    </div>
                </Card>

                {/* Output Panel */}
                <Card className="lg:col-span-2 p-6 flex flex-col h-[600px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {format === 'json' && <FileJson className="h-4 w-4" />}
                            {format === 'csv' && <Table className="h-4 w-4" />}
                            {format === 'yaml' && <FileText className="h-4 w-4" />}
                            Resultado
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={!generatedData}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative border border-border rounded-md bg-muted/20 overflow-hidden">
                        <textarea
                            value={generatedData}
                            readOnly
                            className="w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
                            placeholder="Os dados gerados aparecerão aqui..."
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
