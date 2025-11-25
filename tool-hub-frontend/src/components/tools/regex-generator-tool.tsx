"use client"

import React, { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Copy, Check, X } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'

const REGEX_TEMPLATES = [
    { name: 'CPF', pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$', description: 'Formato: 000.000.000-00' },
    { name: 'CNPJ', pattern: '^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$', description: 'Formato: 00.000.000/0000-00' },
    { name: 'Email', pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', description: 'Ex: usuario@dominio.com' },
    { name: 'Telefone (BR)', pattern: '^\\(\\d{2}\\) \\d{4,5}-\\d{4}$', description: 'Ex: (11) 99999-9999' },
    { name: 'Data (DD/MM/AAAA)', pattern: '^\\d{2}/\\d{2}/\\d{4}$', description: 'Ex: 31/12/2023' },
    { name: 'CEP', pattern: '^\\d{5}-\\d{3}$', description: 'Ex: 01001-000' },
    { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', description: 'Ex: 192.168.0.1' },
]

export function RegexGeneratorTool() {
    const [regex, setRegex] = useState('')
    const [testString, setTestString] = useState('')
    const [matchResult, setMatchResult] = useState<boolean | null>(null)

    const { toast } = useToast()

    const handleTest = () => {
        if (!regex) {
            setMatchResult(null)
            return
        }
        try {
            const re = new RegExp(regex)
            setMatchResult(re.test(testString))
        } catch {
            setMatchResult(null)
            toast({
                title: "Erro",
                description: "Expressão Regular inválida",
                variant: "destructive"
            })
        }
    }

    const copyToClipboard = async (text: string) => {
        if (!text) return

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text)
            } else {
                const textArea = document.createElement("textarea")
                textArea.value = text
                textArea.style.position = "fixed"
                textArea.style.left = "-9999px"
                textArea.style.top = "0"
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                textArea.remove()
            }

            toast({
                title: "Copiado!",
                description: "Regex copiado para a área de transferência",
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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Gerador e Testador de Regex</h1>
                <p className="text-muted-foreground">
                    Utilize modelos prontos ou crie e teste suas próprias Expressões Regulares
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Templates Sidebar */}
                <Card className="md:col-span-1">
                    <div className="p-4">
                        <h3 className="font-semibold mb-4 text-foreground">Modelos Prontos</h3>
                        <div className="space-y-2">
                            {REGEX_TEMPLATES.map((template) => (
                                <button
                                    key={template.name}
                                    onClick={() => setRegex(template.pattern)}
                                    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border group"
                                >
                                    <div className="font-medium text-sm text-foreground">{template.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Main Content */}
                <Card className="md:col-span-2">
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Expressão Regular
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={regex}
                                    onChange={(e) => setRegex(e.target.value)}
                                    placeholder="Digite sua regex aqui..."
                                    className="font-mono text-sm"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => copyToClipboard(regex)}
                                    title="Copiar Regex"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Texto para Teste
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={testString}
                                    onChange={(e) => {
                                        setTestString(e.target.value)
                                        setMatchResult(null)
                                    }}
                                    placeholder="Digite um texto para testar..."
                                />
                                <Button onClick={handleTest}>
                                    Testar
                                </Button>
                            </div>
                        </div>

                        {matchResult !== null && (
                            <div className={`p-4 rounded-md flex items-center gap-3 ${matchResult ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {matchResult ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        <span className="font-medium">Corresponde! O texto segue o padrão.</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="h-5 w-5" />
                                        <span className="font-medium">Não corresponde. Verifique o texto ou a regex.</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
