# 🗃️ Configuração do Banco de Dados - Portal de Eventos Garanhuns

Este diretório contém todos os arquivos necessários para configurar o banco de dados PostgreSQL tanto para desenvolvimento local quanto para produção no Supabase.

## 📋 Pré-requisitos

### **PostgreSQL**
- PostgreSQL 15 ou superior
- Acesso de administrador no sistema

### **Node.js e npm**
- Node.js 18 ou superior ✅ (já instalado: v22.16.0)
- npm 8 ou superior ✅ (já instalado: v10.9.2)

## 🔧 Instalação do PostgreSQL

### **Opção 1: Download Manual (Recomendado)**
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o PostgreSQL 16.x para Windows
3. Execute o instalador como administrador
4. Durante a instalação:
   - **Porta:** 5432 (padrão)
   - **Senha do postgres:** `postgres123` (anote esta senha)
   - **Locale:** Portuguese, Brazil
   - **Componentes:** Instalar todos (PostgreSQL Server, pgAdmin, Command Line Tools)

### **Opção 2: Via Chocolatey (se disponível)**
```powershell
# Execute como Administrador
choco install postgresql --version 16.6.0 -y
```

### **Verificar Instalação**
```powershell
# Testar se PostgreSQL foi instalado
psql --version

# Testar conexão (será solicitada a senha)
psql -h localhost -U postgres
```

## 🚀 Configuração Automática

### **Executar Script de Setup**
```powershell
# Na pasta raiz do projeto
.\database\scripts\setup_local.ps1
```

Este script irá:
1. ✅ Verificar se PostgreSQL está instalado
2. 🗄️ Criar database `eventos_garanhuns_dev`
3. 👤 Criar usuário `eventos_user`
4. 🔑 Configurar permissões
5. 📊 Executar todas as migrações
6. 🌱 Executar seeds (dados iniciais)
7. ✅ Verificar se tudo foi criado corretamente

## 📁 Estrutura de Arquivos

```
database/
├── migrations/          # Migrações do banco de dados
│   ├── 001_create_enums.sql
│   ├── 002_create_event_categories.sql
│   ├── 003_create_user_profiles.sql
│   ├── 004_create_events.sql
│   └── ...
├── seeds/              # Dados iniciais
│   ├── 001_categories.sql
│   └── ...
├── policies/           # Políticas RLS (para Supabase)
│   ├── users_policies.sql
│   ├── events_policies.sql
│   └── ...
├── scripts/           # Scripts de automação
│   ├── setup_local.ps1
│   └── ...
└── README.md          # Este arquivo
```

## 🗃️ Migrações Disponíveis

| Ordem | Arquivo | Descrição |
|-------|---------|-----------|
| 001 | `create_enums.sql` | Criar tipos personalizados (enums) |
| 002 | `create_event_categories.sql` | Tabela de categorias de eventos |
| 003 | `create_user_profiles.sql` | Perfis de usuários (estende auth.users) |
| 004 | `create_events.sql` | Tabela principal de eventos |

## 🌱 Seeds Disponíveis

| Arquivo | Descrição |
|---------|-----------|
| `001_categories.sql` | Categorias e subcategorias de eventos |

## 🔧 Comandos Manuais

### **Criar Database Manualmente**
```sql
-- Conectar como postgres
psql -h localhost -U postgres

-- Criar database
CREATE DATABASE eventos_garanhuns_dev;

-- Criar usuário
CREATE USER eventos_user WITH PASSWORD 'eventos_dev_2025';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE eventos_garanhuns_dev TO eventos_user;
GRANT USAGE ON SCHEMA public TO eventos_user;
GRANT CREATE ON SCHEMA public TO eventos_user;
```

### **Executar Migrações Manualmente**
```powershell
# Executar uma migração específica
psql -h localhost -U postgres -d eventos_garanhuns_dev -f database/migrations/001_create_enums.sql

# Executar todas as migrações
Get-ChildItem database/migrations/*.sql | Sort-Object Name | ForEach-Object {
    psql -h localhost -U postgres -d eventos_garanhuns_dev -f $_.FullName
}
```

### **Executar Seeds Manualmente**
```powershell
# Executar um seed específico
psql -h localhost -U postgres -d eventos_garanhuns_dev -f database/seeds/001_categories.sql
```

## 📊 Verificação

### **Verificar Tabelas Criadas**
```sql
-- Conectar ao database
psql -h localhost -U eventos_user -d eventos_garanhuns_dev

-- Listar tabelas
\dt

-- Verificar categorias
SELECT name, slug, color FROM event_categories WHERE parent_id IS NULL ORDER BY sort_order;
```

### **Informações de Conexão**
- **Host:** localhost
- **Porta:** 5432
- **Database:** eventos_garanhuns_dev
- **Usuário:** eventos_user
- **Senha:** eventos_dev_2025
- **String de Conexão:** `postgresql://eventos_user:eventos_dev_2025@localhost:5432/eventos_garanhuns_dev`

## 🐛 Resolução de Problemas

### **PostgreSQL não encontrado**
- Verifique se o PostgreSQL foi instalado corretamente
- Reinicie o PowerShell para recarregar o PATH
- Verifique se o serviço PostgreSQL está rodando

### **Erro de conexão**
- Verifique se a senha do postgres está correta
- Verifique se o serviço PostgreSQL está rodando
- Tente: `net start postgresql-x64-16`

### **Erro de permissão**
- Execute o PowerShell como Administrador
- Verifique se o usuário tem permissões no PostgreSQL

### **Migrações falharam**
- Verifique se todas as migrações anteriores foram executadas
- Execute as migrações uma por vez para identificar o erro
- Verifique os logs de erro do PostgreSQL

## 🌐 Próximos Passos

1. ✅ **Ambiente Local** (atual)
2. 🔄 **Configuração Supabase** (próximo)
3. 🚀 **Integração Frontend/Backend**
4. 🧪 **Testes**
5. 📊 **Deploy**

## 📞 Suporte

Se encontrar problemas:
1. Verifique este README
2. Execute o script `setup_local.ps1` novamente
3. Consulte a documentação do PostgreSQL
4. Verifique os logs de erro

---

**🎯 Ambiente local configurado com sucesso!** 