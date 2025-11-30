# 🐳 Tool Hub - Docker Documentation

## 📋 Visão Geral

O Tool Hub utiliza **Docker** e **Docker Compose** para orquestrar os serviços da aplicação, facilitando o desenvolvimento, testes e deploy. O ambiente é composto por três containers principais: Backend, Frontend e Banco de Dados.

## 📦 Serviços

### 1. `backend` (Tool Hub API)
- **Imagem Base**: `eclipse-temurin:17-jdk-alpine`
- **Porta**: `8080`
- **Depende de**: `db`
- **Volumes**: Mapeia o código fonte para hot-reload (em dev) ou artefato compilado.

### 2. `frontend` (Tool Hub UI)
- **Imagem Base**: `node:18-alpine`
- **Porta**: `3000`
- **Depende de**: `backend`
- **Comando**: `npm run dev` (dev) ou `npm start` (prod).

### 3. `db` (PostgreSQL)
- **Imagem**: `postgres:14-alpine`
- **Porta**: `5432`
- **Persistência**: Volume Docker `postgres_data` para manter dados entre reinicializações.

## 🚀 Como Rodar com Docker

### Pré-requisitos
- Docker Engine instalado
- Docker Compose instalado

### Comandos Principais

#### Iniciar a Aplicação
Sobe todos os serviços em background.
```bash
docker-compose up -d
```
*Acesse o frontend em `http://localhost:3000` e o backend em `http://localhost:8080`.*

#### Forçar Rebuild
Reconstrói as imagens (útil após instalar novas dependências).
```bash
docker-compose up -d --build
```

#### Ver Logs
Acompanha os logs de todos os serviços.
```bash
docker-compose logs -f
```

#### Parar a Aplicação
Para e remove os containers.
```bash
docker-compose down
```

#### Parar e Remover Volumes (Resetar Banco)
⚠️ **Cuidado**: Isso apagará todos os dados do banco de dados.
```bash
docker-compose down -v
```

## ⚙️ Configuração

As variáveis de ambiente são configuradas no arquivo `docker-compose.yml` ou em um arquivo `.env` na raiz.

### Exemplo de `.env`
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=toolhub

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/toolhub
JWT_SECRET=sua_chave_secreta_super_segura

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```
