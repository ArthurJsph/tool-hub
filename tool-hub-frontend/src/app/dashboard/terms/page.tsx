"use client"

import React from 'react'
import { Card } from '@/components/Card'
import { Shield, Lock, Server, Globe } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Termos de Uso e Privacidade</h1>
                <p className="text-gray-500 mt-4 text-lg">
                    Compromisso com a segurança e privacidade dos seus dados.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-blue-50 border-blue-100">
                    <div className="p-6">
                        <Shield className="h-8 w-8 text-blue-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processamento Local (Client-Side)</h3>
                        <p className="text-gray-700 leading-relaxed">
                            A maioria das ferramentas disponíveis no Tool Hub (como Gerador de UUID, Base64, Hash, JWT Validator, Regex Tester) executa <strong>inteiramente no seu navegador</strong>.
                        </p>
                        <p className="text-gray-700 mt-2">
                            Isso significa que seus dados sensíveis (senhas, tokens, textos) <strong>nunca deixam o seu dispositivo</strong> e não são enviados para nossos servidores.
                        </p>
                    </div>
                </Card>

                <Card className="bg-green-50 border-green-100">
                    <div className="p-6">
                        <Lock className="h-8 w-8 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Sensíveis</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Nós não armazenamos, logamos ou monitoramos os inputs que você coloca nas ferramentas de criptografia ou segurança.
                        </p>
                        <p className="text-gray-700 mt-2">
                            Ferramentas como o Validador de JWT apenas decodificam o token visualmente usando JavaScript local.
                        </p>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Detalhes Técnicos</h2>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                <Globe className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Ferramentas de Rede (DNS, URL Tester)</h4>
                                <p className="text-gray-600 mt-1">
                                    Ferramentas que requerem acesso à rede externa (como DNS Lookup e URL Tester) utilizam um proxy seguro em nosso backend apenas para contornar restrições de CORS e realizar a consulta. Nós não armazenamos o conteúdo das requisições ou respostas.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                <Server className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Armazenamento Local</h4>
                                <p className="text-gray-600 mt-1">
                                    Utilizamos o <code>localStorage</code> do seu navegador apenas para melhorar sua experiência, salvando:
                                </p>
                                <ul className="list-disc list-inside mt-2 text-gray-600 ml-2 space-y-1">
                                    <li>Histórico de ferramentas visitadas recentemente.</li>
                                    <li>Lista de ferramentas favoritas.</li>
                                    <li>Preferências de tema (Claro/Escuro).</li>
                                </ul>
                                <p className="text-gray-600 mt-2">
                                    Você pode limpar esses dados a qualquer momento na página de Configurações.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>


        </div>
    )
}
