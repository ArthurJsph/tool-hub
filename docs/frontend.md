# 🎨 Tool Hub - Frontend Documentation

## 📋 Visão Geral

O frontend do Tool Hub é uma aplicação moderna construída com **Next.js 14** (App Router), **TypeScript** e **Tailwind CSS**. Ele oferece uma interface responsiva e intuitiva para acesso às ferramentas de desenvolvimento.

## 🏗️ Arquitetura

A aplicação utiliza o **App Router** do Next.js, organizando rotas e lógica em diretórios aninhados.

### Estrutura de Pastas
- `src/app`: Rotas da aplicação (pages, layouts).
  - `/auth`: Páginas de login e registro.
  - `/dashboard`: Área logada contendo as ferramentas.
- `src/components`: Componentes React reutilizáveis (UI, formulários, sidebar).
- `src/services`: Camada de comunicação com a API (`api.ts`, `authService.ts`).
- `src/contexts`: Gerenciamento de estado global (`AuthContext`).
- `src/providers`: Provedores de contexto (`ToastProvider`).
- `src/lib`: Utilitários e configurações (`utils.ts`).

## 🧩 Componentes Principais

### Layout
- **DashboardSidebarResponsive**: Menu lateral adaptável para mobile e desktop.
- **DashboardHeader**: Cabeçalho com informações do usuário e menu de perfil.

### UI Kit
Utilizamos **Shadcn/ui** como base para componentes de interface, estilizados com Tailwind CSS.
- Botões, Inputs, Cards, Dialogs, Toasts.

## 🔐 Gerenciamento de Estado e Autenticação

### AuthContext
Gerencia o estado de autenticação do usuário.
- Persiste a sessão utilizando cookies/storage.
- Fornece métodos `login`, `logout` e dados do `user` para toda a aplicação.

### Tratamento de Erros
- **Interceptor Axios (`api.ts`)**: Centraliza o tratamento de erros de API.
- **Toasts**: Notificações visuais para sucesso ou erro (ex: "Login realizado", "Erro de conexão").

## 🛠️ Ferramentas Implementadas

Cada ferramenta possui sua própria rota em `/dashboard/tools/`:
- **Gerador de Senhas**: `/password-generator`
- **Validador JWT**: `/jwt-validator`
- **Conversor Base64**: `/base64`
- **Gerador de Hash**: `/hash-generator`
- **Gerador UUID**: `/uuid-generator`
- **Regex Tester**: `/regex`

## 🚀 Como Rodar (Frontend)

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Comandos
```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```
