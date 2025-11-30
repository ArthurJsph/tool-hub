"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { Globe, Search, Server, Activity } from "lucide-react"
import api from "@/services/api"
import { useToast } from "@/providers/ToastProvider"

import { DnsResult } from "@/types/tools"

export default function DnsLookupPage() {
    const [domain, setDomain] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<DnsResult | null>(null)
    const { toast } = useToast()

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!domain) return

        setLoading(true)
        setResults(null)

        try {
            const data = await api.dnsLookup(domain)
            setResults(data)
        } catch (error) {
            console.error("DNS Lookup error:", error)
            toast({
                title: "Erro",
                description: "Falha ao realizar lookup DNS.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">DNS Lookup</h1>
                <p className="text-muted-foreground">
                    Verifique registros DNS (A, MX) de um domínio.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Consultar Domínio</CardTitle>
                    <CardDescription>Digite o domínio para buscar informações.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLookup} className="flex gap-4">
                        <Input
                            placeholder="exemplo.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Activity className="animate-spin h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            Consultar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {results && (
                <div className="grid gap-6 md:grid-cols-2 animate-slide-up">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Registros A (IPv4)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {results.A && results.A.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {results.A.map((ip: string, index: number) => (
                                        <li key={index} className="font-mono text-sm">{ip}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum registro encontrado.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="h-5 w-5 text-accent" />
                                Registros MX (Email)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {results.MX && results.MX.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {results.MX.map((mx: string, index: number) => (
                                        <li key={index} className="font-mono text-sm break-all">{mx}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum registro encontrado.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-600" />
                                Registros NS (Nameservers)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {results.NS && results.NS.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {results.NS.map((ns: string, index: number) => (
                                        <li key={index} className="font-mono text-sm break-all">{ns}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum registro encontrado.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-orange-600" />
                                Registros TXT
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {results.TXT && results.TXT.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {results.TXT.map((txt: string, index: number) => (
                                        <li key={index} className="font-mono text-sm break-all">{txt}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum registro encontrado.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
