# 📚 Documentação das Novas Rotas - Tool Hub

Esta documentação descreve todas as novas funcionalidades adicionadas ao Tool Hub.

---

## 🔐 1. JSON/JWT Parser

**Base URL:** `/api/tools/json-jwt`

### 1.1 Parse JWT
Decodifica um token JWT em suas três partes: header, payload e signature.

**Endpoint:** `POST /api/tools/json-jwt/parse-jwt`

**Request Body:**
```json
{
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**Response:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "raw": "eyJhbGci...",
  "valid": true,
  "message": "JWT decodificado com sucesso. Nota: Validação de assinatura requer chave secreta."
}
```

### 1.2 Parse JSON
Valida e parseia uma string JSON.

**Endpoint:** `POST /api/tools/json-jwt/parse-json`

**Request Body:**
```json
{
  "data": "{\"name\":\"John\",\"age\":30}"
}
```

**Response:**
```json
{
  "name": "John",
  "age": 30
}
```

### 1.3 Format JSON
Formata e embeleza uma string JSON.

**Endpoint:** `POST /api/tools/json-jwt/format-json`

**Request Body:**
```json
{
  "data": "{\"name\":\"John\",\"age\":30}",
  "prettify": true
}
```

**Response:**
```json
{
  "formatted": "{\n  \"name\" : \"John\",\n  \"age\" : 30\n}",
  "parsed": {
    "name": "John",
    "age": 30
  },
  "valid": true
}
```

---

## 🎭 2. Gerador de Dados Falsos (Faker)

**Base URL:** `/api/tools/faker`

### 2.1 Gerar Dados Falsos
Gera dados fictícios para testes e desenvolvimento.

**Endpoint:** `POST /api/tools/faker/generate`

**Request Body:**
```json
{
  "type": "name",
  "count": 5,
  "locale": "pt-BR"
}
```

**Tipos disponíveis:**
- `name` - Nomes completos
- `email` - Endereços de e-mail
- `address` - Endereços completos
- `phone` - Números de telefone
- `date` - Datas diversas
- `company` - Dados de empresas
- `person` - Pessoa completa (nome, email, telefone, endereço)
- `internet` - Dados de internet (URLs, IPs, MACs)

**Response:**
```json
{
  "success": true,
  "type": "name",
  "count": 5,
  "locale": "pt-BR",
  "data": [
    {
      "fullName": "Maria Silva Santos",
      "firstName": "Maria",
      "lastName": "Silva",
      "username": "maria.silva"
    },
    {
      "fullName": "João Pedro Costa",
      "firstName": "João",
      "lastName": "Costa",
      "username": "joao.costa"
    }
  ]
}
```

**Exemplos por tipo:**

#### Name
```json
{
  "fullName": "Carlos Eduardo Santos",
  "firstName": "Carlos",
  "lastName": "Santos",
  "username": "carlos.santos"
}
```

#### Email
```json
{
  "email": "joao.silva@example.com",
  "safeEmail": "user@example.com",
  "domain": "example.com"
}
```

#### Address
```json
{
  "fullAddress": "Rua das Flores, 123, São Paulo - SP, 01234-567",
  "streetAddress": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "country": "Brasil"
}
```

#### Phone
```json
{
  "phoneNumber": "(11) 98765-4321",
  "cellPhone": "(11) 91234-5678"
}
```

#### Person (completo)
```json
{
  "name": "Ana Maria Costa",
  "email": "ana.costa@example.com",
  "phone": "(21) 98765-4321",
  "address": "Av. Paulista, 1000, São Paulo - SP",
  "company": "Tech Solutions LTDA",
  "jobTitle": "Desenvolvedora Senior"
}
```

### 2.2 Listar Tipos Disponíveis
**Endpoint:** `GET /api/tools/faker/types`

**Response:**
```json
{
  "types": ["name", "email", "address", "phone", "date", "company", "person", "internet"],
  "locales": ["pt-BR", "en-US", "es-ES", "fr-FR", "de-DE", "it-IT"]
}
```

---

## 🔗 3. Analisador de URL

**Base URL:** `/api/tools/url-parser`

### 3.1 Parse URL
Decompõe uma URL em seus componentes.

**Endpoint:** `POST /api/tools/url-parser/parse`

**Request Body:**
```json
{
  "url": "https://user:pass@example.com:8080/path/to/page?name=John&age=30#section1"
}
```

**Response:**
```json
{
  "original": "https://user:pass@example.com:8080/path/to/page?name=John&age=30#section1",
  "protocol": "https",
  "host": "example.com",
  "port": 8080,
  "path": "/path/to/page",
  "query": "name=John&age=30",
  "fragment": "section1",
  "authority": "user:pass@example.com:8080",
  "userInfo": "user:pass",
  "parameters": {
    "name": ["John"],
    "age": ["30"]
  },
  "security": {
    "isSecure": true,
    "hasUserInfo": true
  },
  "reconstructed": "https://user:pass@example.com:8080/path/to/page?name=John&age=30#section1",
  "valid": true
}
```

