"use client"

import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import {
  Key,
  Shield,
  Hash,
  Binary,
  RefreshCw,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

const tools = [
  {
    title: "Gerador de Senhas",
    description: "Gere senhas fortes e seguras com diferentes configurações",
    icon: Key,
    href: "/dashboard/tools/password-generator",
    status: "Disponível",
    features: ["Comprimento personalizável", "Símbolos opcionais", "Múltiplas senhas"],
  },
  {
    title: "Validador JWT",
    description: "Valide e decodifique tokens JWT",
    icon: Shield,
    href: "/dashboard/tools/jwt-validator",
    status: "Disponível",
    features: ["Validação de assinatura", "Decodificação de payload", "Suporte a algoritmos"],
  },
  {
    title: "Gerador UUID",
    description: "Gere identificadores únicos universais (UUID v4)",
    icon: RefreshCw,
    href: "/dashboard/tools/uuid-generator",
    status: "Disponível",
    features: ["UUID v4", "Múltiplos UUIDs", "Cópia rápida"],
  },
  {
    title: "Base64",
    description: "Codifique e decodifique strings em Base64",
    icon: Binary,
    href: "/dashboard/tools/base64",
    status: "Disponível",
    features: ["Codificação", "Decodificação", "Validação"],
  },
  {
    title: "Gerador Hash",
    description: "Gere hashes criptográficos com diferentes algoritmos",
    icon: Hash,
    href: "/dashboard/tools/hash-generator",
    status: "Disponível",
    features: ["MD5, SHA1, SHA256, SHA512", "BCRYPT", "Comparação de hashes"],
  },
]

export function ToolsContent() {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Ferramentas de Desenvolvedor</h1>
        <p className="text-muted-foreground mt-2">
          Conjunto completo de ferramentas para desenvolvimento e segurança
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <tool.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{tool.title}</h3>
                    <Badge variant="default" className="mt-1">
                      {tool.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-600">
                {tool.description}
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recursos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-blue-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleNavigate(tool.href)}
                >
                  Abrir Ferramenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
