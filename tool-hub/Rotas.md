# Documentação das Rotas da API - Tool Hub

## Autenticação

### POST /api/v1/auth/login
- **Descrição**: Realiza login do usuário
- **Parâmetros**: 
  - Body (JSON):
    ```json
    {
      "username": "string", // Username ou Email
      "password": "string"
    }
    ```
- **Resposta**: 
  ```json
  {
    "token": "string",
    "user": {
      "username": "string",
      "email": "string",
      "role": "USER",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```
- **Status**: 200 (Sucesso) | 400 (Erro)

---

## Usuários

### GET /api/v1/users
- **Descrição**: Lista todos os usuários
- **Parâmetros**: Nenhum
- **Resposta**: Array de UserResponseDTO
- **Status**: 200

### GET /api/v1/users/{id}
- **Descrição**: Busca usuário por ID
- **Parâmetros**: 
  - Path: `id` (UUID)
- **Resposta**: UserResponseDTO
- **Status**: 200 (Encontrado) | 404 (Não encontrado)

### POST /api/v1/users
- **Descrição**: Cria novo usuário
- **Parâmetros**:
  - Body (JSON):
    ```json
    {
      "username": "string",
      "email": "string",
      "passwordHash": "string"
    }
    ```
- **Resposta**: UserResponseDTO
- **Status**: 201 (Criado) | 409 (Conflito - usuário já existe)

### PUT /api/v1/users/{id}
- **Descrição**: Atualiza usuário existente
- **Parâmetros**:
  - Path: `id` (UUID)
  - Body (JSON):
    ```json
    {
      "username": "string",
      "email": "string",
      "passwordHash": "string"
    }
    ```
- **Resposta**: UserResponseDTO
- **Status**: 200 (Atualizado) | 404 (Não encontrado)

### DELETE /api/v1/users/{id}
- **Descrição**: Remove usuário
- **Parâmetros**:
  - Path: `id` (UUID)
- **Resposta**: Vazio
- **Status**: 204 (Removido)

---

## Ferramentas

### GET /api/v1/tools/password
- **Descrição**: Gera senha forte
- **Parâmetros**:
  - Query: `length` (int, default: 16)
  - Query: `includeSymbols` (boolean, default: true)
- **Resposta**: String (senha gerada)
- **Status**: 200

### GET /api/v1/tools/jwt/validate
- **Descrição**: Valida token JWT
- **Parâmetros**:
  - Query: `token` (string, obrigatório)
  - Query: `algorithm` (string, default: "HS256")
- **Resposta**: String ("Token é válido!" ou "Token é inválido!")
- **Status**: 200

### GET /api/v1/tools/uuid
- **Descrição**: Gera UUID
- **Parâmetros**: Nenhum
- **Resposta**: String (UUID gerado)
- **Status**: 200

### POST /api/v1/tools/base64/encode
- **Descrição**: Codifica string em Base64
- **Parâmetros**:
  - Form: `input` (string, obrigatório)
- **Resposta**: String (texto codificado)
- **Status**: 200

### POST /api/v1/tools/base64/decode
- **Descrição**: Decodifica string Base64
- **Parâmetros**:
  - Form: `input` (string, obrigatório)
- **Resposta**: String (texto decodificado)
- **Status**: 200

### POST /api/v1/tools/hash
- **Descrição**: Gera hash de string
- **Parâmetros**:
  - Form: `input` (string, obrigatório)
  - Form: `algorithm` (string, default: "SHA256")
- **Resposta**: String (hash gerado)
- **Status**: 200

---

## Logs de Uso

### POST /api/v1/logs
- **Descrição**: Registra uso de ferramenta
- **Parâmetros**:
  - Query: `userId` (UUID, obrigatório)
  - Query: `toolName` (string, obrigatório)
  - Query: `ipAddress` (string, obrigatório)
- **Resposta**: Vazio
- **Status**: 201

---

## DTOs

### UserRequestDTO
```json
{
  "username": "string",
  "email": "string",
  "passwordHash": "string"
}
```

### UserResponseDTO
```json
{
  "username": "string",
  "email": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### LoginRequestDTO
```json
{
  "username": "string", // Pode ser username ou email
  "password": "string"
}
```

---

## Otimizações Implementadas

### Redução de Requisições no Login
- **Problema**: O endpoint de login fazia 2 consultas separadas ao banco (uma por username, outra por email)
- **Solução**: Implementado método `findByUsernameOrEmail()` que faz uma única consulta usando OR na query
- **Resultado**: Redução de 66% no número de consultas durante o login (de 3 para 1 consulta principal)

### Melhorias Técnicas
1. **UserRepository**: Adicionado método `findByUsernameOrEmail()` com query otimizada
2. **UserService**: Implementado método correspondente no service
3. **AuthController**: Modificado para usar o novo método otimizado

### Query SQL Otimizada
```sql
SELECT u FROM User u WHERE u.username = :credential OR u.email = :credential
```

Esta otimização permite que o usuário faça login tanto com username quanto com email, mantendo apenas uma consulta ao banco de dados.
