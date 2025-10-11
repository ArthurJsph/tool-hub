"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'
import { 
  Key, 
  Hash, 
  Binary, 
  Shield, 
  Users
} from 'lucide-react'

export function DashboardContent() {
  const router = useRouter()

  const tools = [
    {
      id: 'password-generator',
      name: 'Gerador de Senhas',
      description: 'Gere senhas seguras e personalizáveis',
      icon: Key,
      status: 'online',
      route: '/dashboard/tools/password-generator'
    },
    {
      id: 'jwt-validator',
      name: 'Validador JWT',
      description: 'Valide e decodifique tokens JWT',
      icon: Shield,
      status: 'online',
      route: '/dashboard/tools/jwt-validator'
    },
    {
      id: 'uuid-generator',
      name: 'Gerador UUID',
      description: 'Gere identificadores únicos universais',
      icon: Hash,
      status: 'online',
      route: '/dashboard/tools/uuid-generator'
    },
    {
      id: 'base64',
      name: 'Base64',
      description: 'Codifique e decodifique strings em Base64',
      icon: Binary,
      status: 'online',
      route: '/dashboard/tools/base64'
    },
    {
      id: 'hash-generator',
      name: 'Gerador de Hash',
      description: 'Gere hashes MD5, SHA1, SHA256, etc.',
      icon: Hash,
      status: 'online',
      route: '/dashboard/tools/hash-generator'
    }
  ]

  const handleNavigate = (route: string) => {
    router.push(route)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao Tool Hub - Suas ferramentas em um só lugar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <Badge variant="success">Online</Badge>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleNavigate(tool.route)}
                >
                  Usar Ferramenta
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades mais usadas</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="secondary" className="justify-start gap-2" onClick={() => handleNavigate("/dashboard/tools/password-generator")}>
            <Key className="h-4 w-4" />
            Gerar Senha
          </Button>
          <Button variant="secondary" className="justify-start gap-2" onClick={() => handleNavigate("/dashboard/tools/uuid-generator")}>
            <Hash className="h-4 w-4" />
            Gerar UUID
          </Button>
          <Button variant="secondary" className="justify-start gap-2" onClick={() => handleNavigate("/dashboard/tools/base64")}>
            <Binary className="h-4 w-4" />
            Base64
          </Button>
          <Button variant="secondary" className="justify-start gap-2" onClick={() => handleNavigate("/dashboard/users")}>
            <Users className="h-4 w-4" />
            Usuários
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
