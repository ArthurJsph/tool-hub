# Scripts de Criação de Administrador

Este diretório contém scripts para criar usuários administradores via API do Tool Hub.

## Scripts Disponíveis

### 1. Bash Script (Linux/Mac/Git Bash)
**Arquivo:** `create-admin.sh`

#### Pré-requisitos
- `curl` instalado
- `jq` instalado (opcional, para formatação JSON)
- API rodando (padrão: http://localhost:8080)

#### Como usar

```bash
# Dar permissão de execução
chmod +x create-admin.sh

# Executar o script
./create-admin.sh

# Ou especificar uma URL diferente
API_URL=http://production-server:8080 ./create-admin.sh
```

### 2. PowerShell Script (Windows)
**Arquivo:** `create-admin.ps1`

#### Pré-requisitos
- PowerShell 5.1 ou superior
- API rodando (padrão: http://localhost:8080)

#### Como usar

```powershell
# Executar o script
.\create-admin.ps1

# Ou especificar uma URL diferente
$env:API_URL = "http://production-server:8080"
.\create-admin.ps1
```

**Nota:** Se encontrar erro de política de execução, execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Formato da Requisição

Os scripts enviam um POST para `/api/v1/users` com o seguinte payload:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "sua-senha-segura",
  "roles": ["ADMIN"]
}
```

## Códigos de Resposta

- **200/201** - Usuário criado com sucesso
- **400** - Dados inválidos
- **409** - Usuário já existe com esse username ou email
- **500** - Erro interno do servidor

## Segurança

⚠️ **Importante:**
- Use senhas fortes e únicas
- Não compartilhe as credenciais
- Em produção, use HTTPS
- Altere a senha padrão após o primeiro login
- Mantenha os scripts em local seguro

## Exemplos de Uso

### Criar primeiro administrador (desenvolvimento)
```bash
# Linux/Mac
./create-admin.sh

# Windows
.\create-admin.ps1
```

### Criar administrador em ambiente de produção
```bash
# Linux/Mac
API_URL=https://toolhub.production.com ./create-admin.sh

# Windows
$env:API_URL = "https://toolhub.production.com"
.\create-admin.ps1
```

## Troubleshooting

### "Connection refused"
- Verifique se a API está rodando
- Confirme a URL e porta corretas

### "Usuário já existe"
- O username ou email já está cadastrado
- Use credenciais diferentes ou faça login com as existentes

### "jq: command not found" (Bash)
- O script funciona sem jq, mas a saída não será formatada
- Para instalar jq:
  - Ubuntu/Debian: `sudo apt-get install jq`
  - Mac: `brew install jq`
  - Windows (Git Bash): Baixe em https://stedolan.github.io/jq/

## Suporte

Para mais informações, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.
