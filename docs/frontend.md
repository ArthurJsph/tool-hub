# Documentação do Frontend - Tool Hub

Este documento fornece uma visão geral detalhada do frontend da aplicação **Tool Hub**, construído com tecnologias modernas para garantir alta performance e uma excelente experiência de usuário.

## 🚀 Visão Geral

O frontend é uma aplicação **Next.js** que serve como a interface principal para os usuários interagirem com as ferramentas disponíveis. Ele consome a API do backend Spring Boot e oferece funcionalidades como autenticação, gerenciamento de ferramentas e dashboards administrativos.

## 🛠️ Stack Tecnológico

As principais tecnologias utilizadas neste projeto são:

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Biblioteca UI**: [React 19](https://react.dev/)
-   **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Gerenciamento de Estado/Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Ícones**: [Lucide React](https://lucide.dev/)
-   **Validação de Schemas**: [Zod](https://zod.dev/)
-   **Editor de Código**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
-   **Visualização de JSON**: [@uiw/react-json-view](https://uiwjs.github.io/react-json-view/)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

-   **Node.js**: Versão 20 ou superior (Recomendado LTS)
-   **npm**: Gerenciador de pacotes padrão do Node.js

## ⚙️ Instalação e Configuração

1.  **Navegue até o diretório do frontend:**

    ```bash
    cd tool-hub-frontend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**

    O projeto utiliza um arquivo `.env` na raiz (ou `.env.local` para desenvolvimento local). Certifique-se de configurar a URL da API:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

    *Nota: Existe um script `npm run dev:sync` que tenta sincronizar o `.env` da raiz do projeto para o diretório do frontend.*

## ▶️ Scripts Disponíveis

No diretório do projeto, você pode executar:

-   **`npm run dev`**: Inicia o servidor de desenvolvimento em `http://localhost:3000`.
-   **`npm run dev:sync`**: Sincroniza o arquivo `.env` e inicia o servidor de desenvolvimento.
-   **`npm run build`**: Cria a build de produção otimizada.
-   **`npm run start`**: Inicia o servidor de produção (após o build).
-   **`npm run lint`**: Executa o ESLint para verificar problemas no código.

## 📂 Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js App Router:

```
tool-hub-frontend/
├── src/
│   ├── app/                 # Rotas e páginas da aplicação (App Router)
│   │   ├── (auth)/          # Rotas de autenticação (login, registro)
│   │   ├── dashboard/       # Área logada (admin, ferramentas)
│   │   ├── layout.tsx       # Layout raiz
│   │   └── page.tsx         # Página inicial (Landing Page)
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/              # Componentes de UI base (botões, inputs, etc.)
│   │   └── ...              # Outros componentes específicos
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Utilitários e configurações (axios, utils)
│   ├── services/            # Camada de serviço para chamadas à API
│   ├── types/               # Definições de tipos TypeScript
│   └── utils/               # Funções auxiliares gerais
├── public/                  # Arquivos estáticos (imagens, ícones)
├── .eslintrc.json           # Configuração do ESLint
├── next.config.ts           # Configuração do Next.js
├── tailwind.config.ts       # Configuração do Tailwind CSS
└── tsconfig.json            # Configuração do TypeScript
```

## 🧩 Principais Funcionalidades

-   **Autenticação**: Login e Registro integrados com JWT.
-   **Dashboard**: Painel administrativo para gerenciamento de ferramentas.
-   **Ferramentas**: Interface para execução e visualização de ferramentas de desenvolvimento.
-   **Responsividade**: Design adaptável para dispositivos móveis e desktop.
-   **Modo Escuro**: Suporte a temas (preparado na estrutura).

## 🤝 Contribuição

Para contribuir com o frontend:

1.  Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
2.  Desenvolva e teste suas alterações.
3.  Abra um Pull Request descrevendo suas mudanças.
