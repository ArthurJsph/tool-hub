"use client"

import { Card } from "@/components/Card"
import { BarChart3, Users, Key, TrendingUp } from "lucide-react"

export function DashboardContent() {
  const stats = [
    {
      title: "Total de Ferramentas",
      value: "10",
      icon: Key,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Usuarios Ativos",
      value: "0",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Uso Hoje",
      value: "0",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Sessoes Ativas",
      value: "1",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-600">Bem-vindo ao Tool Hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Acesso Rapido</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/dashboard/tools/password-generator"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Gerador de Senhas</p>
                  <p className="text-sm text-gray-500">Crie senhas seguras</p>
                </div>
              </div>
            </a>
            
            <a
              href="/dashboard/tools/uuid-generator"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Gerador UUID</p>
                  <p className="text-sm text-gray-500">Gere UUIDs unicos</p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Gerenciar Usuarios</p>
                  <p className="text-sm text-gray-500">Administre usuarios</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Card>

      {/* Welcome Message */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Tool Hub!</h3>
          <p className="text-gray-600">
            Sua plataforma completa de ferramentas para desenvolvimento. 
            Explore as opcoes do menu lateral para acessar todas as funcionalidades disponiveis.
          </p>
        </div>
      </Card>
    </div>
  )
}
