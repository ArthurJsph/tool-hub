"use client"

import React from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Trash2, Moon, Sun } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'

export default function SettingsPage() {
    const { toast } = useToast()

    const clearHistory = () => {
        localStorage.removeItem('toolhub_history')
        localStorage.removeItem('toolhub_favorites') // Optional, maybe separate?
        toast({
            title: "Histórico Limpo",
            description: "Seu histórico de ferramentas foi apagado.",
            variant: "default"
        })
        // Force reload to update UI components that rely on localStorage
        window.location.reload()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-500 mt-2">Gerencie suas preferências e dados locais.</p>
            </div>

            <Card>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Dados de Navegação</h3>
                            <p className="text-sm text-gray-500">Limpe o histórico de ferramentas recentes e favoritos salvos neste navegador.</p>
                        </div>
                        <Button variant="danger" onClick={clearHistory}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Limpar Histórico
                        </Button>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Aparência</h3>
                                <p className="text-sm text-gray-500">Escolha o tema da interface (Em breve).</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" disabled>
                                    <Sun className="h-4 w-4 mr-2" />
                                    Claro
                                </Button>
                                <Button variant="secondary" disabled>
                                    <Moon className="h-4 w-4 mr-2" />
                                    Escuro
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sobre</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Versão:</strong> 2.2.0</p>
                        <p><strong>Ambiente:</strong> Produção</p>
                        <p><strong>Contato:</strong> suporte@toolhub.com</p>
                    </div>
                </div>
            </Card>

            <Card className="border-destructive/50">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-destructive mb-4">Zona de Perigo</h3>
                    <p className="text-sm text-gray-500 mb-6">Ações irreversíveis que afetam sua conta.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-medium text-gray-900">Desativar Conta</h3>
                            <p className="text-sm text-gray-500">Isso irá desativar sua conta permanentemente e remover seus dados.</p>
                        </div>
                        <Button variant="danger" onClick={() => { }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Desativar Conta
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
