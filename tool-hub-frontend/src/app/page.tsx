import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif font-bold text-3xl text-foreground mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">Faça login para acessar suas ferramentas</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
