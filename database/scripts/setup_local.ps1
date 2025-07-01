# Script de Setup Local - Portal de Eventos Garanhuns
# PowerShell Script para configurar ambiente de desenvolvimento local
# Data: 2025-01-26

Write-Host "🚀 Iniciando configuração do ambiente local PostgreSQL..." -ForegroundColor Green

# Verificar se PostgreSQL está instalado
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL encontrado: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Baixe e instale o PostgreSQL 15 ou superior" -ForegroundColor Yellow
    Write-Host "3. Execute este script novamente" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Solicitar senha do postgres
$pgPassword = Read-Host "Digite a senha do usuário postgres" -AsSecureString
$pgPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Verificar conexão com PostgreSQL
Write-Host "🔗 Testando conexão com PostgreSQL..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPasswordText

try {
    psql -h localhost -U postgres -c "SELECT version();" | Out-Null
    Write-Host "✅ Conexão com PostgreSQL estabelecida!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao conectar com PostgreSQL!" -ForegroundColor Red
    Write-Host "Verifique se o serviço está rodando e a senha está correta." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Criar database se não existir
Write-Host "📊 Criando database eventos_garanhuns_dev..." -ForegroundColor Yellow
try {
    psql -h localhost -U postgres -c "CREATE DATABASE eventos_garanhuns_dev;" 2>$null
    Write-Host "✅ Database criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database já existe ou erro na criação" -ForegroundColor Yellow
}

# Criar usuário específico
Write-Host "👤 Criando usuário eventos_user..." -ForegroundColor Yellow
try {
    psql -h localhost -U postgres -c "CREATE USER eventos_user WITH PASSWORD 'eventos_dev_2025';" 2>$null
    psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE eventos_garanhuns_dev TO eventos_user;" 2>$null
    psql -h localhost -U postgres -c "GRANT USAGE ON SCHEMA public TO eventos_user;" 2>$null
    psql -h localhost -U postgres -c "GRANT CREATE ON SCHEMA public TO eventos_user;" 2>$null
    Write-Host "✅ Usuário criado e permissões concedidas!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Usuário já existe ou erro na criação" -ForegroundColor Yellow
}

# Executar migrações
Write-Host "📊 Executando migrações..." -ForegroundColor Yellow
$migrationsPath = "database/migrations"

if (Test-Path $migrationsPath) {
    $migrations = Get-ChildItem $migrationsPath -Filter "*.sql" | Sort-Object Name
    
    foreach ($migration in $migrations) {
        Write-Host "  🔧 Executando: $($migration.Name)" -ForegroundColor Cyan
        try {
            psql -h localhost -U postgres -d eventos_garanhuns_dev -f $migration.FullName
            Write-Host "    ✅ $($migration.Name) executado com sucesso!" -ForegroundColor Green
        } catch {
            Write-Host "    ❌ Erro ao executar $($migration.Name)" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Pasta de migrações não encontrada: $migrationsPath" -ForegroundColor Red
}

# Executar seeds
Write-Host "🌱 Executando seeds..." -ForegroundColor Yellow
$seedsPath = "database/seeds"

if (Test-Path $seedsPath) {
    $seeds = Get-ChildItem $seedsPath -Filter "*.sql" | Sort-Object Name
    
    foreach ($seed in $seeds) {
        Write-Host "  🌱 Executando: $($seed.Name)" -ForegroundColor Cyan
        try {
            psql -h localhost -U postgres -d eventos_garanhuns_dev -f $seed.FullName
            Write-Host "    ✅ $($seed.Name) executado com sucesso!" -ForegroundColor Green
        } catch {
            Write-Host "    ❌ Erro ao executar $($seed.Name)" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  Pasta de seeds não encontrada: $seedsPath" -ForegroundColor Yellow
    Write-Host "    Seeds serão executados quando disponíveis" -ForegroundColor Yellow
}

# Verificar tabelas criadas
Write-Host "🔍 Verificando tabelas criadas..." -ForegroundColor Yellow
try {
    $tables = psql -h localhost -U postgres -d eventos_garanhuns_dev -c "\dt" -t
    if ($tables) {
        Write-Host "✅ Tabelas encontradas no banco:" -ForegroundColor Green
        psql -h localhost -U postgres -d eventos_garanhuns_dev -c "\dt"
    } else {
        Write-Host "⚠️  Nenhuma tabela encontrada" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao verificar tabelas" -ForegroundColor Red
}

# Limpar variável de senha
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "✅ Configuração local concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informações de conexão:" -ForegroundColor Cyan
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Porta: 5432" -ForegroundColor White
Write-Host "  Database: eventos_garanhuns_dev" -ForegroundColor White
Write-Host "  Usuário: eventos_user" -ForegroundColor White
Write-Host "  Senha: eventos_dev_2025" -ForegroundColor White
Write-Host ""
Write-Host "🔗 String de conexão:" -ForegroundColor Cyan
Write-Host "  postgresql://eventos_user:eventos_dev_2025@localhost:5432/eventos_garanhuns_dev" -ForegroundColor White
Write-Host ""
Write-Host "▶️  Para testar a conexão:" -ForegroundColor Cyan
Write-Host "  psql -h localhost -U eventos_user -d eventos_garanhuns_dev" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para finalizar" 