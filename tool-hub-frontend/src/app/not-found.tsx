"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Search className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Página Não Encontrada
          </h2>
          
          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <Button
              onClick={() => router.push('/dashboard')}
              variant="primary"
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir para o Dashboard
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Links Populares
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <button
                onClick={() => router.push('/dashboard/tools/password-generator')}
                className="text-blue-600 hover:underline"
              >
                Gerador de Senhas
              </button>
              <button
                onClick={() => router.push('/dashboard/tools/uuid-generator')}
                className="text-blue-600 hover:underline"
              >
                Gerador UUID
              </button>
              <button
                onClick={() => router.push('/dashboard/tools/jwt-validator')}
                className="text-blue-600 hover:underline"
              >
                Validador JWT
              </button>
              <button
                onClick={() => router.push('/dashboard/tools/base64')}
                className="text-blue-600 hover:underline"
              >
                Base64 Converter
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
