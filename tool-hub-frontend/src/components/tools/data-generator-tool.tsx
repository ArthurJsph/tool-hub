"use client"

import React, { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, Trash2, RefreshCw, Copy, FileJson, Table, Database } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import { fakerPT_BR as faker } from '@faker-js/faker'

type FieldType = 'uuid' | 'fullName' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'company' | 'jobTitle' | 'datePast' | 'dateFuture' | 'boolean' | 'number' | 'price'

interface SchemaField {
    id: string
    name: string
    type: FieldType
}

const FIELD_TYPES: { value: FieldType; label: string; group: string }[] = [
    { value: 'uuid', label: 'UUID', group: 'ID' },
    { value: 'fullName', label: 'Nome Completo', group: 'Pessoa' },
    { value: 'firstName', label: 'Primeiro Nome', group: 'Pessoa' },
    { value: 'lastName', label: 'Sobrenome', group: 'Pessoa' },
    { value: 'email', label: 'E-mail', group: 'Internet' },
    { value: 'phone', label: 'Telefone', group: 'Contato' },
    { value: 'address', label: 'Endereço Completo', group: 'Localização' },
    { value: 'city', label: 'Cidade', group: 'Localização' },
    { value: 'country', label: 'País', group: 'Localização' },
    { value: 'company', label: 'Empresa', group: 'Negócios' },
    { value: 'jobTitle', label: 'Cargo', group: 'Negócios' },
    { value: 'datePast', label: 'Data (Passado)', group: 'Data' },
    { value: 'dateFuture', label: 'Data (Futuro)', group: 'Data' },
    { value: 'boolean', label: 'Booleano', group: 'Outros' },
    { value: 'number', label: 'Número (0-100)', group: 'Outros' },
    { value: 'price', label: 'Preço', group: 'Comércio' },
]

export function DataGeneratorTool() {
    const { toast } = useToast()
    const [fields, setFields] = useState<SchemaField[]>([
        { id: '1', name: 'id', type: 'uuid' },
        { id: '2', name: 'nome', type: 'fullName' },
        { id: '3', name: 'email', type: 'email' },
        { id: '4', name: 'ativo', type: 'boolean' }
    ])
    const [count, setCount] = useState(10)
    const [format, setFormat] = useState<'json' | 'csv' | 'sql'>('json')
    const [tableName, setTableName] = useState('users')
    const [generatedData, setGeneratedData] = useState('')
    const [loading, setLoading] = useState(false)

    const addField = () => {
        setFields([...fields, { id: crypto.randomUUID(), name: '', type: 'fullName' }])
    }

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
    }

    const updateField = (id: string, key: keyof SchemaField, value: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f))
    }

    const generateValue = (type: FieldType) => {
        switch (type) {
            case 'uuid': return faker.string.uuid()
            case 'fullName': return faker.person.fullName()
            case 'firstName': return faker.person.firstName()
            case 'lastName': return faker.person.lastName()
            case 'email': return faker.internet.email()
            case 'phone': return faker.phone.number()
            case 'address': return faker.location.streetAddress()
            case 'city': return faker.location.city()
            case 'country': return faker.location.country()
            case 'company': return faker.company.name()
            case 'jobTitle': return faker.person.jobTitle()
            case 'datePast': return faker.date.past().toISOString()
            case 'dateFuture': return faker.date.future().toISOString()
            case 'boolean': return faker.datatype.boolean()
            case 'number': return faker.number.int({ min: 0, max: 100 })
            case 'price': return faker.commerce.price()
            default: return ''
        }
    }

    const generateData = async () => {
        setLoading(true)
        try {
            // Generate rows
            const rows = Array.from({ length: count }, () => {
                const row: Record<string, unknown> = {}
                fields.forEach(field => {
                    if (field.name) row[field.name] = generateValue(field.type)
                })
                return row
            })

            let output = ''
            if (format === 'json') {
                output = JSON.stringify(rows, null, 2)
            } else if (format === 'csv') {
                const headers = fields.filter(f => f.name).map(f => f.name).join(',')
                const csvRows = rows.map(row =>
                    fields.filter(f => f.name).map(f => {
                        const val = row[f.name]
                        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
                    }).join(',')
                )
                output = [headers, ...csvRows].join('\n')
            } else if (format === 'sql') {
                const validFields = fields.filter(f => f.name)
                const columns = validFields.map(f => f.name).join(', ')
                const values = rows.map(row => {
                    const rowValues = validFields.map(f => {
                        const val = row[f.name]
                        if (typeof val === 'boolean') return val ? 1 : 0
                        if (typeof val === 'number') return val
                        return `'${String(val).replace(/'/g, "''")}'` // Escape single quotes
                    }).join(', ')
                    return `(${rowValues})`
                }).join(',\n')

                output = `INSERT INTO ${tableName} (${columns}) VALUES\n${values};`
            }

            setGeneratedData(output)
            toast({
                title: "Sucesso",
                description: `${count} registros gerados com sucesso!`,
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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Dados (Mock)</h1>
                <p className="text-gray-600">
                    Crie datasets realistas para testes em JSON, CSV ou SQL
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Configuration Panel */}
                <Card className="lg:col-span-1 p-6 h-fit">
                    <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        Schema Builder
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quantidade</label>
                            <Input
                                type="number"
                                min={1}
                                max={1000}
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Formato</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['json', 'csv', 'sql'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`px-2 py-1.5 text-sm font-medium rounded-md border transition-colors ${format === f
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {format === 'sql' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nome da Tabela</label>
                                <Input
                                    value={tableName}
                                    onChange={(e) => setTableName(e.target.value)}
                                    placeholder="users"
                                />
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Campos</label>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {fields.map((field) => (
                                    <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                value={field.name}
                                                onChange={(e) => updateField(field.id, 'name', e.target.value)}
                                                placeholder="nome_do_campo"
                                                className="h-8 text-sm bg-white"
                                            />
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateField(field.id, 'type', e.target.value as FieldType)}
                                                className="w-full h-8 text-sm px-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            >
                                                {FIELD_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
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
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {format === 'json' && <FileJson className="h-4 w-4 text-orange-500" />}
                            {format === 'csv' && <Table className="h-4 w-4 text-green-500" />}
                            {format === 'sql' && <Database className="h-4 w-4 text-blue-500" />}
                            Resultado
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={!generatedData}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                        <textarea
                            value={generatedData}
                            readOnly
                            className="w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none text-gray-800"
                            placeholder="Os dados gerados aparecerão aqui..."
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
