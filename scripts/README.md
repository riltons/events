# Scripts do Projeto

Esta pasta contém todos os scripts organizados por categoria para melhor manutenção e localização.

## Estrutura

### 📁 `/tests`
Scripts para testes e validação:
- `test-basic-operations.js` - Testes de operações básicas
- `test-connection.js` - Teste de conexão com banco
- `test-single-migration.js` - Teste de migração individual
- `test-supabase-connection.js` - Teste de conexão Supabase
- `simple-supabase-test.js` - Teste simples do Supabase
- `quick-test.js` - Teste rápido

### 📁 `/database`
Scripts relacionados ao banco de dados e migrações:
- `execute-migrations.js` - Executor de migrações
- `migrate-direct.js` - Migração direta
- `supabase-config.js` - Configuração básica Supabase
- `supabase-correct-config.js` - Configuração correta Supabase
- `supabase-final-config.js` - Configuração final Supabase

### 📁 `/seed`
Scripts para criação de dados de exemplo:
- `create-eventos-semana.js` - Criação de eventos da semana
- `create-festival-inverno-2025-complete.js` - Festival de inverno completo
- `create-festival-inverno-simple.js` - Festival de inverno simples
- `create-sample-data.js` - Dados de exemplo gerais

### 📁 `/dev`
Scripts de desenvolvimento:
- `api-server.js` - Servidor de API de desenvolvimento
- `setup.sh` - Script de setup do ambiente

## Como usar

Cada pasta contém scripts específicos para sua categoria. Execute os scripts a partir da raiz do projeto:

```bash
# Exemplo: executar teste de conexão
node scripts/tests/test-connection.js

# Exemplo: executar servidor de desenvolvimento
node scripts/dev/api-server.js
``` 