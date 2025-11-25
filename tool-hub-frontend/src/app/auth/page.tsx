"use client"

import type React from "react"

import { useState } from "react"
import { Code2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/providers/ToastProvider"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot">("login")
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("login-email") as string
    const password = formData.get("login-password") as string

    try {
      await login({ username: email, password })

      toast({
        title: "Login realizado!",
        description: "Você será redirecionado para o dashboard",
      })

      // Redirecionar para dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("signup-name") as string
    const email = formData.get("signup-email") as string
    const password = formData.get("signup-password") as string
    const confirmPassword = formData.get("signup-confirm") as string

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          passwordHash: password,
          role: "USER",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar conta")
      }

      toast({
        title: "Conta criada!",
        description: "Faça login para continuar",
      })

      // Mudar para a aba de login
      setActiveTab("login")
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação - implementar recuperação de senha no backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada",
    })

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col space-y-6 px-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-xl p-3">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-balance">Tool-hub</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-balance leading-tight">
              Ferramentas essenciais para desenvolvedores modernos
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Acesse uma coleção completa de ferramentas úteis projetadas para aumentar sua produtividade e simplificar
              seu fluxo de trabalho de desenvolvimento.
            </p>
          </div>

          <div className="grid gap-4 pt-4">
            {[
              { title: "Gerador de códigos", desc: "Crie snippets rapidamente" },
              { title: "Validadores", desc: "JSON, XML, Regex e mais" },
              { title: "Conversores", desc: "Transforme dados entre formatos" },
              { title: "Utilitários", desc: "Base64, Hash, Encode e mais" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="bg-blue-100 rounded-lg p-2 group-hover:bg-blue-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="w-full bg-white rounded-xl shadow-2xl border-2 border-gray-200">
          {/* Card Header */}
          <div className="p-6 space-y-1 border-b border-gray-200">
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Tool-hub</h2>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo</h2>
            <p className="text-sm text-gray-600">Faça login ou crie sua conta para começar</p>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Tabs */}
            <div className="w-full">
              {/* Tabs List */}
              <div className="grid w-full grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Criar Conta
                </button>
                <button
                  onClick={() => setActiveTab("forgot")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "forgot"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Recuperar
                </button>
              </div>

              {/* Login Tab */}
              {activeTab === "login" && (
                <div className="space-y-4">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="login-email" className="text-sm font-medium leading-none">
                        Email
                      </label>
                      <input
                        id="login-email"
                        name="login-email"
                        type="text"
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="login-password" className="text-sm font-medium leading-none">
                        Senha
                      </label>
                      <input
                        id="login-password"
                        name="login-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="h-4 w-4 rounded border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none cursor-pointer select-none"
                        >
                          Lembrar-me
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                  </form>


                </div>
              )}

              {/* Sign Up Tab */}
              {activeTab === "signup" && (
                <div className="space-y-4">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="signup-name" className="text-sm font-medium leading-none">
                        Nome completo
                      </label>
                      <input
                        id="signup-name"
                        name="signup-name"
                        type="text"
                        placeholder="João Silva"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium leading-none">
                        Email
                      </label>
                      <input
                        id="signup-email"
                        name="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium leading-none">
                        Senha
                      </label>
                      <input
                        id="signup-password"
                        name="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-confirm" className="text-sm font-medium leading-none">
                        Confirmar senha
                      </label>
                      <input
                        id="signup-confirm"
                        name="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="h-4 w-4 rounded border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer mt-1"
                      />
                      <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer select-none">
                        Eu aceito os{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          termos de serviço
                        </a>{" "}
                        e{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          política de privacidade
                        </a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </button>
                  </form>


                </div>
              )}

              {/* Forgot Password Tab */}
              {activeTab === "forgot" && (
                <div className="space-y-4">
                  <div className="text-center space-y-2 mb-6">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Digite seu email e enviaremos instruções para redefinir sua senha
                    </p>
                  </div>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="forgot-email" className="text-sm font-medium leading-none">
                        Email
                      </label>
                      <input
                        id="forgot-email"
                        name="forgot-email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Enviando..." : "Enviar instruções"}
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Lembrou sua senha?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Fazer login
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="p-6 pt-0">
            <div className="text-xs text-center text-gray-500 leading-relaxed">
              Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
