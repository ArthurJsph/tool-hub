# 🛠️ Tool Hub - Backend Documentation

## 📋 Visão Geral

O backend do Tool Hub é construído com **Java 17** e **Spring Boot 3.2**, seguindo uma arquitetura em camadas (Controller-Service-Repository). Ele fornece APIs RESTful seguras para o frontend, gerenciando autenticação, usuários e lógica de negócios das ferramentas.

## 🏗️ Arquitetura

A aplicação segue o padrão MVC (Model-View-Controller) adaptado para APIs REST:

- **Controllers** (`com.ferramentas.toolhub.controller`): Pontos de entrada da API. Recebem requisições HTTP, validam dados e chamam os serviços.
- **Services** (`com.ferramentas.toolhub.service`): Contêm a lógica de negócios.
- **Repositories** (`com.ferramentas.toolhub.repository`): Interfaces Spring Data JPA para acesso ao banco de dados.
- **Models/Entities** (`com.ferramentas.toolhub.model`): Representam as tabelas do banco de dados.
- **DTOs** (`com.ferramentas.toolhub.dto`): Objetos de Transferência de Dados para desacoplar a API das entidades internas.

## 🔒 Segurança

A segurança é implementada com **Spring Security 6.2** e **JWT (JSON Web Tokens)**.

- **Autenticação**: Stateless via JWT. O token é gerado no login e deve ser enviado no header `Authorization: Bearer <token>` (ou via cookie HttpOnly, dependendo da configuração).
- **CORS**: Configurado para permitir requisições do frontend (padrão `http://localhost:3000`).
- **Senhas**: Armazenadas com hash BCrypt.

## 🗄️ Banco de Dados

Utilizamos **PostgreSQL 14** como banco de dados relacional.

### Esquema Principal
- **users**: Armazena informações de usuários (id, username, email, password_hash, role).
- **tool_usage_logs**: Registra o uso das ferramentas para analytics.

## 📚 API Reference

### Autenticação

#### `POST /api/v1/auth/login`
Autentica um usuário e retorna o token JWT.
- **Body**: `{ "username": "user", "password": "123" }`
- **Response**: `{ "token": "...", "user": { ... } }`

#### `POST /api/v1/auth/register`
Registra um novo usuário.
- **Body**: `{ "username": "user", "email": "user@mail.com", "passwordHash": "123" }`

#### `POST /api/v1/auth/forgot-password`
Inicia o fluxo de recuperação de senha.

### Usuários

#### `GET /api/v1/users`
Lista todos os usuários (Requer role ADMIN).

#### `GET /api/v1/users/{id}`
Retorna detalhes de um usuário específico.

### Ferramentas

#### `GET /api/v1/tools/password`
Gera uma senha segura.
- **Query Params**: `length` (int), `includeSymbols` (bool)

#### `GET /api/v1/tools/jwt/validate`
Valida um token JWT e decodifica seu payload.

#### `POST /api/v1/tools/base64/encode`
Codifica um texto para Base64.

#### `POST /api/v1/tools/base64/decode`
Decodifica um texto de Base64.

#### `POST /api/v1/tools/hash`
Gera hash (MD5, SHA-1, SHA-256) de um texto.

## 🚀 Como Rodar (Backend)

### Pré-requisitos
- Java 17+
- Maven
- PostgreSQL rodando

### Comandos
```bash
# Compilar e rodar
./mvnw spring-boot:run

# Apenas compilar
./mvnw clean package
```

### Variáveis de Ambiente
Configure no `application.properties` ou via variáveis de sistema:
- `SPRING_DATASOURCE_URL`: URL do banco de dados
- `SPRING_DATASOURCE_USERNAME`: Usuário do banco
- `SPRING_DATASOURCE_PASSWORD`: Senha do banco
- `JWT_SECRET`: Chave secreta para assinatura de tokens