### 3.2 Build URL
Constrói uma URL a partir de componentes.

**Endpoint:** `POST /api/tools/url-parser/build`

**Request Body:**
```json
{
  "protocol": "https",
  "host": "api.example.com",
  "port": 443,
  "path": "/v1/users",
  "parameters": {
    "page": "1",
    "limit": "10"
  },
  "fragment": "results"
}
```

**Response:**
```json
{
  "url": "https://api.example.com/v1/users?page=1&limit=10#results",
  "success": true
}
```

---

## 🔍 4. Regex (Identificador e Testador)

**Base URL:** `/api/tools/regex`

### 4.1 Testar Regex
Testa um padrão regex contra um texto.

**Endpoint:** `POST /api/tools/regex/test`

**Request Body:**
```json
{
  "pattern": "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
  "text": "Contatos: joao@example.com e maria@test.com.br"
}
```

**Response:**
```json
{
  "pattern": "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
  "text": "Contatos: joao@example.com e maria@test.com.br",
  "matches": [
    {
      "match": "joao@example.com",
      "start": 10,
      "end": 27
    },
    {
      "match": "maria@test.com.br",
      "start": 30,
      "end": 47
    }
  ],
  "matchCount": 2,
  "hasMatch": true,
  "success": true
}
```

### 4.2 Substituir com Regex
Substitui texto usando regex.

**Endpoint:** `POST /api/tools/regex/replace`

**Request Body:**
```json
{
  "pattern": "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
  "text": "CPF: 123.456.789-00 e 987.654.321-00",
  "replacement": "***.***.***-**"
}
```

**Response:**
```json
{
  "pattern": "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
  "original": "CPF: 123.456.789-00 e 987.654.321-00",
  "replacement": "***.***.***-**",
  "result": "CPF: ***.***.***.** e ***.***.***.**",
  "replacementCount": 2,
  "success": true
}
```

### 4.3 Listar Padrões Regex Comuns
Retorna uma lista de padrões regex pré-definidos.

**Endpoint:** `GET /api/tools/regex/patterns`

**Response:**
```json
{
  "patterns": {
    "email": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "url": "^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
    "ipv4": "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    "phone_br": "^\\(?[1-9]{2}\\)? ?(?:[2-8]|9[1-9])[0-9]{3}\\-?[0-9]{4}$",
    "cpf": "^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}$",
    "cnpj": "^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}$",
    "cep": "^\\d{5}\\-\\d{3}$",
    "date_br": "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$",
    "date_iso": "^\\d{4}\\-(0[1-9]|1[0-2])\\-(0[1-9]|[12][0-9]|3[01])$",
    "time": "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$",
    "hex_color": "^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    "credit_card": "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$",
    "username": "^[a-zA-Z0-9_]{3,16}$",
    "strong_password": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    "uuid": "^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}$",
    "base64": "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
    "jwt": "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$"
  },
  "count": 17
}
```

### 4.4 Identificar Padrão
Identifica qual(is) padrão(ões) um texto corresponde.

**Endpoint:** `POST /api/tools/regex/identify`

**Request Body:**
```json
{
  "text": "joao.silva@example.com"
}
```

**Response:**
```json
{
  "text": "joao.silva@example.com",
  "identifiedPatterns": ["email"],
  "hasMatch": true
}
```

**Exemplos:**
```json
// CPF
{"text": "123.456.789-00"} → ["cpf"]

// CEP
{"text": "12345-678"} → ["cep"]

// UUID
{"text": "550e8400-e29b-41d4-a716-446655440000"} → ["uuid"]

// JWT
{"text": "eyJhbGc...xyz"} → ["jwt", "base64"]
```

---

## 🌐 5. Testador de URL

**Base URL:** `/api/tools/url-tester`

### 5.1 Testar URL
Faz uma requisição HTTP para testar uma URL e retorna informações da resposta.

**Endpoint:** `POST /api/tools/url-tester/test`

**Request Body:**
```json
{
  "url": "https://api.example.com/users",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token123",
    "Content-Type": "application/json"
  },
  "parameters": {
    "page": "1",
    "limit": "10"
  },
  "body": null,
  "checkSecurity": true
}
```

