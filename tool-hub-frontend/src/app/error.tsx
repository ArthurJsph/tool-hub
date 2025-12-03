"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error to error reporting service
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Algo deu errado!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Encontramos um erro inesperado ao processar sua solicitação.
          </p>
          
          {error.message && (
            <div className="my-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
          
          {error.digest && (
            <p className="text-xs text-gray-500 mb-6">
              ID do Erro: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button
              onClick={reset}
              variant="primary"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
            
            <Button
              onClick={() => router.push('/dashboard')}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Se o problema persistir, entre em contato com o suporte em{' '}
              <a href="mailto:suporte@toolhub.com" className="text-blue-600 hover:underline">
                suporte@toolhub.com
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
