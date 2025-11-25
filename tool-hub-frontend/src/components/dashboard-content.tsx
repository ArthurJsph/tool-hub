"use client"

import { Card } from "@/components/Card"
import { BarChart3, Users, Key, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

export function DashboardContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState([
    {
      title: "Total de Ferramentas",
      value: "5",
      icon: Key,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Usuários Ativos",
      value: "-",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Uso Hoje",
      value: "-",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Sessões Ativas",
      value: "1",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const userCount = await api.getUserCount()
        // Fetch usage today
        const usageToday = await api.getUsageToday()

        setStats(prev => prev.map(stat => {
          if (stat.title === "Usuários Ativos") {
            return { ...stat, value: userCount.toString() }
          }
          if (stat.title === "Uso Hoje") {
            return { ...stat, value: usageToday.toString() }
          }
          return stat
        }))
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Bem-vindo ao Tool Hub, {user?.username}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
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
          <h3 className="text-lg font-semibold mb-4">Acesso Rápido</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/dashboard/tools/password-generator"
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Gerador de Senhas</p>
                  <p className="text-sm text-muted-foreground">Crie senhas seguras</p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/tools/uuid-generator"
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Gerador UUID</p>
                  <p className="text-sm text-muted-foreground">Gere UUIDs únicos</p>
                </div>
              </div>
            </a>

            {user?.role === 'ADMIN' && (
              <a
                href="/dashboard/users"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Gerenciar Usuários</p>
                    <p className="text-sm text-muted-foreground">Administre usuários</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </Card>

      {/* Welcome Message */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Tool Hub!</h3>
          <p className="text-muted-foreground">
            Sua plataforma completa de ferramentas para desenvolvimento.
            Explore as opções do menu lateral para acessar todas as funcionalidades disponíveis.
          </p>
        </div>
      </Card>
    </div>
  )
}