**Parâmetros:**
- `url` (obrigatório): URL a ser testada
- `method` (opcional): Método HTTP (GET, POST, PUT, DELETE, etc.). Padrão: GET
- `headers` (opcional): Headers customizados
- `parameters` (opcional): Parâmetros de query string
- `body` (opcional): Corpo da requisição (para POST, PUT, etc.)
- `checkSecurity` (opcional): Se true, verifica aspectos de segurança da URL

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "statusText": "200 OK",
  "headers": {
    "content-type": ["application/json"],
    "content-length": ["1234"]
  },
  "body": "{\"users\": [...]}",
  "responseTime": "234ms",
  "request": {
    "url": "https://api.example.com/users?page=1&limit=10",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer token123"
    },
    "parameters": {
      "page": "1",
      "limit": "10"
    },
    "hasBody": false
  },
  "security": {
    "isHttps": true,
    "protocol": "https",
    "certificate": {
      "subject": "CN=example.com",
      "issuer": "CN=Let's Encrypt Authority X3",
      "validFrom": "2024-01-01T00:00:00Z",
      "validTo": "2025-01-01T00:00:00Z",
      "isValid": true
    },
    "hasCertificate": true,
    "port": 443,
    "isStandardPort": true,
    "recommendations": [],
    "securityScore": 100
  }
}
```

### 5.2 Verificar Segurança de URL
Verifica aspectos de segurança de uma URL.

**Endpoint:** `POST /api/tools/url-tester/security`

**Request Body:**
```json
{
  "url": "http://example.com:8080/api"
}
```

**Response:**
```json
{
  "isHttps": false,
  "protocol": "http",
  "port": 8080,
  "isStandardPort": false,
  "recommendations": [
    "Considere usar HTTPS para comunicação segura"
  ],
  "securityScore": 20
}
```

**Security Score:**
- HTTPS: +50 pontos
- Porta padrão (80/443): +20 pontos
- Sem credenciais na URL: +30 pontos
- **Total máximo: 100 pontos**

### 5.3 Listar Métodos HTTP
Lista todos os métodos HTTP disponíveis.

**Endpoint:** `GET /api/tools/url-tester/methods`

**Response:**
```json
{
  "methods": [
    {
      "method": "GET",
      "description": "Recupera dados do servidor"
    },
    {
      "method": "POST",
      "description": "Envia dados para criar um recurso"
    },
    {
      "method": "PUT",
      "description": "Atualiza um recurso existente"
    },
    {
      "method": "PATCH",
      "description": "Atualiza parcialmente um recurso"
    },
    {
      "method": "DELETE",
      "description": "Remove um recurso"
    },
    {
      "method": "HEAD",
      "description": "Recupera apenas os headers"
    },
    {
      "method": "OPTIONS",
      "description": "Verifica métodos suportados"
    }
  ]
}
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Validar e formatar JSON
```bash
curl -X POST http://localhost:8080/api/tools/json-jwt/format-json \
  -H "Content-Type: application/json" \
  -d '{
    "data": "{\"name\":\"John\",\"age\":30}",
    "prettify": true
  }'
```

### Exemplo 2: Gerar dados falsos para teste
```bash
curl -X POST http://localhost:8080/api/tools/faker/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "person",
    "count": 10,
    "locale": "pt-BR"
  }'
```

### Exemplo 3: Testar regex de CPF
```bash
curl -X POST http://localhost:8080/api/tools/regex/test \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$",
    "text": "123.456.789-00"
  }'
```

### Exemplo 4: Analisar URL
```bash
curl -X POST http://localhost:8080/api/tools/url-parser/parse \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/users/octocat?tab=repositories"
  }'
```

### Exemplo 5: Testar endpoint com segurança
```bash
curl -X POST http://localhost:8080/api/tools/url-tester/test \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/users/octocat",
    "method": "GET",
    "checkSecurity": true
  }'
```

---

## 🔒 Autenticação

Todas as rotas podem exigir autenticação dependendo da configuração do sistema. Se a autenticação estiver habilitada, inclua o token JWT no header:

```bash
curl -X POST http://localhost:8080/api/tools/faker/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type": "name", "count": 5}'
```

---

## ⚠️ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Requisição inválida (parâmetros incorretos) |
| 401 | Não autorizado (token inválido ou ausente) |
| 404 | Rota não encontrada |
| 500 | Erro interno do servidor |

**Exemplo de resposta de erro:**
```json
{
  "error": "Padrão regex inválido: Unclosed group near index 5"
}
```

---

## 📦 Dependências Necessárias

Estas funcionalidades utilizam as seguintes bibliotecas (já incluídas no `pom.xml`):

- **JavaFaker** (`com.github.javafaker:javafaker:1.0.2`) - Geração de dados falsos
- **JJWT** (`io.jsonwebtoken:jjwt-*:0.12.3`) - Processamento de JWT
- **Spring Web** - RestTemplate para testes de URL
- **Jackson** - Processamento de JSON

---

## 🚀 Testando as Rotas

Você pode testar todas as rotas usando:
- **Postman** ou **Insomnia** (importar coleções)
- **cURL** (exemplos acima)
- **HTTPie**: `http POST localhost:8080/api/tools/faker/generate type=name count=5`
- **Frontend** (consumir as APIs via JavaScript/React/Angular/etc)

---

## 📌 Notas

1. Todas as respostas são em formato JSON
2. Os padrões regex são case-insensitive por padrão
3. O testador de URL segue redirects automaticamente
4. O gerador de dados falsos suporta vários locales
5. A verificação de segurança SSL pode falhar para certificados auto-assinados

---

**Última atualização:** 2025-11-14
**Versão:** 1.0.0

