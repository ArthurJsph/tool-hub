-----

# 🛠️ Tool Hub

**Uma plataforma web completa para ferramentas de desenvolvimento**

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

[🚀 Demo](https://www.google.com/search?q=%23demo) • [📖 Documentação](https://www.google.com/search?q=%23documenta%C3%A7%C3%A3o) • [🛠️ Instalação](https://www.google.com/search?q=%23instala%C3%A7%C3%A3o) • [🤝 Contribuir](https://www.google.com/search?q=%23contribui%C3%A7%C3%A3o)

-----

## 🎯 Sobre o Projeto

O **Tool Hub** é uma aplicação web moderna que centraliza ferramentas essenciais para desenvolvedores. Oferece uma interface intuitiva e APIs robustas para soluções rápidas no dia a dia do desenvolvimento de software.

## ✨ Funcionalidades

### 🔧 Ferramentas Disponíveis

  - **🔐 Gerador de Senhas**: Senhas customizáveis com complexidade controlada.
  - **🔑 Validador JWT**: Validação completa de tokens JWT com análise de payload.
  - **📝 Codificador Base64**: Codificação e decodificação de textos e arquivos.
  - **\#️⃣ Gerador de Hash**: Suporte a múltiplos algoritmos como SHA256 e MD5.
  - **🆔 Gerador UUID**: Geração rápida de UUIDs únicos.
  - **👥 Gerenciamento de Usuários**: Registro, login, recuperação de senha e controle de acesso.

### 📊 Sistema de Monitoramento

  - **📈 Analytics de Uso**: Estatísticas detalhadas de cada ferramenta.
  - **🔍 Logs de Atividade**: Registro completo de ações dos usuários.
  - **⚡ Performance Metrics**: Monitoramento de performance da aplicação.

## 🚀 Tecnologias

### 🖥️ Backend

  - **Java 17**
  - **Spring Boot 3.2**
  - **Spring Security 6.2**
  - **Spring Data JPA**
  - **PostgreSQL 14**
  - **JWT**

### 🎨 Frontend

  - **Next.js 14**
  - **TypeScript 5.3**
  - **Tailwind CSS 3.4**
  - **Shadcn/ui**
  - **Axios**

### 🛠️ DevOps & Infraestrutura

  - **Docker**
  - **Docker Compose**
  - **Nginx**
  - **GitHub Actions (CI/CD)**

-----

## 📦 Instalação

### 🎯 Instalação Rápida (Docker)

A forma mais simples de rodar a aplicação é usando Docker Compose.

1.  **Clone o repositório**:

    ```bash
    git clone https://github.com/seu-usuario/tool-hub.git
    cd tool-hub
    ```

2.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

3.  **Inicie a aplicação**:

    ```bash
    docker-compose up --build -d
    ```

    A aplicação estará disponível em:

      - **Frontend**: `http://localhost:3000`
      - **Backend API**: `http://localhost:8080`

### 🛠️ Instalação para Desenvolvimento

Para rodar o projeto sem Docker, você precisará ter o **Java 17+**, **Node.js 18+** e **PostgreSQL** instalados localmente.

  - **Backend**:
    ```bash
    cd tool-hub
    ./mvnw spring-boot:run
    ```
  - **Frontend**:
    ```bash
    cd tool-hub-frontend
    npm install
    npm run dev
    ```

-----

## 📚 Documentação da API

A API é construída com o padrão RESTful. Para detalhes específicos de cada parte do projeto, consulte as documentações dedicadas:

- [📘 Documentação do Backend](docs/backend.md): Arquitetura, Segurança, Banco de Dados e API Reference.
- [🎨 Documentação do Frontend](docs/frontend.md): Componentes, Estado, UI e Estrutura.
- [🐳 Documentação do Docker](docs/docker.md): Configuração de containers, serviços e comandos.

A documentação interativa (Swagger) também está disponível em `/api-docs` ao rodar o backend.

### Endpoints Principais

  - `POST /api/v1/auth/login`: Autentica o usuário e retorna um token JWT.
  - `POST /api/v1/auth/register`: Cria uma nova conta de usuário.
  - `POST /api/v1/auth/forgot-password`: Solicita recuperação de senha.
  - `GET /api/v1/users`: Lista todos os usuários (requer autenticação).
  - `POST /api/v1/tools/password`: Gera uma senha aleatória.
  - `POST /api/v1/tools/jwt/validate`: Valida um token JWT.

-----

## 📈 Roadmap

  - **Novas Ferramentas**: Validador de CPF, gerador de QR Code.
  - **Melhorias de Performance**: Adicionar cache com Redis.
  - **Segurança Avançada**: Implementar autenticação de dois fatores (2FA).

-----

## 🤝 Contribuição

Contribuições são bem-vindas\! Se você deseja ajudar, por favor, crie uma *branch* para sua *feature* e abra um *Pull Request* seguindo o padrão de *commits* do projeto.

-----

## 📄 Licença

Este projeto está sob a licença **MIT License**.

-----


## 🌟 Mostre seu apoio

Se este projeto foi útil para você, deixe uma ⭐ no repositório\!

[](https://github.com/ArthurJsph/tool-hub/)

**Feito com ❤️ por [ArthurJsph](https://github.com/ArthurJsph)**
