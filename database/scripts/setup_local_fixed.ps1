# Script de Setup Local - Portal de Eventos Garanhuns
# PowerShell Script para configurar ambiente de desenvolvimento local
# Data: 2025-01-26

Write-Host "Iniciando configuracao do ambiente local PostgreSQL..." -ForegroundColor Green

# Verificar se PostgreSQL esta instalado
try {
    $pgVersion = psql --version
    Write-Host "PostgreSQL encontrado: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL nao encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Baixe e instale o PostgreSQL 15 ou superior" -ForegroundColor Yellow
    Write-Host "3. Execute este script novamente" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Solicitar senha do postgres
$pgPassword = Read-Host "Digite a senha do usuario postgres" -AsSecureString
$pgPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Verificar conexao com PostgreSQL
Write-Host "Testando conexao com PostgreSQL..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPasswordText

try {
    psql -h localhost -U postgres -c "SELECT version();" | Out-Null
    Write-Host "Conexao com PostgreSQL estabelecida!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao conectar com PostgreSQL!" -ForegroundColor Red
    Write-Host "Verifique se o servico esta rodando e a senha esta correta." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Criar database se nao existir
Write-Host "Criando database eventos_garanhuns_dev..." -ForegroundColor Yellow
try {
    psql -h localhost -U postgres -c "CREATE DATABASE eventos_garanhuns_dev;" 2>$null
    Write-Host "Database criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Database ja existe ou erro na criacao" -ForegroundColor Yellow
}

# Criar usuario especifico
Write-Host "Criando usuario eventos_user..." -ForegroundColor Yellow
try {
    psql -h localhost -U postgres -c "CREATE USER eventos_user WITH PASSWORD 'eventos_dev_2025';" 2>$null
    psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE eventos_garanhuns_dev TO eventos_user;" 2>$null
    psql -h localhost -U postgres -c "GRANT USAGE ON SCHEMA public TO eventos_user;" 2>$null
    psql -h localhost -U postgres -c "GRANT CREATE ON SCHEMA public TO eventos_user;" 2>$null
    Write-Host "Usuario criado e permissoes concedidas!" -ForegroundColor Green
} catch {
    Write-Host "Usuario ja existe ou erro na criacao" -ForegroundColor Yellow
}

# Executar migracoes
Write-Host "Executando migracoes..." -ForegroundColor Yellow
$migrationsPath = "database/migrations"

if (Test-Path $migrationsPath) {
    $migrations = Get-ChildItem $migrationsPath -Filter "*.sql" | Sort-Object Name
    
    foreach ($migration in $migrations) {
        Write-Host "  Executando: $($migration.Name)" -ForegroundColor Cyan
        try {
            psql -h localhost -U postgres -d eventos_garanhuns_dev -f $migration.FullName
            Write-Host "    $($migration.Name) executado com sucesso!" -ForegroundColor Green
        } catch {
            Write-Host "    Erro ao executar $($migration.Name)" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Pasta de migracoes nao encontrada: $migrationsPath" -ForegroundColor Red
}

# Executar seeds
Write-Host "Executando seeds..." -ForegroundColor Yellow
$seedsPath = "database/seeds"

if (Test-Path $seedsPath) {
    $seeds = Get-ChildItem $seedsPath -Filter "*.sql" | Sort-Object Name
    
    foreach ($seed in $seeds) {
        Write-Host "  Executando: $($seed.Name)" -ForegroundColor Cyan
        try {
            psql -h localhost -U postgres -d eventos_garanhuns_dev -f $seed.FullName
            Write-Host "    $($seed.Name) executado com sucesso!" -ForegroundColor Green
        } catch {
            Write-Host "    Erro ao executar $($seed.Name)" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Pasta de seeds nao encontrada: $seedsPath" -ForegroundColor Yellow
    Write-Host "    Seeds serao executados quando disponiveis" -ForegroundColor Yellow
}

# Verificar tabelas criadas
Write-Host "Verificando tabelas criadas..." -ForegroundColor Yellow
try {
    $tables = psql -h localhost -U postgres -d eventos_garanhuns_dev -c "\dt" -t
    if ($tables) {
        Write-Host "Tabelas encontradas no banco:" -ForegroundColor Green
        psql -h localhost -U postgres -d eventos_garanhuns_dev -c "\dt"
    } else {
        Write-Host "Nenhuma tabela encontrada" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro ao verificar tabelas" -ForegroundColor Red
}

# Limpar variavel de senha
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "Configuracao local concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Informacoes de conexao:" -ForegroundColor Cyan
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Porta: 5432" -ForegroundColor White
Write-Host "  Database: eventos_garanhuns_dev" -ForegroundColor White
Write-Host "  Usuario: eventos_user" -ForegroundColor White
Write-Host "  Senha: eventos_dev_2025" -ForegroundColor White
Write-Host ""
Write-Host "String de conexao:" -ForegroundColor Cyan
Write-Host "  postgresql://eventos_user:eventos_dev_2025@localhost:5432/eventos_garanhuns_dev" -ForegroundColor White
Write-Host ""
Write-Host "Para testar a conexao:" -ForegroundColor Cyan
Write-Host "  psql -h localhost -U eventos_user -d eventos_garanhuns_dev" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para finalizar" 