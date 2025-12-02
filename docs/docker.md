# Documentação Docker - Tool Hub

Este documento explica como utilizar o **Docker** e **Docker Compose** para orquestrar e executar todo o ambiente da aplicação Tool Hub (Frontend, Backend e Banco de Dados) de forma isolada e consistente.

## 🐳 Visão Geral

O projeto utiliza o `docker-compose.yml` na raiz para definir e rodar três serviços principais:

1.  **`postgres`**: Banco de dados PostgreSQL.
2.  **`spring_backend`**: API Backend (Spring Boot).
3.  **`next_frontend`**: Interface Frontend (Next.js).

## 📋 Pré-requisitos

-   **Docker Engine**: Instalado e rodando.
-   **Docker Compose**: Geralmente incluído no Docker Desktop ou instalado separadamente.

## 🚀 Como Executar

### 1. Configuração de Ambiente

Certifique-se de que o arquivo `.env` existe na raiz do projeto com as variáveis necessárias. Um exemplo (`.env.example`) geralmente é fornecido:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tool_hub
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Subir os Serviços

Para construir as imagens e iniciar os containers em segundo plano (detached mode):

```bash
docker-compose up -d --build
```

O flag `--build` garante que as imagens sejam recriadas se houver alterações no código.

### 3. Verificar Status

Para ver se todos os containers estão rodando corretamente:

```bash
docker-compose ps
```

### 4. Parar os Serviços

Para parar e remover os containers:

```bash
docker-compose down
```

Para parar e também remover os volumes (dados do banco):

```bash
docker-compose down -v
```

## 🛠️ Detalhes dos Serviços

### `postgres`
-   **Imagem**: `postgres:14-alpine`
-   **Porta**: Exposta na `5432` (acessível via localhost:5432).
-   **Volume**: `postgres_data` persiste os dados do banco mesmo após reiniciar os containers.

### `spring_backend`
-   **Build Context**: `./tool-hub`
-   **Porta**: Exposta na `8080`.
-   **Dependência**: Aguarda o serviço `postgres` iniciar.
-   **Variáveis**: Configura automaticamente a conexão JDBC usando as variáveis do `.env`.

### `next_frontend`
-   **Build Context**: `./tool-hub-frontend`
-   **Porta**: Exposta na `3000` (Acesse a aplicação em http://localhost:3000).
-   **Dependência**: Aguarda o serviço `spring_backend`.

## 🌐 Rede

Todos os serviços se comunicam através de uma rede interna chamada `tool_hub_network`.
-   O backend acessa o banco via host `postgres`.
-   O frontend (no lado do servidor) pode acessar o backend via host `spring_backend`.

## 🔍 Troubleshooting

-   **Conflito de Portas**: Se você já tiver serviços rodando nas portas 3000, 8080 ou 5432, precisará pará-los ou alterar o mapeamento de portas no `docker-compose.yml`.
-   **Banco de Dados**: Se alterar as credenciais no `.env` após a primeira execução, pode ser necessário remover o volume antigo (`docker-compose down -v`) para que as novas credenciais tenham efeito.
