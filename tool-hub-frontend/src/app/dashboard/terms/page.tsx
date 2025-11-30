"use client"

import React from 'react'
import { Card } from '@/components/Card'

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Termos de Uso e Condições</h1>
                <p className="text-gray-500 mt-4 text-lg">
                    Última atualização: Novembro de 2025
                </p>
            </div>

            <Card className="p-8">
                <div className="prose max-w-none space-y-6 text-gray-700">
                    <p>
                        Bem-vindo ao Tool-Hub. Ao acessar e utilizar nossas ferramentas, você concorda com os termos descritos abaixo.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
                        <p>
                            Ao utilizar nossos serviços, você confirma que leu, entendeu e aceita estes termos. Se você não concordar com qualquer parte, não deverá utilizar nossas ferramentas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso das Ferramentas</h2>
                        <p>
                            O Tool-Hub fornece um conjunto de utilitários digitais para facilitar o dia a dia. Você concorda em usar estas ferramentas apenas para fins legais e éticos. É estritamente proibido:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Tentar violar a segurança do sistema.</li>
                            <li>Utilizar as ferramentas para gerar dados fraudulentos ou prejudiciais a terceiros.</li>
                            <li>Realizar engenharia reversa de qualquer parte da plataforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Isenção de Responsabilidade</h2>
                        <p>
                            Todas as ferramentas são fornecidas &quot;como estão&quot; (as-is), sem garantias de qualquer tipo. Embora nos esforcemos para garantir a precisão dos resultados (como geradores e validadores), o Tool-Hub não se responsabiliza por eventuais erros, imprecisões ou prejuízos decorrentes do uso das informações geradas aqui. O uso dos dados é de inteira responsabilidade do usuário.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Disponibilidade do Serviço</h2>
                        <p>
                            Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer ferramenta a qualquer momento, sem aviso prévio, para manutenções ou atualizações.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contato</h2>
                        <p>
                            Caso tenha dúvidas sobre estes termos ou sobre o uso da plataforma, entre em contato através dos canais oficiais.
                        </p>
                    </section>
                </div>
            </Card>
        </div>
    )
}
