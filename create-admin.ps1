# Script para criar usuário admin no ToolHub

$username = Read-Host "Digite o nome de usuário (username)"
$email = Read-Host "Digite o email"
$password = Read-Host -AsSecureString "Digite a senha"
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$body = @{
    username = $username
    email = $email
    passwordHash = $passwordPlain
    role = "ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Usuário Admin criado com sucesso!" -ForegroundColor Green
    Write-Host "ID: $($response.id)"
    Write-Host "Username: $($response.username)"
    Write-Host "Role: $($response.role)"
} catch {
    Write-Host "Erro ao criar usuário:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Detalhes do erro: $responseBody"
    }
}
